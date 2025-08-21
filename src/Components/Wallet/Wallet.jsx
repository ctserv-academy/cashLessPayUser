// Wallet.js
import React, { useCallback, useState, useMemo } from "react";
import { Card, CardBody, Button } from "reactstrap";
import WalletBalance from "./WalletBalance";
import WalletQRCode from "./WalletQRCode";
import "./Wallet.css";

const Wallet = () => {
  // Consolidated state management
  const [state, setState] = useState({
    balance: 1250.75,
    dailyLimit: null,
    spentToday: 125.5,
    isFrozen: false,
    qrCodeData: "milera://wallet/user123/account456",
  });

  // Memoized wallet data to prevent unnecessary re-renders
  const walletData = useMemo(
    () => ({
      balance: state.balance,
      dailyLimit: state.dailyLimit,
      spentToday: state.spentToday,
    }),
    [state.balance, state.dailyLimit, state.spentToday]
  );

  // Memoized QR code data
  const qrCodeData = useMemo(
    () => ({
      isFrozen: state.isFrozen,
      qrCodeData: state.qrCodeData,
    }),
    [state.isFrozen, state.qrCodeData]
  );

  // Handle freeze toggle with useCallback
  const toggleFreeze = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isFrozen: !prev.isFrozen,
    }));
  }, []);

  // Handle balance updates with useCallback
  const handleBalanceUpdate = useCallback((newBalance) => {
    setState((prev) => ({
      ...prev,
      balance: newBalance,
    }));
  }, []);

  // Handle daily limit updates with useCallback
  const handleDailyLimitUpdate = useCallback((newLimit) => {
    setState((prev) => ({
      ...prev,
      dailyLimit: newLimit,
    }));
  }, []);

  return (
    <div className="wallet-container">
      <Card className="wallet-card">
        <CardBody className="wallet-body">
          <WalletBalance
            balance={walletData.balance}
            dailyLimit={walletData.dailyLimit}
            spentToday={walletData.spentToday}
          />

          <WalletQRCode
            isFrozen={qrCodeData.isFrozen}
            qrCodeData={qrCodeData.qrCodeData}
          />

          <div className="wallet-actions">
            <Button
              className={`freeze-button btn-${
                state.isFrozen ? "success" : "warning"
              }`}
              onClick={toggleFreeze}
            >
              <i className={`fa fa-${state.isFrozen ? "unlock" : "lock"}`}></i>
              {state.isFrozen ? "Unfreeze Wallet" : "Freeze Wallet"}
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default Wallet;
