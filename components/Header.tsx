import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, useLocation } from 'react-router-dom';
import Button from './Button';

interface HeaderProps {
  onLoginClick: () => void;
  onCreatePostClick: () => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const SunIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const MoonIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
  </svg>
);

const UserIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);


const Header: React.FC<HeaderProps> = ({ onLoginClick, onCreatePostClick, theme, toggleTheme }) => {
  const { user, isLoggedIn, isAdmin, isSuperAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const getGreeting = () => {
    if (isSuperAdmin) return "Hello Developer,";
    if (isAdmin) return "Hello Placement officer,";
    return "Welcome,";
  };

  return (
    <header className="bg-surface dark:bg-dark-surface shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 md:px-8 py-4 flex justify-between items-center">
        <div className="text-xl md:text-2xl font-bold text-primary">
          Placement Drive Hub
        </div>
        <div className="flex items-center space-x-2 md:space-x-4">
          {isLoggedIn ? (
            <>
              <span className="text-text-secondary dark:text-dark-text-secondary hidden md:inline">
                {getGreeting()} <span className="font-semibold">{user?.username}</span>
              </span>
              {location.pathname !== '/' && (
                <Button onClick={() => navigate('/')} variant="secondary">
                  Home
                </Button>
              )}
              {isSuperAdmin && (
                 <Button onClick={() => navigate('/manage-admins')} variant="secondary">
                  Manage Admins
                </Button>
              )}
              {isAdmin && (
                <Button onClick={onCreatePostClick} variant="primary">
                  Create Post
                </Button>
              )}
              <Button onClick={logout} variant="secondary">
                Logout
              </Button>
            </>
          ) : (
             <button 
              onClick={onLoginClick} 
              className="p-2 rounded-full text-text-secondary hover:bg-gray-200 dark:text-dark-text-secondary dark:hover:bg-gray-700 transition-colors"
              aria-label="Account Login"
            >
              <UserIcon />
            </button>
          )}
          <button 
            onClick={toggleTheme} 
            className="p-2 rounded-full text-text-secondary hover:bg-gray-200 dark:text-dark-text-secondary dark:hover:bg-gray-700 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? <MoonIcon /> : <SunIcon />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;