import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import AnnouncementsFeed from './AnnouncementsFeed';
import Button from './Button';
import { AnnouncementPost } from '../types';

interface AllAnnouncementsPageProps {
  onEditAnnouncement?: (announcement: AnnouncementPost) => void;
}

const AllAnnouncementsPage: React.FC<AllAnnouncementsPageProps> = ({ onEditAnnouncement }) => {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  
  const visibility = isLoggedIn ? 'student' : 'public';

  return (
    <div className="space-y-6">
      <Button onClick={() => navigate('/')} variant="secondary">
          &larr; Back to Home
      </Button>
      <AnnouncementsFeed visibility={visibility} onEdit={onEditAnnouncement} />
    </div>
  );
};

export default AllAnnouncementsPage;
