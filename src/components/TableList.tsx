import { useEffect, useState } from "react";
import IconTrash from "@/assets/icons/trash.svg";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import dummyData from "@/mockup/items.json";
import { useAppContext } from "@/provider/useAppContext";
import Lottie from "lottie-react";
import noDataAnimation from "@/assets/lottie/no-data.json";
// import { useAppContext } from "@/provider/useAppContext";

const COLUMN_WIDTHS = {
  number: "w-[2%]",
  name: "w-[43%]",
  modal: "w-[12%]",
  market: "w-[12%]",
  pcs: "w-[5%]",
  unitPrice: "w-[12%]",
  totalPrice: "w-[10%]",
};

const CustomTableHeader = () => (
  <div className="flex bg-white drop-shadow-lg my-2 rounded-tl-[10px] rounded-tr-[10px]">
    <div className={`${COLUMN_WIDTHS.number} p-2 font-bold text-[20px]`}>#</div>
    <div className={`${COLUMN_WIDTHS.name} p-2 font-bold text-[20px]`}>
      Nama Produk
    </div>
    <div className={`${COLUMN_WIDTHS.modal} p-2 font-bold text-[20px]`}>
      Modal
    </div>
    <div className={`${COLUMN_WIDTHS.market} p-2 font-bold text-[20px]`}>
      Pasaran
    </div>
    <div className={`${COLUMN_WIDTHS.pcs} p-2 font-bold text-[20px]`}>Pcs</div>
    <div className={`${COLUMN_WIDTHS.unitPrice} p-2 font-bold text-[20px]`}>
      Harga Satuan
    </div>
    <div className={`${COLUMN_WIDTHS.totalPrice} p-2 font-bold text-[20px]`}>
      Total Harga
    </div>
  </div>
);

interface CustomTableRowProps {
  rowData: any;
  index: number;
  onDelete: (index: number) => void;
}
const CustomTableRow = ({ rowData, index, onDelete }: CustomTableRowProps) => {
  const bgColor = index % 2 === 0 ? "bg-[#DDEEFF]" : "bg-[#fff]";

  return (
    <div className={`flex items-center border ${bgColor}`}>
      <div className={`${COLUMN_WIDTHS.number} p-2 mt-[-24px] text-[20px]`}>
        {index + 1}
      </div>
      <div className={`${COLUMN_WIDTHS.name} p-2`}>
        <div className="flex flex-wrap">
          <p className="font-bold text-[20px]">
            {rowData.name}
            <span className="font-normal"> | {rowData.barcode}</span>
          </p>
          <p className="text-[#000] w-full text-[20px]">
            {rowData.brand} | {rowData.guarantee} | {rowData.category}
          </p>
        </div>
      </div>
      <div className={`${COLUMN_WIDTHS.modal} p-2`}>
        <div className="flex flex-wrap">
          <p className="font-bold text-[20px]">{rowData.modal}</p>
          <p className="text-[#000] w-full text-[20px]">
            {rowData.lastUpdatedModal}
          </p>
        </div>
      </div>
      <div className={`${COLUMN_WIDTHS.market} p-2`}>
        <div className="flex flex-wrap">
          <p className="font-bold text-[20px]">{rowData.pasaran}</p>
          <p className="text-[#000] w-full text-[20px]">
            {rowData.lastUpdatedPasaran}
          </p>
        </div>
      </div>
      <div className={`${COLUMN_WIDTHS.pcs} p-2`}>
        <input
          defaultValue={1}
          type="text"
          className=" w-[30px] font-normal border-[0.4px] border-solid border-black text-[20px]"
        />
      </div>
      <div className={`${COLUMN_WIDTHS.unitPrice} p-2`}>
        <div className="flex gap-2">
          <p className="font-normal text-[20px]">Rp</p>
          <input
            defaultValue={rowData.unitPrice}
            type="text"
            className=" w-[110px] font-normal border-[0.4px] border-solid border-black text-[20px]"
          />
        </div>
      </div>
      <div className={`${COLUMN_WIDTHS.totalPrice} p-2 text-[20px]`}>
        Rp {rowData.pcs * rowData.unitPrice}
      </div>
      <div className="p-2">
        <img
          src={IconTrash}
          alt="Icon Trash"
          className="w-[30px] h-[30px] cursor-pointer"
          onClick={() => onDelete(index)}
        />
      </div>
    </div>
  );
};

function TableList() {
  const { tabs, customerTrx, setCustomerTrx } = useAppContext();

  // Find the active tab
  const activeTab = tabs.find((tab) => tab.active);

  // Ensure there is an active tab and get its index
  const activeTabIndex = activeTab ? tabs.indexOf(activeTab) : 0;

  // Use the items from the customer transaction corresponding to the active tab
  const items = customerTrx[activeTabIndex]?.items || [];

  const [data, setData] = useState(items);

  useEffect(() => {
    setData(items);
  }, [items]);

  const handleDelete = (index: number) => {
    const newData = data.filter((_, i) => i !== index);
    setData(newData);

    // Update the customerTrx state to reflect the deletion
    const newCustomerTrx = [...customerTrx];
    newCustomerTrx[activeTabIndex].items = newData;
    setCustomerTrx(newCustomerTrx);
  };

  return (
    <div className="flex flex-col border-b-4">
      <CustomTableHeader />
      <ScrollArea className="h-[410px] w-full">
        {data.length === 0 && (
          <div className="flex flex-wrap items-center justify-center w-full h-[350px]">
            <div className="w-full mt-[4rem]">
              <Lottie
                style={{ width: 150, margin: "auto" }}
                animationData={noDataAnimation}
                loop={true}
                autoPlay
              />
            </div>
            <div className="-mt-[6rem]">
              <p className="text-[16px] text-center text-gray-600">
                Silahkan tambahkan item dengan menekan tombol <br />
                <span className="font-bold">Barcode</span> atau{" "}
                <span className="font-bold">Cari Item</span>
              </p>
            </div>
          </div>
        )}
        {data.map((row, index) => (
          <CustomTableRow
            key={index}
            rowData={row}
            index={index}
            onDelete={handleDelete}
          />
        ))}
        <ScrollBar orientation="vertical" />
      </ScrollArea>
    </div>
  );
}

export default TableList;
