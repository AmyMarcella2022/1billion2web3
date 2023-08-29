import { useNavigate } from 'react-router-dom';
import { logout } from '../../firebase';

const LogoutButton = () => {
  const navigate = useNavigate();

  const signout = () => {
    logout().then(() => {
      navigate('/');
    });
  };

  return (
    <button className='btn btn-neutral' onClick={signout}>
      <svg
        xmlns='http://www.w3.org/2000/svg'
        className='h-6 w-6'
        fill='none'
        viewBox='0 0 24 24'
        stroke='currentColor'
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth='2'
          d='M6 18L18 6M6 6l12 12'
        />
      </svg>
      LOGOUT
    </button>
  );
};

export { LogoutButton };
