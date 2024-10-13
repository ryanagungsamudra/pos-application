import axios from "axios";
import Cookies from "js-cookie";
const url = import.meta.env.VITE_APP_HOST;

// Items
export const getCustomers = async () => {
  const token = Cookies.get("token");

  if (!token) {
    throw new Error("No token found in cookies.");
  }

  const response = await axios.get(`${url}/api/customers`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  return response;
};

export const postCustomer = async (body: object) => {
  const token = Cookies.get("token");

  if (!token) {
    throw new Error("No token found in cookies.");
  }

  const response = await axios.post(`${url}/api/create-customer`, body, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  return response;
};
