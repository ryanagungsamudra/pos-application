// Protected.tsx
import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { isAuthenticated } from "./helper";

interface ProtectedProps {
  children: React.ReactNode;
}

const Protected: React.FC<ProtectedProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isAuthenticated() && location.pathname !== "/login") {
      navigate("/login");
    } else if (isAuthenticated() && location.pathname === "/login") {
      navigate("/");
    }
  }, [navigate, location]);

  return <>{children}</>;
};

export default Protected;
