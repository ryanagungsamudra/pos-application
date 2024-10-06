// assets
import Logo from "@/assets/Logo.png";
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
import BarcodeScanner from "./BarcodeScanner";

function Navbar({ dropdownShown = true }: { dropdownShown?: boolean }) {
  const navigate = useNavigate();
  const { user, removeTabs, removeCustomerTrx } = useAppContext();

  const handleLogout = () => {
    Cookies.remove("token");
    removeTabs();
    removeCustomerTrx();
    navigate("/login");
  };

  return (
    <div className="flex w-full h-[50px] justify-between items-center px-4 py-2 bg-white drop-shadow-lg rounded-[10px]">
      <img src={Logo} alt="Logo" className="w-[85px] h-[50px] cursor-pointer" />

      {dropdownShown && (
        <div>
          <div className="flex items-center justify-around w-full h-full gap-5">
            {/* Barcode Icon */}
            <BarcodeScanner />

            {/* Profile Icon */}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex flex-col items-center justify-center w-full cursor-pointer">
                  <img
                    src={IconProfile}
                    alt="Icon Profile"
                    className="w-[30px] h-[30px]"
                  />
                  <p className="font-bold text-[10px] text-center">
                    {user?.first_name ? `${user?.first_name}` : "User"}
                  </p>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-4 mr-6 mt-4 bg-white hover:bg-[#DDEEFF] hover:font-normal">
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
      )}
    </div>
  );
}

export default Navbar;
