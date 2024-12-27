import React, { useState } from 'react';
import { auth, addNewDocument } from '../../firebase';
import { Link, useNavigate } from 'react-router-dom';
import Loader from '../common/Loader';
import Navbar from '../common/Navbar';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import lotus from '../../assets/lotus-small.jpeg';
import { ROLES } from '../utils/constants';
import { toast } from 'react-toastify';

const Register = () => {

  const navigate = useNavigate();

  const authCode = 'Lotusglobalalliancebrings1billion2web3'.toLowerCase()

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const createUser = async (e) => {
    e.preventDefault();

    if (password.length < 6) {
      toast.error('Please enter a password with at least six characters.')
      return;
    }

    if(code.toLowerCase() != authCode){
      toast.error('Invalid authorization code')
      return
    }

    const userData = {
      name,
      email,
      role
    };

    setLoading(true);

    createUserWithEmailAndPassword(auth, email, password)
      .then(() => {
        addNewDocument('admin-users', userData);
      })
      .then(() => {
        navigate('/login');
      })
      .catch((error) => {
        toast.error(error)
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
            {/* <h1 className='card-title font-poppins text-2xl text-white'>REGISTER</h1> */}
            <div className='flex justify-center'>
              <div className='avatar'>
                <div className='w-24 rounded-full'>
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
                    <span className='label-text'>Role</span>
                  </label>
                  <select className='select select-bordered' value={role} onChange={(e) => setRole(e.target.value)}>
                    <option value="">-</option>
                    {
                      ROLES.map((role) => (
                        <option value={role.value} key={role.id}>{role.label}</option>
                      ))
                    }
                  </select>
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
                <div className='form-control'>
                  <label className='label'>
                    <span className='label-text'>Authorization Code</span>
                  </label>
                  <input
                    type='password'
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
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
