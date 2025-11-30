import { LocalStorageAdapter } from './adapters/local';
import { SupabaseAdapter } from './adapters/supabase';

// Toggle this to switch backends
const USE_SUPABASE = false;

export const StorageService = USE_SUPABASE && SupabaseAdapter ? SupabaseAdapter : LocalStorageAdapter;
