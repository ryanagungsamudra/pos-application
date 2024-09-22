import CarouselBanner from "@/components/CarouselBanner";
import Navbar from "@/components/Navbar";
import TableList from "@/components/TableList";
import { formatCurrency } from "@/lib/utils";
import { useAppContext } from "@/provider/useAppContext";

function Customer() {
  const { tabs, customerTrx } = useAppContext();

  // Find the active tab
  const activeTab = tabs.find((tab) => tab.active);

  // Ensure there is an active tab and get its index
  const activeTabIndex = activeTab ? tabs.indexOf(activeTab) : 0;

  // Use the items from the customer transaction corresponding to the active tab
  const items = customerTrx[activeTabIndex] || [];

  return (
    <div className="p-[1.2%]">
      <div className="flex justify-between w-full gap-8">
        <div className="w-[55%]">
          <CarouselBanner />
        </div>
        <div className="w-[45%] h-full">
          <Navbar dropdownShown={false} />
          <TableList customerPanel={true} />
        </div>
      </div>

      <div className="flex justify-between w-full gap-8">
        <div className="w-[55%] mt-8">
          <div className="flex items-center">
            <div className="w-[200px] h-[44px] rounded-[10px] bg-[#DDEDFF] flex items-center justify-between p-[5px] pl-[12px]">
              <p className="text-[20px] font-semibold text-black">Pembayaran</p>
            </div>

            <div className="text-[20px] pl-4 font-medium uppercase">
              : {items?.payment_method}
            </div>
          </div>

          <div className="flex items-center pt-4">
            <div className="w-[200px] h-[44px] rounded-[10px] bg-[#DDEDFF] flex items-center justify-between p-[5px] pl-[12px]">
              <p className="text-[20px] font-semibold text-black">Keterangan</p>
            </div>

            <div className="text-[20px] pl-4 font-medium capitalize">
              : {items?.description}
            </div>
          </div>
        </div>

        <div className="w-[45%] mt-4">
          <div className="w-full p-4 h-140px">
            {customerTrx[activeTabIndex] && (
              <>
                <div className="flex justify-between w-full bg-[#cdba41] items-center px-3 rounded-[10px]">
                  <p className="text-[26px] font-semibold">Total</p>
                  <p className="text-[40px] font-semibold">
                    {customerTrx[activeTabIndex].total
                      ? formatCurrency(customerTrx[activeTabIndex].total)
                      : ""}
                  </p>
                </div>
                <div className="flex justify-between w-full bg-[#c4bad9] items-center px-3 rounded-[10px] my-2">
                  <p className="text-[20px] font-normal">Uang</p>
                  <div className="flex gap-2">
                    <p className="text-[30px] font-normal">
                      {formatCurrency(customerTrx[activeTabIndex].cash)}
                    </p>
                  </div>
                </div>
                <div className="flex justify-between w-full bg-[#5dc7bd] items-center px-3 rounded-[10px]">
                  <p className="text-[20px] font-normal">Kembalian</p>
                  <p className="text-[30px] font-normal">
                    {customerTrx[activeTabIndex].money_change
                      ? formatCurrency(customerTrx[activeTabIndex].money_change)
                      : 0}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Customer;
