import React from 'react';
import { getCurrentUser } from '../../firebase';
import { useNavigate, Link } from 'react-router-dom';
import DashboardHeader from './DashboardHeader';
import { LogoutButton } from '../common/LogoutButton';
import ThemeToggle from '../common/ThemeToggle';
import { sideMenuItems } from '../utils/constants';
import logo from '../../assets/1billweb3logo.png';
// import styles from '../../styles';

const Layout = ({ children }) => {
  const user = getCurrentUser();

  const navigate = useNavigate();

  // const auth = sessionStorage.getItem('authenticated');

  // console.log(user)

  if (user === null) {
    navigate('/login');
  }

  return (
    <div className='drawer md:drawer-open bg-base-200 min-h-[100dvh]'>
      <input id='my-drawer-2' type='checkbox' className='drawer-toggle' />
      <div className='drawer-content flex flex-col items-stretch justify-start bg-base-100 min-w-0'>
        {/* top bar — phones & small tablets */}
        <div className='md:hidden sticky top-0 z-20 flex items-center justify-between gap-2 bg-base-200/95 backdrop-blur border-b border-base-300 px-2 pt-[env(safe-area-inset-top)]'>
          <label htmlFor='my-drawer-2' aria-label='Open menu' className='btn btn-square btn-ghost'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              className='inline-block w-6 h-6 stroke-current'
            >
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M4 6h16M4 12h16M4 18h16'></path>
            </svg>
          </label>
          <span className='font-poppins font-semibold truncate'>1Billion2Web3</span>
          <ThemeToggle />
        </div>
        {/* desktop: toggle at the top-right of the page */}
        <div className='hidden md:flex justify-end px-4 pt-3'>
          <ThemeToggle />
        </div>
        <div className='py-3 md:py-2 w-full max-w-6xl mx-auto pb-28 px-0'>{children}</div>
      </div>
      <div className='drawer-side z-30'>
        <label htmlFor='my-drawer-2' className='drawer-overlay'></label>
        <DashboardHeader user={user} />

        <ul className='menu p-4 w-72 max-w-[85vw] min-h-full bg-base-200 text-base-content'>
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
          <li className='hidden lg:flex justify-center items-center'>
            <img src={logo} className='h-32 w-32 rounded-full' alt='1Bill2Web3' />
          </li>
        </ul>
        <br />
      </div>
    </div>
  );
};

export default Layout;
