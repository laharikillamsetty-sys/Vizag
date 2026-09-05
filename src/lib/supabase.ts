import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Complaint, ComplaintStatus, UserProfile } from '../types.ts';

// 1. Read Supabase credentials using import.meta.env per Vite standard
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// 2. Validate URL and key to prevent unhandled runtime URL parsing crash on placeholder values
const isValidHttpUrl = (url?: string): boolean => {
  if (!url || typeof url !== 'string') return false;
  return (url.startsWith('https://') || url.startsWith('http://')) && !url.includes('YOUR_SUPABASE');
};

const isValidKey = (key?: string): boolean => {
  if (!key || typeof key !== 'string') return false;
  return key.trim().length > 10 && !key.includes('YOUR_SUPABASE');
};

export const isSupabaseConfigured = isValidHttpUrl(supabaseUrl) && isValidKey(supabaseAnonKey);

// Safe fallback URL for initial compilation/preview before user enters live project credentials
const safeUrl = isSupabaseConfigured ? supabaseUrl! : 'https://placeholder.supabase.co';
const safeAnonKey = isSupabaseConfigured ? supabaseAnonKey! : 'placeholder-anon-key';

// 3. Export the Supabase client instance
export const supabase: SupabaseClient = createClient(safeUrl, safeAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

// -------------------------------------------------------------
// SUPABASE CRUD OPERATIONS WITH ERROR HANDLING
// -------------------------------------------------------------

/**
 * Test Supabase connectivity from the client
 */
export async function testSupabaseClient(): Promise<{
  connected: boolean;
  message: string;
  url?: string;
}> {
  if (!isSupabaseConfigured) {
    return {
      connected: false,
      message: 'Supabase credentials are placeholders in .env.local. Add your Project URL & Anon Key to connect.',
      url: supabaseUrl,
    };
  }

  try {
    const { error } = await supabase.from('complaints').select('count', { count: 'exact', head: true });
    if (error && error.code !== 'PGRST116') {
      return {
        connected: false,
        message: `Supabase reached, but table returned error: ${error.message}`,
        url: supabaseUrl,
      };
    }
    return {
      connected: true,
      message: 'Successfully connected to Supabase database!',
      url: supabaseUrl,
    };
  } catch (err: any) {
    return {
      connected: false,
      message: `Failed to connect to Supabase: ${err.message || err}`,
      url: supabaseUrl,
    };
  }
}

/**
 * Retrieve complaints from Supabase
 */
export async function fetchSupabaseComplaints(filters?: {
  userId?: string;
  status?: string;
  category?: string;
  priority?: string;
}): Promise<{ data: Complaint[] | null; error: any }> {
  if (!isSupabaseConfigured) {
    return { data: null, error: new Error('Supabase not configured') };
  }

  try {
    let query = supabase.from('complaints').select('*').order('created_at', { ascending: false });

    if (filters?.userId) {
      query = query.eq('user_id', filters.userId);
    }
    if (filters?.status) {
      query = query.eq('status', filters.status);
    }
    if (filters?.category) {
      query = query.eq('category', filters.category);
    }
    if (filters?.priority) {
      query = query.eq('priority', filters.priority);
    }

    const { data, error } = await query;
    if (error) {
      console.warn('Supabase fetch complaints warning:', error);
      return { data: null, error };
    }

    return { data: data as Complaint[], error: null };
  } catch (err) {
    return { data: null, error: err };
  }
}

/**
 * Insert a new complaint into Supabase
 */
export async function insertSupabaseComplaint(
  complaintData: Partial<Complaint>
): Promise<{ data: Complaint | null; error: any }> {
  if (!isSupabaseConfigured) {
    return { data: null, error: new Error('Supabase not configured') };
  }

  try {
    const { data, error } = await supabase
      .from('complaints')
      .insert([complaintData])
      .select()
      .single();

    if (error) {
      console.warn('Supabase insert complaint warning:', error);
      return { data: null, error };
    }

    return { data: data as Complaint, error: null };
  } catch (err) {
    return { data: null, error: err };
  }
}

/**
 * Update a complaint status in Supabase
 */
export async function updateSupabaseComplaint(
  idOrCode: string,
  updates: Partial<Complaint>
): Promise<{ data: Complaint | null; error: any }> {
  if (!isSupabaseConfigured) {
    return { data: null, error: new Error('Supabase not configured') };
  }

  try {
    const isCustomId = idOrCode.startsWith('CC-');
    let query = supabase.from('complaints').update(updates);

    if (isCustomId) {
      query = query.eq('complaint_id', idOrCode);
    } else {
      query = query.eq('id', idOrCode);
    }

    const { data, error } = await query.select().single();
    if (error) {
      console.warn('Supabase update complaint warning:', error);
      return { data: null, error };
    }

    return { data: data as Complaint, error: null };
  } catch (err) {
    return { data: null, error: err };
  }
}

/**
 * Delete a complaint from Supabase
 */
export async function deleteSupabaseComplaint(
  idOrCode: string
): Promise<{ success: boolean; error: any }> {
  if (!isSupabaseConfigured) {
    return { success: false, error: new Error('Supabase not configured') };
  }

  try {
    const isCustomId = idOrCode.startsWith('CC-');
    let query = supabase.from('complaints').delete();

    if (isCustomId) {
      query = query.eq('complaint_id', idOrCode);
    } else {
      query = query.eq('id', idOrCode);
    }

    const { error } = await query;
    if (error) {
      console.warn('Supabase delete complaint warning:', error);
      return { success: false, error };
    }

    return { success: true, error: null };
  } catch (err) {
    return { success: false, error: err };
  }
}
