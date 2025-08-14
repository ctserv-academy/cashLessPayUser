import React, { useState, useEffect } from "react";
import { Card, CardBody, Button } from "reactstrap";
import "./Wallet.css";

const Wallet = () => {
  const [balance, setBalance] = useState(1250.75);
  const [dailyLimit, setDailyLimit] = useState(null); // Set to null or 0 to hide daily limit
  const [spentToday, setSpentToday] = useState(125.5);
  const [isHidden, setIsHidden] = useState(false);
  const [isFrozen, setIsFrozen] = useState(false);

  // Mock QR code data - in real app this would be generated from user/account data
  const qrCodeData = "milera://wallet/user123/account456";

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const toggleHide = () => {
    setIsHidden(!isHidden);
  };

  const getRemainingDailyLimit = () => {
    return dailyLimit - spentToday;
  };

  const hasDailyLimit = () => {
    return dailyLimit && dailyLimit > 0;
  };

  const toggleFreeze = () => {
    setIsFrozen(!isFrozen);
  };

  return (
    <div className="wallet-container">
      <Card className="wallet-card">
        <CardBody className="wallet-body">
          {/* Balance Section */}
          <div className="balance-section">
            <div className="balance-header">
              <h3 className="balance-title">Wallet Balance</h3>
              <Button color="link" className="hide-button" onClick={toggleHide}>
                <i className={`fa fa-${isHidden ? "eye" : "eye-slash"}`}></i>
                {isHidden ? "Show" : "Hide"}
              </Button>
            </div>
            <div className="balance-amount">
              <span className="currency-symbol">$</span>
              <span className="balance-value">
                {isHidden ? "****" : formatCurrency(balance).replace("$", "")}
              </span>
            </div>
          </div>

          {/* Daily Limit Section - Only show if daily limit exists */}
          {hasDailyLimit() && (
            <div className="daily-limit-section">
              <div className="limit-header">
                <span className="limit-label">Daily Limit</span>
                <span className="limit-amount">
                  {isHidden
                    ? "****"
                    : formatCurrency(dailyLimit).replace("$", "")}
                </span>
              </div>
              <div className="limit-info">
                <div className="limit-row">
                  <span className="limit-item-label">Spent today:</span>
                  <span className="limit-item-value">
                    {isHidden
                      ? "****"
                      : formatCurrency(spentToday).replace("$", "")}
                  </span>
                </div>
                <div className="limit-row">
                  <span className="limit-item-label">Remaining:</span>
                  <span className="limit-item-value">
                    {isHidden
                      ? "****"
                      : formatCurrency(getRemainingDailyLimit()).replace(
                          "$",
                          ""
                        )}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* QR Code Section */}
          <div className="qr-section">
            <h4 className="qr-title">Payment QR Code</h4>
            <div className="qr-container">
              <div className="qr-image">
                <img
                  src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=milera://wallet/user123/account456"
                  alt="Payment QR Code"
                  className="qr-code-img"
                />
                <small>Scan by vendors for payment</small>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="wallet-actions">
            <Button
              color={isFrozen ? "success" : "warning"}
              className="freeze-button"
              onClick={toggleFreeze}
            >
              <i className={`fa fa-${isFrozen ? "unlock" : "lock"}`}></i>
              {isFrozen ? "Unfreeze Wallet" : "Freeze Wallet"}
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default Wallet;