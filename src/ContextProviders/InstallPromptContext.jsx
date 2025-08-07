import React, { createContext, useEffect, useRef, useState } from "react";

export const InstallPromptContext = createContext();
export function InstallPromptContextWrapper({ children }) {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState("N");
  const [askForNotification, setAskForNotification] = useState("Y");
  const toggleAskForNotificationRef = useRef(null);

  useEffect(() => {
    console.log("deferredPrompt", deferredPrompt);
  }, [deferredPrompt]);
  useEffect(() => {
    console.log("InstallPromptContextWrapper");
  }, []);
  return (
    <InstallPromptContext.Provider
      value={{
        deferredPrompt,
        setDeferredPrompt,
        isInstalled,
        setIsInstalled,
        askForNotification,
        setAskForNotification,
        toggleAskForNotificationRef,
      }}
    >
      {children}
    </InstallPromptContext.Provider>
  );
}
