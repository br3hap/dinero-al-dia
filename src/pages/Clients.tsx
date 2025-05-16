
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getClientsWithLoans } from "@/utils/reports";
import { ClientWithLoans } from "@/types";
import { Plus, User, Search } from "lucide-react";
import ClientForm from "@/components/clients/ClientForm";

const Clients = () => {
  const navigate = useNavigate();
  const [clients, setClients] = useState<ClientWithLoans[]>([]);
  const [filteredClients, setFilteredClients] = useState<ClientWithLoans[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddClient, setShowAddClient] = useState(false);

  useEffect(() => {
    loadClients();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = clients.filter(client => 
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.phone.includes(searchTerm)
      );
      setFilteredClients(filtered);
    } else {
      setFilteredClients(clients);
    }
  }, [searchTerm, clients]);

  const loadClients = () => {
    const clientsData = getClientsWithLoans();
    setClients(clientsData);
    setFilteredClients(clientsData);
  };

  const handleAddClient = () => {
    setShowAddClient(true);
  };

  const handleClientSuccess = () => {
    setShowAddClient(false);
    loadClients();
  };

  const formatCurrency = (amount: number) => {
    return `$${amount.toLocaleString('es-MX')}`;
  };

  return (
    <div className="app-container animate-fade-in">
      {showAddClient ? (
        <ClientForm
          onSuccess={handleClientSuccess}
          onCancel={() => setShowAddClient(false)}
        />
      ) : (
        <>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-xl font-bold">Clientes</h1>
            <Button 
              size="sm" 
              className="bg-lending-primary hover:bg-lending-secondary"
              onClick={handleAddClient}
            >
              <Plus className="h-4 w-4 mr-1" /> Nuevo
            </Button>
          </div>

          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar por nombre o teléfono..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {filteredClients.length === 0 ? (
            <div className="text-center py-8">
              {clients.length === 0 ? (
                <>
                  <User className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500">No hay clientes registrados</p>
                  <Button 
                    variant="link" 
                    className="mt-2 text-lending-primary"
                    onClick={handleAddClient}
                  >
                    Agregar tu primer cliente
                  </Button>
                </>
              ) : (
                <>
                  <Search className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500">No se encontraron clientes</p>
                  <p className="text-sm text-gray-400">Intenta con otro término de búsqueda</p>
                </>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredClients
                .sort((a, b) => {
                  // Sort by active loans first, then by name
                  if (a.activeLoans > 0 && b.activeLoans === 0) return -1;
                  if (a.activeLoans === 0 && b.activeLoans > 0) return 1;
                  return a.name.localeCompare(b.name);
                })
                .map((client) => (
                <Card 
                  key={client.id} 
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => navigate(`/clients/${client.id}`)}
                >
                  <CardContent className="p-3 flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                        <User className="h-5 w-5 text-gray-600" />
                      </div>
                      <div>
                        <p className="font-medium">{client.name}</p>
                        <p className="text-sm text-gray-500">{client.phone}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      {client.activeLoans > 0 && (
                        <>
                          <p className="font-medium text-lending-primary">{formatCurrency(client.totalOwed)}</p>
                          <p className="text-xs text-gray-500">
                            {client.activeLoans} préstamo{client.activeLoans !== 1 ? 's' : ''}
                          </p>
                        </>
                      )}
                      {client.activeLoans === 0 && (
                        <p className="text-xs text-gray-500">Sin préstamos activos</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Clients;
