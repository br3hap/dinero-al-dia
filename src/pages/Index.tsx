
import { useEffect } from "react";
import { Navigate } from "react-router-dom";

const Index = () => {
  useEffect(() => {
    // This component just redirects to the dashboard
    console.log("Redirecting to dashboard...");
  }, []);

  return <Navigate to="/" replace />;
};

export default Index;
