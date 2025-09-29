import React, { useState, useEffect } from 'react';
import { AnnouncementPost } from '../types';
import { fetchAnnouncements, deleteAnnouncement } from '../services/apiService';
import AnnouncementCard from './AnnouncementCard';
import Spinner from './Spinner';
import Marquee from './Marquee';

interface AnnouncementsFeedProps {
  visibility: 'student' | 'public';
  onEdit?: (announcement: AnnouncementPost) => void;
  refreshKey?: boolean;
}

const AnnouncementsFeed: React.FC<AnnouncementsFeedProps> = ({ visibility, onEdit, refreshKey }) => {
  const [announcements, setAnnouncements] = useState<AnnouncementPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAnnouncements = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchAnnouncements(visibility);
        setAnnouncements(data);
      } catch (err) {
        setError(`Failed to load ${visibility} announcements.`);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadAnnouncements();
  }, [refreshKey, visibility]);

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
      <div className="flex justify-center items-center py-4">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500 bg-red-100 dark:bg-red-900/20 p-3 rounded-lg mb-6">{error}</div>;
  }
  
  if (announcements.length === 0) {
      return null;
  }

  const latestAnnouncementTitle = visibility === 'public' && announcements.length > 0 ? announcements[0].title : null;
  const title = visibility === 'public' ? 'Public Announcements' : 'Student Announcements';

  return (
    <div className="space-y-4 my-8">
        {latestAnnouncementTitle && <Marquee text={latestAnnouncementTitle} />}
        <div className="border-b pb-2 border-gray-200 dark:border-gray-700">
            <h2 className="text-xl md:text-2xl font-bold text-text-primary dark:text-dark-text-primary">{title}</h2>
        </div>
        {announcements.map(announcement => (
            <AnnouncementCard 
                key={announcement.id} 
                announcement={announcement} 
                onEdit={onEdit} 
                onDelete={handleDelete}
            />
        ))}
    </div>
  );
};

export default AnnouncementsFeed;