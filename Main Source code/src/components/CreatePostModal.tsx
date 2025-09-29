import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { createDrive, updateDrive } from '../services/apiService';
import { DrivePost, PackageLevel } from '../types';
import Modal from './Modal';
import Input from './Input';
import Button from './Button';
import ToggleSwitch from './ToggleSwitch';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPostCreated: () => void;
  driveToEdit?: DrivePost | null;
}

const initialFormData = {
    companyName: '',
    role: '',
    description: '',
    eligibility: '',
    location: '',
    salary: '',
    applyDeadline: '',
    applyLink: '',
    packageLevel: PackageLevel.LOW,
    isFree: false,
};

const CreatePostModal: React.FC<CreatePostModalProps> = ({ isOpen, onClose, onPostCreated, driveToEdit }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState(initialFormData);
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
        isFree: driveToEdit.isFree || false,
      });
    } else if (!isOpen) {
      // Reset form when modal closes
      setFormData(initialFormData);
      setError(null);
    }
  }, [isOpen, driveToEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleToggleChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, isFree: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
        setError("User session expired. Please log in again.");
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
        await updateDrive(updatedDriveData);
      } else {
        await createDrive(commonData);
      }
      onPostCreated();
    } catch (err: any) {
       setError(err.message || "Failed to submit post. Please try again.");
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
              <option value={PackageLevel.LOW}>Low (e.g., {'<'} 8 LPA)</option>
              <option value={PackageLevel.MID}>Mid (e.g., 8-15 LPA)</option>
              <option value={PackageLevel.HIGH}>High (e.g., {'>'} 15 LPA)</option>
           </select>
        </div>
        <Input label="Application Deadline" id="applyDeadline" type="date" value={formData.applyDeadline} onChange={handleChange} required />
        <Input label="Application Link" id="applyLink" type="url" value={formData.applyLink} onChange={handleChange} />
        
        <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
            <label htmlFor="isFree" className="block text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
                Drive Visibility
                <span className="block text-xs text-gray-500 dark:text-gray-400">
                    Free drives are visible to everyone on the landing page.
                </span>
            </label>
            <ToggleSwitch
                id="isFree"
                checked={formData.isFree}
                onChange={handleToggleChange}
                labelOn="Free"
                labelOff="Premium"
            />
        </div>

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