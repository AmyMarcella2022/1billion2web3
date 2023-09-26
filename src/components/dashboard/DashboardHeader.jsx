import React from 'react';
import { BiUserCircle } from 'react-icons/bi';

const DashboardHeader = ({ user }) => {
  return (
    <div className='flex flex-col justify-center items-center'>
      <div className='avatar'>
        <div className='w-14 rounded-full mt-5'>
          <BiUserCircle size='3rem' color='#000' />
        </div>
      </div>
      <div className='text-center font-bold'>{user?.email}</div>
    </div>
  );
};

export default DashboardHeader;
