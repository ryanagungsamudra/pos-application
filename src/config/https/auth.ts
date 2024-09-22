import axios from "axios";
const url = import.meta.env.VITE_APP_HOST;

// Login
interface Login {
  email: string;
  password: string;
}
export const postLogin = ({ email, password }: Login) => {
  const response = axios.post(`${url}/api/login`, {
    email,
    password,
  });

  return response;
};
