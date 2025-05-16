
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  Users, 
  DollarSign, 
  Settings as SettingsIcon 
} from "lucide-react";

const BottomNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const navigationItems = [
    {
      name: "Inicio",
      path: "/",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      name: "Clientes",
      path: "/clients",
      icon: <Users className="h-5 w-5" />,
    },
    {
      name: "Préstamos",
      path: "/loans",
      icon: <DollarSign className="h-5 w-5" />,
    },
    {
      name: "Ajustes",
      path: "/settings",
      icon: <SettingsIcon className="h-5 w-5" />,
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 h-16 bg-white border-t flex items-center justify-around px-4 z-10">
      {navigationItems.map((item) => (
        <Button
          key={item.path}
          variant="ghost"
          size="sm"
          className={`flex flex-col items-center space-y-1 h-14 w-16 
            ${isActive(item.path) ? "text-lending-primary" : "text-gray-500"}`}
          onClick={() => navigate(item.path)}
        >
          {item.icon}
          <span className="text-xs">{item.name}</span>
        </Button>
      ))}
    </div>
  );
};

export default BottomNavigation;
