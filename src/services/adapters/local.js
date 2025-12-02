import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEYS = {
  EXPENSES: 'farm_expenses_data',
  PAYMENTS: 'farm_payments_data',
};

const PARTNERS = [
  { id: 'p1', name: 'Shwan' },
  { id: 'p2', name: 'Adrees' },
  { id: 'p3', name: 'Mohammed' },
  { id: 'p4', name: 'Dilan' },
];

export const LocalStorageAdapter = {
  getPartners: async () => {
    return PARTNERS;
  },

  getExpenses: async () => {
    const data = localStorage.getItem(STORAGE_KEYS.EXPENSES);
    return data ? JSON.parse(data) : [];
  },

  addExpense: async (expense) => {
    const expenses = await LocalStorageAdapter.getExpenses();
    const newExpense = { ...expense, id: uuidv4(), createdAt: new Date().toISOString() };
    expenses.push(newExpense);
    localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(expenses));
    return newExpense;
  },

  getPayments: async () => {
    const data = localStorage.getItem(STORAGE_KEYS.PAYMENTS);
    return data ? JSON.parse(data) : [];
  },

  addPayment: async (payment) => {
    const payments = await LocalStorageAdapter.getPayments();
    const newPayment = { ...payment, id: uuidv4(), createdAt: new Date().toISOString() };
    payments.push(newPayment);
    localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(payments));
    return newPayment;
  },

  updateExpense: async (expense) => {
    const expenses = await LocalStorageAdapter.getExpenses();
    const index = expenses.findIndex(e => e.id === expense.id);
    if (index !== -1) {
      expenses[index] = { ...expenses[index], ...expense };
      localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(expenses));
      return expenses[index];
    }
    return null;
  },

  deleteExpense: async (id) => {
    const expenses = await LocalStorageAdapter.getExpenses();
    const newExpenses = expenses.filter(e => e.id !== id);
    localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(newExpenses));
    return true;
  },

  updatePayment: async (payment) => {
    const payments = await LocalStorageAdapter.getPayments();
    const index = payments.findIndex(p => p.id === payment.id);
    if (index !== -1) {
      payments[index] = { ...payments[index], ...payment };
      localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(payments));
      return payments[index];
    }
    return null;
  },

  deletePayment: async (id) => {
    const payments = await LocalStorageAdapter.getPayments();
    const newPayments = payments.filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(newPayments));
    return true;
  },

  // Helper to clear data (for testing)
  clearData: async () => {
    localStorage.removeItem(STORAGE_KEYS.EXPENSES);
    localStorage.removeItem(STORAGE_KEYS.PAYMENTS);
  }
};
