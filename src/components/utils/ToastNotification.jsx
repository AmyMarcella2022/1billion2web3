import React, { useContext, useEffect } from 'react';
import { AppContext } from '../../context/AppContext';
import { AiOutlineCloseCircle } from 'react-icons/ai';

const ToastNotification = () => {
  const { toastOpen, toastContent, setToastOpen, toastVariant } = useContext(AppContext);

  if (!toastOpen) {
    return null;
  }

  useEffect(() => {
    if (toastOpen) {
      setTimeout(() => {
        setToastOpen(!toastOpen);
      }, 2500);
    }
  }, [toastOpen, setToastOpen]);

  return (
    <div
      className='toast toast-top toast-end cursor-pointer z-10'
      onClick={() => setToastOpen(false)}
    >
      <div className={`alert ${toastVariant}`}>
        <span>
          <AiOutlineCloseCircle />
        </span>
        <span>{toastContent}</span>
      </div>
    </div>
  );
};

export default ToastNotification;
