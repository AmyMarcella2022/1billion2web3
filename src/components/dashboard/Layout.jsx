import React from 'react';
import { getCurrentUser } from '../../firebase';
import { useNavigate, Link } from 'react-router-dom';
import DashboardHeader from './DashboardHeader';
import { LogoutButton } from '../common/LogoutButton';
import { sideMenuItems } from '../utils/constants';
// import styles from '../../styles';

const Layout = ({ children }) => {
  const user = getCurrentUser();

  const navigate = useNavigate();

  const auth = sessionStorage.getItem('authenticated');

  if (auth != 'true') {
    navigate('/login');
  }

  return (
    <div className='drawer md:drawer-open bg-base-200 min-h-screen'>
      <input id='my-drawer-2' type='checkbox' className='drawer-toggle' />
      <div className='drawer-content flex flex-col items-start justify-start bg-white'>
        {/* Page content here */}
        <div className='py-5'>{children}</div>
      </div>
      <div className='lg:hidden'>
        <label htmlFor='my-drawer-2' className='btn btn-square btn-ghost'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            className='inline-block w-6 h-6 stroke-current'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              d='M4 6h16M4 12h16M4 18h16'
            ></path>
          </svg>
        </label>
      </div>
      <div className='drawer-side'>
        <label htmlFor='my-drawer-2' className='drawer-overlay'></label>
        <DashboardHeader user={user} />

        <ul className='menu p-4 w-64 min-h-screen bg-base-200 text-base-content'>
          {sideMenuItems.map((item) => (
            <li key={item.id}>
              <details>
                <summary className='my-1 font-bold'>{item.title}</summary>
                <ul>
                  {item.modules.map((module) => (
                    <li key={module.name}>
                      <Link to='/dashboard'>{module.name}</Link>
                    </li>
                  ))}
                </ul>
              </details>
            </li>
          ))}
          <li className='mt-10'>
            <hr className='h-4' />
          </li>
          <li>
            <LogoutButton />
          </li>
          <hr />
          <li className='md:hidden'>
            <DashboardHeader user={user} />
          </li>
        </ul>
        <br />
      </div>
    </div>
  );
};

export default Layout;
