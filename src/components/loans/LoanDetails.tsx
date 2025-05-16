
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  getClients, 
  getLoan, 
  getPayments, 
  deleteLoan, 
  updateLoan 
} from "@/utils/storage";
import { Loan, Payment, Client } from "@/types";
import { toast } from "sonner";
import { ArrowUp, Plus, Calendar, DollarSign } from "lucide-react";
import PaymentForm from "./PaymentForm";

const LoanDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loan, setLoan] = useState<Loan | null>(null);
  const [client, setClient] = useState<Client | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [totalPaid, setTotalPaid] = useState(0);
  const [remainingAmount, setRemainingAmount] = useState(0);

  useEffect(() => {
    if (id) {
      const loanData = getLoan(id);
      if (loanData) {
        setLoan(loanData);
        
        // Find client
        const clients = getClients();
        const clientData = clients.find(c => c.id === loanData.clientId);
        setClient(clientData || null);
        
        // Load payments
        loadPayments(id);
      } else {
        toast.error("Préstamo no encontrado");
        navigate("/loans");
      }
    }
  }, [id, navigate]);

  const loadPayments = (loanId: string) => {
    const loanPayments = getPayments(loanId);
    setPayments(loanPayments);
    
    // Calculate total paid
    const paid = loanPayments.reduce((sum, payment) => sum + payment.amount, 0);
    setTotalPaid(paid);
    
    const loanData = getLoan(loanId);
    if (loanData) {
      // Calculate interest
      const interestAmount = (loanData.amount * loanData.interestRate) / 100;
      const totalToRepay = loanData.amount + interestAmount;
      setRemainingAmount(totalToRepay - paid);
      
      // Check if loan is fully paid
      if (paid >= totalToRepay && loanData.status === 'active') {
        // Update loan status to completed
        updateLoan({
          ...loanData,
          status: 'completed'
        });
        setLoan({
          ...loanData,
          status: 'completed'
        });
        toast.success("¡Préstamo completado!");
      }
    }
  };

  const handlePaymentSuccess = () => {
    setShowPaymentForm(false);
    if (id) loadPayments(id);
  };

  const handleDeleteLoan = () => {
    if (!loan) return;
    
    if (window.confirm("¿Estás seguro de eliminar este préstamo? Esta acción no se puede deshacer.")) {
      deleteLoan(loan.id);
      toast.success("Préstamo eliminado correctamente");
      navigate("/loans");
    }
  };

  if (!loan || !client) {
    return (
      <div className="app-container">
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lending-primary"></div>
        </div>
      </div>
    );
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('es-MX');
  };

  const formatCurrency = (amount: number) => {
    return `$${amount.toLocaleString('es-MX')}`;
  };

  const calculateDailyPayment = () => {
    if (!loan) return 0;
    const interestAmount = (loan.amount * loan.interestRate) / 100;
    const totalToRepay = loan.amount + interestAmount;
    return totalToRepay / loan.terms;
  };

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
        <h1 className="text-xl font-bold">Detalles del Préstamo</h1>
      </div>

      {showPaymentForm ? (
        <PaymentForm 
          loan={loan}
          onSuccess={handlePaymentSuccess}
          onCancel={() => setShowPaymentForm(false)}
        />
      ) : (
        <>
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Cliente</p>
                  <p className="font-medium">{client.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Estado</p>
                  <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium 
                    ${loan.status === 'active' ? 'bg-blue-100 text-blue-800' : 
                      loan.status === 'completed' ? 'bg-green-100 text-green-800' : 
                      'bg-red-100 text-red-800'}`}>
                    {loan.status === 'active' ? 'Activo' : 
                     loan.status === 'completed' ? 'Completado' : 'Impago'}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Monto Prestado</p>
                  <p className="font-medium">{formatCurrency(loan.amount)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Interés</p>
                  <p className="font-medium">{loan.interestRate}%</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Fecha Inicio</p>
                  <p className="font-medium">{formatDate(loan.startDate)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Fecha Término</p>
                  <p className="font-medium">{formatDate(loan.endDate)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Plazo</p>
                  <p className="font-medium">{loan.terms} días</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Pago diario</p>
                  <p className="font-medium">{formatCurrency(calculateDailyPayment())}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">Resumen Financiero</h2>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <Card className="bg-lending-light">
              <CardContent className="p-4 flex flex-col items-center justify-center">
                <p className="text-sm text-gray-600">Total Pagado</p>
                <p className="text-xl font-bold text-lending-primary">{formatCurrency(totalPaid)}</p>
              </CardContent>
            </Card>
            <Card className={`${remainingAmount > 0 ? 'bg-amber-50' : 'bg-green-50'}`}>
              <CardContent className="p-4 flex flex-col items-center justify-center">
                <p className="text-sm text-gray-600">Pendiente por Pagar</p>
                <p className={`text-xl font-bold ${remainingAmount > 0 ? 'text-amber-600' : 'text-green-600'}`}>
                  {formatCurrency(remainingAmount)}
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">Historial de Pagos</h2>
            <Button 
              size="sm" 
              className="bg-lending-primary hover:bg-lending-secondary"
              onClick={() => setShowPaymentForm(true)}
            >
              <Plus className="h-4 w-4 mr-1" /> Registrar Pago
            </Button>
          </div>
          
          {payments.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500">No hay pagos registrados</p>
            </div>
          ) : (
            <div className="space-y-3">
              {payments
                .sort((a, b) => b.date - a.date)
                .map((payment) => (
                <Card key={payment.id}>
                  <CardContent className="p-3 flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-lending-light flex items-center justify-center mr-3">
                        <DollarSign className="h-5 w-5 text-lending-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Pago recibido</p>
                        <p className="text-sm text-gray-500">{formatDate(payment.date)}</p>
                      </div>
                    </div>
                    <p className="font-bold text-lending-primary">{formatCurrency(payment.amount)}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
          
          <div className="mt-8 flex gap-3">
            <Button 
              variant="outline" 
              className="flex-1 text-destructive border-destructive hover:bg-destructive/10"
              onClick={handleDeleteLoan}
            >
              Eliminar Préstamo
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default LoanDetails;
