import React from 'react';
import error404 from '../../assets/404.svg';
import { useNavigate } from 'react-router-dom';

const Error = () => {
  const navigate = useNavigate();

  return (
    <div className='h-screen overflow-y-scroll'>
      <div className='flex justify-center items-center flex-col gap-4'>
        <div>
          <img src={error404} alt='Error Page' className='w-[600px]' />
        </div>
        <div>
          <button onClick={() => navigate('/')} className='btn btn-error my-10'>
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default Error;
