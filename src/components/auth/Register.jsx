import React, { useState, useContext } from 'react';
import { addDocumentWithID, auth } from '../../firebase';
import { Link, useNavigate } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import Loader from '../common/Loader';
import Navbar from '../common/Navbar';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import lotus from '../../assets/lotus-small.jpeg';

const Register = () => {
  const { setToastContent, setToastOpen, setToastVariant } = useContext(AppContext);

  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [walletAddress, setWalletAddress] = useState('')
  const [loading, setLoading] = useState(false);

  const createUser = async (e) => {
    e.preventDefault();

    if (password.length < 6) {
      setToastContent('Please enter a password with at least six characters.');
      setToastVariant('alert-info');
      setToastOpen(true);
      return;
    }

    const userData = {
      name,
      email,
      walletAddress
    };

    setLoading(true);

    createUserWithEmailAndPassword(auth, email, password)
      .then((user) => {
        addDocumentWithID('users', user.uid, userData);
      })
      .then(() => {
        navigate('/login');
      })
      .catch((error) => {
        setToastVariant('alert-error');
        setToastContent(`${error}`);
        setToastOpen(true);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <>
      <Navbar />
      <div className='flex items-center justify-center bg-black h-screen overflow-y-scroll'>
          <div className='card bg-base-200 mt-80 lg:mt-36'>
            <div className='card-body text-center'>
            <h1 className='card-title font-poppins text-2xl text-white'>REGISTER</h1>
              <div className='flex justify-center'>
                <div className="avatar">
                  <div className="w-24 rounded-full">
                    <img src={lotus} alt='Lotus' />
                  </div>
                </div>
              </div>
              <form onSubmit={createUser}>
                <fieldset disabled={loading}>
                  <div className='flex flex-col md:flex-row gap-3'>
                  <div className='form-control'>
                    <label className='label'>
                      <span className='label-text'>Full Name</span>
                    </label>
                    <input
                      type='text'
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className='input input-bordered'
                      required
                    />
                  </div>
                  <div className='form-control'>
                    <label className='label'>
                      <span className='label-text'>Email</span>
                    </label>
                    <input
                      type='email'
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className='input input-bordered'
                      required
                    />
                  </div>
                  </div>
                  <div className='form-control'>
                    <label className='label'>
                      <span className='label-text'>Wallet Address</span>
                    </label>
                    <input type='text' value={walletAddress} onChange={(e) => setWalletAddress(e.target.value)} className='input input-bordered'  />
                  </div>
                  <div className='form-control'>
                    <label className='label'>
                      <span className='label-text'>Password</span>
                    </label>
                    <input
                      type='password'
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className='input input-bordered'
                      required
                    />
                    </div>
                    <div>
                    <label className='label'>
                      <span className='label-text-alt font-semibold'>Already have an account?</span>
                      <Link to='/login' className='label-text-alt link link-hover font-semibold'>
                        Login
                      </Link>
                    </label>
                  </div>
                  <div className='card-actions mt-6'>
                    {loading ? (
                      <div className='text-center'>
                        <Loader />
                      </div>
                    ) : (
                      <button
                        type='submit'
                        className='rounded-full py-4 px-6 bg-blue-gradient font-poppins font-medium text-[18px] text-primary outline-none duration-200 hover:scale-105 btn-block'
                      >
                        SUBMIT
                      </button>
                    )}
                  </div>
                </fieldset>
              </form>
            </div>
          </div>
        </div>
    </>
  );
};

export default Register;
