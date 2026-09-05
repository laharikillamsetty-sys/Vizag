import { createClient, SupabaseClient } from '@supabase/supabase-js';

let clientInstance: SupabaseClient | null = null;

export function getClientSupabaseConfig() {
  const url = import.meta.env.VITE_SUPABASE_URL || '';
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

  const isConfigured = Boolean(
    url &&
    anonKey &&
    url.startsWith('http') &&
    url !== 'YOUR_SUPABASE_URL'
  );

  return {
    url,
    anonKey,
    isConfigured,
  };
}

export function getClientSupabase(): SupabaseClient | null {
  const { url, anonKey, isConfigured } = getClientSupabaseConfig();

  if (!isConfigured) {
    return null;
  }

  if (!clientInstance) {
    try {
      clientInstance = createClient(url, anonKey);
    } catch (e) {
      console.warn('Unable to initialize client-side Supabase:', e);
      return null;
    }
  }

  return clientInstance;
}
