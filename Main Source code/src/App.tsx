import React, { useState, useEffect } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import Header from './components/Header';
import DriveFeed from './components/DriveFeed';
import LoginModal from './components/LoginModal';
import CreatePostModal from './components/CreatePostModal';
import LandingPage from './components/LandingPage';
import ManageAdminsPage from './components/ManageAdminsPage';
import AdminDashboard from './components/AdminDashboard';
import ManageStudentsPage from './components/ManageStudentsPage';
import DriveInterestDetails from './components/DriveInterestDetails';
import { DrivePost } from './types';
import Spinner from './components/Spinner';

type Theme = 'light' | 'dark';

const App: React.FC = () => {
  const { isLoggedIn, isAdmin, isSuperAdmin, isLoading } = useAuth();
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [isPostModalOpen, setPostModalOpen] = useState(false);
  const [editingDrive, setEditingDrive] = useState<DrivePost | null>(null);
  const [refreshFeed, setRefreshFeed] = useState(false);
  const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem('theme') as Theme) || 'light');
  const registrationUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSd6l0-y2GIXT9fQUV04ZKMO6TBIvwoAQ__oZ9xO2hVKvADbZw/viewform?usp=header';

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

  const handleEditClick = (drive: DrivePost) => {
    setEditingDrive(drive);
    setPostModalOpen(true);
  };

  const handleRegisterClick = () => {
    window.open(registrationUrl, '_blank', 'noopener,noreferrer');
  };

  // Show a global spinner while checking the user's session
  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-background dark:bg-dark-background">
        <Spinner />
      </div>
    );
  }

  return (
      <div className="min-h-screen flex flex-col bg-background dark:bg-dark-background text-text-primary dark:text-dark-text-primary">
        <Header 
          onLoginClick={() => setLoginModalOpen(true)} 
          theme={theme}
          toggleTheme={toggleTheme}
        />
        <main className="container mx-auto p-4 md:p-8 max-w-6xl flex-grow">
          <Routes>
            {isLoggedIn ? (
              <>
                <Route path="/" element={<DriveFeed key={refreshFeed ? 'refresh' : 'initial'} onEdit={handleEditClick} />} />
                <Route path="/admin" element={isAdmin ? <AdminDashboard onCreatePostClick={() => setPostModalOpen(true)} /> : <Navigate to="/" replace />} />
                <Route path="/manage-admins" element={isSuperAdmin ? <ManageAdminsPage /> : <Navigate to="/" replace />} />
                <Route path="/manage-students" element={isAdmin ? <ManageStudentsPage /> : <Navigate to="/" replace />} />
                <Route path="/drive/:driveId/attendees" element={isAdmin ? <DriveInterestDetails /> : <Navigate to="/" replace />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </>
            ) : (
              <>
                <Route path="/" element={<LandingPage onLoginClick={() => setLoginModalOpen(true)} onRegisterClick={handleRegisterClick} />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </>
            )}
          </Routes>
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
        <footer className="text-center py-4 text-xs text-text-secondary dark:text-dark-text-secondary">
          Powered by - Cirravo Solutions
        </footer>
      </div>
  );
};

export default App;
