// WalletQRCode.js
import React from "react";

const WalletQRCode = ({ 
  isFrozen,
  qrCodeData 
}) => {
  return (
    <div className="qr-section">
      <h4 className="section-title">Payment QR Code</h4>
      <div className="qr-container">
        <div className={`qr-image ${isFrozen ? "qr-code-frozen" : ""}`}>
          <img
            src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${qrCodeData}`}
            alt="Payment QR Code"
            className="qr-code-img"
          />
        </div>
        <div>
          <small>Scan by vendors for payment</small>
        </div>
      </div>
    </div>
  );
};

export default WalletQRCode;
