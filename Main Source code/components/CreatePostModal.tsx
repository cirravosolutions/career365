import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { createDrive, updateDrive } from '../services/apiService';
import { DrivePost, PackageLevel } from '../types';
import Modal from './Modal';
import Input from './Input';
import Button from './Button';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPostCreated: () => void;
  driveToEdit?: DrivePost | null;
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({ isOpen, onClose, onPostCreated, driveToEdit }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    companyName: '',
    role: '',
    description: '',
    eligibility: '',
    location: '',
    salary: '',
    applyDeadline: '',
    applyLink: '',
    packageLevel: PackageLevel.LOW,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEditMode = !!driveToEdit;

  useEffect(() => {
    if (isOpen && driveToEdit) {
      setFormData({
        companyName: driveToEdit.companyName,
        role: driveToEdit.role,
        description: driveToEdit.description,
        eligibility: driveToEdit.eligibility.join(', '),
        location: driveToEdit.location,
        salary: driveToEdit.salary || '',
        applyDeadline: driveToEdit.applyDeadline.split('T')[0], // Format for date input
        applyLink: driveToEdit.applyLink || '',
        packageLevel: driveToEdit.packageLevel || PackageLevel.LOW,
      });
    } else if (!isOpen) {
      // Reset form when modal closes
      setFormData({
        companyName: '', role: '', description: '', eligibility: '', location: '', salary: '', applyDeadline: '', applyLink: '', packageLevel: PackageLevel.LOW,
      });
      setError(null);
    }
  }, [isOpen, driveToEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
        setError("You must be logged in to create or edit a post.");
        return;
    }
    setLoading(true);
    setError(null);
    try {
      const commonData = {
          ...formData,
          eligibility: formData.eligibility.split(',').map(item => item.trim()),
      };

      if (isEditMode) {
        const updatedDriveData: DrivePost = {
          ...driveToEdit,
          ...commonData,
        };
        await updateDrive(updatedDriveData, user.id);
      } else {
        const driveData: Omit<DrivePost, 'id' | 'postedAt' | 'postedBy' | 'postedById'> = commonData;
        await createDrive(driveData, user);
      }
      onPostCreated();
    } catch (err: any) {
      if (err.message === 'Unauthorized') {
          setError('Authorization Failed: Ensure your SECRET_KEY in the app matches the one in your Google Apps Script and that you have re-deployed the script with the latest changes.');
      } else {
        setError(err.message || "Failed to submit post. Please try again.");
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditMode ? "Edit Drive Post" : "Create New Drive Post"}>
      <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
        <Input label="Company Name" id="companyName" value={formData.companyName} onChange={handleChange} required />
        <Input label="Job Role" id="role" value={formData.role} onChange={handleChange} required />
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
          <textarea id="description" value={formData.description} onChange={handleChange} required rows={3} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" />
        </div>
        <Input label="Eligibility (comma-separated)" id="eligibility" value={formData.eligibility} onChange={handleChange} required />
        <Input label="Location" id="location" value={formData.location} onChange={handleChange} required />
        <Input label="Salary / CTC (e.g., 15-20 LPA)" id="salary" value={formData.salary} onChange={handleChange} />
        <div>
          <label htmlFor="packageLevel" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Package Level</label>
           <select id="packageLevel" value={formData.packageLevel} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white">
              <option value={PackageLevel.LOW}>Low (e.g., &lt; 8 LPA)</option>
              <option value={PackageLevel.MID}>Mid (e.g., 8-15 LPA)</option>
              <option value={PackageLevel.HIGH}>High (e.g., &gt; 15 LPA)</option>
           </select>
        </div>
        <Input label="Application Deadline" id="applyDeadline" type="date" value={formData.applyDeadline} onChange={handleChange} required />
        <Input label="Application Link" id="applyLink" type="url" value={formData.applyLink} onChange={handleChange} />
        
        {error && <p className="text-red-500 text-sm font-semibold p-2 bg-red-100 dark:bg-red-900/20 rounded-md">{error}</p>}

        <div className="pt-4 flex justify-end space-x-3">
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="primary" disabled={loading}>{loading ? 'Submitting...' : (isEditMode ? 'Save Changes' : 'Post Drive')}</Button>
        </div>
      </form>
    </Modal>
  );
};

export default CreatePostModal;
