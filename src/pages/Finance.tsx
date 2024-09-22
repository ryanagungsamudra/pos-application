import { formatCurrency } from "@/lib/utils";
import { useAppContext } from "@/provider/useAppContext";
import { useEffect, useState } from "react";

function Finance() {
  const { tabs, customerTrx } = useAppContext();

  // Find the active tab
  const activeTab = tabs.find((tab) => tab.active);

  // Ensure there is an active tab and get its index
  const activeTabIndex = activeTab ? tabs.indexOf(activeTab) : 0;

  // Use the items from the customer transaction corresponding to the active tab
  const items = customerTrx[activeTabIndex] || [];

  // State to hold the countdown time
  const [timeLeft, setTimeLeft] = useState(900); // 300 seconds = 5 minutes

  useEffect(() => {
    if (timeLeft <= 0) return; // Stop the countdown when it reaches 0

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timer); // Cleanup the timer on component unmount
  }, [timeLeft]);

  // Format the time left into minutes and seconds
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  return (
    <div className="grid h-screen grid-cols-2 grid-rows-2">
      <div className="flex flex-wrap items-start justify-center font-semibold text-white bg-gradient-to-r from-gray-100 to-gray-300">
        <div className="flex items-start justify-between w-full p-4">
          <p className="text-[25px] text-black">Komputer 1</p>
          <p className="text-black text-[20px]">
            {items.customer} - {formatTime(timeLeft)}
          </p>
        </div>

        <div className="flex flex-wrap justify-start w-[500px]">
          <div className="flex items-center mb-4">
            <div className="w-[200px] h-[44px] rounded-[10px] bg-primary-gradient flex items-center justify-between p-[5px] pl-[12px]">
              <p className="text-[20px] font-semibold text-white">Pembayaran</p>
            </div>

            <div className="text-[20px] pl-4 uppercase text-black font-bold">
              : {items?.payment_method}
            </div>
          </div>

          <div className="w-full h-140px drop-shadow-lg border-2 bg-white rounded-tr-[10px] rounded-tl-[10px] p-4">
            {customerTrx[activeTabIndex] && (
              <div className="text-black">
                <div className="flex justify-between w-full">
                  <p className="text-[26px] font-semibold">Total</p>
                  <p className="text-[26px] font-semibold">
                    {customerTrx[activeTabIndex].total
                      ? formatCurrency(customerTrx[activeTabIndex].total)
                      : ""}
                  </p>
                </div>
                <div className="flex justify-between w-full">
                  <p className="text-[20px] font-normal">Uang</p>
                  <div className="flex gap-2">
                    <p className="text-[20px] font-normal">Rp</p>
                    {formatCurrency(customerTrx[activeTabIndex].cash)}
                  </div>
                </div>
                <div className="mt-2 -mx-4">
                  <hr className="border-[#CFD1D3] border-1.2" />
                </div>
                <div className="flex justify-between w-full">
                  <p className="text-[20px] font-normal">Kembalian</p>
                  <p className="text-[20px] font-normal">
                    {customerTrx[activeTabIndex].money_change
                      ? formatCurrency(customerTrx[activeTabIndex].money_change)
                      : 0}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center font-semibold text-white bg-gradient-to-r from-blue-100 to-blue-300">
        <span className="text-red-500 text-[18px]">Belum ada pesanan</span>
      </div>
      <div className="flex items-center justify-center font-semibold text-white bg-gradient-to-r from-green-100 to-green-300">
        <span className="text-red-500 text-[18px]">Belum ada pesanan</span>
      </div>
      <div className="flex items-center justify-center font-semibold text-white bg-gradient-to-r from-purple-100 to-purple-300">
        <span className="text-red-500 text-[18px]">Belum ada pesanan</span>
      </div>
    </div>
  );
}

export default Finance;
