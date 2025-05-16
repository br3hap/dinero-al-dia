
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addClient } from "@/utils/storage";
import { Client } from "@/types";
import { toast } from "sonner";

interface ClientFormProps {
  onSuccess: (client: Client) => void;
  onCancel: () => void;
}

const ClientForm = ({ onSuccess, onCancel }: ClientFormProps) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (name.trim().length < 3) {
      toast.error("El nombre debe tener al menos 3 caracteres");
      return;
    }
    
    if (phone.trim().length < 8) {
      toast.error("Ingrese un número de teléfono válido");
      return;
    }
    
    const newClient = addClient({
      name: name.trim(),
      phone: phone.trim(),
    });
    
    toast.success("Cliente agregado correctamente");
    onSuccess(newClient);
  };

  const formatPhoneNumber = (value: string) => {
    const phoneNumber = value.replace(/\D/g, '');
    return phoneNumber;
  };

  return (
    <div className="animate-fade-in">
      <h2 className="text-xl font-bold mb-4">Nuevo Cliente</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name">Nombre Completo</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nombre del cliente"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="phone">Teléfono</Label>
          <Input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(formatPhoneNumber(e.target.value))}
            placeholder="Número de teléfono"
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
            Guardar Cliente
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ClientForm;
