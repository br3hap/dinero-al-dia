
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { getLoans, getClients, getPayments } from "@/utils/storage";
import { Loan, Client } from "@/types";
import { DollarSign } from "lucide-react";

const Loans = () => {
  const navigate = useNavigate();
  const [loans, setLoans] = useState<Loan[]>([]);
  const [clients, setClients] = useState<Record<string, Client>>({}); // Client lookup
  const [activeTab, setActiveTab] = useState("active");

  useEffect(() => {
    const loansData = getLoans();
    setLoans(loansData);
    
    // Create client lookup object
    const clientsData = getClients();
    const clientsMap: Record<string, Client> = {};
    clientsData.forEach(client => {
      clientsMap[client.id] = client;
    });
    setClients(clientsMap);
  }, []);

  // Filter loans based on active tab
  const filteredLoans = loans.filter(loan => {
    if (activeTab === 'active') return loan.status === 'active';
    if (activeTab === 'completed') return loan.status === 'completed';
    if (activeTab === 'defaulted') return loan.status === 'defaulted';
    return true;
  });

  const calculateRemainingAmount = (loan: Loan) => {
    // Calculate total to repay
    const interestAmount = (loan.amount * loan.interestRate) / 100;
    const totalToRepay = loan.amount + interestAmount;
    
    // Get payments for this loan
    const payments = getPayments(loan.id);
    const paidAmount = payments.reduce((sum, payment) => sum + payment.amount, 0);
    
    // Return remaining amount
    return totalToRepay - paidAmount;
  };

  const formatCurrency = (amount: number) => {
    return `$${amount.toLocaleString('es-MX')}`;
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('es-MX', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="app-container animate-fade-in">
      <div className="mb-6">
        <h1 className="text-xl font-bold mb-4">Préstamos</h1>

        <Tabs 
          defaultValue="active" 
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="active">Activos</TabsTrigger>
            <TabsTrigger value="completed">Completados</TabsTrigger>
            <TabsTrigger value="defaulted">Impagos</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="mt-0">
            {filteredLoans.length === 0 ? (
              <div className="text-center py-8">
                <DollarSign className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500">No hay préstamos activos</p>
                <Button 
                  variant="link" 
                  className="mt-2 text-lending-primary"
                  onClick={() => navigate('/clients')}
                >
                  Ir a clientes para crear un préstamo
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredLoans
                  .sort((a, b) => b.startDate - a.startDate)
                  .map((loan) => {
                    const client = clients[loan.clientId];
                    const remainingAmount = calculateRemainingAmount(loan);
                    
                    return (
                      <Card 
                        key={loan.id} 
                        className="hover:bg-gray-50 cursor-pointer"
                        onClick={() => navigate(`/loans/${loan.id}`)}
                      >
                        <CardContent className="p-3">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-medium">{client?.name || 'Cliente desconocido'}</p>
                              <p className="text-sm text-gray-500">
                                {formatDate(loan.startDate)} - {formatDate(loan.endDate)}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium text-lending-primary">
                                {formatCurrency(remainingAmount)}
                              </p>
                              <p className="text-xs text-gray-500">
                                de {formatCurrency(loan.amount)} al {loan.interestRate}%
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="completed" className="mt-0">
            {filteredLoans.length === 0 ? (
              <div className="text-center py-8">
                <DollarSign className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500">No hay préstamos completados</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredLoans
                  .sort((a, b) => b.endDate - a.endDate)
                  .map((loan) => {
                    const client = clients[loan.clientId];
                    
                    return (
                      <Card 
                        key={loan.id} 
                        className="hover:bg-gray-50 cursor-pointer"
                        onClick={() => navigate(`/loans/${loan.id}`)}
                      >
                        <CardContent className="p-3">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-medium">{client?.name || 'Cliente desconocido'}</p>
                              <p className="text-sm text-gray-500">
                                Completado el {formatDate(loan.endDate)}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium text-green-600">
                                {formatCurrency(loan.amount)}
                              </p>
                              <p className="text-xs text-gray-500">
                                al {loan.interestRate}%
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="defaulted" className="mt-0">
            {filteredLoans.length === 0 ? (
              <div className="text-center py-8">
                <DollarSign className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500">No hay préstamos en mora</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredLoans
                  .sort((a, b) => b.startDate - a.startDate)
                  .map((loan) => {
                    const client = clients[loan.clientId];
                    
                    return (
                      <Card 
                        key={loan.id} 
                        className="hover:bg-gray-50 cursor-pointer"
                        onClick={() => navigate(`/loans/${loan.id}`)}
                      >
                        <CardContent className="p-3">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-medium">{client?.name || 'Cliente desconocido'}</p>
                              <p className="text-sm text-gray-500">
                                Vencido el {formatDate(loan.endDate)}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium text-destructive">
                                {formatCurrency(loan.amount)}
                              </p>
                              <p className="text-xs text-gray-500">
                                al {loan.interestRate}%
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Loans;
