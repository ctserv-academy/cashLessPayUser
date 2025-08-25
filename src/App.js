import React, { useContext, useEffect, useState, useMemo } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import "./App.css";
import { AuthenticationContainer } from "./Containers/AuthenticationContainer";
import { LoadingContainer } from "./Containers/LoadingContainer";
import { Full } from "./Components/MainMenu/Full";
import { ErrorContainer } from "./Containers/ErrorContainer";
import { Login } from "./Forms/Login/Login";
import { LoadingContext } from "./ContextProvider/LoadingContext";
import { mobileDevicesWidth, urlPath } from "./globals";
import PageError from "./Containers/PageError";
import Wallet from "./Components/Wallet/Wallet";
import Profile from "./Components/Profile/Profile";
import Home from "./Components/Home/Home";
import Transactions from "./Components/Transactions/Transactions";
import Authentication from "./Components/Authentication/Authentication";
import AuthGate from "./Components/AuthGate/AuthGate";  // Adjust path accordingly

// import PDFViewer from './ReusableComponents/PdfViewer/PDFViewer';

function App() {
  const { setisLoading } = useContext(LoadingContext);

  // Memoized patient data to avoid repeated localStorage access
  const state = useMemo(
    () => ({
      patientData: (() => {
        try {
          const data = localStorage.getItem("patientData");
          return data ? JSON.parse(data) : {};
        } catch (error) {
          console.error("Error parsing patient data:", error);
          return {};
        }
      })(),
    }),
    []
  );

  return (
    // <PDFViewer />
   <Routes>
    <Route element={<ErrorContainer />}>
      <Route element={<LoadingContainer />}>
        <Route element={<AuthenticationContainer />}>
          <Route path="/login" element={<Login />} />
          <Route path="/authenticate" element={<Authentication />} />
          <Route path="/error" element={<PageError />} />
          <Route path="/" element={<Full />}>
            <Route path="/" element={<Home />} />
            <Route path="/wallet" element={<Wallet />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/transactions" element={<Transactions />} />
          </Route>
        </Route>
      </Route>
    </Route>
  </Routes>

  );
}

export default App;
