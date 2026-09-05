import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { db } from './server/db.ts';
import { analyzeSanitationIssue } from './server/ai.ts';
import { testSupabaseConnection, getSupabaseEnvConfig } from './server/supabase.ts';

dotenv.config({ path: '.env.local' });
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Middleware for large payload images (base64 image uploads)
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// -------------------------------------------------------------
// 1. HEALTH & SYSTEM STATUS ENDPOINTS
// -------------------------------------------------------------
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'CleanCity',
    version: '1.0.0-mvp',
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/db/status', (req, res) => {
  const dbStatus = db.getStatus();
  const supabaseConfig = getSupabaseEnvConfig();

  res.json({
    ...dbStatus,
    supabaseConfigured: supabaseConfig.isConfigured,
    supabaseUrl: supabaseConfig.isConfigured ? supabaseConfig.url : null,
    geminiConfigured: Boolean(
      process.env.GEMINI_API_KEY &&
      process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY'
    ),
  });
});

app.get('/api/env/status', (req, res) => {
  const geminiKey = process.env.GEMINI_API_KEY;
  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;
  const appUrl = process.env.APP_URL;

  res.json({
    variables: [
      {
        name: 'GEMINI_API_KEY',
        description: 'Gemini Vision AI integration for sanitation photo classification',
        isSet: Boolean(geminiKey && geminiKey !== 'MY_GEMINI_API_KEY'),
        isSecret: true,
        scope: 'Server-side (Google AI Studio)',
        status: Boolean(geminiKey && geminiKey !== 'MY_GEMINI_API_KEY') ? 'ACTIVE' : 'DEFAULT_FALLBACK',
      },
      {
        name: 'SUPABASE_URL',
        description: 'Supabase PostgreSQL database connection URL',
        isSet: Boolean(supabaseUrl && supabaseUrl.startsWith('http')),
        isSecret: false,
        scope: 'Server & Client',
        maskedValue: supabaseUrl ? `${supabaseUrl.substring(0, 18)}...` : 'Not Set',
        status: Boolean(supabaseUrl && supabaseUrl.startsWith('http')) ? 'ACTIVE' : 'LOCAL_STORAGE_MODE',
      },
      {
        name: 'SUPABASE_ANON_KEY',
        description: 'Supabase public anon API token for database queries',
        isSet: Boolean(supabaseAnonKey && supabaseAnonKey.length > 20),
        isSecret: true,
        scope: 'Server & Client',
        status: Boolean(supabaseAnonKey && supabaseAnonKey.length > 20) ? 'ACTIVE' : 'LOCAL_STORAGE_MODE',
      },
      {
        name: 'VITE_SUPABASE_URL',
        description: 'Client-side Vite exposed Supabase URL',
        isSet: Boolean(process.env.VITE_SUPABASE_URL),
        isSecret: false,
        scope: 'Browser Client',
        status: Boolean(process.env.VITE_SUPABASE_URL) ? 'ACTIVE' : 'OPTIONAL',
      },
      {
        name: 'VITE_SUPABASE_ANON_KEY',
        description: 'Client-side Vite exposed Supabase Anon Key',
        isSet: Boolean(process.env.VITE_SUPABASE_ANON_KEY),
        isSecret: true,
        scope: 'Browser Client',
        status: Boolean(process.env.VITE_SUPABASE_ANON_KEY) ? 'ACTIVE' : 'OPTIONAL',
      },
      {
        name: 'APP_URL',
        description: 'AI Studio Cloud Run deployment URL',
        isSet: Boolean(appUrl),
        isSecret: false,
        scope: 'Runtime Ingress',
        status: Boolean(appUrl) ? 'ACTIVE' : 'LOCAL_PORT_3000',
      },
    ],
    storageMode: Boolean(supabaseUrl && supabaseAnonKey) ? 'Supabase PostgreSQL' : 'Local Persistent Storage (cleancity_db.json)',
    aiEngine: Boolean(geminiKey && geminiKey !== 'MY_GEMINI_API_KEY') ? 'Gemini 3.8 Flash (Live)' : 'Heuristic Rule-Based Fallback Engine',
  });
});

