

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DrivePost, DriveInterest, UserRole, SubscriptionTier, AnnouncementPost } from '../types';
import { fetchDrives, deleteDrive, getUserInterests, getDriveInterestCounts } from '../services/apiService';
import { useAuth } from '../hooks/useAuth';
import DriveCard from './DriveCard';
import Spinner from './Spinner';
import AnnouncementsFeed from './AnnouncementsFeed';
import UpgradeCTA from './UpgradeCTA';
import Button from './Button';

interface DriveFeedProps {
  onEdit: (drive: DrivePost) => void;
  onEditAnnouncement: (announcement: AnnouncementPost) => void;
  refreshAnnouncements: boolean;
}

const DriveFeed: React.FC<DriveFeedProps> = ({ onEdit, onEditAnnouncement, refreshAnnouncements }) => {
  const [drives, setDrives] = useState<DrivePost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { user, isAdmin } = useAuth();

  const [userInterests, setUserInterests] = useState<DriveInterest[]>([]);
  const [driveInterestCounts, setDriveInterestCounts] = useState<{ [driveId: string]: number }>({});

  useEffect(() => {
    const loadAllData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch primary data (drives) and conditional data (interests/counts) in parallel
        const promises: [Promise<DrivePost[]>, Promise<DriveInterest[] | { [driveId: string]: number }> | null] = [fetchDrives(), null];

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
  }, [user, isAdmin]);

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

  const drivesToDisplay = drives.slice(0, 5);

  return (
    <div className="space-y-6">
      <AnnouncementsFeed visibility="student" onEdit={onEditAnnouncement} refreshKey={refreshAnnouncements} limit={5} />
      
      {user?.role === UserRole.STUDENT && user?.subscriptionTier === SubscriptionTier.FREE && (
        <UpgradeCTA />
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-2 border-gray-200 dark:border-gray-700">
        <h1 className="text-2xl md:text-3xl font-bold text-text-primary dark:text-dark-text-primary">Latest Placement Drives</h1>
      </div>

      {error && (
        <div className="text-center text-red-600 bg-red-100 dark:bg-red-900/20 dark:text-red-400 p-4 rounded-lg">
          {error}
        </div>
      )}
      
      {drivesToDisplay.length > 0 ? (
        drivesToDisplay.map(drive => (
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

      {drives.length > 5 && (
        <div className="text-center mt-6">
            <Link to="/drives" className="inline-block px-6 py-3 rounded-md font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200 bg-primary text-white hover:bg-blue-700 focus:ring-blue-500">
                View All Drives
            </Link>
        </div>
      )}
    </div>
  );
};

export default DriveFeed;
