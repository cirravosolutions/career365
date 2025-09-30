import React, { useState, useEffect, useMemo } from 'react';
import { DrivePost, SubscriptionTier, PackageLevel } from '../types';
import { fetchDrives, deleteDrive } from '../services/apiService';
import { useAuth } from '../hooks/useAuth';
import DriveCard from './DriveCard';
import Spinner from './Spinner';
import AdminNoteModal from './AdminNoteModal';
import Button from './Button';

interface DriveFeedProps {
  onEdit: (drive: DrivePost) => void;
  // FIX: Make onCreateUserClick optional to support different parent components.
  onCreateUserClick?: () => void;
}

const InfoIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const DriveFeed: React.FC<DriveFeedProps> = ({ onEdit, onCreateUserClick }) => {
  const [drives, setDrives] = useState<DrivePost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { user, isAdmin, isSuperAdmin } = useAuth();

  const [adminNote, setAdminNote] = useState<string | null>(null);
  const [isNoteModalOpen, setNoteModalOpen] = useState(false);

  useEffect(() => {
    setAdminNote(localStorage.getItem('adminNote'));

    const loadDrives = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchDrives();
        setDrives(data.sort((a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime()));
      } catch (err) {
        setError('Failed to load placement drives. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadDrives();
  }, []);

  const filteredDrives = useMemo(() => {
    return drives;
  }, [drives]);

  const handleDelete = async (driveId: string) => {
    if (!user) {
      alert("You must be logged in to delete a post.");
      return;
    }
    if (window.confirm("Are you sure you want to delete this drive post? This action cannot be undone.")) {
      try {
        setError(null);
        await deleteDrive(driveId, user.id);
        setDrives(prevDrives => prevDrives.filter(drive => drive.id !== driveId));
      } catch (err: any) {
        if (err.message === 'Unauthorized') {
          setError('Authorization Failed: Ensure your SECRET_KEY in the app matches the one in your Google Apps Script and that you have re-deployed the script with the latest changes.');
        } else {
          setError(err.message || "Failed to delete post. Please try again.");
        }
        console.error(err);
      }
    }
  };
  
  const getTitle = () => {
      if (isSuperAdmin) return "Super Admin Dashboard";
      if (isAdmin) return "Admin Dashboard";
      return "Latest Placement Drives";
  }

  const handleSaveNote = (note: string) => {
    const trimmedNote = note.trim();
    if (trimmedNote) {
        localStorage.setItem('adminNote', trimmedNote);
        setAdminNote(trimmedNote);
    } else {
        localStorage.removeItem('adminNote');
        setAdminNote(null);
    }
    setNoteModalOpen(false);
  };

  const handleRemoveNote = () => {
    if (window.confirm("Are you sure you want to remove this note?")) {
        localStorage.removeItem('adminNote');
        setAdminNote(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
       {isSuperAdmin && !adminNote && (
          <div className="text-center">
              <Button onClick={() => setNoteModalOpen(true)} variant="secondary">
                  Add Note for Admins
              </Button>
          </div>
       )}

       {adminNote && (isAdmin || isSuperAdmin) && (
            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-md dark:bg-yellow-900/30 dark:border-yellow-600 dark:text-yellow-300" role="alert">
                <div className="flex">
                    <div className="py-1"><InfoIcon /></div>
                    <div className="ml-3">
                        <p className="font-bold">Note from Super Admin</p>
                        <p className="text-sm whitespace-pre-wrap">{adminNote}</p>
                        {isSuperAdmin && (
                            <div className="mt-2 space-x-2">
                                <button onClick={() => setNoteModalOpen(true)} className="text-xs font-semibold text-yellow-800 dark:text-yellow-200 hover:underline focus:outline-none focus:ring-2 focus:ring-yellow-500 rounded">EDIT</button>
                                <span className="text-yellow-500 dark:text-yellow-600">|</span>
                                <button onClick={handleRemoveNote} className="text-xs font-semibold text-yellow-800 dark:text-yellow-200 hover:underline focus:outline-none focus:ring-2 focus:ring-yellow-500 rounded">REMOVE</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
       )}
       
       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-2 border-gray-200 dark:border-gray-700">
        <h1 className="text-2xl md:text-3xl font-bold text-text-primary dark:text-dark-text-primary">{getTitle()}</h1>
        {/* FIX: Conditionally render the button only if onCreateUserClick is provided. */}
        {isAdmin && onCreateUserClick && (
            <Button onClick={onCreateUserClick} variant="primary">
                Add Student
            </Button>
        )}
       </div>

       {error && (
        <div className="text-center text-red-600 bg-red-100 dark:bg-red-900/20 dark:text-red-400 p-4 rounded-lg">
          {error}
        </div>
      )}
      {filteredDrives.length > 0 ? (
        filteredDrives.map(drive => <DriveCard key={drive.id} drive={drive} onEdit={onEdit} onDelete={handleDelete} />)
      ) : (
        <div className="text-center text-text-secondary dark:text-dark-text-secondary py-10">
           <p>No placement drives posted yet. Check back soon!</p>
        </div>
      )}

      {isSuperAdmin && (
        <AdminNoteModal 
            isOpen={isNoteModalOpen}
            onClose={() => setNoteModalOpen(false)}
            onSave={handleSaveNote}
            currentNote={adminNote}
        />
      )}
    </div>
  );
};

export default DriveFeed;