app.post('/api/supabase/test', async (req, res) => {
  const result = await testSupabaseConnection();
  res.json(result);
});

// -------------------------------------------------------------
// 2. AUTHENTICATION ENDPOINTS
// -------------------------------------------------------------
app.post('/api/auth/register', (req, res) => {
  try {
    const { full_name, email, password, confirm_password, city, phone_optional, role } = req.body;

    if (!full_name || !email || !password) {
      return res.status(400).json({ error: 'Full Name, Email, and Password are required.' });
    }

    if (confirm_password && password !== confirm_password) {
      return res.status(400).json({ error: 'Passwords do not match.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
    }

    const existingUser = db.getUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ error: 'An account with this email address already exists.' });
    }

    const newUser = db.createUser({
      full_name: full_name.trim(),
      email: email.trim().toLowerCase(),
      password,
      city: city ? city.trim() : 'Local Ward',
      phone_optional: phone_optional ? phone_optional.trim() : '',
      role: role === 'ADMIN' ? 'ADMIN' : 'CITIZEN',
    });

    res.status(201).json({
      message: 'Account registered successfully.',
      user: newUser,
    });
  } catch (err: any) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Failed to create user account. Please try again.' });
  }
});

app.post('/api/auth/login', (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const user = db.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password. Please try again.' });
    }

    if (user.password_hash !== password) {
      return res.status(401).json({ error: 'Invalid email or password. Please try again.' });
    }

    const { password_hash, ...profile } = user;
    res.json({
      message: 'Login successful.',
      user: profile,
    });
  } catch (err: any) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Authentication service encountered an error.' });
  }
});

app.get('/api/auth/me', (req, res) => {
  const userId = req.headers['x-user-id'] as string;
  if (!userId) {
    return res.status(401).json({ error: 'Not authenticated.' });
  }

  const profile = db.getUserById(userId);
  if (!profile) {
    return res.status(404).json({ error: 'User profile not found.' });
  }

  res.json({ user: profile });
});

app.post('/api/auth/logout', (req, res) => {
  res.json({ message: 'Logged out successfully.' });
});

// -------------------------------------------------------------
// 3. AI SANITATION ANALYSIS ENDPOINT
// -------------------------------------------------------------
app.post('/api/ai/analyze', async (req, res) => {
  try {
    const { description, imageBase64, imageMimeType, location, categoryHint } = req.body;

    if (!description && !imageBase64) {
      return res.status(400).json({
        error: 'Please provide either an issue description or photo for AI classification.',
      });
    }

    const analysis = await analyzeSanitationIssue({
      description: description || 'Civic sanitation problem detected in public area.',
      imageBase64,
      imageMimeType: imageMimeType || 'image/jpeg',
      location,
      categoryHint,
    });

    res.json(analysis);
  } catch (err: any) {
    console.error('AI analysis error:', err);
    res.status(500).json({ error: 'AI analysis service temporarily unavailable.' });
  }
});

// -------------------------------------------------------------
// 4. COMPLAINTS ENDPOINTS
// -------------------------------------------------------------
app.get('/api/complaints', (req, res) => {
  try {
    const { userId, role, status, category, priority, search } = req.query as Record<string, string>;

    const complaints = db.getComplaints({
      userId,
      role,
      status,
      category,
      priority,
      search,
    });

    res.json(complaints);
  } catch (err: any) {
    console.error('Get complaints error:', err);
    res.status(500).json({ error: 'Failed to retrieve complaints.' });
  }
});

app.get('/api/complaints/:idOrCode', (req, res) => {
  try {
    const { idOrCode } = req.params;
    const complaint = db.getComplaintByIdOrCode(idOrCode);

    if (!complaint) {
      return res.status(404).json({ error: `Complaint "${idOrCode}" not found.` });
    }

    res.json(complaint);
  } catch (err: any) {
    console.error('Get complaint detail error:', err);
    res.status(500).json({ error: 'Failed to retrieve complaint details.' });
  }
});

