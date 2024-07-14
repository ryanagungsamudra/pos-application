import React from "react";
import ReactDOM from "react-dom/client";

import "./index.css";

import { RouterProvider } from "react-router-dom";

// Tanstack Query & Context
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppProvider } from "./provider/AppProvider";
// Create a client & Devtools
const queryClient = new QueryClient();
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "./components/ui/toaster";
import { router } from "./routes";
import { LoadingScreen } from "./components/ui/loading-screen";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <AppProvider>
      <React.StrictMode>
        <RouterProvider router={router} />
        <LoadingScreen />
        <Toaster />
        <ReactQueryDevtools initialIsOpen={true} />
      </React.StrictMode>
    </AppProvider>
  </QueryClientProvider>
);
