import fs from 'fs';
import path from 'path';
import {
  UserProfile,
  Complaint,
  StatusHistoryItem,
  InAppNotification,
  ComplaintStatus,
  ComplaintCategory,
  ComplaintPriority,
  AnalyticsData,
} from '../src/types.ts';

interface DatabaseSchema {
  users: (UserProfile & { password_hash: string })[];
  complaints: Complaint[];
  status_history: StatusHistoryItem[];
  notifications: InAppNotification[];
  counter: number;
}

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'cleancity_db.json');

// Ensure directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

function getInitialSeedData(): DatabaseSchema {
  const users: (UserProfile & { password_hash: string })[] = [
    {
      id: 'usr-admin-01',
      full_name: 'Chief Sanitation Inspector R. Verma',
      email: 'admin@cleancity.org',
      password_hash: 'admin123',
      role: 'ADMIN',
      city: 'Visakhapatnam',
      phone_optional: '+91 98765 43210',
      created_at: new Date('2026-08-01T08:00:00Z').toISOString(),
    },
    {
      id: 'usr-citizen-01',
      full_name: 'Priya Sharma (Student)',
      email: 'citizen@cleancity.org',
      password_hash: 'citizen123',
      role: 'CITIZEN',
      city: 'MVP Colony',
      phone_optional: '+91 98123 45678',
      created_at: new Date('2026-08-10T10:30:00Z').toISOString(),
    },
  ];

  const complaints: Complaint[] = [
    {
      id: 'cmp-001',
      complaint_id: 'CC-2026-001',
      user_id: 'usr-citizen-01',
      user_name: 'Priya Sharma (Student)',
      user_email: 'citizen@cleancity.org',
      image_url:
        'https://images.unsplash.com/photo-1611288875785-5a503e91d643?auto=format&fit=crop&w=800&q=80',
      description:
        'Severe garbage overflow near the local grocery market corner. Stray animals are spreading waste onto the pedestrian walkway.',
      location: 'Sector 4, MVP Colony, Main Market Junction',
      latitude_optional: 17.7412,
      longitude_optional: 83.3325,
      category: 'Garbage Overflow',
      priority: 'High',
      confidence: 0.94,
      ai_reason:
        'Substantial accumulation of organic and packaging solid waste overflowing onto public pavement with imminent public health risk.',
      recommended_action:
        'Dispatch primary compactor truck #12 and place an auxiliary 2.5-ton skip container.',
      status: 'IN PROGRESS',
      created_at: new Date('2026-08-28T09:15:00Z').toISOString(),
      updated_at: new Date('2026-08-29T14:30:00Z').toISOString(),
    },
    {
      id: 'cmp-002',
      complaint_id: 'CC-2026-002',
      user_id: 'usr-citizen-01',
      user_name: 'Priya Sharma (Student)',
      user_email: 'citizen@cleancity.org',
      image_url:
        'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80',
      description:
        'Roadside storm drain is choked with plastic bottles and sediment. Water is backing up during rainfall.',
      location: 'Opposite Government High School, Gajuwaka',
      latitude_optional: 17.6904,
      longitude_optional: 83.2095,
      category: 'Blocked Drain',
      priority: 'Medium',
      confidence: 0.89,
      ai_reason:
        'Clogged drainage canal with visible particulate stoppage; potential flooding hazard during monsoon precipitation.',
      recommended_action:
        'Deploy municipal desilting excavator and manual clearance unit.',
      status: 'UNDER REVIEW',
      created_at: new Date('2026-08-30T11:45:00Z').toISOString(),
      updated_at: new Date('2026-08-30T16:00:00Z').toISOString(),
    },
    {
      id: 'cmp-003',
      complaint_id: 'CC-2026-003',
      user_id: 'usr-citizen-01',
      user_name: 'Priya Sharma (Student)',
      user_email: 'citizen@cleancity.org',
      image_url:
        'https://images.unsplash.com/photo-1621451537084-482c73073a0f?auto=format&fit=crop&w=800&q=80',
      description:
        'Scattered single-use plastic water bottles and snack packaging left along the coastal walkway benches.',
      location: 'Promenade Strip, Beach Road',
      latitude_optional: 17.7126,
      longitude_optional: 83.3235,
      category: 'Plastic Waste',
      priority: 'Low',
      confidence: 0.92,
      ai_reason:
        'Dry post-consumer plastic litter scattered across public seating zone.',
      recommended_action:
        'Assign beach beat sanitization personnel and schedule morning collection cycle.',
      status: 'RESOLVED',
      created_at: new Date('2026-08-25T16:20:00Z').toISOString(),
      updated_at: new Date('2026-08-27T10:10:00Z').toISOString(),
    },
    {
      id: 'cmp-004',
      complaint_id: 'CC-2026-004',
      user_id: 'usr-admin-01',
      user_name: 'Chief Sanitation Inspector R. Verma',
      user_email: 'admin@cleancity.org',
      image_url:
        'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80',
      description:
        'Unapproved dumping of commercial debris and demolition waste on vacant roadside plot.',
      location: 'Plot 42, Highway Approach Road, Madhurawada',
      latitude_optional: 17.8213,
      longitude_optional: 83.3514,
      category: 'Illegal Dumping',
      priority: 'High',
      confidence: 0.96,
      ai_reason:
        'Large-scale unauthorized deposition of mixed demolition and solid refuse in non-designated zone.',
      recommended_action:
        'Issue municipal infringement notice and dispatch heavy loader for site clearance.',
      status: 'REPORTED',
      created_at: new Date('2026-09-02T14:10:00Z').toISOString(),
      updated_at: new Date('2026-09-02T14:10:00Z').toISOString(),
    },
    {
      id: 'cmp-005',
      complaint_id: 'CC-2026-005',
      user_id: 'usr-citizen-01',
      user_name: 'Priya Sharma (Student)',
      user_email: 'citizen@cleancity.org',
      image_url:
        'https://images.unsplash.com/photo-1595278069441-2cf29f8005a4?auto=format&fit=crop&w=800&q=80',
      description:
        'Litter and unemptied bins around student transit area and south entrance.',
      location: 'SITAM Engineering College, South Campus Gate Bus Stop',
      latitude_optional: 17.7388,
      longitude_optional: 83.3198,
      category: 'Unclean Public Space',
      priority: 'Medium',
      confidence: 0.91,
      ai_reason:
        'High pedestrian footfall zone with overwhelmed public trash receptacles.',
      recommended_action:
        'Empty existing campus bins, sanitize area, and place additional twin-bin recycling unit.',
      status: 'UNDER REVIEW',
      created_at: new Date('2026-09-03T08:40:00Z').toISOString(),
      updated_at: new Date('2026-09-03T11:00:00Z').toISOString(),
    },
  ];

  const status_history: StatusHistoryItem[] = [
    {
      id: 'hist-001',
      complaint_id: 'cmp-001',
      old_status: 'NEW',
      new_status: 'REPORTED',
      changed_by: 'Priya Sharma (Student)',
      changed_at: new Date('2026-08-28T09:15:00Z').toISOString(),
      note: 'Complaint registered by citizen with AI-assisted verification.',
    },
    {
      id: 'hist-002',
      complaint_id: 'cmp-001',
      old_status: 'REPORTED',
      new_status: 'UNDER REVIEW',
      changed_by: 'Sanitation Authority Desk',
      changed_at: new Date('2026-08-28T14:00:00Z').toISOString(),
      note: 'Complaint acknowledged and assigned to Zone 3 field supervisor.',
    },
    {
      id: 'hist-003',
      complaint_id: 'cmp-001',
      old_status: 'UNDER REVIEW',
      new_status: 'IN PROGRESS',
      changed_by: 'Chief Sanitation Inspector R. Verma',
      changed_at: new Date('2026-08-29T14:30:00Z').toISOString(),
      note: 'Sanitation vehicle en-route for waste collection.',
    },
    {
      id: 'hist-004',
      complaint_id: 'cmp-002',
      old_status: 'NEW',
      new_status: 'REPORTED',
      changed_by: 'Priya Sharma (Student)',
      changed_at: new Date('2026-08-30T11:45:00Z').toISOString(),
      note: 'Complaint registered with geolocation.',
    },
    {
      id: 'hist-005',
      complaint_id: 'cmp-002',
      old_status: 'REPORTED',
      new_status: 'UNDER REVIEW',
      changed_by: 'Drainage & Public Works Dept',
      changed_at: new Date('2026-08-30T16:00:00Z').toISOString(),
      note: 'Drainage crew scheduled for site inspection.',
    },
    {
      id: 'hist-006',
      complaint_id: 'cmp-003',
      old_status: 'NEW',
      new_status: 'REPORTED',
      changed_by: 'Priya Sharma (Student)',
      changed_at: new Date('2026-08-25T16:20:00Z').toISOString(),
      note: 'Beach litter issue submitted.',
    },
    {
      id: 'hist-007',
      complaint_id: 'cmp-003',
      old_status: 'REPORTED',
      new_status: 'IN PROGRESS',
      changed_by: 'Coastal Sanitation Cell',
      changed_at: new Date('2026-08-26T07:30:00Z').toISOString(),
      note: 'Sanitation staff deployed for promenade cleanup.',
    },
    {
      id: 'hist-008',
      complaint_id: 'cmp-003',
      old_status: 'IN PROGRESS',
      new_status: 'RESOLVED',
      changed_by: 'Chief Sanitation Inspector R. Verma',
      changed_at: new Date('2026-08-27T10:10:00Z').toISOString(),
      note: 'Litter cleared and secondary bins installed. Area sanitized.',
    },
    {
      id: 'hist-009',
      complaint_id: 'cmp-004',
      old_status: 'NEW',
      new_status: 'REPORTED',
      changed_by: 'Chief Sanitation Inspector R. Verma',
      changed_at: new Date('2026-09-02T14:10:00Z').toISOString(),
      note: 'Official field report recorded for illegal dumping.',
    },
    {
      id: 'hist-010',
      complaint_id: 'cmp-005',
      old_status: 'NEW',
      new_status: 'REPORTED',
      changed_by: 'Priya Sharma (Student)',
      changed_at: new Date('2026-09-03T08:40:00Z').toISOString(),
      note: 'Campus perimeter sanitation report submitted.',
    },
    {
      id: 'hist-011',
      complaint_id: 'cmp-005',
      old_status: 'REPORTED',
      new_status: 'UNDER REVIEW',
      changed_by: 'Sanitation Authority Desk',
      changed_at: new Date('2026-09-03T11:00:00Z').toISOString(),
      note: 'Coordinating with campus civic liaison for scheduled servicing.',
    },
  ];

  const notifications: InAppNotification[] = [
    {
      id: 'notif-001',
      user_id: 'usr-citizen-01',
      complaint_id: 'CC-2026-001',
      message: 'Your complaint CC-2026-001 has been submitted.',
      is_read: true,
      created_at: new Date('2026-08-28T09:15:00Z').toISOString(),
    },
    {
      id: 'notif-002',
      user_id: 'usr-citizen-01',
      complaint_id: 'CC-2026-001',
      message: 'Your complaint CC-2026-001 is now Under Review.',
      is_read: true,
      created_at: new Date('2026-08-28T14:00:00Z').toISOString(),
    },
    {
      id: 'notif-003',
      user_id: 'usr-citizen-01',
      complaint_id: 'CC-2026-001',
      message: 'Your complaint CC-2026-001 is now In Progress.',
      is_read: false,
      created_at: new Date('2026-08-29T14:30:00Z').toISOString(),
    },
    {
      id: 'notif-004',
      user_id: 'usr-citizen-01',
      complaint_id: 'CC-2026-002',
      message: 'Your complaint CC-2026-002 has been submitted.',
      is_read: true,
      created_at: new Date('2026-08-30T11:45:00Z').toISOString(),
    },
    {
      id: 'notif-005',
      user_id: 'usr-citizen-01',
      complaint_id: 'CC-2026-002',
      message: 'Your complaint CC-2026-002 is now Under Review.',
      is_read: false,
      created_at: new Date('2026-08-30T16:00:00Z').toISOString(),
    },
    {
      id: 'notif-006',
      user_id: 'usr-citizen-01',
      complaint_id: 'CC-2026-003',
      message: 'Your complaint CC-2026-003 has been Resolved.',
      is_read: false,
      created_at: new Date('2026-08-27T10:10:00Z').toISOString(),
    },
    {
      id: 'notif-007',
      user_id: 'usr-citizen-01',
      complaint_id: 'CC-2026-005',
      message: 'Your complaint CC-2026-005 is now Under Review.',
      is_read: false,
      created_at: new Date('2026-09-03T11:00:00Z').toISOString(),
    },
  ];

  return {
    users,
    complaints,
    status_history,
    notifications,
    counter: 5,
  };
}

