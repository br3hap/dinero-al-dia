
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addPayment } from "@/utils/storage";
import { Loan, Payment } from "@/types";
import { toast } from "sonner";

interface PaymentFormProps {
  loan: Loan;
  onSuccess: (payment: Payment) => void;
  onCancel: () => void;
}

const PaymentForm = ({ loan, onSuccess, onCancel }: PaymentFormProps) => {
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const amountNum = parseFloat(amount);
    
    if (amountNum <= 0) {
      toast.error("El monto debe ser mayor a 0");
      return;
    }
    
    const newPayment = addPayment({
      loanId: loan.id,
      amount: amountNum,
      date: new Date(date).getTime(),
    });
    
    toast.success("Pago registrado correctamente");
    onSuccess(newPayment);
  };

  const formatCurrency = (value: string) => {
    const number = value.replace(/[^\d]/g, '');
    return number ? parseInt(number).toLocaleString('es-MX') : '';
  };

  return (
    <div className="animate-fade-in">
      <h2 className="text-xl font-bold mb-4">Registrar Pago</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="amount">Monto del Pago</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2">$</span>
            <Input
              id="amount"
              className="pl-7"
              value={formatCurrency(amount)}
              onChange={(e) => setAmount(e.target.value.replace(/,/g, ''))}
              required
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="date">Fecha de Pago</Label>
          <Input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        
        <div className="flex gap-3 pt-4">
          <Button 
            type="button" 
            variant="outline" 
            className="flex-1"
            onClick={onCancel}
          >
            Cancelar
          </Button>
          <Button 
            type="submit" 
            className="flex-1 bg-lending-primary hover:bg-lending-secondary"
          >
            Registrar Pago
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PaymentForm;
