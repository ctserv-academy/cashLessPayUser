import React, { createContext, useRef, useState } from "react";

export const NotificationContext = createContext();

export function NotificationContextWrapper({ children }) {
  const [notificationCount, setNotificationCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const setClearNotifications = useRef(null);

  return (
    <NotificationContext.Provider
      value={{
        notificationCount,
        setNotificationCount,
        notifications,
        setNotifications,
        setClearNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}
