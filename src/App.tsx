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
import { DrivePost, AnnouncementPost, AlumniPost } from './types';
import Spinner from './components/Spinner';
import CreateAnnouncementModal from './components/CreateAnnouncementModal';
import ContactAdmin from './components/ContactAdmin';
import AboutUsPage from './components/AboutUsPage';
import AlumniPage from './components/AlumniPage';
import CreateAlumniModal from './components/CreateAlumniModal';
import AllDrivesPage from './components/AllDrivesPage';
import AllAnnouncementsPage from './components/AllAnnouncementsPage';

type Theme = 'light' | 'dark';

const App: React.FC = () => {
  const { isLoggedIn, isAdmin, isSuperAdmin, isLoading } = useAuth();
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [isPostModalOpen, setPostModalOpen] = useState(false);
  const [editingDrive, setEditingDrive] = useState<DrivePost | null>(null);
  const [refreshFeed, setRefreshFeed] = useState(false);
  const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem('theme') as Theme) || 'light');
  
  const registrationUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSd6l0-y2GIXT9fQUV04ZKMO6TBIvwoAQ__oZ9xO2hVKvADbZw/viewform?usp=sharing&ouid=115934251216838098785';

  const [isAnnouncementModalOpen, setAnnouncementModalOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<AnnouncementPost | null>(null);
  const [refreshAnnouncements, setRefreshAnnouncements] = useState(false);

  const [isAlumniModalOpen, setAlumniModalOpen] = useState(false);
  const [editingAlumni, setEditingAlumni] = useState<AlumniPost | null>(null);
  const [refreshAlumni, setRefreshAlumni] = useState(false);

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

  const handleAnnouncementSubmitted = () => {
    setAnnouncementModalOpen(false);
    setEditingAnnouncement(null);
    setRefreshAnnouncements(prev => !prev);
  };

  const handleEditAnnouncementClick = (announcement: AnnouncementPost) => {
      setEditingAnnouncement(announcement);
      setAnnouncementModalOpen(true);
  };

  const handleAlumniSubmitted = () => {
    setAlumniModalOpen(false);
    setEditingAlumni(null);
    setRefreshAlumni(prev => !prev);
  };
  
  const handleAddAlumniClick = () => {
      setEditingAlumni(null);
      setAlumniModalOpen(true);
  };

  const handleEditAlumniClick = (alumni: AlumniPost) => {
      setEditingAlumni(alumni);
      setAlumniModalOpen(true);
  };

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
            <Route path="/about" element={<AboutUsPage />} />
            <Route 
                path="/alumni" 
                element={<AlumniPage 
                    key={refreshAlumni ? 'refresh' : 'initial'}
                    onAdd={handleAddAlumniClick} 
                    onEdit={handleEditAlumniClick}
                />} 
            />
            <Route path="/drives" element={<AllDrivesPage onEdit={handleEditClick} />} />
            <Route path="/announcements" element={<AllAnnouncementsPage onEdit={handleEditAnnouncementClick} />} />
            
            {isLoggedIn ? (
              <>
                <Route path="/" element={<DriveFeed key={refreshFeed ? 'refresh' : 'initial'} onEdit={handleEditClick} onEditAnnouncement={handleEditAnnouncementClick} refreshAnnouncements={refreshAnnouncements} />} />
                <Route path="/admin" element={isAdmin ? <AdminDashboard onCreatePostClick={() => { setEditingDrive(null); setPostModalOpen(true); }} onCreateAnnouncementClick={() => { setEditingAnnouncement(null); setAnnouncementModalOpen(true); }} /> : <Navigate to="/" replace />} />
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
          onRegisterClick={() => {
            setLoginModalOpen(false);
            handleRegisterClick();
          }}
        />
        {isLoggedIn && isAdmin && (
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
        {isLoggedIn && isAdmin && (
          <CreateAnnouncementModal
              isOpen={isAnnouncementModalOpen}
              onClose={() => {
                  setAnnouncementModalOpen(false);
                  setEditingAnnouncement(null);
              }}
              onSubmitted={handleAnnouncementSubmitted}
              announcementToEdit={editingAnnouncement}
          />
        )}
        {isLoggedIn && isAdmin && (
          <CreateAlumniModal
            isOpen={isAlumniModalOpen}
            onClose={() => {
              setAlumniModalOpen(false);
              setEditingAlumni(null);
            }}
            onSubmitted={handleAlumniSubmitted}
            alumniToEdit={editingAlumni}
          />
        )}
        <footer className="bg-surface dark:bg-dark-surface mt-auto">
          <div className="container mx-auto px-4 md:px-8 py-6 flex flex-col md:flex-row justify-between items-center gap-6">
            <ContactAdmin />
            <p className="text-[11px] sm:text-xs text-text-secondary dark:text-dark-text-secondary">
              All copyrights reserved to Cirravo
            </p>
          </div>
        </footer>
      </div>
  );
};

export default App;
