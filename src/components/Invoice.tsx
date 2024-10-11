// @ts-nocheck

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
  const trxData = customerTrx[activeTabIndex] || [];
  const items = customerTrx[activeTabIndex]?.items || [];
  const paymentMethod = customerTrx[activeTabIndex]?.payment_method || "N/A";
  const total = customerTrx[activeTabIndex]?.total || 0;
  const uang = customerTrx[activeTabIndex]?.cash || 0;
  const kembalian = customerTrx[activeTabIndex]?.money_change || 0;

  const currentDate = new Date();

  // Extract the date components
  const day = String(currentDate.getDate()).padStart(2, '0'); // Pad with zero if needed
  const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Months are 0-based, so add 1
  const year = String(currentDate.getFullYear()).slice(-2); // Get last 2 digits of the year

  // Extract the time components
  const hours = String(currentDate.getHours()).padStart(2, '0');
  const minutes = String(currentDate.getMinutes()).padStart(2, '0');

  // Format the date and time
  const formattedDate = `${day}.${month}.${year}-${hours}:${minutes}`;


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

  const renderPaymentMethod = () => {
    if (paymentMethod === "cash") {
      return "Cash";
    } else if (paymentMethod === "transfer") {
      return "Transfer";
    } else {
      return "Bon (Hutang)";
    }
  };

  return (
    <div
      ref={billRef}
      className="max-w-[88mm] mx-auto overflow-hidden bg-white rounded-lg shadow-md">
      <div className="p-4">
        <div className="flex items-center justify-center w-full">
          <img
            src={Logo}
            alt="Logo"
            className="w-[30] h-[30px] cursor-pointer"
          />
        </div>

        <div>
          <p className="text-[10px] text-center mt-2">
            Jl. Magelang No.6,3, Mlati Dukuh, Sinduadi, Kec. Mlati, Kabupaten
            Sleman, Daerah Istimewa Yogyakarta 55284
          </p>

          <p className="text-[10px] text-center mt-1 font-semibold">
            +62 821-2222-3333</p>
        </div>

        <div className="mt-0">
          <div className="text-center font-extralight text-md">
            ------------------------------------
          </div>

          <div className="flex items-center justify-between w-full px-[3px] -mt-2">
            <p className="text-[8px]">{formattedDate}</p>
            <p className="text-[8px]">{trxData?.customer}</p>
          </div>

          <div className="my-0 -mt-[10px] text-center font-extralight text-md h-[10px]">
            ------------------------------------
          </div>
          <div id="itemList" className="px-1 my-2">
            {items.map((item, index) => (
              <div key={index} className="flex items-center justify-between text-xs h-[25px]">
                <div className="w-[65%] flex flex-wrap items-center">
                  <span className="text-[10px] w-full font-semibold">{item.name}</span>
                  <span className="text-[10px] w-full -mt-1">({item.barcode})</span>
                </div>
                <div className="">
                  <span className="text-[10px] flex">
                    x {item.qty}
                  </span>
                </div>
                <div className="">
                  <span className="text-[10px]">
                    {formatNumber(item.total_unit_price)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <h2 className="text-center font-extralight text-md h-[15px] -mt-4">
          ------------------------------------
        </h2>

        {/* summaries */}
        <div className="">
          {
            trxData?.description && (
              <div className="flex justify-start mb-2 text-xs font-bold">
                <div className="h-[13px] text-start">
                  <span className="text-[8px]">Keterangan&nbsp;&nbsp;&nbsp;:</span>
                </div>
                <div className="h-full text-start">
                  <span className="text-[8px] font-normal text-justify leading-[0px]">&nbsp;&nbsp;{trxData.description}</span>
                </div>
              </div>
            )
          }

          <div className="flex justify-end mt-0 text-xs font-bold">
            <div className="w-full h-[13px] text-end">
              <span className="text-[8px]">Total&nbsp;&nbsp;&nbsp;:</span>
            </div>
            <div className="w-[25%] text-end h-[13px]">
              <span className="text-[8px]">{formatNumber(total)}</span>
            </div>
          </div>

          <div className="flex justify-end mt-0 text-xs font-bold">
            <div className="w-full h-[13px] text-end">
              <span className="text-[8px]">
                {renderPaymentMethod()}&nbsp;&nbsp;&nbsp;:
              </span>
            </div>
            <div className="w-[25%] text-end h-[13px]">
              <span className="text-[8px]">{formatNumber(uang)}</span>
            </div>
          </div>

          <div className="flex justify-end mt-0 text-xs font-bold">
            <div className="w-full h-[13px] text-end">
              <span className="text-[8px]">Kembali&nbsp;&nbsp;&nbsp;:</span>
            </div>
            <div className="w-[25%] text-end h-[13px]">
              <span className="text-[8px]">{formatNumber(kembalian)}</span>
            </div>
          </div>
        </div>


        <h1 className="mt-4 text-center font-semibold italic underline text-[10px]">Terimakasih</h1>
      </div>

    </div >
  );
});

export default Invoice;
