import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabaseClient: SupabaseClient | null = null;

export function getSupabaseEnvConfig() {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
  const anonKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';

  const isConfigured = Boolean(
    url &&
    anonKey &&
    url.startsWith('http') &&
    url !== 'YOUR_SUPABASE_URL' &&
    anonKey !== 'YOUR_SUPABASE_ANON_KEY'
  );

  return {
    url,
    anonKey,
    isConfigured,
  };
}

export function getSupabase(): SupabaseClient | null {
  const { url, anonKey, isConfigured } = getSupabaseEnvConfig();

  if (!isConfigured) {
    return null;
  }

  if (!supabaseClient) {
    try {
      supabaseClient = createClient(url, anonKey, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      });
    } catch (err) {
      console.warn('Could not initialize Supabase client:', err);
      return null;
    }
  }

  return supabaseClient;
}

export async function testSupabaseConnection(): Promise<{
  connected: boolean;
  message: string;
  url?: string;
}> {
  const { isConfigured, url } = getSupabaseEnvConfig();

  if (!isConfigured) {
    return {
      connected: false,
      message: 'Supabase environment variables not provided. Using built-in local persistent database.',
    };
  }

  const client = getSupabase();
  if (!client) {
    return {
      connected: false,
      message: 'Failed to instantiate Supabase client with current credentials.',
      url,
    };
  }

  try {
    // Quick query against complaints or health
    const { error } = await client.from('complaints').select('count', { count: 'exact', head: true });
    if (error && error.code !== 'PGRST116') {
      return {
        connected: false,
        message: `Supabase reached, but table query returned: ${error.message} (Tip: run supabase_schema.sql in Supabase SQL editor)`,
        url,
      };
    }
    return {
      connected: true,
      message: 'Successfully connected to Supabase PostgreSQL database!',
      url,
    };
  } catch (err: any) {
    return {
      connected: false,
      message: `Connection error: ${err.message || 'Unknown network error'}`,
      url,
    };
  }
}
