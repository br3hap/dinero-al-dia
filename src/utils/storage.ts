
import { AppData, Client, Loan, Payment, User } from "@/types";

// Initialize with default empty data
const INITIAL_APP_DATA: AppData = {
  clients: [],
  loans: [],
  payments: [],
  user: null,
  lastSync: Date.now(),
};

// Local storage key
const STORAGE_KEY = 'dinero_al_dia_data';

// Generate unique IDs
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

// Save all app data
export const saveAppData = (data: AppData): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    console.log('Data saved successfully');
  } catch (error) {
    console.error('Failed to save data:', error);
  }
};

// Load all app data
export const loadAppData = (): AppData => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      // Initialize if empty
      saveAppData(INITIAL_APP_DATA);
      return INITIAL_APP_DATA;
    }
    return JSON.parse(data) as AppData;
  } catch (error) {
    console.error('Failed to load data:', error);
    return INITIAL_APP_DATA;
  }
};

// Client CRUD operations
export const getClients = (): Client[] => {
  const data = loadAppData();
  return data.clients;
};

export const addClient = (client: Omit<Client, 'id' | 'createdAt'>): Client => {
  const data = loadAppData();
  const newClient: Client = {
    ...client,
    id: generateId(),
    createdAt: Date.now(),
  };
  data.clients.push(newClient);
  saveAppData(data);
  return newClient;
};

export const updateClient = (client: Client): void => {
  const data = loadAppData();
  const index = data.clients.findIndex(c => c.id === client.id);
  if (index !== -1) {
    data.clients[index] = client;
    saveAppData(data);
  }
};

export const deleteClient = (clientId: string): void => {
  const data = loadAppData();
  data.clients = data.clients.filter(client => client.id !== clientId);
  saveAppData(data);
};

// Loan CRUD operations
export const getLoans = (clientId?: string): Loan[] => {
  const data = loadAppData();
  if (clientId) {
    return data.loans.filter(loan => loan.clientId === clientId);
  }
  return data.loans;
};

export const getLoan = (id: string): Loan | undefined => {
  const data = loadAppData();
  return data.loans.find(loan => loan.id === id);
};

export const addLoan = (loan: Omit<Loan, 'id' | 'createdAt'>): Loan => {
  const data = loadAppData();
  const newLoan: Loan = {
    ...loan,
    id: generateId(),
    createdAt: Date.now(),
  };
  data.loans.push(newLoan);
  saveAppData(data);
  return newLoan;
};

export const updateLoan = (loan: Loan): void => {
  const data = loadAppData();
  const index = data.loans.findIndex(l => l.id === loan.id);
  if (index !== -1) {
    data.loans[index] = loan;
    saveAppData(data);
  }
};

export const deleteLoan = (loanId: string): void => {
  const data = loadAppData();
  data.loans = data.loans.filter(loan => loan.id !== loanId);
  // Also delete related payments
  data.payments = data.payments.filter(payment => payment.loanId !== loanId);
  saveAppData(data);
};

// Payment CRUD operations
export const getPayments = (loanId?: string): Payment[] => {
  const data = loadAppData();
  if (loanId) {
    return data.payments.filter(payment => payment.loanId === loanId);
  }
  return data.payments;
};

export const addPayment = (payment: Omit<Payment, 'id' | 'createdAt'>): Payment => {
  const data = loadAppData();
  const newPayment: Payment = {
    ...payment,
    id: generateId(),
    createdAt: Date.now(),
  };
  data.payments.push(newPayment);
  saveAppData(data);
  return newPayment;
};

export const updatePayment = (payment: Payment): void => {
  const data = loadAppData();
  const index = data.payments.findIndex(p => p.id === payment.id);
  if (index !== -1) {
    data.payments[index] = payment;
    saveAppData(data);
  }
};

export const deletePayment = (paymentId: string): void => {
  const data = loadAppData();
  data.payments = data.payments.filter(payment => payment.id !== paymentId);
  saveAppData(data);
};

// Authentication
export const getUser = (): User | null => {
  const data = loadAppData();
  return data.user;
};

export const setUser = (user: User): void => {
  const data = loadAppData();
  data.user = user;
  saveAppData(data);
};

export const updateUser = (userData: Partial<User>): void => {
  const data = loadAppData();
  if (data.user) {
    data.user = { ...data.user, ...userData };
  } else {
    data.user = { pin: "", useBiometrics: false, ...userData };
  }
  saveAppData(data);
};

export const deleteUserData = (): void => {
  saveAppData(INITIAL_APP_DATA);
};
