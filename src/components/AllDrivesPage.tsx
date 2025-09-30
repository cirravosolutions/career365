import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DrivePost, DriveInterest, UserRole, SubscriptionTier } from '../types';
import { fetchDrives, deleteDrive, getUserInterests, getDriveInterestCounts } from '../services/apiService';
import { useAuth } from '../hooks/useAuth';
import DriveCard from './DriveCard';
import Spinner from './Spinner';
import Button from './Button';
import UpgradeCTA from './UpgradeCTA';

interface AllDrivesPageProps {
  onEdit: (drive: DrivePost) => void;
}

const AllDrivesPage: React.FC<AllDrivesPageProps> = ({ onEdit }) => {
  const [drives, setDrives] = useState<DrivePost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { user, isAdmin, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const [userInterests, setUserInterests] = useState<DriveInterest[]>([]);
  const [driveInterestCounts, setDriveInterestCounts] = useState<{ [driveId: string]: number }>({});

  useEffect(() => {
    const loadAllData = async () => {
      try {
        setLoading(true);
        setError(null);

        const visibility = isLoggedIn ? 'all' : 'free';
        const promises: [Promise<DrivePost[]>, Promise<DriveInterest[] | { [driveId: string]: number }> | null] = [fetchDrives(visibility), null];

        if (user) {
            if (user.role === UserRole.STUDENT) {
                promises[1] = getUserInterests();
            } else if (isAdmin) {
                promises[1] = getDriveInterestCounts();
            }
        }

        const [driveData, interestsOrCounts] = await Promise.all(promises);

        let drivesToShow = driveData;
        if (user && user.role === UserRole.STUDENT && user.subscriptionTier === SubscriptionTier.FREE) {
          drivesToShow = driveData.filter(d => d.isFree);
        } else if (!isLoggedIn) {
          drivesToShow = driveData.filter(d => d.isFree);
        }

        setDrives(drivesToShow.sort((a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime()));

        if (user && interestsOrCounts) {
          if (user.role === UserRole.STUDENT) {
            setUserInterests(interestsOrCounts as DriveInterest[]);
          } else if (isAdmin) {
            setDriveInterestCounts(interestsOrCounts as { [driveId: string]: number });
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
  }, [user, isAdmin, isLoggedIn]);

  const handleDelete = async (driveId: string) => {
    if (!user) {
      alert("You must be logged in to delete a post.");
      return;
    }
    if (window.confirm("Are you sure you want to delete this drive post? This action cannot be undone.")) {
      try {
        setError(null);
        await deleteDrive(driveId);
        setDrives(prevDrives => prevDrives.filter(drive => drive.id !== driveId));
      } catch (err: any) {
        setError(err.message || "Failed to delete post. Please try again.");
        console.error(err);
      }
    }
  };

  const handleInterestRegistered = (newInterest: DriveInterest) => {
    setUserInterests(prev => [...prev, newInterest]);
    if (isAdmin) {
      setDriveInterestCounts(prev => ({ ...prev, [newInterest.driveId]: (prev[newInterest.driveId] || 0) + 1 }));
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner />
      </div>
    );
  }
  
  const title = !isLoggedIn ? "All Free Drives" : (user?.subscriptionTier === SubscriptionTier.FREE ? "All Available Free Drives" : "All Placement Drives");


  return (
    <div className="space-y-6">
       <div className="border-b pb-4 border-gray-200 dark:border-gray-700">
          <Button onClick={() => navigate(-1)} variant="secondary" className="mb-4">
              &larr; Back
          </Button>
          <h1 className="text-2xl md:text-3xl font-bold text-text-primary dark:text-dark-text-primary">{title}</h1>
      </div>
      
      {user?.role === UserRole.STUDENT && user?.subscriptionTier === SubscriptionTier.FREE && (
        <UpgradeCTA />
      )}

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
          <p>No placement drives found.</p>
        </div>
      )}
    </div>
  );
};

export default AllDrivesPage;
