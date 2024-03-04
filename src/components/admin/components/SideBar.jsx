import React from 'react';
import { AdminSideMenu } from '../../utils/constants';
import { Link } from 'react-router-dom';
// import { FaUsers } from 'react-icons/fa';

const SideBar = () => {
  return (
    <div>
      <div className='menu bg-base-200 rounded-box h-screen items-center'>
        <h1 className='my-5 text-2xl font-semibold'>Admin Panel</h1>
        <div className='divider'></div>
        <div className='flex flex-col items-start gap-4'>
          {AdminSideMenu.map((menuItem) => (
            <Link
              key={menuItem.title}
              to={menuItem.path}
              className='flex gap-5 py-4 px-20 rounded-xl hover:bg-base-300'
            >
              <h3 className='text-2xl'>{menuItem.icon}</h3>
              <h3 className='text-xl'>{menuItem.title}</h3>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SideBar;
