import React, { useState, useContext } from 'react';
import styles from '../styles';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../firebase';
import { AppContext } from '../context/AppContext';
import Navbar from './common/Navbar';

const Home = () => {
  const navigate = useNavigate();

  const { setToastOpen, setToastContent, setToastVariant, setUserEmail } = useContext(AppContext);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const signin = async (e) => {
    e.preventDefault();

    if (email.trim() === '' || password.trim() === '') {
      setToastVariant('alert-error');
      setToastContent('Email/Password incorrect');
      setToastOpen(true);
      return;
    }

    setLoading(true);

    login(email, password)
      .then((user) => {
        // setUserEmail(user.email)
        console.log(user);
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
    <div className='bg-black'>
      <Navbar />
      <section id='home' className='hero min-h-screen'>
        <div className={`flex md:flex-row-reverse flex-col ${styles.paddingY}`}>
          <div className={`flex-1 ${styles.flexStart} flex-col xl:px-0 sm:px-16 px-6`}>
            <h1 className='flex-1 font-poppins font-semibold ss:text-[69px] text-[50px] text-white ss:leading-[100px] leading-[75px]'>
              <br className='sm:block hidden' /> <span className='text-gradient'>Web3 Quest</span>{' '}
            </h1>
            <p className={`${styles.paragraph} mb-5`}>
              Welcome to the 1Billion2Web3Initiative quiz. Watch short videos in the metaverse and
              answer questions. Get a free token at the end.
            </p>
          </div>

          <div className={`flex-1 flex ${styles.flexCenter} md:my-0 my-10`}>
            <div className='card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100'>
              <div className='card-body'>
                <form onSubmit={signin}>
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
                        <Link
                          to='/register'
                          className='label-text-alt link link-hover font-semibold'
                        >
                          Register
                        </Link>
                      </label>
                    </div>
                    <div className='form-control mt-6'>
                      <button
                        type='submit'
                        className='rounded-full py-4 px-6 bg-blue-gradient font-poppins font-medium text-[18px] text-primary outline-none duration-200 hover:scale-105 btn-block'
                      >
                        LOGIN
                      </button>
                    </div>
                  </fieldset>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
