import axios from "axios";
import Cookies from "js-cookie";
const url = import.meta.env.VITE_APP_HOST;

// export const getItems = async () => {
//   const token = Cookies.get("token");

//   if (!token) {
//     throw new Error("No token found in cookies.");
//   }

//   const response = await axios.get(`http://localhost:3000/items`);
//   return response;
// };

export const getItems = async () => {
  const token = Cookies.get("token");

  if (!token) {
    throw new Error("No token found in cookies.");
  }

  const response = await axios.get(`${url}/api/client/items`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  return response;
};

export const getCodes = async (category) => {
  const token = Cookies.get("token");

  if (!token) {
    throw new Error("No token found in cookies.");
  }

  const response = await axios.get(`${url}/api/codes?category=${category}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  return response.data;
};
