import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import Button from './Button';

interface HeaderProps {
  onLoginClick: () => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

// SVG Icons
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

const MenuIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16m-7 6h7" />
    </svg>
);

const Header: React.FC<HeaderProps> = ({ onLoginClick, theme, toggleTheme }) => {
  const { user, isLoggedIn, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const getGreeting = () => {
    return "Welcome,";
  };
  
  const handleMenuNavigation = (path: string) => {
    navigate(path);
    setIsMenuOpen(false);
  }

  const handleMenuAction = (action: () => void) => {
    action();
    setIsMenuOpen(false);
  }

  return (
    <header className="bg-surface dark:bg-dark-surface shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 md:px-8 py-4 flex justify-between items-center">
        <div className="cursor-pointer" onClick={() => navigate('/')}>
          <div className="text-lg sm:text-xl md:text-2xl font-bold text-primary">
            Career365
          </div>
          <p className="text-xs text-text-secondary dark:text-dark-text-secondary -mt-1 hidden sm:block">Build Your Dreams With Us</p>
        </div>
        <div className="flex items-center space-x-2 md:space-x-4">
          {/* --- Desktop Nav Links --- */}
          <div className="hidden md:flex items-center space-x-2">
            <Button onClick={() => navigate('/about')} variant="secondary">About Us</Button>
            <Button onClick={() => navigate('/alumni')} variant="secondary">Alumni</Button>
          </div>

          {/* --- Desktop Auth Buttons --- */}
          <div className="hidden md:flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                <span className="text-text-secondary dark:text-dark-text-secondary">
                  {getGreeting()} <span className="font-semibold">{user?.name}</span>
                </span>
                {isAdmin && (
                  <Button onClick={() => navigate('/admin')} variant="secondary">
                    Admin Dashboard
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
                aria-label="Login / Register"
                title="Login / Register"
              >
                <UserIcon />
              </button>
            )}
          </div>
          
          {/* --- Theme Toggle (Always visible) --- */}
          <button 
            onClick={toggleTheme} 
            className="p-2 rounded-full text-text-secondary hover:bg-gray-200 dark:text-dark-text-secondary dark:hover:bg-gray-700 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? <MoonIcon /> : <SunIcon />}
          </button>

          {/* --- Mobile Menu Button (Always visible on mobile) --- */}
          <div className="md:hidden">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-full text-text-secondary hover:bg-gray-200 dark:text-dark-text-secondary dark:hover:bg-gray-700 transition-colors"
              aria-label="Open menu"
            >
              <MenuIcon />
            </button>
          </div>
        </div>
      </div>
       {/* --- Mobile Dropdown Menu --- */}
      {isMenuOpen && (
          <div className="md:hidden absolute top-full right-0 w-48 bg-surface dark:bg-dark-surface shadow-lg rounded-b-lg border-t border-gray-200 dark:border-gray-700 z-50">
              {isLoggedIn ? (
                <>
                  <div className="p-2 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-text-secondary dark:text-dark-text-secondary text-sm">
                      Signed in as <span className="font-semibold">{user?.name}</span>
                    </span>
                  </div>
                  <ul className="py-1">
                      <li><button onClick={() => handleMenuNavigation('/about')} className="w-full text-left px-4 py-2 text-sm text-text-primary dark:text-dark-text-primary hover:bg-gray-100 dark:hover:bg-gray-700">About Us</button></li>
                      <li><button onClick={() => handleMenuNavigation('/alumni')} className="w-full text-left px-4 py-2 text-sm text-text-primary dark:text-dark-text-primary hover:bg-gray-100 dark:hover:bg-gray-700">Alumni</button></li>
                      {isAdmin && (
                        <li><button onClick={() => handleMenuNavigation('/admin')} className="w-full text-left px-4 py-2 text-sm text-text-primary dark:text-dark-text-primary hover:bg-gray-100 dark:hover:bg-gray-700">Admin Dashboard</button></li>
                      )}
                      <li><button onClick={() => handleMenuAction(logout)} className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20">Logout</button></li>
                  </ul>
                </>
              ) : (
                <ul className="py-1">
                  <li><button onClick={() => handleMenuAction(onLoginClick)} className="w-full text-left px-4 py-2 text-sm text-text-primary dark:text-dark-text-primary hover:bg-gray-100 dark:hover:bg-gray-700">Login / Register</button></li>
                  <li><button onClick={() => handleMenuNavigation('/about')} className="w-full text-left px-4 py-2 text-sm text-text-primary dark:text-dark-text-primary hover:bg-gray-100 dark:hover:bg-gray-700">About Us</button></li>
                  <li><button onClick={() => handleMenuNavigation('/alumni')} className="w-full text-left px-4 py-2 text-sm text-text-primary dark:text-dark-text-primary hover:bg-gray-100 dark:hover:bg-gray-700">Alumni</button></li>
                </ul>
              )}
          </div>
      )}
    </header>
  );
};

export default Header;
