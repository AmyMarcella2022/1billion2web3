import React, { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';
// import { getCurrentUser, db } from '../../firebase';
// import { setDoc, doc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { addProgress } from '../../firebase';
import Loader from './Loader';

const SuccessPage = () => {
  const { moduleNumber, setToastContent, setToastOpen, setToastVariant } = useContext(AppContext);

  const [buttonLoading, setButtonLoading] = useState(false);

  const navigate = useNavigate();

  // const [walletAddress, setWalletAddress] = useState('');

  const saveProgress = async (module) => {
    setButtonLoading(true);

    var email = localStorage.getItem('userEmail');

    const progress = {
      email,
      moduleNumber: module,
    };

    try {
      await addProgress(email, progress);
      setToastContent('Progress updated');
      setToastVariant('alert-success');
      setToastOpen(true);
    } catch (error) {
      setToastContent('Error updating progress');
      setToastVariant('alert-error');
      setToastOpen(true);
    }
  };

  const proceed = async (e) => {
    e.preventDefault();

    try {
      await saveProgress(moduleNumber);
      navigate('/dashboard');
    } catch (error) {
      console.log(error);
    } finally {
      setButtonLoading(false);
    }
  };

  return (
    <div className=''>
      <div className='card card-normal lg:w-[500px] bg-base-100 shadow-xl'>
        <div className='card-body items-center text-center'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='stroke-current shrink-0 h-20 w-20 text-success'
            fill='none'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
            />
          </svg>
          <h5 className='text-lg font-bold font-poppins uppercase'>
            Congratulations on finishing module {moduleNumber}
          </h5>

          <div className='card-actions'>
            <button className='btn btn-success' onClick={proceed}>
              {buttonLoading ? <Loader /> : 'Proceed to Next Module'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export { SuccessPage };
