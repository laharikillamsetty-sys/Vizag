export type UserRole = 'CITIZEN' | 'ADMIN';

export interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  role: UserRole;
  city: string;
  phone_optional?: string;
  created_at: string;
}

export type ComplaintCategory =
  | 'Garbage Overflow'
  | 'Illegal Dumping'
  | 'Blocked Drain'
  | 'Plastic Waste'
  | 'Unclean Public Space'
  | 'Other';

export type ComplaintPriority = 'High' | 'Medium' | 'Low';

export type ComplaintStatus =
  | 'REPORTED'
  | 'UNDER REVIEW'
  | 'IN PROGRESS'
  | 'RESOLVED';

export interface StatusHistoryItem {
  id: string;
  complaint_id: string;
  old_status: ComplaintStatus | 'NEW';
  new_status: ComplaintStatus;
  changed_by: string;
  changed_at: string;
  note?: string;
}

export interface Complaint {
  id: string;
  complaint_id: string; // e.g. "CC-2026-001"
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
  confidence: number; // e.g. 0.94
  ai_reason: string;
  recommended_action: string;
  status: ComplaintStatus;
  created_at: string;
  updated_at: string;
  history?: StatusHistoryItem[];
}

export interface InAppNotification {
  id: string;
  user_id: string;
  complaint_id: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface AIAnalysisResult {
  category: ComplaintCategory;
  priority: ComplaintPriority;
  confidence: number;
  reason: string;
  recommendedAction: string;
}

export interface AnalyticsData {
  totalComplaints: number;
  underReview: number;
  inProgress: number;
  resolved: number;
  highPriority: number;
  pendingCount: number;
  resolutionPercentage: number;
  mostCommonCategory: string;
  byCategory: { category: string; count: number }[];
  byStatus: { status: ComplaintStatus; count: number }[];
  recentComplaints: Complaint[];
}
