import React, { createContext, useState } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [toastOpen, setToastOpen] = useState(false);
  const [toastContent, setToastContent] = useState('');
  const [toastVariant, setToastVariant] = useState('alert-info');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const [modalTitle, setModalTitle] = useState('Congratulations!!!');
  const [metaLink, setMetaLink] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [moduleNumber, setModuleNumber] = useState(0);

  const providerValues = {
    toastOpen,
    setToastOpen,
    toastContent,
    setToastContent,
    toastVariant,
    setToastVariant,
    modalOpen,
    setModalOpen,
    modalContent,
    setModalContent,
    modalTitle,
    setModalTitle,
    userEmail,
    setUserEmail,
    metaLink,
    setMetaLink,
    moduleNumber,
    setModuleNumber,
  };

  return <AppContext.Provider value={providerValues}>{children}</AppContext.Provider>;
};
