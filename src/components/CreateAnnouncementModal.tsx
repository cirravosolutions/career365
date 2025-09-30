import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { createAnnouncement, updateAnnouncement } from '../services/apiService';
import { AnnouncementPost } from '../types';
import Modal from './Modal';
import Input from './Input';
import Button from './Button';
import ToggleSwitch from './ToggleSwitch';

interface CreateAnnouncementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitted: () => void;
  announcementToEdit?: AnnouncementPost | null;
}

const CreateAnnouncementModal: React.FC<CreateAnnouncementModalProps> = ({ isOpen, onClose, onSubmitted, announcementToEdit }) => {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEditMode = !!announcementToEdit;

  useEffect(() => {
    if (isOpen && announcementToEdit) {
      setTitle(announcementToEdit.title);
      setContent(announcementToEdit.content);
      setIsPublic(announcementToEdit.isPublic || false);
    } else if (!isOpen) {
      setTitle('');
      setContent('');
      setIsPublic(false);
      setError(null);
    }
  }, [isOpen, announcementToEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
        setError("User session expired. Please log in again.");
        return;
    }
    setLoading(true);
    setError(null);
    try {
      if (isEditMode) {
        const updatedAnnouncementData: AnnouncementPost = {
          ...announcementToEdit,
          title,
          content,
          isPublic,
        };
        await updateAnnouncement(updatedAnnouncementData);
      } else {
        const newAnnouncementData = {
            title,
            content,
            isPublic,
        };
        await createAnnouncement(newAnnouncementData);
      }
      onSubmitted();
    } catch (err: any) {
      setError(err.message || "Failed to submit announcement. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditMode ? "Edit Announcement" : "Create New Announcement"}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="Title" id="announcementTitle" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <div>
          <label htmlFor="announcementContent" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Content</label>
          <textarea 
            id="announcementContent" 
            value={content} 
            onChange={(e) => setContent(e.target.value)} 
            required 
            rows={5} 
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
            placeholder="Enter your announcement, update, or link here."
          />
        </div>
        
        <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
            <label htmlFor="isPublic" className="block text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
                Audience
                <span className="block text-xs text-gray-500 dark:text-gray-400">
                    Public posts are visible on the landing page.
                </span>
            </label>
            <ToggleSwitch
                id="isPublic"
                checked={isPublic}
                onChange={setIsPublic}
                labelOn="Public"
                labelOff="Students"
            />
        </div>

        {error && <p className="text-red-500 text-sm font-semibold p-2 bg-red-100 dark:bg-red-900/20 rounded-md">{error}</p>}

        <div className="pt-4 flex justify-end space-x-3">
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="primary" disabled={loading}>{loading ? 'Submitting...' : (isEditMode ? 'Save Changes' : 'Post')}</Button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateAnnouncementModal;