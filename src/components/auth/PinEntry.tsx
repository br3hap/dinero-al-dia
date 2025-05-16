
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getUser } from "@/utils/storage";
import { toast } from "sonner";

interface PinEntryProps {
  onSuccess: () => void;
}

const PinEntry = ({ onSuccess }: PinEntryProps) => {
  const [pin, setPin] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [error, setError] = useState("");
  const [isLocked, setIsLocked] = useState(false);
  const [lockTimer, setLockTimer] = useState(0);

  useEffect(() => {
    if (isLocked && lockTimer > 0) {
      const timer = setTimeout(() => {
        setLockTimer(lockTimer - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (isLocked && lockTimer === 0) {
      setIsLocked(false);
      setAttempts(0);
    }
  }, [isLocked, lockTimer]);

  const verifyPin = () => {
    const user = getUser();
    
    if (!user || !user.pin) {
      setError("No se ha configurado un PIN");
      return;
    }
    
    if (pin === user.pin) {
      setPin("");
      setError("");
      setAttempts(0);
      onSuccess();
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      
      if (newAttempts >= 3) {
        setIsLocked(true);
        setLockTimer(30); // Lock for 30 seconds
        toast.error("Demasiados intentos. Espera 30 segundos");
      } else {
        setError(`PIN incorrecto. ${3 - newAttempts} intentos restantes`);
      }
      
      setPin("");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    verifyPin();
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 animate-fade-in">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-lending-primary">Dinero al Día</h1>
        <p className="text-gray-600 mt-2">
          Ingresa tu PIN para acceder
        </p>
      </div>

      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
        <div className="space-y-4">
          <div>
            <Input
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
              disabled={isLocked}
              required
              autoFocus
            />
          </div>
          
          {error && (
            <p className="text-destructive text-sm">{error}</p>
          )}
          
          {isLocked && (
            <p className="text-amber-600 text-sm text-center">
              Espera {lockTimer} segundos antes de intentar nuevamente
            </p>
          )}
        </div>
        
        <Button 
          type="submit" 
          className="w-full bg-lending-primary hover:bg-lending-secondary"
          disabled={isLocked || pin.length < 4}
        >
          {isLocked ? `Bloqueado (${lockTimer}s)` : "Acceder"}
        </Button>
      </form>
    </div>
  );
};

export default PinEntry;
