// src/contexts/AppContext.ts
import { createContext } from "react";

export interface AppContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  tabs: Tabs[];
  setTabs: React.Dispatch<React.SetStateAction<Tabs[]>>;
  customerTrx: CustomerTransaction[];
  setCustomerTrx: React.Dispatch<React.SetStateAction<CustomerTransaction[]>>;
  isLoading: boolean;
  showLoading: () => void;
  hideLoading: () => void;
  animation: "blue" | "green";
}

export interface User {
  email: string;
  first_name: string;
  last_name: string;
}

export interface Tabs {
  id: number;
  label: string;
  active: boolean;
}

export interface Item {
  name: string;
  barcode: string;
  brand: string;
  guarantee: string;
  type: string;
  product_code: string;
  product_code_updated_at: string;
  market: string;
  market_updated_at: string;
  qty: number;
  unit_price: number;
  total_unit_price?: number;
}

export interface CustomerTransaction {
  items?: Item[];
  customer?: string;
  description?: string;
  payment_method?: string;
  bon_duration?: number;
  total?: number;
  cash?: number;
  money_change?: number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export default AppContext;
