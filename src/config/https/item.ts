import axios from "axios";
import Cookies from "js-cookie";
const url = import.meta.env.VITE_APP_HOST;

// Items
export const getItems = async () => {
  const token = Cookies.get("token");

  if (!token) {
    throw new Error("No token found in cookies.");
  }

  const response = await axios.get(
    `http://localhost:3000/items`
    //     , {
    //     headers: {
    //       Authorization: `Bearer ${token}`,
    //       "Content-Type": "application/json",
    //     },
    //   }
  );
  return response;
};
