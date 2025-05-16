
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getCollectionsForDay } from "@/utils/reports";
import { CollectionsForDay } from "@/types";
import { Check, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface CollectionsListProps {
  date?: Date;
}

const CollectionsList = ({ date = new Date() }: CollectionsListProps) => {
  const [collections, setCollections] = useState<CollectionsForDay | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const data = getCollectionsForDay(date);
    setCollections(data);
  }, [date]);

  const formatCurrency = (amount: number) => {
    return `$${amount.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('es-MX', options);
  };

  if (!collections) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lending-primary"></div>
      </div>
    );
  }

  const handleNavigateToClient = (clientId: string) => {
    navigate(`/clients/${clientId}`);
  };

  if (collections.clients.length === 0) {
    return (
      <div className="text-center py-8">
        <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-2" />
        <p className="text-gray-500">No hay cobros programados para hoy</p>
        <p className="text-sm text-gray-400">Agrega nuevos préstamos para ver las cobranzas</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-medium text-gray-700">Cobros para {formatDate(collections.date)}</h3>
        <p className="text-sm font-medium text-lending-primary">
          Total: {formatCurrency(collections.totalAmount)}
        </p>
      </div>

      <div className="space-y-3">
        {collections.clients.map((client) => (
          <Card 
            key={`${client.loanId}-${client.clientId}`}
            className={`${client.paid ? 'bg-gray-50' : 'bg-white'} hover:bg-gray-50 cursor-pointer`}
            onClick={() => handleNavigateToClient(client.clientId)}
          >
            <CardContent className="p-3 flex justify-between items-center">
              <div className="flex items-center">
                <div className={`h-10 w-10 rounded-full flex items-center justify-center mr-3
                  ${client.paid ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'}`}>
                  {client.paid ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <span className="text-sm font-medium">
                      {new Date().getDate()}
                    </span>
                  )}
                </div>
                <div>
                  <p className={`font-medium ${client.paid ? 'text-gray-500' : 'text-gray-800'}`}>
                    {client.clientName}
                  </p>
                  <p className="text-sm text-gray-500">
                    {client.paid ? 'Cobrado hoy' : 'Pendiente'}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-medium ${client.paid ? 'text-gray-500' : 'text-lending-primary'}`}>
                  {formatCurrency(client.amount)}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CollectionsList;
