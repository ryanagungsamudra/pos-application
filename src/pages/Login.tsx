import React, { useState, useCallback, useMemo } from "react";

import loginBackground from "@/assets/abstract.jpg";
import Logo from "@/assets/Logo.png";

import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { postLogin } from "@/config/https/auth";
import { useAppContext } from "@/provider/useAppContext";

const Login: React.FC = () => {
  // hooks
  const { toast } = useToast();
  const { setUser, hideLoading, showLoading } = useAppContext();
  const navigate = useNavigate();

  // states
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  // functions
  const isValidEmail = useMemo(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }, [email]);

  const loginMutation = useMutation({
    mutationFn: postLogin,
    onSuccess: (data) => {
      setError(null);

      // set token to cookie
      const token = JSON.stringify(data.data.data.token);
      Cookies.set("token", token, { expires: 1 });
      // set the rest of data to context
      setUser((prev) => ({
        ...prev,
        email: data.data.data.email,
        first_name: data.data.data.firstname,
        last_name: data.data.data.lastname,
      }));

      setTimeout(() => {
        hideLoading();
        toast({
          variant: "success",
          title: "Login Berhasil",
          description: "Selamat datang kembali!",
          duration: 2500,
        });
        navigate("/");
      }, 3000);
    },
    onError: (error) => {
      console.error("Login failed", error.message);
      setError("Username or password is incorrect");
    },
  });

  const handleLogin = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();

      if (!isValidEmail) {
        setError("Please enter a valid email address.");
        return;
      }
      try {
        showLoading();
        await loginMutation.mutateAsync({
          email,
          password,
        });
        setError(null);
      } catch (error) {
        console.error("Login failed", error);
        setError("Username or password is incorrect");
      } finally {
        setTimeout(() => {
          hideLoading();
        }, 3000);
      }
    },
    [isValidEmail, loginMutation, email, password]
  );

  return (
    <div
      className="flex items-center justify-center w-screen min-h-screen px-4 bg-{#eeeeee} dark:bg-gray-800 sm:px-6 lg:px-8 drop-shadow-xl"
      style={{
        backgroundImage: `url(${loginBackground})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
      }}>
      <div className="relative py-3 sm:max-w-xs sm:mx-auto md:min-w-[25rem]">
        <form
          onSubmit={handleLogin}
          className="px-8 py-6 mt-4 text-left bg-white shadow-lg min-h-96 dark:bg-gray-900 rounded-xl">
          <div className="flex flex-col items-center justify-center h-full select-none">
            <div className="flex flex-col items-center justify-center gap-2 mb-8">
              <div className="flex justify-center w-full">
                <img src={Logo} className="w-20" alt="User Icon" />
                {/* <p className="m-0 text-[22px] font-semibold dark:text-white">
                  Login to your Account
                </p> */}
              </div>
              <span className="mt-2 max-w-[90%] text-[14px] text-center text-[#8B8E98]">
                Silahkan login terlebih dahulu untuk mengakses applikasi
              </span>
            </div>
            <div className="flex flex-col w-full gap-2">
              <label className="text-[12px] font-semibold text-gray-400 ">
                Email
              </label>
              <input
                type="email"
                className="w-full px-3 py-2 mb-5 text-[14px] border rounded-lg outline-none dark:border-gray-500 dark:bg-gray-900 focus:ring-0 focus:ring-offset-0 focus:border-[#079457] focus:border-[1.5px]"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          <div className="flex flex-col w-full gap-2">
            <label className="text-[12px] font-semibold text-gray-400 ">
              Password
            </label>
            <input
              type="password"
              className="w-full px-3 py-2 mb-5 text-[14px] border rounded-lg outline-none dark:border-gray-500 dark:bg-gray-900 focus:ring-0 focus:ring-offset-0 focus:border-[#079457] focus:border-[1.5px]"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <div className="mt-5">
            <button
              type="submit"
              className="w-full px-8 py-[5px] text-base font-semibold text-center text-white transition duration-200 ease-in rounded-lg shadow-md cursor-pointer select-none bg-primary-gradient hover:bg-blue-800 focus:ring-offset-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2">
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
