import React, { createContext, useState } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [toastOpen, setToastOpen] = useState(false);
  const [toastContent, setToastContent] = useState('');
  const [toastVariant, setToastVariant] = useState('alert-info');
  const [userEmail, setUserEmail] = useState('');

  const providerValues = {
    toastOpen,
    setToastOpen,
    toastContent,
    setToastContent,
    toastVariant,
    setToastVariant,
    userEmail,
    setUserEmail,
  };

  return <AppContext.Provider value={providerValues}>{children}</AppContext.Provider>;
};