class DatabaseManager {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.loadDatabase();
  }

  private loadDatabase(): DatabaseSchema {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        return JSON.parse(raw);
      }
    } catch (err) {
      console.warn('Could not read existing database file, resetting to seed data:', err);
    }
    const seed = getInitialSeedData();
    this.saveDatabase(seed);
    return seed;
  }

  private saveDatabase(dataToSave?: DatabaseSchema) {
    try {
      const payload = dataToSave || this.data;
      fs.writeFileSync(DB_FILE, JSON.stringify(payload, null, 2), 'utf-8');
    } catch (err) {
      console.error('Error saving database to file:', err);
    }
  }

  // Users
  getUserByEmail(email: string) {
    return this.data.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  getUserById(id: string) {
    const user = this.data.users.find((u) => u.id === id);
    if (!user) return null;
    const { password_hash, ...profile } = user;
    return profile;
  }

  createUser(userData: {
    full_name: string;
    email: string;
    password: string;
    city: string;
    phone_optional?: string;
    role?: 'CITIZEN' | 'ADMIN';
  }): UserProfile {
    const id = `usr-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const role = userData.role || 'CITIZEN';
    const newUser = {
      id,
      full_name: userData.full_name,
      email: userData.email,
      password_hash: userData.password,
      role,
      city: userData.city,
      phone_optional: userData.phone_optional || '',
      created_at: new Date().toISOString(),
    };
    this.data.users.push(newUser);
    this.saveDatabase();
    const { password_hash, ...profile } = newUser;
    return profile;
  }

  // Complaints
  getComplaints(options?: {
    userId?: string;
    role?: string;
    status?: string;
    category?: string;
    priority?: string;
    search?: string;
  }): Complaint[] {
    let list = [...this.data.complaints];

    // Citizen can only see their own complaints
    if (options?.role === 'CITIZEN' && options.userId) {
      list = list.filter((c) => c.user_id === options.userId);
    }

    if (options?.status && options.status !== 'ALL') {
      list = list.filter((c) => c.status === options.status);
    }

    if (options?.category && options.category !== 'ALL') {
      list = list.filter((c) => c.category === options.category);
    }

    if (options?.priority && options.priority !== 'ALL') {
      list = list.filter((c) => c.priority === options.priority);
    }

    if (options?.search) {
      const q = options.search.toLowerCase();
      list = list.filter(
        (c) =>
          c.complaint_id.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          c.location.toLowerCase().includes(q) ||
          c.category.toLowerCase().includes(q)
      );
    }

    // Attach history
    return list.map((c) => ({
      ...c,
      history: this.data.status_history.filter((h) => h.complaint_id === c.id),
    })).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  getComplaintByIdOrCode(identifier: string): Complaint | null {
    const complaint = this.data.complaints.find(
      (c) => c.id === identifier || c.complaint_id.toLowerCase() === identifier.toLowerCase()
    );
    if (!complaint) return null;
    return {
      ...complaint,
      history: this.data.status_history.filter((h) => h.complaint_id === complaint.id),
    };
  }

  createComplaint(data: {
    user_id: string;
    user_name?: string;
    user_email?: string;
    image_url: string;
    description: string;
    location: string;
    latitude_optional?: number;
    longitude_optional?: number;
    category: ComplaintCategory;
    priority: ComplaintPriority;
    confidence: number;
    ai_reason: string;
    recommended_action: string;
  }): Complaint {
    this.data.counter += 1;
    const padded = String(this.data.counter).padStart(3, '0');
    const complaint_id = `CC-2026-${padded}`;
    const id = `cmp-${Date.now()}`;
    const now = new Date().toISOString();

    const newComplaint: Complaint = {
      id,
      complaint_id,
      user_id: data.user_id,
      user_name: data.user_name || 'Citizen User',
      user_email: data.user_email || '',
      image_url: data.image_url,
      description: data.description,
      location: data.location,
      latitude_optional: data.latitude_optional,
      longitude_optional: data.longitude_optional,
      category: data.category,
      priority: data.priority,
      confidence: data.confidence,
      ai_reason: data.ai_reason,
      recommended_action: data.recommended_action,
      status: 'REPORTED',
      created_at: now,
      updated_at: now,
    };

    this.data.complaints.unshift(newComplaint);

    // Initial history
    const historyItem: StatusHistoryItem = {
      id: `hist-${Date.now()}`,
      complaint_id: id,
      old_status: 'NEW',
      new_status: 'REPORTED',
      changed_by: data.user_name || 'Citizen User',
      changed_at: now,
      note: 'Complaint submitted with automated AI classification.',
    };
    this.data.status_history.push(historyItem);

    // Initial notification
    const notification: InAppNotification = {
      id: `notif-${Date.now()}`,
      user_id: data.user_id,
      complaint_id,
      message: `Your complaint ${complaint_id} has been submitted.`,
      is_read: false,
      created_at: now,
    };
    this.data.notifications.unshift(notification);

    this.saveDatabase();
    return {
      ...newComplaint,
      history: [historyItem],
    };
  }

  updateComplaintStatus(
    idOrCode: string,
    newStatus: ComplaintStatus,
    changedBy: string,
    adminNote?: string
  ): Complaint | null {
    const complaint = this.data.complaints.find(
      (c) => c.id === idOrCode || c.complaint_id.toLowerCase() === idOrCode.toLowerCase()
    );
    if (!complaint) return null;

    const oldStatus = complaint.status;
    complaint.status = newStatus;
    complaint.updated_at = new Date().toISOString();

    const historyItem: StatusHistoryItem = {
      id: `hist-${Date.now()}`,
      complaint_id: complaint.id,
      old_status: oldStatus,
      new_status: newStatus,
      changed_by: changedBy,
      changed_at: complaint.updated_at,
      note: adminNote || `Status updated from ${oldStatus} to ${newStatus}.`,
    };
    this.data.status_history.push(historyItem);

    // Create notification for the citizen who filed it
    let messageText = `Your complaint ${complaint.complaint_id} is now ${newStatus.toLowerCase().replace(/\b\w/g, (l) => l.toUpperCase())}.`;
    if (newStatus === 'RESOLVED') {
      messageText = `Your complaint ${complaint.complaint_id} has been Resolved.`;
    }
    const notif: InAppNotification = {
      id: `notif-${Date.now()}`,
      user_id: complaint.user_id,
      complaint_id: complaint.complaint_id,
      message: messageText,
      is_read: false,
      created_at: complaint.updated_at,
    };
    this.data.notifications.unshift(notif);

    this.saveDatabase();
    return {
      ...complaint,
      history: this.data.status_history.filter((h) => h.complaint_id === complaint.id),
    };
  }

  deleteComplaint(idOrCode: string): boolean {
    const initialCount = this.data.complaints.length;
    const target = this.data.complaints.find(
      (c) => c.id === idOrCode || c.complaint_id.toLowerCase() === idOrCode.toLowerCase()
    );
    if (!target) return false;

    this.data.complaints = this.data.complaints.filter((c) => c.id !== target.id);
    this.data.status_history = this.data.status_history.filter((h) => h.complaint_id !== target.id);
    this.saveDatabase();
    return this.data.complaints.length < initialCount;
  }

  // Notifications
  getNotifications(userId: string): InAppNotification[] {
    return this.data.notifications
      .filter((n) => n.user_id === userId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  markNotificationRead(id: string, userId: string): boolean {
    const n = this.data.notifications.find((item) => item.id === id && item.user_id === userId);
    if (n) {
      n.is_read = true;
      this.saveDatabase();
      return true;
    }
    return false;
  }

  markAllNotificationsRead(userId: string): boolean {
    let updated = false;
    this.data.notifications.forEach((n) => {
      if (n.user_id === userId && !n.is_read) {
        n.is_read = true;
        updated = true;
      }
    });
    if (updated) {
      this.saveDatabase();
    }
    return true;
  }

  // Analytics
  getAnalytics(): AnalyticsData {
    const total = this.data.complaints.length;
    const underReview = this.data.complaints.filter((c) => c.status === 'UNDER REVIEW').length;
    const inProgress = this.data.complaints.filter((c) => c.status === 'IN PROGRESS').length;
    const resolved = this.data.complaints.filter((c) => c.status === 'RESOLVED').length;
    const highPriority = this.data.complaints.filter((c) => c.priority === 'High').length;
    const pendingCount = this.data.complaints.filter((c) => c.status !== 'RESOLVED').length;
    const resolutionPercentage = total > 0 ? Math.round((resolved / total) * 100) : 0;

    // Category aggregation
    const catMap: Record<string, number> = {};
    this.data.complaints.forEach((c) => {
      catMap[c.category] = (catMap[c.category] || 0) + 1;
    });
    const byCategory = Object.entries(catMap).map(([category, count]) => ({
      category,
      count,
    })).sort((a, b) => b.count - a.count);

    const mostCommonCategory = byCategory[0]?.category || 'Garbage Overflow';

    // Status aggregation
    const statuses: ComplaintStatus[] = ['REPORTED', 'UNDER REVIEW', 'IN PROGRESS', 'RESOLVED'];
    const byStatus = statuses.map((st) => ({
      status: st,
      count: this.data.complaints.filter((c) => c.status === st).length,
    }));

    const recentComplaints = [...this.data.complaints]
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 5);

    return {
      totalComplaints: total,
      underReview,
      inProgress,
      resolved,
      highPriority,
      pendingCount,
      resolutionPercentage,
      mostCommonCategory,
      byCategory,
      byStatus,
      recentComplaints,
    };
  }

  getStatus() {
    return {
      status: 'online',
      storageType: 'file-persistent-json',
      path: DB_FILE,
      totalUsers: this.data.users.length,
      totalComplaints: this.data.complaints.length,
      totalNotifications: this.data.notifications.length,
    };
  }
}

export const db = new DatabaseManager();
