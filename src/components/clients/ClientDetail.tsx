
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  getClients, 
  getLoans, 
  deleteClient, 
  updateClient 
} from "@/utils/storage";
import { Client, Loan } from "@/types";
import { toast } from "sonner";
import { ArrowUp, Phone, User, Plus } from "lucide-react";
import LoanForm from "../loans/LoanForm";

const ClientDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [client, setClient] = useState<Client | null>(null);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [showLoanForm, setShowLoanForm] = useState(false);

  useEffect(() => {
    if (id) {
      const clients = getClients();
      const clientData = clients.find(c => c.id === id);
      
      if (clientData) {
        setClient(clientData);
        loadLoans(id);
      } else {
        toast.error("Cliente no encontrado");
        navigate("/clients");
      }
    }
  }, [id, navigate]);

  const loadLoans = (clientId: string) => {
    const clientLoans = getLoans(clientId);
    setLoans(clientLoans);
  };

  const handleLoanSuccess = (loan: Loan) => {
    setShowLoanForm(false);
    loadLoans(loan.clientId);
  };

  const handleDeleteClient = () => {
    if (!client) return;
    
    if (loans.length > 0) {
      toast.error("No se puede eliminar un cliente con préstamos activos");
      return;
    }
    
    if (window.confirm("¿Estás seguro de eliminar este cliente? Esta acción no se puede deshacer.")) {
      deleteClient(client.id);
      toast.success("Cliente eliminado correctamente");
      navigate("/clients");
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('es-MX');
  };

  const formatCurrency = (amount: number) => {
    return `$${amount.toLocaleString('es-MX')}`;
  };

  const handleCallClient = () => {
    if (client && client.phone) {
      window.location.href = `tel:${client.phone}`;
    }
  };

  if (!client) {
    return (
      <div className="app-container">
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lending-primary"></div>
        </div>
      </div>
    );
  }

  // Calculate active loans and total owed
  const activeLoans = loans.filter(loan => loan.status === 'active');
  const totalOwed = activeLoans.reduce((sum, loan) => {
    const interestAmount = (loan.amount * loan.interestRate) / 100;
    return sum + loan.amount + interestAmount;
  }, 0);

  return (
    <div className="app-container pb-24">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          size="sm" 
          className="mr-2"
          onClick={() => navigate(-1)}
        >
          <ArrowUp className="rotate-270 h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold">Detalles del Cliente</h1>
      </div>

      {showLoanForm ? (
        <LoanForm 
          client={client}
          onSuccess={handleLoanSuccess}
          onCancel={() => setShowLoanForm(false)}
        />
      ) : (
        <>
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex items-center mb-4">
                <div className="h-16 w-16 rounded-full bg-lending-light flex items-center justify-center">
                  <User className="h-8 w-8 text-lending-primary" />
                </div>
                <div className="ml-4">
                  <h2 className="text-xl font-bold">{client.name}</h2>
                  <div className="flex items-center text-sm text-gray-500">
                    <Phone className="h-4 w-4 mr-1" />
                    <a href={`tel:${client.phone}`} className="hover:underline">{client.phone}</a>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <p className="text-sm text-gray-500">Cliente desde</p>
                  <p className="font-medium">{formatDate(client.createdAt)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Préstamos activos</p>
                  <p className="font-medium">{activeLoans.length}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-500">Total por cobrar</p>
                  <p className="font-medium text-lending-primary">{formatCurrency(totalOwed)}</p>
                </div>
              </div>
              
              <div className="mt-4 flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={handleCallClient}
                >
                  <Phone className="h-4 w-4 mr-1" /> Llamar
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">Préstamos</h2>
            <Button 
              size="sm" 
              className="bg-lending-primary hover:bg-lending-secondary"
              onClick={() => setShowLoanForm(true)}
            >
              <Plus className="h-4 w-4 mr-1" /> Nuevo Préstamo
            </Button>
          </div>
          
          {loans.length === 0 ? (
            <div className="text-center py-8">
              <User className="h-12 w-12 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500">No hay préstamos registrados</p>
              <Button 
                variant="link" 
                className="mt-2 text-lending-primary"
                onClick={() => setShowLoanForm(true)}
              >
                Crear primer préstamo
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {loans
                .sort((a, b) => {
                  if (a.status === 'active' && b.status !== 'active') return -1;
                  if (a.status !== 'active' && b.status === 'active') return 1;
                  return b.startDate - a.startDate;
                })
                .map((loan) => (
                <Card 
                  key={loan.id} 
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => navigate(`/loans/${loan.id}`)}
                >
                  <CardContent className="p-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="flex items-center">
                          <p className="font-medium">{formatCurrency(loan.amount)}</p>
                          <div className={`ml-2 px-2 py-0.5 rounded-full text-xs
                            ${loan.status === 'active' ? 'bg-blue-100 text-blue-800' : 
                              loan.status === 'completed' ? 'bg-green-100 text-green-800' : 
                              'bg-red-100 text-red-800'}`}>
                            {loan.status === 'active' ? 'Activo' : 
                             loan.status === 'completed' ? 'Completado' : 'Impago'}
                          </div>
                        </div>
                        <p className="text-sm text-gray-500">
                          {formatDate(loan.startDate)} - {formatDate(loan.endDate)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-lending-primary">{loan.interestRate}%</p>
                        <p className="text-sm text-gray-500">{loan.terms} días</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
          
          <div className="mt-8">
            <Button 
              variant="outline" 
              className="w-full text-destructive border-destructive hover:bg-destructive/10"
              onClick={handleDeleteClient}
              disabled={loans.length > 0}
            >
              Eliminar Cliente
            </Button>
            {loans.length > 0 && (
              <p className="text-xs text-center text-gray-500 mt-2">
                No se puede eliminar un cliente con préstamos
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ClientDetail;
