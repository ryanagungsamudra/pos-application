import Breadcrumb from "@/components/Breadcrumb";
import Navbar from "@/components/Navbar";
import TableList from "@/components/TableList";
import OrderPanel from "@/components/OrderPanel";

function Cashier() {
  return (
    <div className="p-[1.2%] h-screen overflow-hidden">
      <Navbar />
      <Breadcrumb />
      <TableList />
      <OrderPanel />
    </div>
  );
}

export default Cashier;
