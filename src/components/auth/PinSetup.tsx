
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { setUser } from "@/utils/storage";
import { toast } from "sonner";

interface PinSetupProps {
  onComplete: () => void;
}

const PinSetup = ({ onComplete }: PinSetupProps) => {
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (pin.length < 4) {
      setError("PIN debe tener al menos 4 dígitos");
      return;
    }
    
    if (pin !== confirmPin) {
      setError("Los PINs no coinciden");
      return;
    }
    
    setUser({ pin, useBiometrics: false });
    toast.success("PIN establecido correctamente");
    onComplete();
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 animate-fade-in">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-lending-primary">Configurar PIN</h1>
        <p className="text-gray-600 mt-2">
          Crea un PIN para proteger tus datos
        </p>
      </div>

      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="pin" className="block text-sm font-medium mb-1">
              Ingresa tu PIN
            </label>
            <Input
              id="pin"
              type="password"
              inputMode="numeric"
              pattern="[0-9]*"
              value={pin}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '');
                if (value.length <= 6) setPin(value);
              }}
              className="text-center text-2xl tracking-widest"
              placeholder="• • • •"
              required
            />
          </div>
          
          <div>
            <label htmlFor="confirmPin" className="block text-sm font-medium mb-1">
              Confirma tu PIN
            </label>
            <Input
              id="confirmPin"
              type="password"
              inputMode="numeric"
              pattern="[0-9]*"
              value={confirmPin}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '');
                if (value.length <= 6) setConfirmPin(value);
              }}
              className="text-center text-2xl tracking-widest"
              placeholder="• • • •"
              required
            />
          </div>
          
          {error && (
            <p className="text-destructive text-sm">{error}</p>
          )}
        </div>
        
        <Button 
          type="submit" 
          className="w-full bg-lending-primary hover:bg-lending-secondary"
        >
          Guardar PIN
        </Button>
      </form>
    </div>
  );
};

export default PinSetup;
