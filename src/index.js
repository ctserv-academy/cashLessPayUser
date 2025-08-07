import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import 'bootstrap/dist/css/bootstrap.css'
import { HashRouter } from 'react-router-dom';
import { AuthContextWrapper } from './ContextProviders/AuthContext';
import { LoadingContextWrapper } from './ContextProviders/LoadingContext';
import { ToastContextWrapper } from './ContextProviders/ToastNotificationContext';
import { InstallPromptContextWrapper } from './ContextProviders/InstallPromptContext';
import { NotificationContextWrapper } from './ContextProviders/NotificationContext';

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <HashRouter>

    <ToastContextWrapper>
      <LoadingContextWrapper>
        <AuthContextWrapper>
          <InstallPromptContextWrapper>
            <NotificationContextWrapper>
              <App />
            </NotificationContextWrapper>

          </InstallPromptContextWrapper>
        </AuthContextWrapper>
      </LoadingContextWrapper>
    </ToastContextWrapper>

  </HashRouter>,
);

serviceWorkerRegistration.register();
reportWebVitals();