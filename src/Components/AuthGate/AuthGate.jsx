import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getFromDB } from "../../utils/storage";

const AuthGate = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthentication = async () => {
      // Check if the credential exists in IndexedDB
      const credential = await getFromDB("credential");

    //   if (credential) {
    //     // User is authenticated → go to home
    //     navigate("/", { replace: true });
    //   } else {
    //     // User not authenticated → go to authentication page
    //     navigate("/auth", { replace: true });
    //   }
    
    navigate("/auth", { replace: true });

    };

    checkAuthentication();
  }, [navigate]);

  return <div>Checking authentication...</div>;
};

export default AuthGate;
