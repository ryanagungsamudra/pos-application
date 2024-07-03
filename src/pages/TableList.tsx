import IconTrash from "@/assets/icons/trash.svg";

const COLUMN_WIDTHS = {
  number: "w-[2%]",
  name: "w-[49%]",
  modal: "w-[8%]",
  market: "w-[8%]",
  pcs: "w-[5%]",
  unitPrice: "w-[12%]",
  totalPrice: "w-[10%]",
};

const data = [
  [
    "1",
    "Kampas Rem | 8382313",
    "@SFD",
    "GDSD",
    "GDSD",
    "Rp 5.000.000",
    "Rp 90.900.000",
  ],
  [
    "2",
    "Kampas Rem | 8382313",
    "@SFD",
    "GDSD",
    "GDSD",
    "Rp 5.000.000",
    "Rp 90.900.000",
  ],
  [
    "3",
    "Kampas Rem | 8382313",
    "@SFD",
    "GDSD",
    "GDSD",
    "Rp 5.000.000",
    "Rp 90.900.000",
  ],
  [
    "4",
    "Kampas Rem | 8382313",
    "@SFD",
    "GDSD",
    "GDSD",
    "Rp 5.000.000",
    "Rp 90.900.000",
  ],
  [
    "5",
    "Kampas Rem | 8382313",
    "@SFD",
    "GDSD",
    "GDSD",
    "Rp 5.000.000",
    "Rp 90.900.000",
  ],
];

const CustomTableHeader = () => {
  return (
    <div className="flex bg-white drop-shadow-lg my-2 rounded-tl-[10px] rounded-tr-[10px]">
      <div className={`${COLUMN_WIDTHS.number} p-2 font-bold`}>#</div>
      <div className={`${COLUMN_WIDTHS.name} p-2 font-bold`}>Nama Produk</div>
      <div className={`${COLUMN_WIDTHS.modal} p-2 font-bold`}>Modal</div>
      <div className={`${COLUMN_WIDTHS.market} p-2 font-bold`}>Pasaran</div>
      <div className={`${COLUMN_WIDTHS.pcs} p-2 font-bold`}>Pcs</div>
      <div className={`${COLUMN_WIDTHS.unitPrice} p-2 font-bold`}>
        Harga Satuan
      </div>
      <div className={`${COLUMN_WIDTHS.totalPrice} p-2 font-bold`}>
        Total Harga
      </div>
    </div>
  );
};

const CustomTableRow = ({
  rowData,
  index,
}: {
  rowData: string[];
  index: number;
}) => {
  const bgColor = index % 2 === 0 ? "bg-[#DDEEFF]" : "bg-[#fff]";

  return (
    <div className={`flex items-center border ${bgColor}`}>
      <div className={`${COLUMN_WIDTHS.number} p-2 mt-[-24px]`}>
        {rowData[0]}
      </div>
      <div className={`${COLUMN_WIDTHS.name} p-2`}>
        <div className="flex flex-wrap">
          <p className="font-bold">{rowData[1]}</p>
          <p className="text-[#000] w-full">
            Toyota | 3 Bulan | Avanza, Innova
          </p>
        </div>
      </div>
      <div className={`${COLUMN_WIDTHS.modal} p-2`}>
        <div className="flex flex-wrap">
          <p className="font-bold">{rowData[2]}</p>
          <p className="text-[#000] w-full">01-02-2024</p>
        </div>
      </div>
      <div className={`${COLUMN_WIDTHS.market} p-2`}>
        {" "}
        <div className="flex flex-wrap">
          <p className="font-bold">{rowData[3]}</p>
          <p className="text-[#000] w-full">22-11-2024</p>
        </div>
      </div>
      <div className={`${COLUMN_WIDTHS.pcs} p-2`}>
        <input
          type="text"
          className=" w-[30px] font-normal border-[0.4px] border-solid border-black"
        />
      </div>
      <div className={`${COLUMN_WIDTHS.unitPrice} p-2`}>
        <div className="flex gap-2">
          <p className="font-normal">Rp</p>
          <input
            type="text"
            className=" w-[110px] font-normal border-[0.4px] border-solid border-black"
          />
        </div>
      </div>
      <div className={`${COLUMN_WIDTHS.totalPrice} p-2`}>{rowData[6]}</div>
      <div className="p-2">
        <img
          src={IconTrash}
          alt="Icon Trash"
          className="w-[30px] h-[30px] cursor-pointer"
        />
      </div>
    </div>
  );
};

function TableList() {
  return (
    <div>
      <div className="">
        <div className="flex flex-col">
          <CustomTableHeader />
          {data.map((row, index) => (
            <CustomTableRow key={index} rowData={row} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default TableList;
