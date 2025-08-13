import React, { useContext, useEffect, useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import './App.css';
import { AuthenticationContainer } from './Containers/AuthenticationContainer';
import { LoadingContainer } from './Containers/LoadingContainer';
import { Full } from './Components/MainMenu/Full';
import { ErrorContainer } from './Containers/ErrorContainer';
import { Login } from './Forms/Login/Login';
import { LoadingContext } from './ContextProvider/LoadingContext';
import { mobileDevicesWidth, urlPath } from './globals';
import PageError from './Containers/PageError';
// import PDFViewer from './ReusableComponents/PdfViewer/PDFViewer';

function App() {
  const { setisLoading } = useContext(LoadingContext);


  const state = {
    patientData: localStorage.getItem('patientData') ? JSON.parse(localStorage.getItem('patientData')) : {}
  }

  return (

    // <PDFViewer />

    <Routes>
      <Route element={<ErrorContainer />}>
        <Route element={<LoadingContainer />}>
          <Route element={<AuthenticationContainer />}>
            <Route path='/login' element={<Login />} />
            <Route path='/error' element={<PageError />} />

            <Route path='/' element={<Full />}>
            </Route>
          </Route>
        </Route>
      </Route >
    </Routes >

  );
}

export default App;
