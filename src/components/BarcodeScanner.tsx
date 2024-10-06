import React, { useState, useRef, useEffect, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAppContext } from "@/provider/useAppContext";
import { getItems } from "@/config/https/item";
import IconBarcodeOn from "@/assets/icons/BarcodeOn.svg";
import IconBarcodeOff from "@/assets/icons/BarcodeOff.svg";

const BarcodeScanner: React.FC = () => {
  const {
    tabs,
    setCustomerTrx,
    isBarcodeScannerActive,
    setIsBarcodeScannerActive,
    setEnterCount,
  } = useAppContext();
  const [barcode, setBarcode] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const inactivityTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { data: items } = useQuery({
    queryKey: ["items"],
    queryFn: getItems,
  });

  const activeTabIndex = tabs.findIndex((tab) => tab.active) || 0;

  const handleBarcodeMatch = useCallback(
    (matchedBarcode: string) => {
      if (items?.data?.data) {
        const item = items.data.data.find(
          (item) => item.barcode === matchedBarcode
        );
        if (item) {
          setBarcode("");

          setCustomerTrx((prevTrx) => {
            const newCustomerTrx = [...prevTrx];
            const currentItems = newCustomerTrx[activeTabIndex].items;

            const existingItemIndex = currentItems.findIndex(
              (existingItem) => existingItem.barcode === item.barcode
            );

            if (existingItemIndex !== -1) {
              currentItems[existingItemIndex].qty += 1;
            } else {
              currentItems.push({ ...item, qty: 1 });
            }

            return newCustomerTrx;
          });
        }
      }
    },
    [items, activeTabIndex, setCustomerTrx]
  );

  useEffect(() => {
    if (barcode) {
      handleBarcodeMatch(barcode);
    }
  }, [barcode, handleBarcodeMatch]);

  useEffect(() => {
    if (inputRef.current && isBarcodeScannerActive) {
      inputRef.current.focus();
    }
  }, [isBarcodeScannerActive]);

  const resetInactivityTimeout = useCallback(() => {
    if (inactivityTimeoutRef.current) {
      clearTimeout(inactivityTimeoutRef.current);
    }
    inactivityTimeoutRef.current = setTimeout(() => {
      setIsBarcodeScannerActive(true);
      setEnterCount(0);
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 3000);
  }, [setIsBarcodeScannerActive, setEnterCount]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.trim();
    setBarcode(value);
    resetInactivityTimeout();
  };

  const handleInputBlur = () => {
    setIsBarcodeScannerActive(false);
    resetInactivityTimeout();
  };

  useEffect(() => {
    const handleUserActivity = () => {
      resetInactivityTimeout();
    };

    document.addEventListener("keydown", handleUserActivity);
    document.addEventListener("focusin", handleUserActivity);
    document.addEventListener("mousedown", handleUserActivity);

    return () => {
      document.removeEventListener("keydown", handleUserActivity);
      document.removeEventListener("focusin", handleUserActivity);
      document.removeEventListener("mousedown", handleUserActivity);
    };
  }, [resetInactivityTimeout]);

  return (
    <div>
      <input
        type="text"
        value={barcode}
        onChange={handleInputChange}
        ref={inputRef}
        placeholder="Scan barcode here"
        onBlur={handleInputBlur}
        autoFocus
        style={{
          position: "absolute",
          left: "-9999px",
          width: "1px",
          height: "1px",
          opacity: 0,
        }}
      />
      <div
        className="flex flex-col items-center justify-center w-[50px] cursor-pointer"
        onClick={() => setIsBarcodeScannerActive(!isBarcodeScannerActive)}>
        <div className="relative">
          <img
            src={isBarcodeScannerActive ? IconBarcodeOn : IconBarcodeOff}
            alt="Icon Barcode"
            className="w-[30px] h-[30px]"
          />
          <div className="absolute flex items-center justify-center w-4 h-3 transform -translate-x-1/2 -translate-y-1/2 bg-white top-1/2 left-1/2">
            <p
              className={`text-[8px] ${
                isBarcodeScannerActive ? "text-[#038B0A]" : "text-[#B30A28]"
              }  font-bold`}>
              {isBarcodeScannerActive ? "ON" : "OFF"}
            </p>
          </div>
        </div>
        <p className="font-bold text-[10px] text-center">Barcode</p>
      </div>
    </div>
  );
};

export default BarcodeScanner;
