// WalletBalance.js
import React, { useState, useCallback } from "react";
import { Button } from "reactstrap";

const WalletBalance = ({
  balance,
  dailyLimit,
  spentToday
}) => {
  const hasDailyLimit = () => dailyLimit && dailyLimit > 0;
  const getRemainingDailyLimit = () => dailyLimit - spentToday;

    const [state, setState] = useState({
      isHidden: true,
    });

    const toggleHide = useCallback(() =>
      setState((prev) => ({
        ...prev,
        isHidden: !prev.isHidden
      })), []);
    
    const formatCurrency = useCallback((amount) =>
      new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD"
      }).format(amount), []);

  return (
    <div className="balance-section">
      <div className="balance-header">
        <h3 className="section-title">Balance</h3>
        <Button color="link" className="hide-button" onClick={toggleHide}>
          <i className={`fa fa-${state.isHidden ? "eye" : "eye-slash"}`}></i>
          {state.isHidden ? "Show" : "Hide"}
        </Button>
      </div>
      <div className="balance-amount">
        <span className="currency-symbol">$</span>
        <span className="balance-value">
          {state.isHidden ? "****" : formatCurrency(balance).replace("$", "")}
        </span>
      </div>

      {hasDailyLimit() && (
        <div className="daily-limit-section">
          <div className="limit-header">
            <span className="limit-label">Daily Limit</span>
            <span className="limit-amount">
              {state.isHidden ? "****" : formatCurrency(dailyLimit)}
            </span>
          </div>
          <div className="limit-info">
            <div className="limit-row">
              <span className="limit-item-label">Spent today:</span>
              <span className="limit-item-value">
                {state.isHidden ? "****" : formatCurrency(spentToday)}
              </span>
            </div>
            <div className="limit-row">
              <span className="limit-item-label">Remaining:</span>
              <span className="limit-item-value">
                {state.isHidden ? "****" : formatCurrency(getRemainingDailyLimit())}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletBalance;
