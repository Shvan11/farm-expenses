import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Only create client if env vars are present
export const supabase = (supabaseUrl && supabaseKey)
  ? createClient(supabaseUrl, supabaseKey)
  : null;

const PARTNERS = [
  { id: 'p1', name: 'Shwan' },
  { id: 'p2', name: 'Adrees' },
  { id: 'p3', name: 'Mohammed' },
  { id: 'p4', name: 'Dilan' },
];

export const SupabaseAdapter = {
  getPartners: async () => {
    return PARTNERS;
  },

  getExpenses: async () => {
    if (!supabase) return [];
    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .order('date', { ascending: false });

    if (error) {
      console.error('Supabase error fetching expenses:', error);
      return [];
    }

    // Map snake_case to camelCase
    return data.map(e => ({
      id: e.id,
      amount: e.amount,
      description: e.description,
      payerId: e.payer_id,
      date: e.date,
      category: e.category,
      splitType: e.split_type
    }));
  },

  addExpense: async (expense) => {
    if (!supabase) return null;

    // Map camelCase to snake_case
    const dbExpense = {
      amount: expense.amount,
      description: expense.description,
      payer_id: expense.payerId,
      date: expense.date,
      category: expense.category,
      split_type: expense.splitType
    };

    const { data, error } = await supabase
      .from('expenses')
      .insert([dbExpense])
      .select();

    if (error) {
      console.error('Supabase error adding expense:', error);
      throw error;
    }

    // Return mapped result
    const e = data[0];
    return {
      id: e.id,
      amount: e.amount,
      description: e.description,
      payerId: e.payer_id,
      date: e.date,
      category: e.category,
      splitType: e.split_type
    };
  },

  getPayments: async () => {
    if (!supabase) return [];
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .order('date', { ascending: false });

    if (error) {
      console.error('Supabase error fetching payments:', error);
      return [];
    }

    return data.map(p => ({
      id: p.id,
      amount: p.amount,
      fromId: p.from_id,
      toId: p.to_id,
      date: p.date
    }));
  },

  addPayment: async (payment) => {
    if (!supabase) return null;

    const dbPayment = {
      amount: payment.amount,
      from_id: payment.fromId,
      to_id: payment.toId,
      date: payment.date
    };

    const { data, error } = await supabase
      .from('payments')
      .insert([dbPayment])
      .select();

    if (error) {
      console.error('Supabase error adding payment:', error);
      throw error;
    }

    const p = data[0];
    return {
      id: p.id,
      amount: p.amount,
      fromId: p.from_id,
      toId: p.to_id,
      date: p.date
    };
  }
};
