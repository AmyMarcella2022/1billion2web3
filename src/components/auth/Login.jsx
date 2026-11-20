import React, { useState, useContext } from 'react';
import { auth } from '../../firebase';
import { useNavigate, Link } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import Loader from '../common/Loader';
import Navbar from '../common/Navbar';
import {
  signInWithEmailAndPassword,
  // setPersistence,
  // browserSessionPersistence,
} from 'firebase/auth';
// import lotus from '../../assets/lotus-small.jpeg';
import web3 from '../../assets/1b2web3.jpg';

const Login = () => {
  const { setToastContent, setToastOpen, setToastVariant } = useContext(AppContext);

  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const signin = async (e) => {
    e.preventDefault();

    setLoading(true);

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Add user to local storage and update state
        localStorage.setItem('userEmail', userCredential.user.email);
        localStorage.setItem('authenticated', true);
      })
      .then(() => {
        navigate('/dashboard');
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
      <div className='bg-base-200 min-h-[100dvh] px-4 pb-10'>
        <div className='flex flex-col flex-1 items-center'>
          <h1 className='font-poppins text-3xl text-base-content text-center pt-24 pb-6'>LOGIN</h1>
          <div className='card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100'>
            <div className='card-body'>
              <form onSubmit={signin}>
                <div className='flex justify-center'>
                  <div className='avatar'>
                    <div className='w-24 rounded-full'>
                      <img src={web3} alt='1Billion2Web3' />
                    </div>
                  </div>
                </div>
                <fieldset disabled={loading}>
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
                    <label className='label'>
                      <span className='label-text-alt font-semibold'>Don't have an account?</span>
                      <Link to='/register' className='label-text-alt link link-hover font-semibold'>
                        Register
                      </Link>
                    </label>
                  </div>
                  <div className='form-control mt-6'>
                    {loading ? (
                      <div className='text-center'>
                        <Loader />
                      </div>
                    ) : (
                      <button
                        type='submit'
                        className='rounded-full py-4 px-6 bg-blue-gradient font-poppins font-medium text-[18px] text-primary outline-none duration-200 hover:scale-105 btn-block'
                      >
                        LOGIN
                      </button>
                    )}
                  </div>
                </fieldset>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
