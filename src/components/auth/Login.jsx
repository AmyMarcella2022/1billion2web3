import React, { useState, useCallback, useContext } from 'react';
import { login } from '../../firebase';
import { useNavigate, Link } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import Loader from '../common/Loader';
import Navbar from '../common/Navbar';

const Login = () => {
  const { setToastContent, setToastOpen, setToastVariant } = useContext(AppContext);

  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const signin = useCallback(async (e) => {
    e.preventDefault();

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
  }, []);

  return (
    <>
      <Navbar />
      <div className='bg-black h-screen'>
        <div className='flex flex-col flex-1 items-center'>
          <h1 className='font-poppins text-3xl text-white text-center h-[20px] py-24'>LOGIN</h1>
          <div className='card flex-shrink-0 w-96 shadow-2xl bg-base-100'>
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
