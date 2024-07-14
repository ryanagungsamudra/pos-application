import { useState } from "react";

// assets
import Logo from "@/assets/Logo.png";
import IconBarcodeOn from "@/assets/icons/BarcodeOn.svg";
import IconBarcodeOff from "@/assets/icons/BarcodeOff.svg";
import IconProfile from "@/assets/icons/Profile.svg";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut } from "lucide-react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "@/provider/useAppContext";

function Navbar() {
  const navigate = useNavigate();
  const { user } = useAppContext();
  const [toggleScanner, setToggleScanner] = useState(false);

  const handleLogout = () => {
    Cookies.remove("token");
    localStorage.removeItem("user");
    localStorage.removeItem("customerTrx");
    localStorage.removeItem("tabs");
    navigate("/login");
  };

  return (
    <div className="flex w-full h-[9.22%] justify-between items-center px-4 py-2 bg-white drop-shadow-lg rounded-[10px]">
      <img
        src={Logo}
        alt="Logo"
        className="w-[123px] h-[62px] cursor-pointer"
      />

      <div>
        <div className="flex items-center justify-around w-full h-full gap-5">
          {/* Barcode Icon */}
          <div
            className="flex flex-col items-center justify-center w-[50px] cursor-pointer"
            onClick={() => setToggleScanner(!toggleScanner)}>
            <div className="relative">
              <img
                src={toggleScanner ? IconBarcodeOn : IconBarcodeOff}
                alt="Icon Barcode"
                className="w-[46px] h-[46px]"
              />
              <div className="absolute flex items-center justify-center w-6 h-3 transform -translate-x-1/2 -translate-y-1/2 bg-white top-1/2 left-1/2">
                <p
                  className={`text-[10px] ${
                    toggleScanner ? "text-[#038B0A]" : "text-[#B30A28]"
                  }  font-bold`}>
                  {toggleScanner ? "ON" : "OFF"}
                </p>
              </div>
            </div>
            <p className="font-bold text-[12px] text-center">Barcode</p>
          </div>

          {/* Profile Icon */}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex flex-col items-center justify-center w-full cursor-pointer">
                <img
                  src={IconProfile}
                  alt="Icon Profile"
                  className="w-[33px] h-[46px]"
                />
                <p className="font-bold text-[12px] text-center">
                  {user?.first_name ? `${user?.first_name}` : "User"}
                </p>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-6 mr-6 mt-4 bg-white hover:bg-[#DDEEFF] hover:font-normal">
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={handleLogout}>
                <LogOut className="h-4 mr-2" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
