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

  if (!user) {
    navigate('/login');
  }

  return (
    <div className='drawer md:drawer-open bg-base-200 min-h-screen'>
      <input id='my-drawer-2' type='checkbox' className='drawer-toggle' />
      <div className='drawer-content flex flex-col items-center justify-start bg-white'>
        {/* Page content here */}

        <div>
          {/* <h1 className='font-poppins font-semibold xs:text-[48px] text-[40px] text-black xs:leading-[76.8px] leading-[66.8px] w-full'>1Billion2Web3Initiative Quiz</h1> */}
        </div>
        <div className='p-5'>{children}</div>
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
                      <Link to={module.path}>{module.name}</Link>
                    </li>
                  ))}
                </ul>
              </details>
            </li>
          ))}
          <li className='mt-10'>
            <hr />
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
