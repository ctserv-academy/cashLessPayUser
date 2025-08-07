import React, { useContext, useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import './App.css';
import Full from './AppMainComponents/full/Full';

import VerificationPage from './AppBodyComponents/verificationPage/VerificationPage';
import RegistrationPage from './AppBodyComponents/registrationPage/RegistrationPage';

import Home from './AppBodyComponents/home/Home';
import RewardsPoints from './AppBodyComponents/rewardsPoints/RewardsPoints';
import Notifications from './AppBodyComponents/notifications/Notifications';
import ContactUs from './AppBodyComponents/contactUs/ContactUs';

import Profile from './AppBodyComponents/profile/Profile';
import TermsAndConditions from './AppBodyComponents/termsAndConditions/TermsAndConditions';
import PrivacyPolicy from './AppBodyComponents/privacyPolicy/PrivacyPolicy';
import Support from './AppBodyComponents/support/Support';
import AuthContainer from './Containers/AuthContainer';
import { LoadingContainer } from './Containers/LoadingContainer';
import { usePWA } from './hooks/usePWA';
import { NotificationContext } from './ContextProviders/NotificationContext';
import { cloneDeep } from 'lodash';
import TestingLockScreenPin from './TestingLockScreenPin';
// import usePushNotificationsContainer from './hooks/usePushNotification'


function App() {
  const [clientData] = usePWA()
  const { notificationCount, setNotificationCount, notifications, setNotifications, setClearNotifications } = useContext(NotificationContext)
  const location = useLocation()
  useEffect(() => {
    // Listen for messages from the service worker
    const messageHandler = (event) => {
      console.log('messageHandler', event)
      if (event.data.type === 'NOTIFICATIONS_DATA') {
        console.log('Received notifications data:', event.data.notifications)
        setNotifications(event.data.notifications);
        setNotificationCount(event.data.notifications.filter(n => !n.read).length);
      }
      else if (event.data.type === 'NOTIFICATION_COUNT_UPDATE') {
        console.log('Received notification update:', event.data.notifications)
        setNotifications(event.data.notifications);
        setNotificationCount(event.data.count);
      }
      else if (event.data.type === 'NOTIFICATION_OPEN') {
        console.log('Received NOTIFICATION_OPEN Approve for ' + event.data.notification.title)
        // alert('Received NOTIFICATION_OPEN Approve for ' + event.data.notification.title)
      }
    };

    navigator.serviceWorker.addEventListener('message', messageHandler);

    // Request notifications from service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(registration => {
        // Initial sync
        registration.active.postMessage({
          type: 'GET_NOTIFICATIONS'
        });

        // Set up periodic sync every 30 seconds
        const syncInterval = setInterval(() => {
          registration.active.postMessage({
            type: 'GET_NOTIFICATIONS'
          });
        }, 30000);

        // Clean up interval on unmount
        return () => clearInterval(syncInterval);
      });
    }

    return () => {
      navigator.serviceWorker.removeEventListener('message', messageHandler);
    };
  }, []);

  // Effect to mark notifications as read when entering notifications screen
  useEffect(() => {
    if (location.pathname === '/Notifications' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(registration => {
        registration.active.postMessage({
          type: 'MARK_NOTIFICATIONS_READ'
        });
      });
    }
  }, [location.pathname]);

  setClearNotifications.current = (tag = null) => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(registration => {
        registration.active.postMessage({
          type: 'CLEAR_NOTIFICATIONS',
          tag: tag
        });
        setNotificationCount(0);
        setNotifications([]);
      });
    }
  };

  console.log('notifications', notifications)

  return (
    <>
      <Routes>
        <Route path='/TestingLockScreenPin' element={<TestingLockScreenPin />} />
        <Route element={<AuthContainer />}>
          <Route element={<LoadingContainer />}>
            <Route path='/RegistrationPage' element={<RegistrationPage />} />
            <Route path='/VerificationPage' element={<VerificationPage />} />
            <Route path='/' element={<Full />}>
              <Route path='/' element={<Home />} />
              <Route path='/Home' element={<Home />} />
              <Route path='/RewardsPoints' element={<RewardsPoints />} />
              <Route path='/Notifications' element={<Notifications />} />
              <Route path='/ContactUs' element={<ContactUs />} />

              <Route path='/Profile' element={<Profile />} />
              <Route path='/TermsAndConditions' element={<TermsAndConditions />} />
              <Route path='/PrivacyPolicy' element={<PrivacyPolicy />} />
              <Route path='/Support' element={<Support />} />
            </Route>
          </Route>
        </Route>

      </Routes >
      {/* {notificationCount > 0 && (
        <div onClick={() => clearNotifications()} className="notification-badge">
          {notificationCount}
        </div>
      )} */}
    </>

  );

}

export default App;
