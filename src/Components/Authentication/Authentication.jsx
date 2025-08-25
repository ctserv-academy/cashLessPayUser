import React, { useState } from "react";
import { Button, Card, CardBody } from "reactstrap";
import { useNavigate } from "react-router-dom";  // <--- import this
import useWebAuth from "../../hooks/useWebAuth";

const Authentication = () => {
  const [handleRegister, handleAuthenticate] = useWebAuth();
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const onRegister = async () => {
    try {
      const credential = await handleRegister();
      setMessage(`Registered with credential ID: ${credential.id}`);

      // After successful registration, redirect to home
      navigate("/", { replace: true });
    } catch (error) {
      setMessage(`Registration failed: ${error.message}`);
    }
  };

  const onAuthenticate = async () => {
    try {
      await handleAuthenticate();
      setMessage("Authentication successful!");

      // After successful authentication, redirect to home
      navigate("/", { replace: true });
    } catch (error) {
      setMessage(`Authentication failed: ${error.message}`);
    }
  };

  return (
    <div className="authentication-container" style={{ maxWidth: 400, margin: "auto", padding: 20 }}>
      <Card>
        <CardBody>
          <h3>Authentication</h3>
          <Button color="success" onClick={onAuthenticate}>
            Authenticate
          </Button>
          {message && <div style={{ marginTop: 20, color: "blue" }}>{message}</div>}
        </CardBody>
      </Card>
    </div>
  );
};

export default Authentication;
