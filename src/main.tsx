import React from "react";
import ReactDOM from "react-dom/client";

import "./index.css";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Cashier from "./pages/Cashier";
import Customer from "./pages/Customer";
import Login from "./pages/Login";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/customer",
    element: <Customer />,
  },
  {
    path: "/cashier",
    element: <Cashier />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
