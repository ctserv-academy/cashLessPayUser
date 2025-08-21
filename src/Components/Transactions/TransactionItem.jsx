// TransactionItem.js
import React from "react";
import "./TransactionItem.css";
import moment from "moment";

function TransactionItem({ vendor, timestamp, amount, type }) {
  const isTopUp = type === "top-up";

  return (
    <div className="transaction-item">
      <div className="transaction-left">
        <div className="vendor-name">{vendor}</div>
        <div className="timestamp">{moment(timestamp).format("MMM D, YYYY - h:mm:ss A")}</div>
      </div>
      <div className={`amount ${isTopUp ? "positive" : "negative"}`}>
        {isTopUp ? "+" : "-"}${Math.abs(amount).toFixed(2)}
      </div>
    </div>  
  );
}

export default TransactionItem;
