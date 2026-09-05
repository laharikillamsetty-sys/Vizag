import {
  UserProfile,
  Complaint,
  InAppNotification,
  AIAnalysisResult,
  AnalyticsData,
  ComplaintStatus,
} from '../types.ts';
import {
  supabase,
  isSupabaseConfigured,
  fetchSupabaseComplaints,
  insertSupabaseComplaint,
  updateSupabaseComplaint,
  deleteSupabaseComplaint,
  testSupabaseClient,
} from '../lib/supabase.ts';

const API_BASE = '';

// Helper to get stored auth token/user
export function getStoredUser(): UserProfile | null {
  try {
    const raw = localStorage.getItem('cleancity_auth_user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setStoredUser(user: UserProfile | null) {
  if (user) {
    localStorage.setItem('cleancity_auth_user', JSON.stringify(user));
  } else {
    localStorage.removeItem('cleancity_auth_user');
  }
}

function getAuthHeaders(): HeadersInit {
  const user = getStoredUser();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (user?.id) {
    headers['x-user-id'] = user.id;
  }
  return headers;
}

export const api = {
  // 1. Auth
  async register(data: {
    full_name: string;
    email: string;
    password: string;
    confirm_password?: string;
    city: string;
    phone_optional?: string;
    role?: 'CITIZEN' | 'ADMIN';
  }): Promise<{ user: UserProfile; message: string }> {
    const res = await fetch(`${API_BASE}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) {
      throw new Error(result.error || 'Registration failed');
    }
    setStoredUser(result.user);
    return result;
  },

  async login(credentials: { email: string; password: string }): Promise<{ user: UserProfile; message: string }> {
    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    const result = await res.json();
    if (!res.ok) {
      throw new Error(result.error || 'Login failed');
    }
    setStoredUser(result.user);
    return result;
  },

  async logout(): Promise<void> {
    try {
      await fetch(`${API_BASE}/api/auth/logout`, { method: 'POST' });
    } catch (e) {
      console.warn('Logout network error:', e);
    }
    setStoredUser(null);
  },

  async getCurrentUser(): Promise<UserProfile | null> {
    const stored = getStoredUser();
    if (!stored) return null;
    try {
      const res = await fetch(`${API_BASE}/api/auth/me`, {
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        setStoredUser(data.user);
        return data.user;
      }
    } catch {
      // Offline fallback: return stored user
    }
    return stored;
  },

  // 2. AI Sanitation Analysis
  async analyzeIssue(payload: {
    description: string;
    imageBase64?: string;
    imageMimeType?: string;
    location?: string;
    categoryHint?: string;
  }): Promise<AIAnalysisResult> {
    const res = await fetch(`${API_BASE}/api/ai/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const result = await res.json();
    if (!res.ok) {
      throw new Error(result.error || 'AI analysis failed');
    }
    return result;
  },

  // 3. Complaints
  async getComplaints(filters?: {
    userId?: string;
    role?: string;
    status?: string;
    category?: string;
    priority?: string;
    search?: string;
  }): Promise<Complaint[]> {
    // If Supabase is configured on client side, retrieve from Supabase first
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await fetchSupabaseComplaints(filters);
        if (!error && data && data.length > 0) {
          return data;
        }
      } catch (err) {
        console.warn('Supabase fetch failed, falling back to local API:', err);
      }
    }

    const params = new URLSearchParams();
    if (filters?.userId) params.append('userId', filters.userId);
    if (filters?.role) params.append('role', filters.role);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.category) params.append('category', filters.category);
    if (filters?.priority) params.append('priority', filters.priority);
    if (filters?.search) params.append('search', filters.search);

    const res = await fetch(`${API_BASE}/api/complaints?${params.toString()}`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) {
      throw new Error('Failed to load complaints');
    }
    return res.json();
  },

  async getComplaint(idOrCode: string): Promise<Complaint> {
    const res = await fetch(`${API_BASE}/api/complaints/${encodeURIComponent(idOrCode)}`, {
      headers: getAuthHeaders(),
    });
    const result = await res.json();
    if (!res.ok) {
      throw new Error(result.error || 'Complaint not found');
    }
    return result;
  },

  async submitComplaint(data: {
    user_id: string;
    user_name?: string;
    user_email?: string;
    image_url: string;
    description: string;
    location: string;
    latitude_optional?: number;
    longitude_optional?: number;
    category: string;
    priority: string;
    confidence: number;
    ai_reason: string;
    recommended_action: string;
  }): Promise<{ message: string; complaint: Complaint }> {
    const res = await fetch(`${API_BASE}/api/complaints`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) {
      throw new Error(result.error || 'Failed to submit complaint');
    }

    // When Supabase is configured, also persist directly into Supabase
    if (isSupabaseConfigured && result.complaint) {
      try {
        await insertSupabaseComplaint(result.complaint);
      } catch (err) {
        console.warn('Direct Supabase insert advisory:', err);
      }
    }

    return result;
  },

  async updateComplaintStatus(
    idOrCode: string,
    new_status: ComplaintStatus,
    changed_by: string,
    note?: string
  ): Promise<{ message: string; complaint: Complaint }> {
    const res = await fetch(`${API_BASE}/api/complaints/${encodeURIComponent(idOrCode)}/status`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ new_status, changed_by, note }),
    });
    const result = await res.json();
    if (!res.ok) {
      throw new Error(result.error || 'Failed to update complaint status');
    }

    // When Supabase is configured, also update in Supabase
    if (isSupabaseConfigured && result.complaint) {
      try {
        await updateSupabaseComplaint(idOrCode, { status: new_status });
      } catch (err) {
        console.warn('Direct Supabase update advisory:', err);
      }
    }

    return result;
  },

  async deleteComplaint(idOrCode: string): Promise<{ success: boolean; message: string }> {
    // When Supabase is configured, delete from Supabase
    if (isSupabaseConfigured) {
      try {
        await deleteSupabaseComplaint(idOrCode);
      } catch (err) {
        console.warn('Direct Supabase delete advisory:', err);
      }
    }

    const res = await fetch(`${API_BASE}/api/complaints/${encodeURIComponent(idOrCode)}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!res.ok) {
      return { success: true, message: 'Complaint deleted from current state.' };
    }
    return res.json();
  },

  // 4. Notifications
  async getNotifications(userId: string): Promise<InAppNotification[]> {
    const res = await fetch(`${API_BASE}/api/notifications?userId=${encodeURIComponent(userId)}`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) {
      return [];
    }
    return res.json();
  },

  async markNotificationRead(id: string, userId: string): Promise<void> {
    await fetch(`${API_BASE}/api/notifications/${id}/read`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ userId }),
    });
  },

  async markAllNotificationsRead(userId: string): Promise<void> {
    await fetch(`${API_BASE}/api/notifications/mark-all-read`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ userId }),
    });
  },

  // 5. Analytics
  async getAnalytics(): Promise<AnalyticsData> {
    const res = await fetch(`${API_BASE}/api/analytics`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) {
      throw new Error('Failed to load analytics data');
    }
    return res.json();
  },

  // 6. DB & Environment Status
  async getDbStatus(): Promise<any> {
    try {
      const res = await fetch(`${API_BASE}/api/db/status`);
      return await res.json();
    } catch {
      return { status: 'offline', storageType: 'local-memory' };
    }
  },

  async getEnvStatus(): Promise<any> {
    try {
      const res = await fetch(`${API_BASE}/api/env/status`);
      return await res.json();
    } catch {
      return {
        variables: [],
        storageMode: 'Local JSON Database',
        aiEngine: 'Heuristic Rule-Based Engine',
      };
    }
  },

  async testSupabase(): Promise<{ connected: boolean; message: string; url?: string }> {
    if (isSupabaseConfigured) {
      try {
        const clientResult = await testSupabaseClient();
        if (clientResult.connected) {
          return clientResult;
        }
      } catch (err) {
        console.warn('Client Supabase test error, trying backend route:', err);
      }
    }

    try {
      const res = await fetch(`${API_BASE}/api/supabase/test`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      return await res.json();
    } catch (e: any) {
      return {
        connected: false,
        message: e.message || 'Network request failed while testing Supabase connection',
      };
    }
  },
};
