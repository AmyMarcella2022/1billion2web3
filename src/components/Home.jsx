import React, { useState, useContext } from 'react';
import styles from '../styles';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { AppContext } from '../context/AppContext';
import Navbar from './common/Navbar';
import { signInWithEmailAndPassword } from 'firebase/auth';
import Loader from './common/Loader';
import { BsEyeFill, BsEyeSlashFill } from 'react-icons/bs';
import lotus from '../assets/lotus-small.jpeg'

const Home = () => {
  const navigate = useNavigate();

  const { setToastOpen, setToastContent, setToastVariant } = useContext(AppContext);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);

  const signin = async (e) => {
    e.preventDefault();

    if (email === '' || password === '') {
      setToastVariant('alert-error');
      setToastContent('Email/Password incorrect');
      setToastOpen(true);
      return;
    }

    setLoading(true);

    setTimeout(() => {
      signInWithEmailAndPassword(auth, email, password)
        .then((user) => {
          console.log(user);
          navigate('/dashboard');
        })
        .catch((error) => {
          setToastVariant('alert-error');
          setToastContent(`${error.message}`);
          setToastOpen(true);
        })
        .finally(() => {
          setLoading(false);
        });
    }, 1000);
  };

  return (
    <div className='bg-black'>
      <Navbar />
      <section id='home' className='mt-5 hero min-h-screen'>
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
                  <div className='flex justify-center'>
                    <div className="avatar">
                      <div className="w-24 rounded-full">
                        <img src={lotus} alt='Lotus' />
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
                      <div className='input-group'>
                        <input
                          type={show ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className='input input-bordered w-full'
                          required
                        />
                        <span className='rounded-r cursor-pointer' onClick={() => setShow(!show)}>
                          {show ? <BsEyeFill /> : <BsEyeSlashFill />}
                        </span>
                      </div>
                      <label className='label mt-5 justify-center'>
                        <Link
                          to='/register'
                          className='label-text-alt link link-hover font-semibold'
                        >
                          Don't have an account? Register
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
      </section>
    </div>
  );
};

export default Home;
