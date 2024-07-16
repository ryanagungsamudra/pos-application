import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getItems } from "@/config/https/item";
import { useAppContext } from "@/provider/useAppContext";
import { getCustomers } from "@/config/https/customer";
import { Item } from "@/provider/AppContext";

export function useOrderPanelFunctions() {
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

  const { tabs, customerTrx, setCustomerTrx } = useAppContext();
  const [open, setOpen] = useState({
    customer: false,
    searchItem: false,
  });

  const [addingNewCustomer, setAddingNewCustomer] = useState(false);
  const [newCustomerName, setNewCustomerName] = useState("");
  const [newCustomerPhone, setNewCustomerPhone] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedOption, setSelectedOption] = useState("cash");
  const [bonDuration, setBonDuration] = useState(0);
  const [selectedItems, setSelectedItems] = useState([]);
  const [description, setDescription] = useState("");

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
    console.log(customerTrx[activeTabIndex]);

    toast({
      variant: "success",
      title: "Checkout Berhasil!",
      description: "Silahkan lakukan pembayaran",
      duration: 2500,
    });
  };

  const handleKeyPress = (
    event: KeyboardEvent,
    enterPressedInDialog: boolean
  ) => {
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
      case "C":
        if (event.shiftKey) {
          openCustomerModal();
        }
        break;
      case "c":
        setSelectedOption("cash");
        break;
      case "t":
        setSelectedOption("transfer");
        break;
      case "b":
        setSelectedOption("bon");
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

  const handleCustomerSelect = (customer) => {
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

  const updateCustomerTrx = (customerName: string, activeTabIndex: number) => {
    const newCustomerTrx = [...customerTrx];
    newCustomerTrx[activeTabIndex] = {
      ...newCustomerTrx[activeTabIndex],
      customer: customerName,
    };
    setCustomerTrx(newCustomerTrx);
    setSelectedCustomer(null);
    openCustomerModal();
  };

  const handleCustomerDefault = (activeTabIndex: number) => {
    updateCustomerTrx("Reguler", activeTabIndex);
  };

  const handleApplyCustomer = (activeTabIndex: number) => {
    if (selectedCustomer?.name) {
      updateCustomerTrx(selectedCustomer.name, activeTabIndex);
    }
  };

  const handleSaveNewCustomer = (activeTabIndex: number) => {
    if (newCustomerName && newCustomerPhone) {
      updateCustomerTrx(newCustomerName, activeTabIndex);
      setAddingNewCustomer(false);

      setNewCustomerName("");
      setNewCustomerPhone("");
    } else {
      alert("Please enter name and phone number.");
    }
  };

  const handleDiscardNewCustomer = () => {
    setNewCustomerName("");
    setNewCustomerPhone("");
    setAddingNewCustomer(false); // Close the form
  };

  const handleItemClick = (item, selectedItems) => {
    if (selectedItems.includes(item)) {
      return selectedItems.filter((i) => i !== item);
    } else {
      return [...selectedItems, item];
    }
  };

  const handleApplyItems = (activeTabIndex, selectedItems) => {
    const newCustomerTrx = [...customerTrx];
    newCustomerTrx[activeTabIndex].items.push(...selectedItems);
    setCustomerTrx(newCustomerTrx);
    setSelectedItems([]); // Reset selected items

    openSearchItemModal();
  };

  const handleDeleteAllItems = (activeTabIndex) => {
    const newCustomerTrx = [...customerTrx];

    newCustomerTrx[activeTabIndex].items = [];
    setCustomerTrx(newCustomerTrx);
  };

  return {
    uang,
    handleUangChange,
    enterPressedInDialog,
    open,
    openCustomerModal,
    openSearchItemModal,
    handleSubmit,
    handleKeyPress,
    addingNewCustomer,
    setAddingNewCustomer,
    newCustomerName,
    setNewCustomerName,
    newCustomerPhone,
    setNewCustomerPhone,
    selectedCustomer,
    setSelectedCustomer,
    selectedOption,
    setSelectedOption,
    bonDuration,
    setBonDuration,
    selectedItems,
    setSelectedItems,
    description,
    setDescription,
    checkoutRef,
    handleCustomerSelect,
    getInitials,
    updateCustomerTrx,
    handleCustomerDefault,
    handleApplyCustomer,
    handleSaveNewCustomer,
    handleDiscardNewCustomer,
    handleItemClick,
    handleApplyItems,
    handleDeleteAllItems,
  };
}

// Function to calculate total based on active tab's items
export function calculateTotal(items: Item[]) {
  return items.reduce((total, item) => total + (item.total_unit_price || 0), 0);
}

// Function to calculate change based on total and entered amount
export function calculateChange(total: number, cash: number) {
  return cash - total;
}
