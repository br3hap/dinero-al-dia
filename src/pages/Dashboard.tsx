
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { getDashboardData } from "@/utils/reports";
import { DashboardData } from "@/types";
import DashboardCard from "@/components/reports/DashboardCard";
import CollectionsList from "@/components/reports/CollectionsList";
import { DollarSign, Calendar, ArrowUp, ArrowDown } from "lucide-react";

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);

  useEffect(() => {
    const data = getDashboardData();
    setDashboardData(data);
  }, []);

  const formatCurrency = (amount: number) => {
    return `$${amount.toLocaleString('es-MX')}`;
  };

  if (!dashboardData) {
    return (
      <div className="app-container">
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lending-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container animate-fade-in">
      <h1 className="text-2xl font-bold mb-6">Dinero al Día</h1>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <DashboardCard
          title="Total Prestado"
          value={formatCurrency(dashboardData.totalLoaned)}
          icon={<ArrowUp className="h-5 w-5" />}
          color="bg-blue-100 text-blue-600"
        />
        <DashboardCard
          title="Total Cobrado"
          value={formatCurrency(dashboardData.totalCollected)}
          icon={<ArrowDown className="h-5 w-5" />}
          color="bg-green-100 text-green-600"
        />
        <DashboardCard
          title="Por Cobrar"
          value={formatCurrency(dashboardData.totalPending)}
          icon={<DollarSign className="h-5 w-5" />}
          color="bg-amber-100 text-amber-600"
        />
        <DashboardCard
          title="Cobros Hoy"
          value={formatCurrency(dashboardData.dueToday)}
          icon={<Calendar className="h-5 w-5" />}
          color="bg-lending-light text-lending-primary"
        />
      </div>
      
      <Card className="mb-6">
        <div className="p-4">
          <h2 className="text-lg font-medium mb-4">Cobros del Día</h2>
          <CollectionsList />
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;
