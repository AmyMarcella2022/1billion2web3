import React, { useState } from 'react';
import { AdminSideMenu } from '../../utils/constants';
import { Link } from 'react-router-dom';
import { IoCloseCircleOutline, IoMenu } from 'react-icons/io5';

const Navbar = ({ className }) => {
  const [toggle, setToggle] = useState(false);

  return (
    <div className={className}>
      <div className='navbar bg-base-100'>
        <div className='flex-1'>
          <a className='btn btn-ghost text-xl'>Admin Panel</a>
        </div>
        <div className='flex-none'>
          <button className='btn btn-square btn-ghost'>
            <div className='text-2xl cursor-pointer' onClick={() => setToggle((prev) => !prev)}>
              {toggle ? <IoCloseCircleOutline /> : <IoMenu />}
            </div>
          </button>
          <div
            className={`${
              toggle ? 'flex' : 'hidden'
            } p-6 bg-white absolute top-20 right-0 mx-4 my-2 min-w-[140px] rounded-xl shadow-lg sidebar`}
          >
            <ul className='list-none flex flex-col justify-end items-center flex-1'>
              {AdminSideMenu.map((nav, index) => (
                <li
                  key={nav.title}
                  className={`font-poppins font-normal cursor-pointer text-[16px] ${
                    index === AdminSideMenu.length - 1 ? 'mr-0' : 'mb-5'
                  } text-black`}
                >
                  <Link to={nav.path}>{nav.title}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
