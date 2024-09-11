import React, { useEffect } from 'react';
import SideBar from './components/SideBar';
import Navbar from './components/Navbar';
import { useNavigate } from 'react-router-dom';

const AdminLayout = ({ children }) => {
  const navigate = useNavigate();

  const authenticated = localStorage.getItem('authenticated');

  useEffect(() => {
    if (authenticated !== 'true') {
      navigate('/');
    }
  }, []);

  return (
    <div>
      <div className='lg:hidden'>
        <Navbar />
        {children}
      </div>
      <div className='hidden lg:block'>
        <div className='grid grid-cols-4'>
          <div className='col-span-1'>
            <SideBar />
          </div>
          <div className='col-span-3'>{children}</div>
        </div>
      </div>
    </div>
  );
};

export { AdminLayout };
