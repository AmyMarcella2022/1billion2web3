import React, { useState, useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { getCurrentUser, db } from '../../firebase';
import { setDoc, doc } from 'firebase/firestore';

const SuccessPage = () => {
  const { moduleNumber, metaLink, setToastContent, setToastVariant, setToastOpen } =
    useContext(AppContext);

  const user = getCurrentUser();

  const [walletAddress, setWalletAddress] = useState('');

  const submit = () => {
    setDoc(doc(db, `module${moduleNumber}Addresses`, `${user.email}`), {
      email: user?.email,
      evmAddress: walletAddress,
    })
      .then(() => {
        window.open(metaLink);
      })
      .catch((error) => {
        setToastContent('Server error. Try again later.');
        setToastVariant('alert-error');
        setToastOpen(true);
      });
  };

  const proceed = (e) => {
    e.preventDefault();

    var answer = prompt('Please confirm your wallet address', walletAddress);

    if (answer != null) {
      setWalletAddress(answer);
      submit();
      return;
    }
  };

  return (
    <div className=''>
      <div className='card w-[500px] bg-base-100 shadow-xl'>
        <div className='card-body items-center text-center'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='stroke-current shrink-0 h-20 w-20'
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
          <h5>Congratulations on finishing module {moduleNumber}</h5>
          <div className='form-control'>
            <label className='label'>
              <span className='label-text'>Wallet Address</span>
            </label>
            <input
              type='text'
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              className='input input-bordered'
              placeholder='Enter your GATA wallet address to receive your reward token'
            />
          </div>
          <div className='card-actions'>
            <button className='btn btn-success' onClick={proceed}>
              Proceed to Next Module
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export { SuccessPage };
