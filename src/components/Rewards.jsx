import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import styles from '../styles';
import { useNavigate, useParams } from 'react-router-dom';
import useAlertModal from '../hooks/useAlertModal';

const Rewards = ({}) => {
  const alertModal = useAlertModal();

  const navigate = useNavigate();

  const { id } = useParams();
  const module = parseInt(id);

  const [email, setEmail] = useState('');
  const [walletAddress, SetWalletAddress] = useState('');
  const [loading, setLoading] = useState(false);

  const submitDetails = async (e) => {
    e.preventDefault();

    if (email.trim() === '') {
      alertModal.setTitle('Email missing');
      alertModal.setContent('Please fill in your email');
      alertModal.open();
      return;
    }

    setLoading(true);

    try {
      await addDoc(collection(db, `module${module}Rewards`), {
        name: sessionStorage.getItem('name'),
        email: email,
        evmAddress: walletAddress,
      });
      alertModal.setTitle('Success');
      alertModal.setContent('Details submitted successfully');
      alertModal.open();
      navigate(`/module/${module + 1}`);
    } catch (error) {
      alertModal.setTitle('Server Error');
      alertModal.setContent('Error submitting details. Try again later');
      alertModal.open();
    } finally {
      setLoading(false);
    }
  };

  const exit = () => {
    navigate('/');
  };

  return (
    <div>
      <h2 className={`${styles.paragraph} text-center text-dimWhite`}>
        Please submit your email address below to get your certificate & also your wallet address to
        receive your reward.
      </h2>
      <div className='flex flex-col justify-center items-center mt-10'>
        <div>
          <label className='block text-white text-sm font-bold mb-2'>Email Address</label>
          <input
            type='text'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
          />
        </div>
        <div>
          <label className='block text-white text-sm font-bold mb-2'>
            Evm Wallet Address (Optional)
          </label>
          <input
            type='text'
            value={walletAddress}
            onChange={(e) => SetWalletAddress(e.target.value)}
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
          />
        </div>
      </div>
      <div className='flex justify-center items-center content-between mt-10 p-5'>
        <div>
          {loading ? (
            <div class='flex items-center justify-center'>
              <div
                className='inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]'
                role='status'
              >
                <span className='!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]'>
                  Loading...
                </span>
              </div>
            </div>
          ) : (
            <div className='flex flex-1 flex-row justify-around'>
              <div className='p-2 flex-col'>
                <button
                  onClick={exit}
                  className='bg-white hover:bg-slate-300 text-black font-bold py-2 px-4 ml-3 rounded focus:outline-none focus:shadow-outline'
                >
                  Exit
                </button>
              </div>
              <div className='p-2 flex-col'>
                <button
                  onClick={submitDetails}
                  className='bg-white hover:bg-slate-300 text-black font-bold py-2 px-4 ml-3 rounded focus:outline-none focus:shadow-outline'
                >
                  Go to Next Module
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Rewards;
