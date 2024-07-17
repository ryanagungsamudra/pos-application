// src/contexts/AppProvider.tsx
import React, { ReactNode, useState, useCallback, useEffect } from "react";
import AppContext, { User, Tabs, CustomerTransaction } from "./AppContext";
import { useLocalStorageState } from "@/lib/utils";

export const AppProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useLocalStorageState<User | null>("user", null);
  const [tabs, setTabs] = useLocalStorageState<Tabs[]>("tabs", [
    { id: 1, label: "Customer 1", active: true },
  ]);
  const [customerTrx, setCustomerTrx] = useLocalStorageState<
    CustomerTransaction[]
  >("customerTrx", [
    {
      items: [],
      customer: "Reguler",
      description: "",
      payment_method: "cash",
      bon_duration: 0,
      total: 0,
      cash: 0,
      money_change: 0,
    },
  ]);

  // Loading state and logic
  const [isLoading, setIsLoading] = useState(false);
  const [animation, setAnimation] = useState<"blue" | "green">("blue");

  const showLoading = useCallback(() => setIsLoading(true), []);
  const hideLoading = useCallback(() => setIsLoading(false), []);

  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setAnimation((prev) => (prev === "blue" ? "green" : "blue"));
      }, 2500);

      return () => clearInterval(interval);
    }
  }, [isLoading]);

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        tabs,
        setTabs,
        customerTrx,
        setCustomerTrx,
        isLoading,
        showLoading,
        hideLoading,
        animation,
      }}>
      {children}
    </AppContext.Provider>
  );
};
