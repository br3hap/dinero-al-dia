
import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Clients from "./pages/Clients";
import ClientDetail from "./components/clients/ClientDetail";
import Loans from "./pages/Loans";
import LoanDetails from "./components/loans/LoanDetails";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import AuthScreen from "./components/auth/AuthScreen";

const queryClient = new QueryClient();

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if we should bypass authentication for development
    const bypassAuth = process.env.NODE_ENV === 'development' && true; // Set to false to disable bypass
    
    if (bypassAuth) {
      setIsAuthenticated(true);
      setIsLoading(false);
      return;
    }
    
    // Add a little delay to make authentication feel more secure
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lending-primary"></div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        {isAuthenticated ? (
          <BrowserRouter>
            <AppLayout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/clients" element={<Clients />} />
                <Route path="/clients/:id" element={<ClientDetail />} />
                <Route path="/loans" element={<Loans />} />
                <Route path="/loans/:id" element={<LoanDetails />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AppLayout>
          </BrowserRouter>
        ) : (
          <AuthScreen onAuthenticated={() => setIsAuthenticated(true)} />
        )}
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
