// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import './index.css';
// import App from './App';
// import reportWebVitals from './reportWebVitals';

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );

// // If you want to start measuring performance in your app, pass a function
// // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';


//import 'react-datepicker/dist/react-datepicker.css';
import "react-table/react-table.css";
import 'icheck/skins/all.css';
import 'react-virtualized/styles.css'
import 'react-virtualized-select/styles.css'
import 'react-datepicker/dist/react-datepicker.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import { HashRouter } from "react-router-dom";
import { SettingsContextWrapper } from './ContextProvider/SettingsContext';
import { AuthContextWrapper } from './ContextProvider/AuthContext';
import { LoadingContextWrapper } from './ContextProvider/LoadingContext';
import { ErrorContextWrapper } from './ContextProvider/ErrorContext';
import axios from 'axios';
import { has, isArray } from 'lodash';
import { ToastProvider } from 'react-toast-notifications';


// Add a response interceptor
axios.interceptors.response.use(function (response) {
  let responseObj = {}
  if (isArray(response.data)) {
    responseObj.success = true
    responseObj.data = response.data
  }
  else {
    if (has(response.data, 'data') && has(response.data, 'success')) {
      responseObj = response.data;
    }
    else {
      let newToken = response?.headers?._auth?.replace("Bearer ", "")
      if (newToken)
        localStorage.setItem('token', newToken)

      responseObj.success = true
      responseObj.status = 200
      let arr = []
      arr.push(response.data)
      responseObj.data = arr
    }
  }
  return responseObj;

}, function (error) {

  let err1 = JSON.parse(JSON.stringify(error));

  if (err1.status === 401) {
    console.log(401)
    let responseObj = {}
    responseObj.success = false
    responseObj.status = 401
    responseObj.message = 'Unauthorized Access'
    responseObj.data = []
    localStorage.removeItem('token')
    return Promise.resolve(responseObj)
  }
  //schema validation error
  else if (err1.status === 400) {
    let errordata = error?.response?.data?.errors
    if (errordata) {
      let responseObj = {}
      responseObj.status = 400
      responseObj.success = false
      responseObj.message = err1.message
      responseObj.data = [{ ...errordata }]
      return Promise.resolve(responseObj)
    }
  }
  //User Message
  else if (err1.status === 313) {
    let errordata = error?.response?.data
    if (errordata) {
      let responseObj = {}
      responseObj.status = 313
      responseObj.success = false
      responseObj.message = err1.message
      responseObj.data = [errordata]
      return Promise.resolve(responseObj)
    }
  }
  return Promise.reject(err1);
});

//Add request interceptors
axios.interceptors.request.use(function (config) {
  try {
    let uri = new URL(config.url);

    if (uri.pathname.toLowerCase() !== '/login' && uri.pathname.toLowerCase() !== '/system/getmileramdsystemfile'
      && uri.pathname.toLowerCase() !== '/system/getlogomilera' && uri.pathname.toLowerCase() !== '/hisservice/auth/getmileratoken') {

      // let token = getSessionInfo('token')
      let token = localStorage.getItem('token')
      config.headers['authorization'] = `Bearer ${token}`;
    }
  }
  catch (e) {
    if (!e.message.toLowerCase().includes('invalid url')) {
      Promise.reject(e)
    }

  }



  return config

}, function (error) {
  Promise.reject(error)
})

ReactDOM.render(
  // <React.StrictMode>
  <HashRouter>
    <ErrorContextWrapper>
      <SettingsContextWrapper>
        <AuthContextWrapper>
          <LoadingContextWrapper>
            <ToastProvider>
              <App />
            </ToastProvider>
          </LoadingContextWrapper>
        </AuthContextWrapper>
      </SettingsContextWrapper>
    </ErrorContextWrapper>
  </HashRouter>,

  // </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
serviceWorkerRegistration.register();
reportWebVitals();
