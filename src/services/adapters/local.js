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

  // Helper to clear data (for testing)
  clearData: async () => {
    localStorage.removeItem(STORAGE_KEYS.EXPENSES);
    localStorage.removeItem(STORAGE_KEYS.PAYMENTS);
  }
};
