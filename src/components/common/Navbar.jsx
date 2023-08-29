import React, { useState } from 'react';
import { getCurrentUser } from '../../firebase';
import { Link, useNavigate } from 'react-router-dom';
import close from '../../assets/close.svg';
import menu from '../../assets/menu.svg';
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
    <nav className='w-full flex py-3 justify-between items-center navbar fixed top-0 bg-black'>
      <h1 className='font-signature text-3xl text-white h-[20px] w-[50px]'>
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
              } text-white`}
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
        <img
          src={toggle ? close : menu}
          alt='nav menu'
          className='w-[28px] h-[28px] object-contain'
          onClick={() => setToggle((prev) => !prev)}
        />

        <div
          className={`${
            toggle ? 'flex' : 'hidden'
          } p-6 bg-black-gradient absolute top-20 right-0 mx-4 my-2 min-w-[140px] rounded-xl sidebar z-50`}
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
                  } text-white`}
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
