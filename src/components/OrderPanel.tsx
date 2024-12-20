
// @ts-nocheck

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

// Icons
import IconSearch from "@/assets/icons/search.svg";
import IconTrash from "@/assets/icons/trash-white.svg";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { formatCurrency, formatDate, useDebounce } from "@/lib/utils";

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
import { getCustomers, postCustomer } from "@/config/https/customer";
import { Input } from "./ui/input";
import { Item } from "@/provider/AppContext";
import { InputNumeric } from "./ui/input-numeric";
import { postTransaction } from "@/config/https/transaction";
import Invoice from "./Invoice";
import { useGetCodes } from "@/hooks/useGetCodes";

function OrderPanel() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: items, refetch: refetchItems } = useQuery({
    queryKey: ["items"],
    queryFn: getItems,
  });

  const { data: customers, refetch: refetchCustomers } = useQuery({
    queryKey: ["customers"],
    queryFn: getCustomers,
  });

  const {
    tabs,
    customerTrx,
    setCustomerTrx,
    showLoading,
    hideLoading,
    isBarcodeScannerActive,
    enterCount,
    setEnterCount,
    isKeyboardEnterPressed
  } = useAppContext();

  // useGetcodes
  const { getMaskedNumber } = useGetCodes();

  // Find the active tab
  const activeTabIndex = useMemo(() => {
    const activeTab = tabs.find((tab) => tab.active);
    return activeTab ? tabs.indexOf(activeTab) : 0;
  }, [tabs]);

  // Use the items from the customer transaction corresponding to the active tab
  const activeTabItems = useMemo(
    () => customerTrx[activeTabIndex]?.items || [],
    [customerTrx, activeTabIndex]
  );
  const [enterPressedInDialog, setEnterPressedInDialog] = useState(false);
  const [open, setOpen] = useState({
    customer: false,
    searchItem: false,
    dialog: false,
  });

  const [addingNewCustomer, setAddingNewCustomer] = useState(false);
  const [newCustomerName, setNewCustomerName] = useState("");
  const [newCustomerPhone, setNewCustomerPhone] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [selectedItems, setSelectedItems] = useState([]);

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

  const invoiceRef = useRef(); // Create a reference to the Invoice component

  const handlePrint = () => {
    invoiceRef?.current?.handlePrint(); // Call the handlePrint method in Invoice
  };

  const handleSubmit = useCallback(async () => {
    showLoading();

    if (customerTrx[activeTabIndex]?.money_change < 0) {
      toast({
        variant: "destructive",
        title: "Uang Kurang!",
        description: "Silahkan tambahkan uang",
        duration: 2500,
      });

      return hideLoading();
    }

    const dataTrx = customerTrx[activeTabIndex];
    const body = {
      items: dataTrx?.items?.map((item) => ({
        item_id: item.id,
        qty: item.qty,
        unit_price: item.unit_price,
        total_price: item.total_unit_price,
      })),
      payment_method: dataTrx?.payment_method,
      customer_id: dataTrx?.customerId,
      bon_duration: dataTrx?.bon_duration || 0,
      total_payment: dataTrx?.total,
      cash: dataTrx?.cash,
      money_change: dataTrx?.money_change,
      description: dataTrx?.description,
    };

    await postTransaction(body)
      .then((res) => {
        handlePrint();
        setOpen({ ...open, dialog: false });
        console.log("res", res);
        toast({
          variant: "success",
          title: "Checkout Berhasil!",
          description: "Silahkan lakukan pembayaran",
          duration: 2500,
        });

        hideLoading();
        navigate("/customer");
      })
      .catch((err) => {
        hideLoading();
        console.log("err", err);
        toast({
          variant: "destructive",
          title: "Checkout Gagal!",
          description: "Silahkan coba lagi",
          duration: 2500,
        });
      });
  }, [customerTrx, activeTabIndex, navigate, toast]);

  // CUSTOMER MODAL START
  const [searchCustomerQuery, setSearchCustomerQuery] = useState("");
  const debouncedSearchCustomerQuery = useDebounce(searchCustomerQuery, 500);
  const filteredCustomers = customers?.data?.data?.filter((item) => {
    // Concatenate first_name and last_name to allow for combined searches
    const fullName = `${item.first_name || ''} ${item.last_name || ''}`.trim().toLowerCase();
    // Check if the search query matches the first name, last name, or phone number
    const firstNameMatches = item.first_name && item.first_name.toLowerCase().includes(debouncedSearchCustomerQuery.toLowerCase());
    const lastNameMatches = item.last_name && item.last_name.toLowerCase().includes(debouncedSearchCustomerQuery.toLowerCase());
    // Check if the concatenated full name matches the search query
    const fullNameMatches = fullName.includes(debouncedSearchCustomerQuery.toLowerCase());
    // Ensure item.phone is a string before checking for a match
    const phoneMatches = item.phone && String(item.phone).toLowerCase().includes(debouncedSearchCustomerQuery.toLowerCase());
    // Return true if any of the conditions are met
    return firstNameMatches || lastNameMatches || fullNameMatches || phoneMatches;
  });


  interface Customer {
    id: number;
    first_name: string;
    last_name: string;
    phone: string;
  }
  const handleCustomerSelect = (customer: Customer | null) => {
    setSelectedCustomer(customer);
  };

  const getInitials = (name: string): string => {
    const names = name.split(" ");
    let initials = "";
    names.forEach((word) => {
      initials += word.charAt(0);
    });
    return initials.toUpperCase();
  };

  const updateCustomerTrx = (customerName: string, customerId: number) => {
    const newCustomerTrx = [...customerTrx];
    newCustomerTrx[activeTabIndex] = {
      ...newCustomerTrx[activeTabIndex],
      customer: customerName,
      customerId: customerId,
    };
    setCustomerTrx(newCustomerTrx);
    setSelectedCustomer(null);
    openCustomerModal();
  };

  const handleCustomerDefault = () => {
    updateCustomerTrx("Reguler");
  };

  const handleApplyCustomer = () => {
    if (selectedCustomer?.first_name) {
      updateCustomerTrx(
        selectedCustomer.first_name + " " + selectedCustomer.last_name,
        selectedCustomer.id
      );
    }
  };

  // adding new customer start
  const splitCustomerName = (fullName) => {
    const nameParts = fullName.trim().split(" ");
    const first_name = nameParts[0]; // First word as the first name
    const last_name = nameParts.slice(1).join(" "); // Join the remaining words as the last name

    return { first_name, last_name };
  };

  const handleSaveNewCustomer = () => {
    if (newCustomerName && newCustomerPhone) {
      const { first_name, last_name } = splitCustomerName(newCustomerName);

      try {
        postCustomer({
          first_name,
          last_name,
          phone: newCustomerPhone,
          customer_type: "admin"
        })
          .then((res) => {
            console.log("res", res);
            setAddingNewCustomer(false);
            setNewCustomerName("");
            setNewCustomerPhone("");
            toast({
              variant: "success",
              title: "Customer berhasil ditambahkan!",
              description: "",
              duration: 2500,
            });
            refetchCustomers();
          })
          .catch((err) => {
            console.log("err", err);
          });
      } catch (error) {
        console.log("error", error);
      }
    } else {
      toast({
        variant: "destructive",
        title: "Tambah customer gagal!",
        description: "Silahkan lengkapi data customer",
        duration: 2500,
      });
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
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const filteredItems = items?.data?.data?.filter((item) => {
    const nameMatches = item.name && item.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase());
    const barcodeMatches = item.barcode && item.barcode.toLowerCase().includes(debouncedSearchQuery.toLowerCase());
    return nameMatches || barcodeMatches;
  });

  const handleItemClick = (item: Item) => {
    const isDuplicate = activeTabItems.some((i) => i.barcode === item.barcode);

    if (!isDuplicate) {
      if (selectedItems.includes(item)) {
        setSelectedItems(selectedItems.filter((i) => i !== item));
      } else {
        setSelectedItems([...selectedItems, item]);
      }

      // Update enterCount if an item is clicked
      setEnterCount(0); // Reset enterCount when an item is clicked to start from the first input
    }
  };

  const handleApplyItems = () => {
    // Create a copy of the current customerTrx
    const newCustomerTrx = [...customerTrx];
    // Check if activeTabIndex is valid
    if (!newCustomerTrx[activeTabIndex]) {
      console.error(`Invalid activeTabIndex: ${activeTabIndex}`);
      return; // Exit the function if the index is invalid
    }
    // Ensure items exists in the active tab
    if (!Array.isArray(newCustomerTrx[activeTabIndex].items)) {
      console.error(`Items is not an array at activeTabIndex: ${activeTabIndex}`);
      newCustomerTrx[activeTabIndex].items = []; // Initialize items if it's not an array
    }
    // Get existing item barcodes
    const existingItems = newCustomerTrx[activeTabIndex].items.map(
      (item) => item.barcode
    );
    // Filter items to add
    const itemsToAdd = selectedItems.filter(
      (item) => !existingItems.includes(item.barcode)
    );
    // Add items to the transaction
    itemsToAdd.forEach((item) => {
      const newItem = { ...item, qty: 1 };
      newCustomerTrx[activeTabIndex].items.push(newItem);
    });

    // Update state
    setCustomerTrx(newCustomerTrx);
    setSelectedItems([]); // Reset selected items
    setEnterCount(0); // Reset enterCount after applying items

    openSearchItemModal();
  };


  const handleDeleteAllItems = () => {
    const newCustomerTrx = [...customerTrx];

    newCustomerTrx[activeTabIndex].items = [];
    setCustomerTrx(newCustomerTrx);
  };
  // ITEMS MODAL END

  // Function to calculate total based on active tab's items
  const calculateTotal = (items: Item[]) => {
    return items.reduce(
      (total, item) => total + (item.total_unit_price || 0),
      0
    );
  };

  // Function to calculate change based on total and entered amount
  const calculateChange = (total: number, cash: number) => {
    return cash - total;
  };

  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const value = e.target.value;
    const newCustomerTrx = [...customerTrx];
    newCustomerTrx[activeTabIndex] = {
      ...newCustomerTrx[activeTabIndex],
      description: value,
    };
    setCustomerTrx(newCustomerTrx);
  };

  const handlePaymentMethodChange = useCallback(
    (newValue: string) => {
      const newCustomerTrx = [...customerTrx];
      newCustomerTrx[activeTabIndex] = {
        ...newCustomerTrx[activeTabIndex],
        payment_method: newValue,
      };
      setCustomerTrx(newCustomerTrx);
    },
    [customerTrx, activeTabIndex, setCustomerTrx]
  );

  const paymentMethodSelected = customerTrx[activeTabIndex]?.payment_method;

  const handleCash = (newValue: number) => {
    const newCustomerTrx = [...customerTrx];

    newCustomerTrx[activeTabIndex] = {
      ...newCustomerTrx[activeTabIndex],
      cash: newValue,
    };
    setCustomerTrx(newCustomerTrx);
  };

  const handleBonDuration = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);

    const newCustomerTrx = [...customerTrx];
    newCustomerTrx[activeTabIndex] = {
      ...newCustomerTrx[activeTabIndex],
      bon_duration: value,
    };
    setCustomerTrx(newCustomerTrx);
  };

  const itemsActive = customerTrx[activeTabIndex]?.items || [];


  // === UseEffect === //
  const cashRef = useRef<HTMLInputElement>(null);
  const [cashFocused, setCashFocused] = useState(false); // To track if cashRef has been focused

  useEffect(() => {
    if (!isKeyboardEnterPressed) {
      return
    }

    const hasZeroUnitPrice = itemsActive.some(
      (item) => item.unit_price === 0 || !item.unit_price
    );

    if (hasZeroUnitPrice) {
      setCashFocused(false);
    }

    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === "Enter" && !hasZeroUnitPrice) {
        // Focus and select cashRef only once
        if (!cashFocused) {
          cashRef.current?.focus();
          cashRef.current?.select();
          setCashFocused(true); // Mark cashRef as focused
          return; // Prevent further logic from executing the first time
        }

        // After focusing cashRef once, execute the rest of the logic
        if (!open.dialog && customerTrx[activeTabIndex].cash > 0 && isKeyboardEnterPressed && !isBarcodeScannerActive) {
          checkoutRef.current?.click();
          setEnterPressedInDialog(true);
        } else if (enterPressedInDialog && customerTrx[activeTabIndex].cash > 0) {
          handleSubmit();
        } else {
          setEnterPressedInDialog(true);
        }
      }

      // Other key handling logic
      switch (event.key) {
        // case "C":
        //   if (event.shiftKey) {
        //     openCustomerModal();
        //   }
        //   break;
        case "c" && !open.customer:
          handlePaymentMethodChange("cash");
          break;
        case "t" && !open.customer:
          handlePaymentMethodChange("transfer");
          break;
        case "b" && !open.customer:
          handlePaymentMethodChange("bon");
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
  }, [
    open.dialog,
    enterPressedInDialog,
    handlePaymentMethodChange,
    handleSubmit,
    cashFocused, // Add cashFocused as a dependency
    itemsActive,
    isKeyboardEnterPressed
  ]);

  useEffect(() => {
    if (!open.dialog) {
      setEnterPressedInDialog(false);
    }
  }, [open.dialog]);

  const total = calculateTotal(activeTabItems);
  const change = calculateChange(total, customerTrx[activeTabIndex]?.cash);

  useEffect(() => {
    // Update customer transaction based on active tab
    setCustomerTrx((prevCustomerTrx) => {
      const newCustomerTrx = [...prevCustomerTrx];
      newCustomerTrx[activeTabIndex] = {
        ...newCustomerTrx[activeTabIndex],
        total,
        money_change: change,
      };
      return newCustomerTrx;
    });
  }, [activeTabItems, activeTabIndex, customerTrx, setCustomerTrx]);

  useEffect(() => {
    const newCustomerTrx = [...customerTrx];
    newCustomerTrx[activeTabIndex] = {
      ...newCustomerTrx[activeTabIndex],
      cash: total,
    };
    setCustomerTrx(newCustomerTrx);
  }, [customerTrx[activeTabIndex]?.total]);

  return (
    <div className="flex gap-5 mt-[0.2rem] -m-[1.2%] px-4 pt-3">
      <div className="flex flex-col gap-[11px]">
        {/* Customer */}
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
              className={`sm:max-w-[450px] ${addingNewCustomer ? "h-[300px]" : "h-[600px]"
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
                      type="text"
                      placeholder="Cari customer..."
                      value={searchCustomerQuery}
                      onChange={(e) => setSearchCustomerQuery(e.target.value)}
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
                    value={newCustomerName || ""}
                    onChange={(e) => setNewCustomerName(e.target.value)}
                    className="w-full px-4 py-3 mt-2 text-sm bg-transparent border-b border-gray-400 focus:outline-none focus:border-blue-500"
                  />
                  <Input
                    type="text"
                    placeholder="Nomor telepon"
                    value={newCustomerPhone || ""}
                    onChange={(e) => setNewCustomerPhone(e.target.value)}
                    className="w-full px-4 py-3 mt-2 text-sm bg-transparent border-b border-gray-400 focus:outline-none focus:border-blue-500"
                  />
                </div>
              )}
              {/* Add new customer ends here */}

              {!addingNewCustomer && (
                <ScrollArea className="min-h-[300px]">
                  {filteredCustomers?.map((customer: Customer, index) => (
                    <div
                      key={customer.id + index}
                      onClick={() => handleCustomerSelect(customer)}
                      className={`flex items-center justify-between p-2 hover:bg-secondary-gradient hover:text-white cursor-pointer`}>
                      <div className="flex items-center gap-3">
                        <div className="w-[40px] h-[40px] bg-[#E4E7EC] flex items-center justify-center rounded-full p-5">
                          <p className="text-black">
                            {getInitials(
                              customer.first_name + " " + customer.last_name
                            )}
                          </p>
                        </div>
                        <div>
                          <p className="text-[16px] font-bold">
                            {customer.first_name + " " + customer.last_name}
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
                          value={customer.first_name + " " + customer.last_name || ""}
                          checked={
                            selectedCustomer?.first_name === customer.first_name
                          }
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
            <textarea
              maxLength={50}
              className=" w-full h-full font-normal border-[0.4px] border-solid border-black text-[20px] rounded-[5px]"
              onChange={handleDescriptionChange}
              value={
                customerTrx[activeTabIndex]?.description
                  ? customerTrx[activeTabIndex]?.description
                  : ""
              }
            />
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
            defaultValue="cash"
            value={
              customerTrx[activeTabIndex]?.payment_method
                ? customerTrx[activeTabIndex]?.payment_method
                : ""
            }
            onValueChange={handlePaymentMethodChange}
            className="flex gap-[12px]">
            <div
              onClick={() => handlePaymentMethodChange("cash")}
              className={`flex justify-center items-center space-x-2 w-[104px] h-[60px] border-[1.1px] ${paymentMethodSelected === "cash"
                ? "border-[#7ABFFF]"
                : "border-[#D1D3D5]"
                } rounded-[10px] cursor-pointer`}>
              <RadioGroupItem
                value="cash"
                id="cash"
                className={`${paymentMethodSelected === "cash"
                  ? "text-[#7ABFFF]"
                  : "text-[#000]"
                  }`}
              />
              <Label
                htmlFor="cash"
                className={`text-[18px] ${paymentMethodSelected === "cash" ? "text-[#7ABFFF]" : ""
                  }`}>
                Cash
              </Label>
            </div>
            <div
              onClick={() => handlePaymentMethodChange("transfer")}
              className={`flex justify-center items-center space-x-2 w-[124px] h-[60px] border-[1.1px] ${paymentMethodSelected === "transfer"
                ? "border-[#7ABFFF]"
                : "border-[#D1D3D5]"
                } rounded-[10px] cursor-pointer`}>
              <RadioGroupItem
                value="transfer"
                id="transfer"
                className={`${paymentMethodSelected === "transfer"
                  ? "text-[#7ABFFF]"
                  : "text-[#000]"
                  }`}
              />
              <Label
                htmlFor="transfer"
                className={`text-[18px] ${paymentMethodSelected === "transfer" ? "text-[#7ABFFF]" : ""
                  }`}>
                Transfer
              </Label>
            </div>
            <div
              onClick={() => handlePaymentMethodChange("bon")}
              className={`flex justify-center items-center space-x-2 w-[140px] h-[60px] border-[1.1px] ${paymentMethodSelected === "bon"
                ? "border-[#7ABFFF]"
                : "border-[#D1D3D5]"
                } rounded-[10px] cursor-pointer`}>
              <RadioGroupItem
                value="bon"
                id="bon"
                className={`${paymentMethodSelected === "bon"
                  ? "text-[#7ABFFF]"
                  : "text-[#000]"
                  }`}
              />
              <div>
                <Label
                  htmlFor="bon"
                  className={`text-[18px] ${paymentMethodSelected === "bon" ? "text-[#7ABFFF]" : ""
                    }`}>
                  Bon
                </Label>
                <div className="flex items-center gap-1">
                  <input
                    value={
                      customerTrx[activeTabIndex]?.bon_duration
                        ? customerTrx[activeTabIndex]?.bon_duration
                        : null
                    }
                    type="text"
                    className="w-[34px] h-[18px] border-[0.4px] border-solid border-black"
                    onChange={handleBonDuration}
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
                className="sm:max-w-[1000px]"
              >
                <DialogHeader>
                  <DialogTitle>Pilih Produk</DialogTitle>
                  <DialogDescription>
                    Cari item yang anda inginkan. Klik tombol di bawah untuk mencari
                  </DialogDescription>
                </DialogHeader>
                <div
                  className="flex items-center px-3 border-[0.2px] border-solid border-black rounded-md"
                  cmdk-input-wrapper=""
                >
                  <Search className="w-4 h-4 mr-2 opacity-50 shrink-0" />
                  <input
                    type="text"
                    placeholder="Cari item..."
                    className="flex w-full py-3 text-sm bg-transparent rounded-md outline-none h-11 placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                    value={searchQuery || ""}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                {/* Header Row */}
                <div className="sticky top-0 flex items-center justify-between p-2 font-bold bg-gray-100">
                  <div className="w-[1%]">#</div>
                  <div className="w-[40%]">Nama Produk</div>
                  <div className="w-[15%]">Modal</div>
                  <div className="w-[15%]">Pasaran</div>
                  <div className="w-[5%]">Stok</div>
                  <div className="w-[5%]">Rak</div>
                  <div className="w-[5%]"></div>
                </div>

                {/* Items Row */}
                <ScrollArea className="h-[350px]">
                  {Array.isArray(filteredItems) && filteredItems.length > 0 ? ( // Check if filteredItems is an array and has items
                    filteredItems.map((item, index) => {
                      const isDuplicate = customerTrx?.[activeTabIndex]?.items?.some((i) => i.barcode === item.barcode);

                      // Prevent adding item if item_stock is null
                      const isStockUnavailable = item.item_stock === null || item.item_stock === 0;

                      const itemKey = item.barcode || `item-${index}`;

                      return (
                        <div
                          key={itemKey}
                          onClick={() => !isStockUnavailable && handleItemClick(item)}
                          className={`flex items-center justify-between p-2 hover:bg-gray-200 ${selectedItems.includes(item) ? "bg-gray-200" : ""
                            } ${isDuplicate || isStockUnavailable ? "bg-gray-100 cursor-not-allowed" : "cursor-pointer"}`}
                        >
                          <div className="w-[1%]">
                            <p>{index + 1}</p>
                          </div>

                          <div className="w-[40%]">
                            <p className="text-[16px] font-bold">
                              {item.name} |{" "}
                              <span className="font-normal">{item.barcode}</span>
                              {isDuplicate && (
                                <span className="text-[#FF0000] text-sm font-normal">
                                  {" "}
                                  (Sudah dipilih)
                                </span>
                              )}
                              {isStockUnavailable && (
                                <span className="text-[#FF0000] text-sm font-normal">
                                  {" "}
                                  (Stok tidak tersedia)
                                </span>
                              )}
                            </p>
                            <p className="text-[16px] font-normal">
                              {[item.brand, item.guarantee, item.type]
                                .filter(Boolean) // Filter out empty values
                                .join(" | ")}
                            </p>
                          </div>

                          <div className="w-[15%]">
                            <p className="text-[16px] font-bold">
                              {item.product_code ? getMaskedNumber(item.product_code, "modal") : ""}
                            </p>
                            <p className="text-[16px] font-normal">
                              {item.product_code_updated_at ? formatDate(item.product_code_updated_at) : ""}
                            </p>
                          </div>

                          <div className="w-[15%]">
                            <p className="text-[16px] font-bold">
                              {item.market ? getMaskedNumber(item.market, "pasaran") : ""}
                            </p>
                            <p className="text-[16px] font-normal">
                              {item.market_updated_at ? formatDate(item.market_updated_at) : ""}
                            </p>
                          </div>

                          <div className="w-[5%]">
                            <p className="text-[16px] font-bold">
                              {item.item_stock ? item.item_stock : 0}
                            </p>
                          </div>

                          <div className="w-[5%]">
                            <p className="text-[16px] font-bold">{item.rak}</p>
                          </div>

                          <div className="w-[5%]">
                            <Checkbox
                              disabled={isDuplicate || isStockUnavailable}
                              checked={selectedItems.includes(item)}
                              onChange={() => !isStockUnavailable && handleItemClick(item)}
                              className={`mr-4 cursor-pointer ${isDuplicate || isStockUnavailable ? "hidden" : ""}`}
                            />
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p>No items found</p> // Optional: display a message when no items are available
                  )}
                </ScrollArea>

                <DialogFooter>
                  <Button
                    type="button"
                    variant={"outline"}
                    onClick={() => setSelectedItems([])}
                    disabled={selectedItems.length > 0 ? false : true}
                  >
                    Batalkan Pilihan
                  </Button>
                  <Button
                    type="button"
                    onClick={handleApplyItems}
                    disabled={selectedItems.length > 0 ? false : true}
                  >
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
              className="w-[60px] h-[60px] flex items-center justify-center bg-[#D9D9D9] rounded-full cursor-pointer"
            >
              <img src={IconTrash} alt="Icon Trash" className="w-[30px] h-[30px]" />
            </div>
            <p className="text-[16px] font-medium">Delete all</p>
          </div>
        </div>
      </div>


      {/* Checkout */}
      <div className="w-full">
        <div className="w-full h-[135px] drop-shadow-lg border-2 bg-white rounded-tr-[10px] rounded-tl-[10px] p-4">
          {customerTrx[activeTabIndex] && (
            <>
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
                  <InputNumeric
                    ref={cashRef}
                    value={
                      customerTrx[activeTabIndex].cash
                        ? customerTrx[activeTabIndex].cash
                        : customerTrx[activeTabIndex].total
                    }
                    onChange={handleCash}
                    className="w-[120px] font-normal border-[0.4px] border-solid border-black text-[20px]"
                  />
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
            </>
          )}
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

      <div className="hidden">
        <Invoice ref={invoiceRef} />
      </div>
    </div>
  );
}

export default OrderPanel;
