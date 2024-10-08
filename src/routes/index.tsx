import { createBrowserRouter } from "react-router-dom";

import Cashier from "@/pages/Cashier";
import Customer from "@/pages/Customer";
import Login from "@/pages/Login";
import Protected from "./protected";
import Finance from "@/pages/Finance";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Protected>{<Cashier />}</Protected>,
  },
  {
    path: "/login",
    element: <Protected>{<Login />}</Protected>,
  },
  {
    path: "/customer",
    element: <Protected>{<Customer />}</Protected>,
  },
  {
    path: "/finance",
    element: <Protected>{<Finance />}</Protected>,
  },
  {
    path: "*",
    element: (
      <Protected>
        <p>404 Error - Nothing here...</p>,
      </Protected>
    ),
  },
]);
