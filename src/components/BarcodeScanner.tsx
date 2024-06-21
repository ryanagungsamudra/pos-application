// src/components/BarcodeScanner.tsx
import React, { useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

interface BarcodeScannerProps {
  onScanSuccess: (data: string) => void;
}

const BarcodeScanner: React.FC<BarcodeScannerProps> = ({ onScanSuccess }) => {
  useEffect(() => {
    const html5QrcodeScanner = new Html5QrcodeScanner(
      "reader",
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
      },
      /* verbose= */ false
    );

    const handleScanSuccess = (
      decodedText: string
      // decodedResult: Html5QrcodeResult
    ) => {
      // Handle the result here.
      onScanSuccess(decodedText);
    };

    const handleScanFailure = (error: string) => {
      // Handle scan failure, usually logging or displaying an error message.
      console.error("QR code scan error:", error);
    };

    html5QrcodeScanner.render(handleScanSuccess, handleScanFailure);

    return () => {
      html5QrcodeScanner.clear().catch((error) => {
        console.error("Failed to clear html5QrcodeScanner. ", error);
      });
    };
  }, [onScanSuccess]);

  return (
    <div>
      <div id="reader" style={{ width: "500px" }}></div>
    </div>
  );
};

export default BarcodeScanner;
