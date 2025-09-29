import React, { useState, useEffect, useMemo } from 'react';
import { DrivePost, DriveInterest, UserRole, SubscriptionTier } from '../types';
import { fetchDrives, deleteDrive, getUserInterests, getInterestDetailsForDrive } from '../services/apiService';
import { useAuth } from '../hooks/useAuth';
import DriveCard from './DriveCard';
import Spinner from './Spinner';
import AdminNoteModal from './AdminNoteModal';
import Button from './Button';
import ResumeBuilderCTA from './ResumeBuilderCTA';
import UpgradeCTA from './UpgradeCTA';

interface DriveFeedProps {
  onEdit: (drive: DrivePost) => void;
}

const InfoIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const DriveFeed: React.FC<DriveFeedProps> = ({ onEdit }) => {
  const [drives, setDrives] = useState<DrivePost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { user, isAdmin, isSuperAdmin } = useAuth();

  const [adminNote, setAdminNote] = useState<string | null>(null);
  const [studentNote, setStudentNote] = useState<string | null>(null);
  const [isNoteModalOpen, setNoteModalOpen] = useState(false);
  
  const [userInterests, setUserInterests] = useState<DriveInterest[]>([]);
  const [driveInterestCounts, setDriveInterestCounts] = useState<{[driveId: string]: number}>({});


  useEffect(() => {
    setAdminNote(localStorage.getItem('adminNote'));
    setStudentNote(localStorage.getItem('studentNote'));

    const loadAllData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const driveData = await fetchDrives(); // Fetches all drives

        // Filter drives based on user subscription
        let drivesToShow = driveData;
        if (user && user.role === UserRole.STUDENT && user.subscriptionTier === SubscriptionTier.FREE) {
            drivesToShow = driveData.filter(d => d.isFree);
        }
        setDrives(drivesToShow.sort((a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime()));

        if (user) {
          const interestsData = await getUserInterests(user.id);
          setUserInterests(interestsData);

          if (isAdmin) {
            const counts: {[driveId: string]: number} = {};
            // Use all drives for admin counts, not the filtered list
            for (const drive of driveData) { 
              const attendees = await getInterestDetailsForDrive(drive.id, user.id);
              counts[drive.id] = attendees.length;
            }
            setDriveInterestCounts(counts);
          }
        }

      } catch (err: any) {
        setError(err.message || 'Failed to load placement drives. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadAllData();
  }, [user, isAdmin]);

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
        setError(err.message || "Failed to delete post. Please try again.");
        console.error(err);
      }
    }
  };
  
  const title = "Latest Placement Drives";

  const handleInterestRegistered = (newInterest: DriveInterest) => {
    setUserInterests(prev => [...prev, newInterest]);
    if(isAdmin){
      setDriveInterestCounts(prev => ({...prev, [newInterest.driveId]: (prev[newInterest.driveId] || 0) + 1}));
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
       {user?.role === UserRole.STUDENT && user.subscriptionTier === SubscriptionTier.FREE && <UpgradeCTA />}
       
       {studentNote && (
            <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 rounded-md dark:bg-blue-900/30 dark:border-blue-600 dark:text-blue-300" role="alert">
                <div className="flex">
                    <div className="py-1"><InfoIcon /></div>
                    <div className="ml-3">
                        <p className="font-bold">Important Announcement</p>
                        <p className="text-sm whitespace-pre-wrap">{studentNote}</p>
                    </div>
                </div>
            </div>
       )}
       
       {user?.role === UserRole.STUDENT && <ResumeBuilderCTA />}

       {adminNote && (isAdmin || isSuperAdmin) && (
            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-md dark:bg-yellow-900/30 dark:border-yellow-600 dark:text-yellow-300" role="alert">
                <div className="flex">
                    <div className="py-1"><InfoIcon /></div>
                    <div className="ml-3">
                        <p className="font-bold">Note from Super Admin</p>
                        <p className="text-sm whitespace-pre-wrap">{adminNote}</p>
                    </div>
                </div>
            </div>
       )}
       
       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-2 border-gray-200 dark:border-gray-700">
        <h1 className="text-2xl md:text-3xl font-bold text-text-primary dark:text-dark-text-primary">{title}</h1>
       </div>

       {error && (
        <div className="text-center text-red-600 bg-red-100 dark:bg-red-900/20 dark:text-red-400 p-4 rounded-lg">
          {error}
        </div>
      )}
      {drives.length > 0 ? (
        drives.map(drive => (
          <DriveCard 
            key={drive.id} 
            drive={drive} 
            onEdit={onEdit} 
            onDelete={handleDelete}
            userInterest={userInterests.find(i => i.driveId === drive.id) || null}
            onInterestRegistered={handleInterestRegistered}
            interestCount={driveInterestCounts[drive.id] || 0}
          />
        ))
      ) : (
        <div className="text-center text-text-secondary dark:text-dark-text-secondary py-10">
           {user?.subscriptionTier === SubscriptionTier.FREE ? (
              <p>No free placement drives posted yet. Upgrade to Premium to see all drives!</p>
           ) : (
              <p>No placement drives posted yet. Check back soon!</p>
           )}
        </div>
      )}
    </div>
  );
};

export default DriveFeed;