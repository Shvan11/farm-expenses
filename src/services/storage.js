import { LocalStorageAdapter } from './adapters/local';
import { SupabaseAdapter } from './adapters/supabase';

// Check if Supabase is configured
const isSupabaseConfigured = import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY;

export const StorageService = isSupabaseConfigured ? SupabaseAdapter : LocalStorageAdapter;
