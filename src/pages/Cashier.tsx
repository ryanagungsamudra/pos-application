import Breadcrumb from "@/components/Breadcrumb";
import Navbar from "@/components/Navbar";
import TableList from "@/components/TableList";
import OrderPanel from "@/components/OrderPanel";
import { useEffect } from "react";
import { useAppContext } from "@/provider/useAppContext";

function Cashier() {
  const { enterCount, setEnterCount } = useAppContext();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        setEnterCount(enterCount + 1);
      }
      console.log(enterCount);
    };

    // Add event listener
    window.addEventListener("keydown", handleKeyDown);

    // Clean up event listener on component unmount
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [enterCount, setEnterCount]);

  return (
    <div className="p-[1.2%]">
      <Navbar />
      <Breadcrumb />
      <TableList />
      <OrderPanel />
    </div>
  );
}

export default Cashier;
