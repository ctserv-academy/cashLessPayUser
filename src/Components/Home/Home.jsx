import React, { useState, useCallback, useMemo, useEffect } from "react";
import { Card, CardBody, Button } from "reactstrap";
import WalletBalance from "../Wallet/WalletBalance";
import "../Wallet/Wallet.css";
import useWebAuth from "../../hooks/useWebAuth";
import { getFromDB, setToDB } from "../../utils/storage";

const Home = () => {
  // Consolidated state management
  const [state, setState] = useState({
    balance: 1250.75,
    dailyLimit: null,
    spentToday: 125.5,
    isHidden: true,
    isFrozen: false,
  });

  // Memoized wallet data to prevent unnecessary re-renders
  const walletData = useMemo(
    () => ({
      balance: state.balance,
      dailyLimit: state.dailyLimit,
      spentToday: state.spentToday,
      isHidden: state.isHidden,
    }),
    [state.balance, state.dailyLimit, state.spentToday, state.isHidden]
  );

  // Handle balance updates with useCallback
  const handleBalanceUpdate = useCallback((newBalance) => {
    setState((prevState) => ({
      ...prevState,
      balance: newBalance,
    }));
  }, []);

  // Handle visibility toggle with useCallback
  const handleVisibilityToggle = useCallback(() => {
    setState((prevState) => ({
      ...prevState,
      isHidden: !prevState.isHidden,
    }));
  }, []);

  const [handleRegister, handleAuthenticate] = useWebAuth();

  useEffect(() => {
    const startupRegister = async()=>{
      if (! await getFromDB('credential')) {
      const credential = await handleRegister();
      await setToDB('credential', credential.id);
      }

    }
    startupRegister();
    // Example effect: Log balance changes
    // console.log("Wallet balance updated:", walletData.balance);
  }, []);

  return (
    <div className="wallet-container">
      <Card className="wallet-card">
        <CardBody className="wallet-body">
          <WalletBalance
            balance={walletData.balance}
            dailyLimit={walletData.dailyLimit}
            spentToday={walletData.spentToday}
            isHidden={walletData.isHidden}
            // toggleHide={handleVisibilityToggle}
            // formatCurrency={formatCurrency}
          />
        </CardBody>
      </Card>
      <button onClick={handleAuthenticate}>
        Authenticate
      </button>
    </div>
  );
};

export default Home;
