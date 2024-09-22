import IconTrash from "@/assets/icons/trash.svg";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useAppContext } from "@/provider/useAppContext";
import Lottie from "lottie-react";
import noDataAnimation from "@/assets/lottie/no-data.json";
import { Item } from "@/provider/AppContext";
import { formatCurrency, formatDate } from "@/lib/utils";
import { InputNumeric } from "./ui/input-numeric";
import { useRef } from "react";
// import { useAppContext } from "@/provider/useAppContext";

const CustomTableHeader = ({
  customerPanel,
  columns,
}: {
  customerPanel?: boolean;
  columns: string[];
}) => {
  return (
    <div className="flex bg-white drop-shadow-lg my-2 rounded-tl-[10px] rounded-tr-[10px]">
      <div className={`${columns.number} p-2 font-bold text-[20px]`}>#</div>
      <div className={`${columns.name} p-2 font-bold text-[20px]`}>
        Nama Produk
      </div>
      {!customerPanel && (
        <>
          <div className={`${columns.modal} p-2 font-bold text-[20px]`}>
            Modal
          </div>
          <div className={`${columns.market} p-2 font-bold text-[20px]`}>
            Pasaran
          </div>
        </>
      )}
      <div className={`${columns.pcs} p-2 font-bold text-[20px]`}>
        {!customerPanel ? "Pcs" : "Jumlah"}
      </div>
      {!customerPanel && (
        <div className={`${columns.unitPrice} p-2 font-bold text-[20px]`}>
          Harga Satuan
        </div>
      )}
      <div className={`${columns.totalPrice} p-2 font-bold text-[20px]`}>
        {!customerPanel ? "Total Harga" : "Harga"}
      </div>
    </div>
  );
};

interface CustomTableRowProps {
  customerPanel?: boolean;
  columns: string[];
  rowData: Item;
  index: number;
  onDelete: (index: number) => void;
  onUpdate: (index: number, updatedProperties: Partial<Item>) => void;
}
const CustomTableRow = ({
  customerPanel,
  columns,
  rowData,
  index,
  onDelete,
  onUpdate,
}: CustomTableRowProps) => {
  const bgColor = index % 2 === 0 ? "bg-[#DDEEFF]" : "bg-[#fff]";

  const handleQtyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQty = parseInt(e.target.value, 10) || 0;
    const newTotalUnitPrice = newQty * rowData.unit_price;
    onUpdate(index, { qty: newQty, total_unit_price: newTotalUnitPrice });
  };

  const handleUnitPriceChange = (newUnitPrice: number) => {
    const newTotalUnitPrice = newUnitPrice * rowData.qty;
    onUpdate(index, {
      unit_price: newUnitPrice,
      total_unit_price: newTotalUnitPrice,
    });
  };

  return (
    <div className={`flex items-center border ${bgColor}`}>
      <div className={`${columns.number} p-2 mt-[-24px] text-[20px]`}>
        {index + 1}
      </div>
      <div className={`${columns.name} p-2`}>
        <div className="flex flex-wrap">
          <p className="font-bold text-[20px]">
            {rowData.name}
            <span className="font-normal">
              {" "}
              {!customerPanel ? "| " + rowData.barcode : ""}
            </span>
          </p>
          <p className="text-[#000] w-full text-[20px]">
            {!customerPanel ? rowData.brand + " |" : ""} {rowData.guarantee} |{" "}
            {!customerPanel ? rowData.type : rowData.barcode}
          </p>
        </div>
      </div>
      {!customerPanel && (
        <>
          <div className={`${columns.modal} p-2`}>
            <div className="flex flex-wrap">
              <p className="font-bold text-[20px]">{rowData.product_code}</p>
              <p className="text-[#000] w-full text-[20px]">
                {formatDate(rowData.product_code_updated_at)}
              </p>
            </div>
          </div>
          <div className={`${columns.market} p-2`}>
            <div className="flex flex-wrap">
              <p className="font-bold text-[20px]">{rowData.market}</p>
              <p className="text-[#000] w-full text-[20px]">
                {formatDate(rowData.market_updated_at)}
              </p>
            </div>
          </div>
        </>
      )}
      <div className={`${columns.pcs} p-2`}>
        {!customerPanel ? (
          <input
            onChange={handleQtyChange}
            value={rowData.qty ? String(rowData.qty) : 0}
            type="text"
            className=" w-[30px] font-normal border-[0.4px] border-solid border-black text-[20px]"
          />
        ) : (
          <p className="text-center">{rowData.qty}</p>
        )}
      </div>
      {!customerPanel && (
        <div className={`${columns.unitPrice} p-2`}>
          <div className="flex gap-2">
            <p className="font-normal text-[20px]">Rp</p>
            <InputNumeric
              value={rowData.unit_price}
              onChange={handleUnitPriceChange}
              className=" w-[110px] font-normal border-[0.4px] border-solid border-black text-[20px]"
            />
          </div>
        </div>
      )}
      <div className={`${columns.totalPrice} p-2 text-[20px]`}>
        {rowData.total_unit_price
          ? formatCurrency(rowData.total_unit_price)
          : ""}
      </div>

      {!customerPanel && (
        <div className="p-2">
          <img
            src={IconTrash}
            alt="Icon Trash"
            className="w-[30px] h-[30px] cursor-pointer"
            onClick={() => onDelete(index)}
          />
        </div>
      )}
    </div>
  );
};

