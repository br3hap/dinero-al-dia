
import { getClients, getLoans, getPayments } from "./storage";
import { Client, Payment, Loan, DashboardData, CollectionsForDay, ClientWithLoans } from "@/types";

// Get dashboard summary data
export const getDashboardData = (): DashboardData => {
  const loans = getLoans();
  const payments = getPayments();
  
  // Calculate total loaned amount
  const totalLoaned = loans.reduce((sum, loan) => sum + loan.amount, 0);
  
  // Calculate total collected amount
  const totalCollected = payments.reduce((sum, payment) => sum + payment.amount, 0);
  
  // Calculate total pending amount (including interest)
  let totalPending = 0;
  loans.forEach(loan => {
    if (loan.status === 'active') {
      const interestAmount = (loan.amount * loan.interestRate) / 100;
      const totalToRepay = loan.amount + interestAmount;
      
      // Get payments for this loan
      const loanPayments = payments.filter(p => p.loanId === loan.id);
      const paidAmount = loanPayments.reduce((sum, p) => sum + p.amount, 0);
      
      // Add remaining amount to total pending
      totalPending += (totalToRepay - paidAmount);
    }
  });
  
  // Count active loans
  const activeLoans = loans.filter(loan => loan.status === 'active').length;
  
  // Calculate collections due today
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayTimestamp = today.getTime();
  
  // Filter active loans
  const activeLoansData = loans.filter(loan => loan.status === 'active');
  
  // Calculate daily payments for each active loan
  let dueToday = 0;
  activeLoansData.forEach(loan => {
    // Calculate daily payment amount
    const interestAmount = (loan.amount * loan.interestRate) / 100;
    const totalToRepay = loan.amount + interestAmount;
    const dailyAmount = totalToRepay / loan.terms;
    
    // Check if loan is active today
    if (loan.startDate <= todayTimestamp && loan.endDate >= todayTimestamp) {
      dueToday += dailyAmount;
    }
  });
  
  return {
    totalLoaned,
    totalCollected,
    totalPending,
    dueToday,
    loanCount: loans.length,
    activeLoans,
  };
};

// Get collections for a specific day
export const getCollectionsForDay = (date: Date): CollectionsForDay => {
  const targetDate = new Date(date);
  targetDate.setHours(0, 0, 0, 0);
  const targetTimestamp = targetDate.getTime();
  
  const loans = getLoans();
  const clients = getClients();
  const payments = getPayments();
  
  // Filter active loans for the target date
  const activeLoansForDay = loans.filter(loan => 
    loan.status === 'active' && 
    loan.startDate <= targetTimestamp && 
    loan.endDate >= targetTimestamp
  );
  
  // Calculate collections
  let totalAmount = 0;
  const clientsToCollect = activeLoansForDay.map(loan => {
    // Find client
    const client = clients.find(c => c.id === loan.clientId);
    
    // Calculate daily payment
    const interestAmount = (loan.amount * loan.interestRate) / 100;
    const totalToRepay = loan.amount + interestAmount;
    const dailyAmount = totalToRepay / loan.terms;
    
    // Check if payment was made for this day
    const dayStart = new Date(targetDate);
    const dayEnd = new Date(targetDate);
    dayEnd.setHours(23, 59, 59, 999);
    
    const paymentMade = payments.some(payment => 
      payment.loanId === loan.id && 
      payment.date >= dayStart.getTime() && 
      payment.date <= dayEnd.getTime()
    );
    
    totalAmount += dailyAmount;
    
    return {
      clientId: loan.clientId,
      clientName: client?.name || 'Cliente desconocido',
      loanId: loan.id,
      amount: dailyAmount,
      paid: paymentMade,
    };
  });
  
  return {
    date: targetDate.toISOString(),
    totalAmount,
    clients: clientsToCollect,
  };
};

// Get clients with loan summary
export const getClientsWithLoans = (): ClientWithLoans[] => {
  const clients = getClients();
  const loans = getLoans();
  const payments = getPayments();
  
  return clients.map(client => {
    // Get active loans for this client
    const activeLoans = loans.filter(loan => 
      loan.clientId === client.id && 
      loan.status === 'active'
    );
    
    // Calculate total owed
    let totalOwed = 0;
    activeLoans.forEach(loan => {
      const interestAmount = (loan.amount * loan.interestRate) / 100;
      const totalToRepay = loan.amount + interestAmount;
      
      // Get payments for this loan
      const loanPayments = payments.filter(p => p.loanId === loan.id);
      const paidAmount = loanPayments.reduce((sum, p) => sum + p.amount, 0);
      
      // Add remaining amount to total owed
      totalOwed += (totalToRepay - paidAmount);
    });
    
    return {
      ...client,
      activeLoans: activeLoans.length,
      totalOwed,
    };
  });
};
