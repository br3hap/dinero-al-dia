
// Types for the app
export interface Client {
  id: string;
  name: string;
  phone: string;
  createdAt: number;
}

export interface Loan {
  id: string;
  clientId: string;
  amount: number;
  interestRate: number;
  terms: number; // In days
  startDate: number;
  endDate: number;
  status: 'active' | 'completed' | 'defaulted';
  createdAt: number;
}

export interface Payment {
  id: string;
  loanId: string;
  amount: number;
  date: number;
  createdAt: number;
}

export interface User {
  pin: string;
  useBiometrics: boolean;
}

// For summary data on dashboard
export interface DashboardData {
  totalLoaned: number;
  totalCollected: number;
  totalPending: number;
  dueToday: number;
  loanCount: number;
  activeLoans: number;
}

// For offline storage
export interface AppData {
  clients: Client[];
  loans: Loan[];
  payments: Payment[];
  user: User | null;
  lastSync: number;
}

export interface CollectionsForDay {
  date: string;
  totalAmount: number;
  clients: {
    clientId: string;
    clientName: string;
    loanId: string;
    amount: number;
    paid: boolean;
  }[];
}

export interface ClientWithLoans extends Client {
  activeLoans: number;
  totalOwed: number;
}
