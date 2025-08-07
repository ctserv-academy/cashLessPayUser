import React, { useCallback, useContext, useEffect, useRef } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../ContextProviders/AuthContext";
import { get, set, remove } from "../Helpers/utils";
import { isEqual } from "lodash";

export default function AuthContainer() {
  const { clientData, setClientData } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const clientData_ = useRef(null);
  const fetchingMemory = useRef(false);

  const readData = async () => {
    fetchingMemory.current = true;

    let data = await get("clientData");
    let phone = await get("registeredPhone");
    let isVerified = await get("isVerified");
    clientData_.current = { ...data, phone, isVerified };

    // clientData_.current = data;
    if (!isEqual(clientData_.current, clientData)) {
      setClientData(clientData_.current);
    }
    fetchingMemory.current = false;
  };

  useEffect(() => {
    readData();
  });

  const checkAuthData = useCallback(async () => {
    // console.log("DB Client Data", JSON.stringify(clientData_.current));
    // console.log("Context Client Data", JSON.stringify(clientData));

    if (!clientData_.current?.cardNumber) {
      navigate("/RegistrationPage", { replace: true });
    } else {
      if (!clientData_.current?.isVerified) {
        navigate("/VerificationPage", { replace: true });
      } else if (
        clientData_.current.isVerified &&
        location.pathname.toLocaleLowerCase() === "/verificationpage"
      ) {
        navigate("/", { replace: true });
      } else if (
        clientData_.current &&
        location.pathname.toLocaleLowerCase() === "/registrationpage"
      ) {
        navigate("/", { replace: true });
      }
    }
  }, [location.pathname]);

  useEffect(() => {
    readData().then((resp) => checkAuthData());
  }, [location.pathname]);

  return <Outlet />;
}
