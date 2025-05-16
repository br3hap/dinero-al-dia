
import { useState, useEffect } from "react";
import { getUser } from "@/utils/storage";
import PinSetup from "./PinSetup";
import PinEntry from "./PinEntry";

interface AuthScreenProps {
  onAuthenticated: () => void;
}

const AuthScreen = ({ onAuthenticated }: AuthScreenProps) => {
  const [isConfigured, setIsConfigured] = useState<boolean | null>(null);
  
  useEffect(() => {
    const user = getUser();
    setIsConfigured(!!user && !!user.pin);
  }, []);

  // Show loading while checking if PIN is configured
  if (isConfigured === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lending-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-lending-light to-white">
      {isConfigured ? (
        <PinEntry onSuccess={onAuthenticated} />
      ) : (
        <PinSetup onComplete={() => setIsConfigured(true)} />
      )}
    </div>
  );
};

export default AuthScreen;
