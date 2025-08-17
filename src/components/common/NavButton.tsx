import { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';

interface NavButtonProps {
  to: string;
  icon: ReactNode;
  label: string;
  isActive: boolean;
  end?: boolean;
}

const NavButton = ({ to, icon, label, isActive, end }: NavButtonProps) => {
  return (
    <NavLink to={to} end={end}>
      <div className={`
        group relative flex items-center justify-flex-start w-12 h-12 rounded-full cursor-pointer overflow-hidden transition-all duration-500 border-none
        ${isActive 
          ? 'bg-gradient-to-r from-light-primary to-light-accent dark:from-dark-primary dark:to-dark-accent shadow-xl shadow-light-primary/40 dark:shadow-dark-primary/40' 
          : 'bg-white/95 dark:bg-dark-card shadow-lg shadow-black/10 dark:shadow-black/30 hover:shadow-xl hover:shadow-light-primary/20 dark:hover:shadow-dark-primary/20'
        }
        hover:w-36 hover:rounded-[40px]
        active:translate-x-0.5 active:translate-y-0.5
      `}>
        {/* Icon container */}
        <div className={`
          w-full flex items-center justify-center transition-all duration-500
          ${isActive ? 'text-white' : 'text-light-text dark:text-dark-text'}
          group-hover:w-[28%] group-hover:pl-4
        `}>
          <div className="w-5 h-5 transition-transform duration-500 group-hover:scale-110">
            {icon}
          </div>
        </div>

        {/* Label text */}
        <div className={`
          absolute right-0 w-0 opacity-0 overflow-hidden whitespace-nowrap text-sm font-semibold transition-all duration-500
          ${isActive ? 'text-white' : 'text-light-text dark:text-dark-text'}
          group-hover:w-[72%] group-hover:opacity-100 group-hover:pr-4
        `}>
          {label}
        </div>
      </div>
    </NavLink>
  );
};

export default NavButton;