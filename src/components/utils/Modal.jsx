import React, { useCallback } from 'react';
import { AiOutlineClose } from 'react-icons/ai';

const Modal = ({ isOpen, onClose, title, body, disabled, clear }) => {
  const handleClose = useCallback(() => {
    if (disabled) {
      return;
    }

    onClose();
  }, [disabled, onClose]);

  const clearModal = useCallback(() => {
    if (disabled) {
      return;
    }

    clear();
  }, [disabled, clear]);

  if (!isOpen) {
    return null;
  }

  return (
    <>
      <div className='justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none'>
        <div className='relative w-full lg:w-3/6 my-6 mx-auto h-auto lg:h-auto'>
          <div className='h-full lg:h-auto border-0 rounded-2xl shadow-lg relative flex flex-col w-full bg-white outline-none'>
            {/* Header */}
            <div className='flex items-center justify-between p-5 rounded-t-2xl'>
              <h3 className='text-3xl font-semibold text-primary'>{title}</h3>
              <button
                onClick={handleClose}
                className='p-1 ml-auto border-0 text-black hover:opacity-70 transition'
              >
                <AiOutlineClose size={20} />
              </button>
            </div>
            {/* Body */}
            <div className='relative p-5 font-medium'>{body}</div>
            {/* Footer */}
            <div className='flex flex-col gap-2 p-5'>
              <button
                onClick={clearModal}
                className='bg-primary hover:bg-opacity-90 text-white font-bold py-2 px-4 ml-3 rounded focus:outline-none focus:shadow-outline'
              >
                OK
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;
