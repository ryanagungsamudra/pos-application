// @ts-nocheck

import IconTrash from "@/assets/icons/trash.svg";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useAppContext } from "@/provider/useAppContext";
import Lottie from "lottie-react";
import noDataAnimation from "@/assets/lottie/no-data.json";
import { Item } from "@/provider/AppContext";
import { formatCurrency, formatDate } from "@/lib/utils";
import { InputNumeric } from "./ui/input-numeric";
import { useEffect, useRef, memo, useMemo, useCallback } from "react";

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
  inputRef?: (instance: HTMLInputElement | null) => void;
}
const CustomTableRow = ({
  customerPanel,
  columns,
  rowData,
  index,
  onDelete,
  onUpdate,
  inputRef,
}: CustomTableRowProps) => {
  const bgColor = index % 2 === 0 ? "bg-[#DDEEFF]" : "bg-[#fff]";

  const handleQtyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQty = parseInt(e.target.value, 10) || 0; // Parse input value as integer
    const newTotalUnitPrice = newQty * rowData.unit_price; // Calculate the new total price based on the unit price
    onUpdate(index, { qty: newQty, total_unit_price: newTotalUnitPrice }); // Update the item
  };

  const handleUnitPriceChange = (newUnitPrice: number) => {
    const newTotalUnitPrice = newUnitPrice * rowData.qty; // Calculate new total price based on the quantity
    onUpdate(index, { unit_price: newUnitPrice, total_unit_price: newTotalUnitPrice }); // Update the item
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
            {[
              !customerPanel ? rowData.brand : null,
              rowData.guarantee,
              !customerPanel ? rowData.type : rowData.barcode
            ]
              .filter(Boolean)  // Filter out empty or null values
              .join(" | ")      // Join the non-empty values with " | "
            }
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
              <p className="font-bold text-[20px]">{rowData.market || ''}</p>
              <p className="text-[#000] w-full text-[20px]">
                {rowData.market_updated_at ? formatDate(rowData.market_updated_at) : ''}
              </p>
            </div>
          </div>
        </>
      )}
      <div className={`${columns.pcs} p-2`}>
        {!customerPanel ? (
          <input
            onChange={handleQtyChange}
            value={rowData.qty != null ? String(rowData.qty) : '0'}
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
              ref={inputRef}
              value={rowData.unit_price || 0}
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
// Custom equality check function to control re-rendering
const areEqual = (
  prevProps: CustomTableRowProps,
  nextProps: CustomTableRowProps
) => {
  return (
    prevProps.rowData.qty === nextProps.rowData.qty &&
    prevProps.rowData.unit_price === nextProps.rowData.unit_price &&
    prevProps.rowData.total_unit_price === nextProps.rowData.total_unit_price &&
    prevProps.index === nextProps.index &&
    prevProps.customerPanel === nextProps.customerPanel &&
    JSON.stringify(prevProps.columns) === JSON.stringify(nextProps.columns)
  );
};
const MemoizedCustomTableRow = memo(CustomTableRow, areEqual);

function TableList({ customerPanel = false }: { customerPanel?: boolean }) {
  const { tabs, customerTrx, setCustomerTrx, enterCount, setEnterCount } = useAppContext();

  // Active tab and index
  const activeTab = useMemo(() => tabs.find((tab) => tab.active), [tabs]);
  const activeTabIndex = useMemo(() => (activeTab ? tabs.indexOf(activeTab) : 0), [activeTab, tabs]);
  const items = useMemo(() => customerTrx[activeTabIndex]?.items || [], [customerTrx, activeTabIndex]);

  // Column widths memoized
  const COLUMN_WIDTHS = useMemo(() => ({
    number: !customerPanel ? "w-[2%]" : "w-[5%]",
    name: !customerPanel ? "w-[43%]" : "w-[60%]",
    modal: !customerPanel ? "w-[12%]" : "w-[0%]",
    market: !customerPanel ? "w-[12%]" : "w-[0%]",
    pcs: !customerPanel ? "w-[5%]" : "w-[15%]",
    unitPrice: !customerPanel ? "w-[12%]" : "w-[0%]",
    totalPrice: !customerPanel ? "w-[10%]" : "w-[15%]",
  }), [customerPanel]);

  const setInputRef = useCallback(
    (index: number, ref: HTMLInputElement | null) => {
      inputRefs.current[index] = ref;
    },
    [] // Dependencies, empty because you don't need to recalculate this function on updates.
  );

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Update customer transaction
  const updateItems = useCallback((newItems: Item[]) => {
    setCustomerTrx((prev) => {
      const newCustomerTrx = [...prev];
      newCustomerTrx[activeTabIndex] = {
        ...newCustomerTrx[activeTabIndex],
        items: [...newItems], // Ensure immutability here
      };
      return newCustomerTrx;
    });

  }, [setCustomerTrx, activeTabIndex]);

  const modifyItem = useCallback((index: number, updatedProperties: Partial<Item>) => {
    const updatedItems = items.map((item, i) => i === index ? { ...item, ...updatedProperties } : item);
    updateItems(updatedItems);
  }, [items, updateItems]);

  const handleDelete = useCallback((index: number) => {
    updateItems(items.filter((_, i) => i !== index));
  }, [items, updateItems]);

  // Handle Enter key for unit price input navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Check for zero unit price on every keydown
      const hasZeroUnitPrice = items.some(
        (item) => item.unit_price === 0 || !item.unit_price
      );

      if (event.key === "Enter" && hasZeroUnitPrice) {
        const currentInput = inputRefs.current[enterCount];

        // Ensure the input exists before focusing and selecting
        if (currentInput) {
          currentInput.focus();
          currentInput.select();
        }

        // Update the enterCount, cycling back to 0 if it reaches the end of the items array
        setEnterCount((prevCount) => (prevCount + 1) % items.length);
      }
    };

    // Add event listener for keydown
    window.addEventListener("keydown", handleKeyDown);

    // Cleanup event listener
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [enterCount, items, setEnterCount]);

  return (
    <div className="flex flex-col border-b-4">
      <CustomTableHeader customerPanel={customerPanel} columns={COLUMN_WIDTHS} />
      {items.length === 0 ? (
        <div className="flex flex-wrap items-center justify-center w-full h-[400px]">
          <div className="w-full mt-[4rem]">
            <Lottie style={{ width: 150, margin: "auto" }} animationData={noDataAnimation} loop={false} />
          </div>
          <div className="-mt-[6rem]">
            <p className="text-[16px] text-center text-gray-600">
              Silahkan tambahkan item dengan menekan tombol <br />
              <span className="font-bold">Barcode</span> atau <span className="font-bold">Cari Item</span>
            </p>
          </div>
        </div>
      ) : (
        <ScrollArea className="h-[400px] w-full">
          {items.map((row, index) => (
            <CustomTableRow
              columns={COLUMN_WIDTHS}
              customerPanel={customerPanel}
              key={index}
              rowData={row}
              index={index}
              onDelete={handleDelete}
              onUpdate={modifyItem}
              inputRef={(ref) => setInputRef(index, ref)}
            />
          ))}
          <ScrollBar orientation="vertical" />
        </ScrollArea>
      )}
    </div>
  );
}

export default memo(TableList);