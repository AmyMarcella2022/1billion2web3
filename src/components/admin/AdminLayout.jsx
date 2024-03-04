import React from 'react';
import SideBar from './components/SideBar';
import Navbar from './components/Navbar';

const AdminLayout = ({ children }) => {
  return (
    <div>
      <div className='lg:hidden'>
        <Navbar />
        {children}
      </div>
      <div className='hidden lg:block'>
        <div className='grid grid-cols-4'>
          <div className=''>
            <SideBar />
          </div>
          <div className='col-span-3'>{children}</div>
        </div>
      </div>
    </div>
  );
};

export { AdminLayout };
