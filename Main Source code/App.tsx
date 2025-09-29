import React, { useState, useEffect } from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import Header from './components/Header';
import DriveFeed from './components/DriveFeed';
import LoginModal from './components/LoginModal';
import CreatePostModal from './components/CreatePostModal';
import LandingPage from './components/LandingPage';
import { DrivePost } from './types';

type Theme = 'light' | 'dark';

const App: React.FC = () => {
  const { isLoggedIn } = useAuth();
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [isPostModalOpen, setPostModalOpen] = useState(false);
  const [editingDrive, setEditingDrive] = useState<DrivePost | null>(null);
  const [refreshFeed, setRefreshFeed] = useState(false);
  const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem('theme') as Theme) || 'light');
  const registrationUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSd6l0-y2GIXT9fQUV04ZKMO6TBIvwoAQ__oZ9xO2hVKvADbZw/viewform';

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const handlePostSubmitted = () => {
    setPostModalOpen(false);
    setEditingDrive(null);
    setRefreshFeed(prev => !prev); 
  };

  const handleCreateClick = () => {
    setEditingDrive(null);
    setPostModalOpen(true);
  };

  const handleEditClick = (drive: DrivePost) => {
    setEditingDrive(drive);
    setPostModalOpen(true);
  };

  const handleRegisterClick = () => {
    window.open(registrationUrl, '_blank', 'noopener,noreferrer');
  };


  return (
    <HashRouter>
      <div className="min-h-screen bg-background dark:bg-dark-background text-text-primary dark:text-dark-text-primary">
        <Header 
          onLoginClick={() => setLoginModalOpen(true)} 
          onCreatePostClick={handleCreateClick}
          theme={theme}
          toggleTheme={toggleTheme}
        />
        <main className="container mx-auto p-4 md:p-8 max-w-6xl">
          {isLoggedIn ? (
             <Routes>
              <Route path="/" element={<DriveFeed key={refreshFeed ? 'refresh' : 'initial'} onEdit={handleEditClick} />} />
            </Routes>
          ) : (
            <LandingPage onLoginClick={() => setLoginModalOpen(true)} onRegisterClick={handleRegisterClick} />
          )}
        </main>
        <LoginModal 
          isOpen={isLoginModalOpen} 
          onClose={() => setLoginModalOpen(false)} 
          onRegisterClick={handleRegisterClick}
        />
        {isLoggedIn && (
          <CreatePostModal
            isOpen={isPostModalOpen}
            onClose={() => {
              setPostModalOpen(false);
              setEditingDrive(null);
            }}
            onPostCreated={handlePostSubmitted}
            driveToEdit={editingDrive}
          />
        )}
      </div>
    </HashRouter>
  );
};

export default App;