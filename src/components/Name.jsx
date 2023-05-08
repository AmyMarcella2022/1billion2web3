import React, { useState } from 'react';
import styles from '../styles';
import { useNavigate } from 'react-router-dom';
import useAlertModal from '../hooks/useAlertModal';

const Name = () => {
  const alertModal = useAlertModal();

  const navigate = useNavigate();

  const [name, setName] = useState('');

  const continueGame = (e) => {
    e.preventDefault();

    if (name.trim() === '') {
      alertModal.setTitle('Name missing');
      alertModal.setContent('Please input your name!');
      alertModal.open();
      return;
    }

    sessionStorage.setItem('name', name);

    navigate('/module/1');
  };

  return (
    <>
      <div className={`w-full max-w-md p-3`}>
        <h2 className={`${styles.heading2} text-center`}>Welcome to</h2>
        <h4 className={`${styles.paragraph} text-center text-dimWhite`}>1Billion2Web3Initiative</h4>
        <form onSubmit={continueGame} className='bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4'>
          <div className='mb-4'>
            <label className='block text-gray-700 text-sm font-bold mb-2'>
              Please enter your name:
            </label>
            <input
              className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
              id='name'
              type='text'
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className='flex justify-center items-center'>
            <button
              className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
              type='submit'
            >
              Continue
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default Name;
