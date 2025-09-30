import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnnouncementPost } from '../types';
import { fetchAnnouncements, deleteAnnouncement } from '../services/apiService';
import AnnouncementCard from './AnnouncementCard';
import Spinner from './Spinner';
import { useAuth } from '../hooks/useAuth';
import Button from './Button';

interface AllAnnouncementsPageProps {
  onEdit: (announcement: AnnouncementPost) => void;
}

const AllAnnouncementsPage: React.FC<AllAnnouncementsPageProps> = ({ onEdit }) => {
  const [announcements, setAnnouncements] = useState<AnnouncementPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const visibility = isLoggedIn ? 'student' : 'public';

  useEffect(() => {
    const loadAnnouncements = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchAnnouncements(visibility);
        setAnnouncements(data);
      } catch (err) {
        setError(`Failed to load announcements.`);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadAnnouncements();
  }, [visibility]);

  const handleDelete = async (announcementId: string) => {
    if (window.confirm("Are you sure you want to delete this announcement?")) {
      try {
        setError(null);
        await deleteAnnouncement(announcementId);
        setAnnouncements(prev => prev.filter(a => a.id !== announcementId));
      } catch (err: any) {
        setError(err.message || "Failed to delete announcement.");
        console.error(err);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-4 h-64">
        <Spinner />
      </div>
    );
  }
  
  const title = visibility === 'public' ? 'All Public Announcements' : 'All Student Announcements';

  return (
    <div className="space-y-4 my-8">
        <div className="border-b pb-4 border-gray-200 dark:border-gray-700">
          <Button onClick={() => navigate(-1)} variant="secondary" className="mb-4">
              &larr; Back
          </Button>
          <h1 className="text-2xl md:text-3xl font-bold text-text-primary dark:text-dark-text-primary">{title}</h1>
        </div>
        
        {error && <div className="text-center text-red-500 bg-red-100 dark:bg-red-900/20 p-3 rounded-lg">{error}</div>}

        {announcements.length > 0 ? (
            announcements.map(announcement => (
                <AnnouncementCard 
                    key={announcement.id} 
                    announcement={announcement} 
                    onEdit={onEdit} 
                    onDelete={handleDelete}
                />
            ))
        ) : (
            <div className="text-center text-text-secondary dark:text-dark-text-secondary py-10">
                <p>No announcements found.</p>
            </div>
        )}
    </div>
  );
};

export default AllAnnouncementsPage;
