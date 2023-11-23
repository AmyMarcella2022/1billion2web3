import React, { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
// import { getCurrentUser, db } from '../../firebase';
// import { setDoc, doc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom'

const SuccessPage = () => {
  const { moduleNumber } =
    useContext(AppContext);

  // const user = getCurrentUser();

  const navigate = useNavigate()

  // const [walletAddress, setWalletAddress] = useState('');

  const submit = () => {
    // setDoc(doc(db, `module${moduleNumber}Addresses`, `${user.email}`), {
    //   email: user?.email,
    //   evmAddress: walletAddress,
    // })
    //   .then(() => {
    //     window.open(metaLink);
    //   })
    //   .catch((error) => {
    //     setToastContent('Server error. Try again later.');
    //     setToastVariant('alert-error');
    //     setToastOpen(true);
    //   });

    navigate('/dashboard')
  };

  const proceed = (e) => {
    e.preventDefault();

    submit()
  };

  return (
    <div className=''>
      <div className='card w-[500px] bg-base-100 shadow-xl'>
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
          <h5 className='text-lg font-bold font-poppins uppercase'>Congratulations on finishing module {moduleNumber}</h5>
          
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
