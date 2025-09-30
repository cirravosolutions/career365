
import React from 'react';
import { AnnouncementPost } from '../types';
import { useAuth } from '../hooks/useAuth';
import Button from './Button';

interface AnnouncementCardProps {
  announcement: AnnouncementPost;
  onEdit?: (announcement: AnnouncementPost) => void;
  onDelete?: (announcementId: string) => void;
}

const AnnouncementCard: React.FC<AnnouncementCardProps> = ({ announcement, onEdit, onDelete }) => {
  const { user, isSuperAdmin, isLoggedIn } = useAuth();
  const isOwner = user && user.id === announcement.postedById;
  const canManage = isLoggedIn && onEdit && onDelete && (isOwner || isSuperAdmin);
  
  const formatToIST = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
        // The server provides a timestamp that appears to be in a timezone
        // that is 7 hours behind UTC (e.g., PDT), but without timezone info.
        // We parse it as UTC and then add the 7-hour offset to correct it
        // before formatting to Indian Standard Time.
        const date = new Date(dateString.replace(' ', 'T') + 'Z');

        // Add 7 hours to correct for the server's timezone offset
        date.setHours(date.getHours() + 7);

        if (isNaN(date.getTime())) {
            return 'Invalid Date';
        }
        return date.toLocaleString('en-IN', {
            timeZone: 'Asia/Kolkata',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
        });
    } catch (e) {
        console.error("Failed to format date:", dateString, e);
        return 'Invalid Date';
    }
  };

  return (
    <div className="bg-surface dark:bg-dark-surface rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-start gap-4">
            <div className="flex items-center gap-3">
                <h3 className="text-lg font-bold text-text-primary dark:text-dark-text-primary">{announcement.title}</h3>
                {announcement.isPublic && (
                    <span className="text-xs font-semibold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full dark:bg-blue-900/30 dark:text-blue-300">
                        PUBLIC
                    </span>
                )}
            </div>
            {canManage && (
                <div className="flex space-x-2 flex-shrink-0">
                    <Button onClick={() => onEdit(announcement)} variant="secondary" className="px-2 py-1 text-xs">Edit</Button>
                    <Button onClick={() => onDelete(announcement.id)} variant="danger" className="px-2 py-1 text-xs">Delete</Button>
                </div>
            )}
        </div>
        <p className="mt-2 text-text-secondary dark:text-dark-text-secondary whitespace-pre-wrap">{announcement.content}</p>
      </div>
      <div className="bg-gray-50 dark:bg-gray-900/50 px-6 py-2 flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
        <span>By: {announcement.postedBy}</span>
        <span>{formatToIST(announcement.postedAt)}</span>
      </div>
    </div>
  );
};

export default AnnouncementCard;
