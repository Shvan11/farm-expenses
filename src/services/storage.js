import { LocalStorageAdapter } from './adapters/local';
import { SupabaseAdapter } from './adapters/supabase';

// Check if Supabase is configured
const isSupabaseConfigured = import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY;

export const StorageService = {
    // Partner methods
    getPartners: () => isSupabaseConfigured ? SupabaseAdapter.getPartners() : LocalStorageAdapter.getPartners(),

    // Expense methods
    addExpense: (expense) => isSupabaseConfigured ? SupabaseAdapter.addExpense(expense) : LocalStorageAdapter.addExpense(expense),
    updateExpense: (expense) => isSupabaseConfigured ? SupabaseAdapter.updateExpense(expense) : LocalStorageAdapter.updateExpense(expense),
    deleteExpense: (id) => isSupabaseConfigured ? SupabaseAdapter.deleteExpense(id) : LocalStorageAdapter.deleteExpense(id),
    getExpenses: () => isSupabaseConfigured ? SupabaseAdapter.getExpenses() : LocalStorageAdapter.getExpenses(),

    // Payment methods
    getPayments: () => isSupabaseConfigured ? SupabaseAdapter.getPayments() : LocalStorageAdapter.getPayments(),
    addPayment: (payment) => isSupabaseConfigured ? SupabaseAdapter.addPayment(payment) : LocalStorageAdapter.addPayment(payment),
    updatePayment: (payment) => isSupabaseConfigured ? SupabaseAdapter.updatePayment(payment) : LocalStorageAdapter.updatePayment(payment),
    deletePayment: (id) => isSupabaseConfigured ? SupabaseAdapter.deletePayment(id) : LocalStorageAdapter.deletePayment(id),
};
