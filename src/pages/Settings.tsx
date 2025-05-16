
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { 
  getUser,
  updateUser,
  deleteUserData,
  loadAppData,
} from "@/utils/storage";
import { toast } from "sonner";

const Settings = () => {
  const [currentPin, setCurrentPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [useBiometrics, setUseBiometrics] = useState(false);
  const [error, setError] = useState("");
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  
  // Load user settings
  useEffect(() => {
    const user = getUser();
    if (user) {
      setUseBiometrics(user.useBiometrics);
    }
  }, []);

  const handleChangePin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    const user = getUser();
    
    if (!user || !user.pin) {
      setError("No se ha configurado un PIN");
      return;
    }
    
    if (currentPin !== user.pin) {
      setError("PIN actual incorrecto");
      return;
    }
    
    if (newPin.length < 4) {
      setError("El nuevo PIN debe tener al menos 4 dígitos");
      return;
    }
    
    if (newPin !== confirmPin) {
      setError("Los PINs no coinciden");
      return;
    }
    
    updateUser({ pin: newPin });
    toast.success("PIN actualizado correctamente");
    
    // Clear form
    setCurrentPin("");
    setNewPin("");
    setConfirmPin("");
  };

  const handleToggleBiometrics = () => {
    const newValue = !useBiometrics;
    
    // Update in storage
    updateUser({ useBiometrics: newValue });
    
    // Update state
    setUseBiometrics(newValue);
    
    toast.success(`Autenticación biométrica ${newValue ? 'activada' : 'desactivada'}`);
  };

  const handleDeleteData = () => {
    if (showConfirmDelete) {
      // Perform delete
      deleteUserData();
      toast.success("Todos los datos han sido eliminados");
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } else {
      // Show confirmation
      setShowConfirmDelete(true);
    }
  };

  const handleCancelDelete = () => {
    setShowConfirmDelete(false);
  };

  const handleExportData = () => {
    try {
      const data = loadAppData();
      
      // Create blob and link
      const dataStr = JSON.stringify(data, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      
      // Set up download
      link.href = url;
      link.download = `dinero-al-dia-backup-${new Date().toISOString().split('T')[0]}.json`;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast.success("Datos exportados correctamente");
    } catch (err) {
      console.error('Export error:', err);
      toast.error("Error al exportar datos");
    }
  };

  return (
    <div className="app-container animate-fade-in">
      <h1 className="text-xl font-bold mb-6">Configuración</h1>
      
      <div className="space-y-6">
        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <h2 className="text-lg font-medium mb-4">Seguridad</h2>
          
          <form onSubmit={handleChangePin} className="space-y-4">
            <div>
              <Label htmlFor="currentPin">PIN Actual</Label>
              <Input
                id="currentPin"
                type="password"
                inputMode="numeric"
                pattern="[0-9]*"
                value={currentPin}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');
                  if (value.length <= 6) setCurrentPin(value);
                }}
                className="text-center"
                placeholder="• • • •"
              />
            </div>
            
            <div>
              <Label htmlFor="newPin">Nuevo PIN</Label>
              <Input
                id="newPin"
                type="password"
                inputMode="numeric"
                pattern="[0-9]*"
                value={newPin}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');
                  if (value.length <= 6) setNewPin(value);
                }}
                className="text-center"
                placeholder="• • • •"
              />
            </div>
            
            <div>
              <Label htmlFor="confirmPin">Confirmar Nuevo PIN</Label>
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
                className="text-center"
                placeholder="• • • •"
              />
            </div>
            
            {error && (
              <p className="text-destructive text-sm">{error}</p>
            )}
            
            <Button 
              type="submit" 
              className="w-full bg-lending-primary hover:bg-lending-secondary"
              disabled={!currentPin || !newPin || !confirmPin}
            >
              Cambiar PIN
            </Button>
          </form>
          
          <div className="flex items-center justify-between mt-6">
            <div>
              <p className="font-medium">Autenticación Biométrica</p>
              <p className="text-sm text-gray-500">Usar Face ID o Touch ID para acceder</p>
            </div>
            <Switch
              checked={useBiometrics}
              onCheckedChange={handleToggleBiometrics}
            />
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <h2 className="text-lg font-medium mb-4">Datos</h2>
          
          <div className="space-y-4">
            <div>
              <p className="mb-2">Exportar Datos</p>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={handleExportData}
              >
                Exportar como JSON
              </Button>
            </div>
            
            <div>
              <p className="mb-2">Eliminar Datos</p>
              
              {showConfirmDelete ? (
                <div className="space-y-2">
                  <p className="text-sm text-destructive font-medium">
                    ¿Estás seguro? Esta acción eliminará TODOS los datos de la aplicación.
                  </p>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={handleCancelDelete}
                    >
                      Cancelar
                    </Button>
                    <Button 
                      variant="destructive" 
                      className="flex-1"
                      onClick={handleDeleteData}
                    >
                      Sí, eliminar
                    </Button>
                  </div>
                </div>
              ) : (
                <Button 
                  variant="outline" 
                  className="w-full text-destructive border-destructive hover:bg-destructive/10"
                  onClick={handleDeleteData}
                >
                  Eliminar todos los datos
                </Button>
              )}
            </div>
          </div>
        </div>
        
        <div className="text-center text-xs text-gray-500 pt-4">
          <p>Dinero al Día v1.0.0</p>
          <p className="mt-1">Aplicación para gestión de préstamos</p>
        </div>
      </div>
    </div>
  );
};

export default Settings;
