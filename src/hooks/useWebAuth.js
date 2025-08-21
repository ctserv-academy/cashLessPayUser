import { useState } from "react";

const useWebAuth = ()=>{

  const [authStatus, setAuthStatus] = useState("idle");
  const [error, setError] = useState(null);
  const handleRegister = async () => {
    setAuthStatus("pending");
    setError(null);
    try {
      const publicKey = {
        // challenge: A random value to prevent replay attacks
        // Generate random bytes using Math.random()
        challenge: new Uint8Array(
          Array.from({ length: 32 }, () => Math.floor(Math.random() * 256))
        ),
        // rp: Relying Party - identifies your website/service
        // name: Human-readable name shown to user
        // id: Domain name (must match current domain for security)
        rp: {
          name: "Demo App",
          id: "localhost", // Change from "localhost" to your actual domain
        },
        // user: Information about the user creating the credential
        // id: Unique user identifier (must be byte array)
        // name: Username/email (string)
        // displayName: Full name shown to user (string)
        user: {
          id: Uint8Array.from("demoUser", (c) => c.charCodeAt(0)),
          name: "demoUser",
          displayName: "Demo User",
        },
        // pubKeyCredParams: Supported cryptographic algorithms
        // alg: -7 = ES256 (ECDSA), -257 = RS256 (RSA)
        // Include both for maximum device compatibility
        pubKeyCredParams: [
          { type: "public-key", alg: -7 }, // ES256 (ECDSA w/ SHA-256)
          { type: "public-key", alg: -257 }, // RS256 (RSASSA-PKCS1-v1_5 w/ SHA-256)
        ],
        // timeout: How long (in milliseconds) to wait for user interaction
        timeout: 60000,
        // attestation: How much attestation data to include
        // "none" = minimal attestation (recommended for most apps)
        // "direct" = full attestation (for high-security apps)
        attestation: "none",
        // authenticatorSelection: Controls which authenticators can be used
        authenticatorSelection: {
          // userVerification: Whether to require biometric/PIN verification
          userVerification: "required",
          // residentKey: Whether the credential should be discoverable
          // "required" = must be discoverable (can find without knowing ID)
          // "preferred" = prefer discoverable
          // "discouraged" = don't make discoverable
          residentKey: "required",
          // authenticatorAttachment: Which type of authenticator to prefer
          // "platform" = built-in (fingerprint, Face ID, Windows Hello)
          // "cross-platform" = external (USB keys, QR codes)
          authenticatorAttachment: "platform", // Forces local platform authenticator
          // requireResidentKey: Forces the credential to be resident (discoverable)
          // This helps ensure local storage without cloud sync
          requireResidentKey: true,
        },
      };
      const credential = await navigator.credentials.create({ publicKey });
      if (credential) {
        console.log("Credential registered:", credential);
        return credential

        // Send credential to server for storage
        // try {
        //   const serverResult = await sendCredentialToServer(credential);
        //   console.log("Server registration successful:", serverResult);
        //   setAuthStatus("registered");
        // } catch (serverError) {
        //   setAuthStatus("failed");
        //   setError("Server registration failed: " + serverError.message);
        // }
      } else {
        console.log("Credential not registered");
        setAuthStatus("failed");
      }
    } catch (err) {
      setAuthStatus("failed");
      setError(err.message || "Registration failed");
    }
  };

    const handleAuthenticate = async () => {
    setAuthStatus("pending");
    setError(null);
    try {
      // Demo challenge and allowCredentials for testing only
      const publicKey = {
        // challenge: A random value to prevent replay attacks
        // Generate random bytes using Math.random()
        challenge: new Uint8Array(
          Array.from({ length: 32 }, () => Math.floor(Math.random() * 256))
        ),
        // timeout: How long (in milliseconds) to wait for user interaction
        // After this time, the operation will fail
        timeout: 60000,
        // userVerification: Whether to require biometric/PIN verification
        // "required" = always prompt for biometric/PIN
        // "preferred" = prefer biometric/PIN but allow without
        // "discouraged" = don't require biometric/PIN
        userVerification: "required", // <-- This is the key!
      };
      //Sign a token with the private key
      //then verify the token with the public key(Implicitly happens when you call navigator.credentials.get())
      const assertion = await navigator.credentials.get({ publicKey });
      if (assertion) {
        console.log("Authentication successful:", assertion);

        // Send assertion to server for dual verification
        // try {
        //   const serverResult = await sendAssertionToServer(assertion);
        //   console.log("Server verification successful:", serverResult);
        //   setAuthStatus("authenticated");
        // } catch (serverError) {
        //   setAuthStatus("failed");
        //   setError("Server verification failed: " + serverError.message);
        // }
      } else {
        setAuthStatus("failed");
        console.log("Authentication failed:", assertion);
      }
    } catch (err) {
      setAuthStatus("failed");
      console.log("Authentication failed:", err);
      setError(err.message || "Authentication failed");
    }
  };

  return [handleRegister,handleAuthenticate]

}

export default useWebAuth;


// 