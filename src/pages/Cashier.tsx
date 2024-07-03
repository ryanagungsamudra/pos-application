import Breadcrumb from "@/components/Breadcrumb";
import Navbar from "@/components/Navbar";
import TableList from "./TableList";
import OrderPanel from "@/components/OrderPanel";

function Cashier() {
  return (
    <div className="m-[1.73%]">
      <Navbar />
      <Breadcrumb />
      <TableList />
      <OrderPanel />
    </div>
  );
}

export default Cashier;