function TableList({ customerPanel = false }: { customerPanel?: boolean }) {
  const { tabs, customerTrx, setCustomerTrx } = useAppContext();

  // Find the active tab
  const activeTab = tabs.find((tab) => tab.active);

  // Ensure there is an active tab and get its index
  const activeTabIndex = activeTab ? tabs.indexOf(activeTab) : 0;

  // Use the items from the customer transaction corresponding to the active tab
  const items = customerTrx[activeTabIndex]?.items || [];

  // Function to update items
  const updateItems = (newItems: Item[]) => {
    const newCustomerTrx = [...customerTrx];
    newCustomerTrx[activeTabIndex] = {
      ...newCustomerTrx[activeTabIndex],
      items: newItems,
    };
    setCustomerTrx(newCustomerTrx);
  };

  // Function to modify an item
  const modifyItem = (index: number, updatedProperties: Partial<Item>) => {
    const updatedItems = items.map((item, i) =>
      i === index ? { ...item, ...updatedProperties } : item
    );
    updateItems(updatedItems);
  };

  const handleDelete = (index: number) => {
    const newData = items.filter((_, i) => i !== index);

    // Update the customerTrx state to reflect the deletion
    const newCustomerTrx = [...customerTrx];
    newCustomerTrx[activeTabIndex].items = newData;
    setCustomerTrx(newCustomerTrx);
  };

  const COLUMN_WIDTHS = {
    number: !customerPanel ? "w-[2%]" : "w-[5%]",
    name: !customerPanel ? "w-[43%]" : "w-[60%]",
    modal: !customerPanel ? "w-[12%]" : "w-[0%]",
    market: !customerPanel ? "w-[12%]" : "w-[0%]",
    pcs: !customerPanel ? "w-[5%]" : "w-[15%]",
    unitPrice: !customerPanel ? "w-[12%]" : "w-[0%]",
    totalPrice: !customerPanel ? "w-[10%]" : "w-[15%]",
  };

  // Handle enter shortcut
  const inputRefs = useRef([]);
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      const currentIndex = e.target.dataset.index;
      if (inputRefs.current[currentIndex]) {
        inputRefs.current[currentIndex].focus();
        inputRefs.current[currentIndex].select();
      }
    }
  };

  return (
    <div className="flex flex-col border-b-4">
      <CustomTableHeader
        customerPanel={customerPanel}
        columns={COLUMN_WIDTHS}
      />
      <ScrollArea className="h-[410px] w-full">
        {items.length === 0 && (
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
        {items.map((row, index) => (
          <CustomTableRow
            columns={COLUMN_WIDTHS}
            customerPanel={customerPanel}
            key={index}
            rowData={row}
            index={index}
            onDelete={handleDelete}
            onUpdate={modifyItem}
          />
        ))}
        <ScrollBar orientation="vertical" />
      </ScrollArea>
    </div>
  );
}

export default TableList;
