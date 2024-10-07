import { useAppContext } from "@/provider/useAppContext";
import React, { useRef } from "react";
import Logo from "@/assets/Logo.png";

const Invoice = React.forwardRef((_, ref) => {
  const { tabs, customerTrx } = useAppContext();

  const billRef = useRef();
  // Find the active tab
  const activeTab = tabs.find((tab) => tab.active);
  // Ensure there is an active tab and get its index
  const activeTabIndex = activeTab ? tabs.indexOf(activeTab) : 0;

  // Use the items from the customer transaction corresponding to the active tab
  const items = customerTrx[activeTabIndex]?.items || [];
  const paymentMethod = customerTrx[activeTabIndex]?.payment_method || "N/A";
  const total = customerTrx[activeTabIndex]?.total || 0;
  const uang = customerTrx[activeTabIndex]?.cash || 0;
  const kembalian = customerTrx[activeTabIndex]?.money_change || 0;

  const currentDate = new Date().toLocaleDateString();

  React.useImperativeHandle(ref, () => ({
    handlePrint: () => {
      const printContents = billRef.current.innerHTML;
      const originalContents = document.body.innerHTML;

      // Replace the body content with the invoice for printing
      document.body.innerHTML = printContents;

      // Trigger the browser's print functionality
      window.print();

      // Restore the original content after printing
      document.body.innerHTML = originalContents;

      // Reload the page to avoid any issues after printing
      window.location.reload();
    },
  }));

  const formatNumber = (number: number) => {
    // Ensure the input is a valid number
    if (isNaN(number)) return "0";

    // Use the toLocaleString method to format the number
    return number.toLocaleString("id-ID");
  };

  return (
    <div
      ref={billRef}
      className="max-w-[58mm] mx-auto overflow-hidden bg-white rounded-lg shadow-md">
      <div className="p-4">
        <div className="flex items-center justify-between w-full">
          <img
            src={Logo}
            alt="Logo"
            className="w-[50px] h-[30px] cursor-pointer"
          />
          <p className="text-xs text-center text-gray-600">{currentDate}</p>
        </div>

        <div>
          <p className="text-[8px] text-center mt-2">
            Jl. Magelang No.6,3, Mlati Dukuh, Sinduadi, Kec. Mlati, Kabupaten
            Sleman, Daerah Istimewa Yogyakarta 55284
          </p>
        </div>

        <div className="mt-0">
          <h2 className="font-semibold text-center text-md">
            -------------------------
          </h2>
          <div id="itemList" className="">
            {items.map((item, index) => (
              <div key={index} className="flex justify-between py-1 text-xs">
                <div className="w-[45%]">
                  <span className="text-[10px]">{item.name}</span>
                </div>
                <div className="w-[35%]">
                  <span className="text-[10px]">
                    {item.qty} x {item.unit_price}
                  </span>
                </div>
                <div className="w-[20%]">
                  <span className="text-[10px]">
                    {formatNumber(item.total_unit_price)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <h2 className="font-semibold text-center text-md">
          -------------------------
        </h2>

        <div className="flex justify-between -my-[5px] text-xs font-bold px-1">
          <h2 className="font-semibold text-[10px]">Metode Pembayaran :</h2>
          <p className="text-gray-600 text-[10px] uppercase">{paymentMethod}</p>
        </div>

        <h2 className="font-semibold text-center text-md">
          -------------------------
        </h2>

        <div className="flex justify-between mt-0 text-xs font-bold">
          <span className="text-[10px]">Total</span>
          <span className="text-[10px]">{formatNumber(total)}</span>
        </div>

        <div className="flex justify-between mt-0 text-xs font-bold">
          <span className="text-[10px]">Tunai</span>
          <span className="text-[10px]">{formatNumber(uang)}</span>
        </div>

        <div className="flex justify-between mt-0 text-xs font-bold">
          <span className="text-[10px]">Kembali</span>
          <span className="text-[10px]">{formatNumber(kembalian)}</span>
        </div>
      </div>
    </div>
  );
});

export default Invoice;
