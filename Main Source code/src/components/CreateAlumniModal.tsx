import React, { useState, useEffect, useRef } from 'react';
import { createAlumni, updateAlumni } from '../services/apiService';
import { AlumniPost } from '../types';
import Modal from './Modal';
import Input from './Input';
import Button from './Button';

interface CreateAlumniModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitted: () => void;
  alumniToEdit?: AlumniPost | null;
}

const initialFormData = {
    name: '',
    companyName: '',
    placementDate: '',
    package: '',
};

const MAX_FILE_SIZE_MB = 1;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif'];

const CreateAlumniModal: React.FC<CreateAlumniModalProps> = ({ isOpen, onClose, onSubmitted, alumniToEdit }) => {
  const [formData, setFormData] = useState(initialFormData);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isEditMode = !!alumniToEdit;

  useEffect(() => {
    if (isOpen) {
      if (alumniToEdit) {
        setFormData({
          name: alumniToEdit.name,
          companyName: alumniToEdit.companyName,
          placementDate: alumniToEdit.placementDate,
          package: alumniToEdit.package || '',
        });
        setPreview(alumniToEdit.photoUrl);
      }
    } else {
      // Reset form when modal closes
      setFormData(initialFormData);
      setPhotoFile(null);
      setPreview(null);
      setError(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, [isOpen, alumniToEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      setError('Invalid file type. Please select a PNG, JPG, or GIF image.');
      return;
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      setError(`File is too large. Please select an image under ${MAX_FILE_SIZE_MB}MB.`);
      return;
    }
    
    setPhotoFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!photoFile && !isEditMode) {
        setError("A photo is required to create a new alumni record.");
        return;
    }
    
    setLoading(true);
    setError(null);

    const data = new FormData();
    data.append('name', formData.name);
    data.append('companyName', formData.companyName);
    data.append('placementDate', formData.placementDate);
    data.append('package', formData.package);

    if (photoFile) {
        data.append('photo', photoFile);
    }
    
    try {
      if (isEditMode && alumniToEdit) {
        data.append('id', alumniToEdit.id);
        await updateAlumni(data);
      } else {
        await createAlumni(data);
      }
      onSubmitted();
    } catch (err: any) {
      setError(err.message || "Failed to submit alumni record. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditMode ? "Edit Alumni Record" : "Add New Alumni"}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="Student Name" id="name" value={formData.name} onChange={handleChange} required />
        <Input label="Company Name" id="companyName" value={formData.companyName} onChange={handleChange} required />
        <Input label="Package (e.g., 12 LPA)" id="package" value={formData.package} onChange={handleChange} />
        <Input label="Placement Date" id="placementDate" type="date" value={formData.placementDate} onChange={handleChange} required />
        
        <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Photo</label>
            <div className="mt-2 flex items-center space-x-4">
                {preview ? (
                    <img src={preview} alt="Preview" className="h-16 w-16 rounded-full object-cover" />
                ) : (
                    <div className="h-16 w-16 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                        <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    </div>
                )}
                <input
                    ref={fileInputRef}
                    type="file"
                    id="photo"
                    aria-label="Upload photo"
                    accept={ACCEPTED_IMAGE_TYPES.join(',')}
                    onChange={handleFileChange}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-primary hover:file:bg-blue-100 dark:file:bg-gray-700 dark:file:text-gray-300 dark:hover:file:bg-gray-600"
                />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Max file size: {MAX_FILE_SIZE_MB}MB. Accepted formats: JPG, PNG, GIF.</p>
        </div>


        {error && <p className="text-red-500 text-sm font-semibold p-2 bg-red-100 dark:bg-red-900/20 rounded-md">{error}</p>}

        <div className="pt-4 flex justify-end space-x-3">
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="primary" disabled={loading}>{loading ? 'Submitting...' : (isEditMode ? 'Save Changes' : 'Add Alumni')}</Button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateAlumniModal;