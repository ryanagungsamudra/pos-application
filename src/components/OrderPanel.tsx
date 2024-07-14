import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

// Icons
import IconSearch from "@/assets/icons/search.svg";
import IconTrash from "@/assets/icons/trash-white.svg";
import { useEffect, useRef, useState } from "react";
import { useFormattedNumber } from "@/lib/utils";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";

import { Check, CircleAlert, Plus, Search, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "./ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import { getItems } from "@/config/https/item";
import { useAppContext } from "@/provider/useAppContext";
import { Checkbox } from "./ui/checkbox";
import { getCustomers } from "@/config/https/customer";
import { Input } from "./ui/input";

function OrderPanel() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: items } = useQuery({
    queryKey: ["items"],
    queryFn: getItems,
  });
  const { data: customers } = useQuery({
    queryKey: ["customers"],
    queryFn: getCustomers,
  });

  const [formattedUang, , handleUangChange] = useFormattedNumber(0);
  const [selectedOption, setSelectedOption] = useState("option-one");
  const [enterPressedInDialog, setEnterPressedInDialog] = useState(false);
  const [open, setOpen] = useState({
    customer: false,
    searchItem: false,
  });
  const checkoutRef = useRef<HTMLDivElement>(null);

  const openCustomerModal = () => {
    setOpen((prevOpen) => ({
      ...prevOpen,
      customer: !prevOpen.customer,
    }));
  };
  const openSearchItemModal = () => {
    setOpen((prevOpen) => ({
      ...prevOpen,
      searchItem: !prevOpen.searchItem,
    }));
  };
  const handleSubmit = () => {
    navigate("/customer");

    toast({
      variant: "success",
      title: "Checkout Berhasil!",
      description: "Silahkan lakukan pembayaran",
      duration: 2500,
    });
  };

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        if (!open.dialog) {
          checkoutRef.current?.click();
          setEnterPressedInDialog(true);
        } else if (enterPressedInDialog) {
          handleSubmit();
        } else {
          setEnterPressedInDialog(true);
        }
      }

      switch (event.key) {
        case "c":
          setSelectedOption("option-one");
          break;
        case "t":
          setSelectedOption("option-two");
          break;
        case "b":
          setSelectedOption("option-three");
          break;
        case "j":
          if (event.metaKey || event.ctrlKey) {
            event.preventDefault();
            openSearchItemModal();
          }
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [open.dialog, enterPressedInDialog]);

  useEffect(() => {
    if (!open.dialog) {
      setEnterPressedInDialog(false);
    }
  }, [open.dialog]);

  // Dynamic add items
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const { tabs, customerTrx, setCustomerTrx } = useAppContext();
  // Find the active tab
  const activeTab = tabs.find((tab) => tab.active);

  const activeTabIndex = activeTab ? tabs.indexOf(activeTab) : 0;

  // CUSTOMER MODAL START
  const handleCustomerSelect = (customer) => {
    setSelectedCustomer(customer);
  };

  function getInitials(name: string): string {
    const names = name.split(" ");
    let initials = "";
    names.forEach((word) => {
      initials += word.charAt(0);
    });
    return initials.toUpperCase();
  }

  const handleCustomerDefault = () => {
    const newCustomerTrx = [...customerTrx];
    newCustomerTrx[activeTabIndex] = {
      ...newCustomerTrx[activeTabIndex],
      customer: "Reguler",
    };
    setCustomerTrx(newCustomerTrx);

    openCustomerModal();
  };

  const handleApplyCustomer = () => {
    const newCustomerTrx = [...customerTrx];
    newCustomerTrx[activeTabIndex] = {
      ...newCustomerTrx[activeTabIndex],
      customer: selectedCustomer.name,
    };
    setCustomerTrx(newCustomerTrx);
    setSelectedCustomer(null);

    openCustomerModal();
  };

  // adding new customer start
  const [addingNewCustomer, setAddingNewCustomer] = useState(false);
  const [newCustomerName, setNewCustomerName] = useState("");
  const [newCustomerPhone, setNewCustomerPhone] = useState("");
  const handleSaveNewCustomer = () => {
    if (newCustomerName && newCustomerPhone) {
      // Save new customer to state or context
      const newCustomer = { name: newCustomerName, phone: newCustomerPhone };
      // Replace this with actual state update logic for customerTrx
      setCustomerTrx([
        ...customerTrx,
        {
          customer: newCustomerName,
          items: [],
        },
      ]);
      handleCustomerSelect(newCustomer);
      handleApplyCustomer();
      setAddingNewCustomer(false); // Close the form
    } else {
      alert("Please enter name and phone number.");
    }
  };

  const handleDiscardNewCustomer = () => {
    setNewCustomerName("");
    setNewCustomerPhone("");
    setAddingNewCustomer(false); // Close the form
  };
  // adding new customer end
  // CUSTOMER MODAL END

  // ITEMS MODAL START
  const handleItemClick = (item) => {
    if (selectedItems.includes(item)) {
      setSelectedItems(selectedItems.filter((i) => i !== item));
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };

  const handleApplyItems = () => {
    const newCustomerTrx = [...customerTrx];
    newCustomerTrx[activeTabIndex].items.push(...selectedItems);
    setCustomerTrx(newCustomerTrx);
    setSelectedItems([]); // Reset selected items

    openSearchItemModal();
  };

  const handleDeleteAllItems = () => {
    const newCustomerTrx = [...customerTrx];
    console.log(newCustomerTrx[activeTabIndex]);

    newCustomerTrx[activeTabIndex].items = [];
    setCustomerTrx(newCustomerTrx);
  };
  // ITEMS MODAL END

  return (
    <div className="flex gap-5 mt-[0.2rem] -m-[1.2%] px-4 pt-3">
      <div className="flex flex-col gap-[11px]">
        {/* Vustomer */}
        <div className="w-[418px] h-[44px] rounded-[10px] bg-primary-gradient flex items-center justify-between p-[5px] pl-[12px]">
          <p className="text-[20px] font-semibold text-white">Customer</p>
          <Dialog open={open.customer} onOpenChange={openCustomerModal}>
            <DialogTrigger>
              <div className="flex items-center justify-center border-[0.3px] border-[#000] rounded-[10px] w-full px-3 h-[29px] cursor-pointer">
                <p className="text-[16px] font-medium py-[5px]">
                  {customerTrx[activeTabIndex]?.customer || "Pilih"}
                </p>
              </div>
            </DialogTrigger>
            {/* Customers modal starts here */}
            <DialogContent
              aria-describedby="search"
              className={`sm:max-w-[450px] ${
                addingNewCustomer ? "h-[300px]" : "h-[600px]"
              }`}>
              <DialogHeader>
                <DialogTitle>
                  {addingNewCustomer ? "Tambah Baru" : "Pilih Customer"}
                </DialogTitle>
                <DialogDescription>
                  Silahkan pilih customer jika sudah terdaftar, atau tambahkan
                </DialogDescription>
              </DialogHeader>
              {!addingNewCustomer && (
                <>
                  <div
                    className="flex items-center px-3 border-[0.2px] border-solid border-black rounded-md"
                    cmdk-input-wrapper="">
                    <Search className="w-4 h-4 mr-2 opacity-50 shrink-0" />
                    <input
                      placeholder="Cari customer..."
                      className="flex w-full py-3 text-sm bg-transparent rounded-md outline-none h-11 placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>
                  <div
                    className="flex items-center w-full gap-2 pl-2 cursor-pointer"
                    onClick={() => setAddingNewCustomer(true)}>
                    <div className="flex items-center w-[40px] h-[40px] p-[6px] border-2 border-dashed bg-[#F9FAFC] rounded-full">
                      <Plus className="text-black w-7 h-7" />
                    </div>
                    <p>Tambahkan customer baru</p>
                  </div>
                </>
              )}

              {/* Add new customer starts here */}
              {addingNewCustomer && (
                <div className="flex flex-col items-center mt-4">
                  <Input
                    type="text"
                    placeholder="Nama customer"
                    value={newCustomerName}
                    onChange={(e) => setNewCustomerName(e.target.value)}
                    className="w-full px-4 py-3 mt-2 text-sm bg-transparent border-b border-gray-400 focus:outline-none focus:border-blue-500"
                  />
                  <Input
                    type="text"
                    placeholder="Nomor telepon"
                    value={newCustomerPhone}
                    onChange={(e) => setNewCustomerPhone(e.target.value)}
                    className="w-full px-4 py-3 mt-2 text-sm bg-transparent border-b border-gray-400 focus:outline-none focus:border-blue-500"
                  />
                </div>
              )}
              {/* Add new customer ends here */}

              {!addingNewCustomer && (
                <ScrollArea className="h-full">
                  {customers?.data?.map((customer) => (
                    <div
                      key={customer.name}
                      onClick={() => handleCustomerSelect(customer)}
                      className={`flex items-center justify-between p-2 hover:bg-secondary-gradient hover:text-white cursor-pointer`}>
                      <div className="flex items-center gap-3">
                        <div className="w-[40px] h-[40px] bg-[#E4E7EC] flex items-center justify-center rounded-full p-5">
                          <p className="text-black">
                            {getInitials(customer.name)}
                          </p>
                        </div>
                        <div>
                          <p className="text-[16px] font-bold">
                            {customer.name}
                          </p>
                          <p>{customer.phone}</p>
                        </div>
                      </div>
                      <RadioGroup
                        value={selectedCustomer?.name}
                        onValueChange={handleCustomerSelect}
                        className="mr-4">
                        <input
                          type="radio"
                          value={customer.name}
                          checked={selectedCustomer?.name === customer.name}
                          onChange={() => handleCustomerSelect(customer)}
                          className={`peer sr-only`} // sr-only hides the default radio button visually
                        />
                        <div className="relative w-5 h-5 rounded-full border border-gray-400 bg-white cursor-pointer peer-checked:bg-[#fff] peer-checked:border-blue-500 focus:ring focus:ring-offset-2 focus:ring-blue-500 after:content-[''] after:absolute after:top-1/2 after:left-1/2 after:w-3 after:h-3 after:bg-transparent after:rounded-full after:transform after:translate-x-[-50%] after:translate-y-[-50%] peer-checked:after:bg-[#000]" />
                      </RadioGroup>
                    </div>
                  ))}
                </ScrollArea>
              )}

              <DialogFooter>
                {addingNewCustomer ? (
                  <div>
                    <Button
                      variant={"outline"}
                      className="w-[100px]"
                      type="button"
                      onClick={handleDiscardNewCustomer}>
                      Batal
                    </Button>
                    <Button
                      className="w-[100px]"
                      type="button"
                      onClick={handleSaveNewCustomer}>
                      Simpan
                    </Button>
                  </div>
                ) : (
                  <div>
                    <Button
                      type="button"
                      variant={"outline"}
                      onClick={handleCustomerDefault}>
                      Set Reguler
                    </Button>
                    <Button
                      type="button"
                      onClick={handleApplyCustomer}
                      disabled={!selectedCustomer}>
                      Pilih Customer
                    </Button>
                  </div>
                )}
              </DialogFooter>
            </DialogContent>
            {/* Customers modal ends here */}
          </Dialog>
        </div>

        {/* Keterangan */}
        <div>
          <div className="w-[418px] h-[44px] rounded-tl-[10px] rounded-tr-[10px] bg-primary-gradient flex items-center justify-between p-[5px] pl-[12px]">
            <p className="text-[20px] font-semibold text-white">Keterangan</p>
          </div>
          <div className="w-[418px] rounded-bl-[10px] rounded-br-[10px] drop-shadow-lg bg-white p-[12px]">
            <textarea className=" w-full h-full font-normal border-[0.4px] border-solid border-black text-[20px] rounded-[5px]" />
          </div>
        </div>
      </div>

      {/* Metode Pembayaran */}
      <div>
        <div className="w-[418px] h-[44px] rounded-tl-[10px] rounded-tr-[10px] bg-primary-gradient flex items-center justify-between p-[5px] pl-[12px]">
          <p className="text-[20px] font-semibold text-white">
            Metode Pembayaran
          </p>
        </div>
        <div className="w-[418px] rounded-bl-[10px] rounded-br-[10px] drop-shadow-lg bg-white p-[12px]">
          <RadioGroup
            defaultValue="option-one"
            value={selectedOption}
            onValueChange={setSelectedOption}
            className="flex gap-[12px]">
            <div
              onClick={() => setSelectedOption("option-one")}
              className={`flex justify-center items-center space-x-2 w-[104px] h-[60px] border-[1.1px] ${
                selectedOption === "option-one"
                  ? "border-[#7ABFFF]"
                  : "border-[#D1D3D5]"
              } rounded-[10px] cursor-pointer`}>
              <RadioGroupItem
                value="option-one"
                id="option-one"
                className={`${
                  selectedOption === "option-one"
                    ? "text-[#7ABFFF]"
                    : "text-[#000]"
                }`}
              />
              <Label
                htmlFor="option-one"
                className={`text-[18px] ${
                  selectedOption === "option-one" ? "text-[#7ABFFF]" : ""
                }`}>
                Cash
              </Label>
            </div>
            <div
              onClick={() => setSelectedOption("option-two")}
              className={`flex justify-center items-center space-x-2 w-[124px] h-[60px] border-[1.1px] ${
                selectedOption === "option-two"
                  ? "border-[#7ABFFF]"
                  : "border-[#D1D3D5]"
              } rounded-[10px] cursor-pointer`}>
              <RadioGroupItem
                value="option-two"
                id="option-two"
                className={`${
                  selectedOption === "option-two"
                    ? "text-[#7ABFFF]"
                    : "text-[#000]"
                }`}
              />
              <Label
                htmlFor="option-two"
                className={`text-[18px] ${
                  selectedOption === "option-two" ? "text-[#7ABFFF]" : ""
                }`}>
                Transfer
              </Label>
            </div>
            <div
              onClick={() => setSelectedOption("option-three")}
              className={`flex justify-center items-center space-x-2 w-[140px] h-[60px] border-[1.1px] ${
                selectedOption === "option-three"
                  ? "border-[#7ABFFF]"
                  : "border-[#D1D3D5]"
              } rounded-[10px] cursor-pointer`}>
              <RadioGroupItem
                value="option-three"
                id="option-three"
                className={`${
                  selectedOption === "option-three"
                    ? "text-[#7ABFFF]"
                    : "text-[#000]"
                }`}
              />
              <div>
                <Label
                  htmlFor="option-three"
                  className={`text-[18px] ${
                    selectedOption === "option-three" ? "text-[#7ABFFF]" : ""
                  }`}>
                  Bon
                </Label>
                <div className="flex items-center gap-1">
                  <input
                    type="text"
                    className="w-[34px] h-[18px] border-[0.4px] border-solid border-black"
                  />
                  <p>Hari</p>
                </div>
              </div>
            </div>
          </RadioGroup>
        </div>
      </div>

      {/* Toggle search & delete all */}
      <div className="w-[17%] flex justify-center">
        <div className="flex flex-col gap-[18px]">
          <div>
            <Dialog open={open.searchItem} onOpenChange={openSearchItemModal}>
              <DialogTrigger asChild>
                <div className="w-[60px] h-[60px] flex items-center justify-center bg-[#D9D9D9] rounded-full cursor-pointer">
                  <img
                    src={IconSearch}
                    alt="Icon Search"
                    className="w-[30px] h-[30px]"
                  />
                </div>
              </DialogTrigger>
              {/* Search modal starts here */}
              <DialogContent
                aria-describedby="search"
                className="sm:max-w-[600px] h-[500px]">
                <DialogHeader>
                  <DialogTitle>Pilih Produk</DialogTitle>
                  <DialogDescription>
                    Cari item yang anda inginkan. Klik tombol di bawah untuk
                    mencari
                  </DialogDescription>
                </DialogHeader>
                <div
                  className="flex items-center px-3 border-[0.2px] border-solid border-black rounded-md"
                  cmdk-input-wrapper="">
                  <Search className="w-4 h-4 mr-2 opacity-50 shrink-0" />
                  <input
                    placeholder="Cari item..."
                    className="flex w-full py-3 text-sm bg-transparent rounded-md outline-none h-11 placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
                <ScrollArea className="h-full">
                  {items?.data?.map((item) => (
                    <div
                      key={item.name}
                      onClick={() => handleItemClick(item)}
                      className={`flex items-center justify-between p-2 hover:bg-gray-200 cursor-pointer ${
                        selectedItems.includes(item) ? "bg-gray-200" : ""
                      }`}>
                      <p className="text-[16px] font-bold">
                        {item.name} |{" "}
                        <span className="font-normal">{item.barcode}</span>
                      </p>
                      <Checkbox
                        checked={selectedItems.includes(item)}
                        onChange={() => handleItemClick(item)}
                        className="mr-4 cursor-pointer"
                      />
                    </div>
                  ))}
                </ScrollArea>
                <DialogFooter>
                  <Button
                    type="button"
                    variant={"outline"}
                    onClick={() => setSelectedItems([])}
                    disabled={selectedItems.length > 0 ? false : true}>
                    Batalkan Pilihan
                  </Button>
                  <Button
                    type="button"
                    onClick={handleApplyItems}
                    disabled={selectedItems.length > 0 ? false : true}>
                    Simpan & Terapkan
                  </Button>
                </DialogFooter>
              </DialogContent>
              {/* Search modal ends here */}
            </Dialog>
            <p className="text-[16px] font-medium">Cari Item</p>
          </div>
          <div>
            <div
              onClick={handleDeleteAllItems}
              className="w-[60px] h-[60px] flex items-center justify-center bg-[#D9D9D9] rounded-full cursor-pointer">
              <img
                src={IconTrash}
                alt="Icon Trash"
                className="w-[30px] h-[30px]"
              />
            </div>
            <p className="text-[16px] font-medium">Delete all</p>
          </div>
        </div>
      </div>

      {/* Checkout */}
      <div className="w-full">
        <div className="w-full h-140px drop-shadow-lg border-2 bg-white rounded-tr-[10px] rounded-tl-[10px] p-4">
          <div className="flex justify-between w-full">
            <p className="text-[26px] font-semibold">Total</p>
            <p className="text-[26px] font-semibold">Rp 100.000.000</p>
          </div>
          <div className="flex justify-between w-full">
            <p className="text-[20px] font-normal">Uang</p>
            <div className="flex gap-2">
              <p className="text-[20px] font-normal">Rp</p>
              <input
                type="text"
                className="text-[20px] w-[120px] font-normal border-[0.4px] border-solid border-black"
                value={formattedUang}
                onChange={handleUangChange}
              />
            </div>
          </div>
          <div className="mt-2 -mx-4">
            <hr className="border-[#CFD1D3] border-1.2" />
          </div>
          <div className="flex justify-between w-full">
            <p className="text-[20px] font-normal">Kembalian</p>
            <p className="text-[20px] font-normal">Rp 40.000</p>
          </div>
        </div>
        <Dialog
          open={open.dialog}
          onOpenChange={(isOpen) =>
            setOpen((prevOpen) => ({ ...prevOpen, dialog: isOpen }))
          }>
          <DialogTrigger asChild>
            <div
              ref={checkoutRef}
              className="w-full h-[54px] bg-secondary-gradient flex items-center justify-center rounded-bl-[10px] rounded-br-[10px] cursor-pointer"
              tabIndex={0} // Ensuring the div can receive focus
            >
              <p className="text-[20px] font-bold text-white">Checkout</p>
            </div>
          </DialogTrigger>
          <DialogContent
            className="sm:max-w-[425px] bg-white"
            aria-describedby="dialog-description">
            <DialogHeader>
              <div className="flex items-center gap-2 -mt-2">
                <CircleAlert className="w-8 h-8 text-[#bf2d2d]" />
                <DialogTitle className="text-[22px] font-bold ">
                  Konfirmasi Checkout
                </DialogTitle>
              </div>
            </DialogHeader>
            <div className="">
              <h1 className="text-[20px] text-center font-normal">
                Apakah kamu yakin?
              </h1>
            </div>
            <DialogFooter>
              <div className="flex justify-center w-full gap-4 mt-2">
                <DialogClose asChild>
                  <Button
                    variant={"outline"}
                    className="bg-[#e45253] text-white w-[100px] h-[50px] hover:bg-[#e27a7a] hover:text-white rounded-[5px]"
                    tabIndex={-1} // Remove focus from this button
                  >
                    <X />
                  </Button>
                </DialogClose>
                <Button
                  type="submit"
                  onClick={handleSubmit}
                  className="bg-[#36c180] text-white w-[100px] h-[50px] hover:bg-[#8ff1c3] hover:text-white rounded-[5px]"
                  tabIndex={-1} // Remove focus from this button
                >
                  <Check />
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

export default OrderPanel;
