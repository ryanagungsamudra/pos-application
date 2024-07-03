import { useEffect, useRef, useState } from "react";
import BarcodeScanner from "@/components/BarcodeScanner";

function BarcodeUI() {
  const [scannedData, setScannedData] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [detail, setDetail] = useState<any>(null);

  const handleScanSuccess = (data: string) => {
    setScannedData(data);
    saveScannedData(data);
  };

  const saveScannedData = (data: string) => {
    // Example of saving data to local storage
    localStorage.setItem("scannedData", data);

    // Example of setting the input field value
    if (inputRef.current) {
      inputRef.current.value = data;
    }

    // get data to backend
    fetch(`https://fakestoreapi.com/products/${data}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
        setDetail(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });

    // Optionally, send the data to a backend server
    // fetch("https://your-backend-api.com/save-scan", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({ scannedData: data }),
    // })
    //   .then((response) => response.json())
    //   .then((data) => {
    //     console.log("Success:", data);
    //   })
    //   .catch((error) => {
    //     console.error("Error:", error);
    //   });
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <div className="App">
      <h1>QR Code Scanner</h1>
      <BarcodeScanner onScanSuccess={handleScanSuccess} />
      {/* <input type="text" ref={inputRef} placeholder="Scan QR code here" /> */}
      {scannedData && <p>Scanned Data: {scannedData}</p>}

      {detail && (
        <div>
          <h2>{detail.title}</h2>
          <p>${detail.price}</p>
          <img
            src={detail.image}
            alt={detail.title}
            width={200}
            height={200}
            className="w-64 h-64"
          />
        </div>
      )}
    </div>
  );
}

export default BarcodeUI;
