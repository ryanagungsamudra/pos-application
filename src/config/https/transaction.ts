import axios from "axios";
import Cookies from "js-cookie";
const url = import.meta.env.VITE_APP_HOST;

// transaction
export const postTransaction = async (body) => {
  const token = Cookies.get("token");

  if (!token) {
    throw new Error("No token found in cookies.");
  }

  const response = await axios.post(`${url}/api/create-transaction`, body);
  return response;
};
