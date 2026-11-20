import React from 'react';
import { BsSun, BsMoonStars } from 'react-icons/bs';
import { useTheme } from '../../theme';

// variant="floating": fixed bottom-left button (pages without the dashboard layout)
// variant="inline":   normal button for headers / menus
const ThemeToggle = ({ variant = 'inline', className = '' }) => {
  const [theme, , toggle] = useTheme();
  const dark = theme === 'dark';
  const label = dark ? 'Switch to light mode' : 'Switch to dark mode';
  const pos =
    variant === 'floating'
      ? 'fixed z-40 shadow-lg border border-base-300 bg-base-100 bottom-[max(1rem,env(safe-area-inset-bottom))] left-[max(1rem,env(safe-area-inset-left))]'
      : '';
  return (
    <button
      type='button'
      onClick={toggle}
      aria-label={label}
      title={label}
      className={`btn btn-circle btn-ghost min-h-[44px] min-w-[44px] text-xl ${pos} ${className}`}
    >
      {dark ? <BsSun /> : <BsMoonStars />}
    </button>
  );
};

export default ThemeToggle;