app.post('/api/complaints', (req, res) => {
  try {
    const {
      user_id,
      user_name,
      user_email,
      image_url,
      description,
      location,
      latitude_optional,
      longitude_optional,
      category,
      priority,
      confidence,
      ai_reason,
      recommended_action,
    } = req.body;

    if (!description || !location) {
      return res.status(400).json({
        error: 'Description and location are required to submit a complaint.',
      });
    }

    const newComplaint = db.createComplaint({
      user_id: user_id || 'usr-anonymous',
      user_name: user_name || 'Citizen User',
      user_email: user_email || '',
      image_url:
        image_url ||
        'https://images.unsplash.com/photo-1611288875785-5a503e91d643?auto=format&fit=crop&w=800&q=80',
      description: description.trim(),
      location: location.trim(),
      latitude_optional: latitude_optional ? Number(latitude_optional) : undefined,
      longitude_optional: longitude_optional ? Number(longitude_optional) : undefined,
      category: category || 'Garbage Overflow',
      priority: priority || 'Medium',
      confidence: confidence ? Number(confidence) : 0.9,
      ai_reason:
        ai_reason ||
        'Evaluated by CleanCity sanitation assessment engine based on reported criteria.',
      recommended_action:
        recommended_action || 'Assign municipal ward team for routine inspection and clearance.',
    });

    res.status(201).json({
      message: 'Complaint submitted successfully.',
      complaint: newComplaint,
    });
  } catch (err: any) {
    console.error('Create complaint error:', err);
    res.status(500).json({ error: 'Failed to record complaint in database.' });
  }
});

app.patch('/api/complaints/:id/status', (req, res) => {
  try {
    const { id } = req.params;
    const { new_status, changed_by, note } = req.body;

    const validStatuses = ['REPORTED', 'UNDER REVIEW', 'IN PROGRESS', 'RESOLVED'];
    if (!validStatuses.includes(new_status)) {
      return res.status(400).json({
        error: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
      });
    }

    const updated = db.updateComplaintStatus(
      id,
      new_status,
      changed_by || 'Sanitation Authority',
      note
    );

    if (!updated) {
      return res.status(404).json({ error: 'Complaint not found.' });
    }

    res.json({
      message: `Complaint status updated to ${new_status}.`,
      complaint: updated,
    });
  } catch (err: any) {
    console.error('Update status error:', err);
    res.status(500).json({ error: 'Failed to update complaint status.' });
  }
});

app.delete('/api/complaints/:id', (req, res) => {
  try {
    const { id } = req.params;
    const deleted = db.deleteComplaint(id);
    if (!deleted) {
      return res.status(404).json({ error: 'Complaint not found.' });
    }
    res.json({ success: true, message: 'Complaint deleted successfully.' });
  } catch (err: any) {
    console.error('Delete complaint error:', err);
    res.status(500).json({ error: 'Failed to delete complaint.' });
  }
});

// -------------------------------------------------------------
// 5. NOTIFICATIONS ENDPOINTS
// -------------------------------------------------------------
app.get('/api/notifications', (req, res) => {
  try {
    const userId = (req.query.userId as string) || (req.headers['x-user-id'] as string);
    if (!userId) {
      return res.status(400).json({ error: 'userId parameter is required.' });
    }

    const notifications = db.getNotifications(userId);
    res.json(notifications);
  } catch (err: any) {
    console.error('Get notifications error:', err);
    res.status(500).json({ error: 'Failed to load notifications.' });
  }
});

app.patch('/api/notifications/:id/read', (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    const success = db.markNotificationRead(id, userId);
    res.json({ success });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to mark notification as read.' });
  }
});

app.patch('/api/notifications/mark-all-read', (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ error: 'userId is required.' });
    }

    db.markAllNotificationsRead(userId);
    res.json({ success: true, message: 'All notifications marked as read.' });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to mark all notifications as read.' });
  }
});

// -------------------------------------------------------------
// 6. ANALYTICS ENDPOINTS
// -------------------------------------------------------------
app.get('/api/analytics', (req, res) => {
  try {
    const analytics = db.getAnalytics();
    res.json(analytics);
  } catch (err: any) {
    console.error('Get analytics error:', err);
    res.status(500).json({ error: 'Failed to compute sanitation analytics.' });
  }
});

// -------------------------------------------------------------
// 7. VITE MIDDLEWARE & SERVER STARTUP
// -------------------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[CleanCity] Full-stack Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
