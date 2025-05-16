
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { addLoan } from "@/utils/storage";
import { Client, Loan } from "@/types";
import { toast } from "sonner";

interface LoanFormProps {
  client: Client;
  onSuccess: (loan: Loan) => void;
  onCancel: () => void;
}

const LoanForm = ({ client, onSuccess, onCancel }: LoanFormProps) => {
  const [amount, setAmount] = useState("");
  const [interestRate, setInterestRate] = useState("10");
  const [terms, setTerms] = useState("30");
  const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const amountNum = parseFloat(amount);
    const interestRateNum = parseFloat(interestRate);
    const termsNum = parseInt(terms);
    const startDateObj = new Date(startDate);
    const endDateObj = new Date(startDateObj);
    endDateObj.setDate(startDateObj.getDate() + termsNum);
    
    if (amountNum <= 0) {
      toast.error("El monto debe ser mayor a 0");
      return;
    }
    
    if (interestRateNum < 0) {
      toast.error("La tasa de interés no puede ser negativa");
      return;
    }
    
    if (termsNum <= 0) {
      toast.error("El plazo debe ser mayor a 0");
      return;
    }
    
    const newLoan = addLoan({
      clientId: client.id,
      amount: amountNum,
      interestRate: interestRateNum,
      terms: termsNum,
      startDate: startDateObj.getTime(),
      endDate: endDateObj.getTime(),
      status: "active",
    });
    
    toast.success("Préstamo registrado correctamente");
    onSuccess(newLoan);
  };

  const formatCurrency = (value: string) => {
    const number = value.replace(/[^\d]/g, '');
    return number ? parseInt(number).toLocaleString('es-MX') : '';
  };

  return (
    <div className="animate-fade-in">
      <h2 className="text-xl font-bold mb-4">Nuevo Préstamo para {client.name}</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="amount">Monto del Préstamo</Label>
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
        
        <div className="flex gap-4">
          <div className="flex-1">
            <Label htmlFor="interestRate">Tasa de Interés (%)</Label>
            <Input
              id="interestRate"
              type="number"
              step="0.01"
              min="0"
              max="100"
              value={interestRate}
              onChange={(e) => setInterestRate(e.target.value)}
              required
            />
          </div>
          
          <div className="flex-1">
            <Label htmlFor="terms">Plazo (días)</Label>
            <Select
              value={terms}
              onValueChange={setTerms}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">7 días</SelectItem>
                <SelectItem value="15">15 días</SelectItem>
                <SelectItem value="30">30 días</SelectItem>
                <SelectItem value="60">60 días</SelectItem>
                <SelectItem value="90">90 días</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div>
          <Label htmlFor="startDate">Fecha de Inicio</Label>
          <Input
            id="startDate"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
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
            Guardar Préstamo
          </Button>
        </div>
      </form>
    </div>
  );
};

export default LoanForm;
