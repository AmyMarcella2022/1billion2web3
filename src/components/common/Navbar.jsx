import React, { useState } from 'react';
import { getCurrentUser } from '../../firebase';
import { Link, useNavigate } from 'react-router-dom';
import { AiOutlineClose, AiOutlineMenu } from 'react-icons/ai';
import { navbarButtons } from '../utils/constants';

const Navbar = () => {
  const user = getCurrentUser();

  const navigate = useNavigate();

  const [toggle, setToggle] = useState(false);

  const signout = () => {
    logout
      .then(() => {
        navigate('/');
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <nav className='w-full flex py-3 mb-5 justify-between items-center navbar fixed top-0 z-10 bg-base-100/95 backdrop-blur border-b border-base-300 px-3 pt-[env(safe-area-inset-top)]'>
      <h1 className='font-signature text-2xl sm:text-3xl text-base-content whitespace-nowrap'>
        1Billion2Web3Initiative
      </h1>

      <ul className='list-none sm:flex hidden justify-end items-center flex-1'>
        {user ? (
          <li>
            <button className='btn' onClick={signout}>
              LOGOUT
            </button>
          </li>
        ) : (
          navbarButtons.map((nav, index) => (
            <li
              key={nav.id}
              className={`font-poppins font-normal cursor-pointer text-[16px] ${
                index === navbarButtons.length - 1 ? 'mr-0' : 'mr-10'
              } text-base-content`}
            >
              <Link to={nav.path} className='btn'>
                {nav.label}
              </Link>
            </li>
          ))
        )}
      </ul>

      {/* mobile view */}
      <div className='sm:hidden flex flex-1 justify-end items-center'>
        <button
          type='button'
          aria-label={toggle ? 'Close menu' : 'Open menu'}
          aria-expanded={toggle}
          className='btn btn-ghost btn-square text-2xl'
          onClick={() => setToggle((prev) => !prev)}
        >
          {toggle ? <AiOutlineClose /> : <AiOutlineMenu />}
        </button>

        <div
          className={`${
            toggle ? 'flex' : 'hidden'
          } p-6 bg-base-100 border border-base-300 shadow-xl absolute top-full right-0 mx-4 my-2 min-w-[160px] rounded-xl sidebar z-50`}
        >
          <ul className='list-none flex flex-col justify-end items-center flex-1'>
            {user ? (
              <li>
                <button className='btn' onClick={signout}>
                  LOGOUT
                </button>
              </li>
            ) : (
              navbarButtons.map((nav, index) => (
                <li
                  key={nav.id}
                  className={`font-poppins font-normal cursor-pointer text-[16px] ${
                    index === navbarButtons.length - 1 ? 'mb-0' : 'mb-10'
                  } text-base-content`}
                >
                  <Link to={nav.path} className='btn'>
                    {nav.label}
                  </Link>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
