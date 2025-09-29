import React, { useState } from 'react';
import { AlumniPost } from '../types';
import Button from './Button';

interface AlumniCardProps {
  alumni: AlumniPost;
  onEdit?: (alumni: AlumniPost) => void;
  onDelete?: (alumniId: string) => void;
}

const UserPlaceholderIcon: React.FC = () => (
    <svg className="w-full h-full text-gray-300 dark:text-gray-600" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
);


const AlumniCard: React.FC<AlumniCardProps> = ({ alumni, onEdit, onDelete }) => {
  const [imageError, setImageError] = useState(false);

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return 'Invalid Date';
        // Use en-IN for consistency, UTC to avoid timezone shift on date-only strings
        return date.toLocaleDateString('en-IN', {
            timeZone: 'UTC', 
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    } catch (e) {
        return 'Invalid Date';
    }
  };

  return (
    <div className="bg-surface dark:bg-dark-surface rounded-lg shadow-md overflow-hidden text-center flex flex-col p-4 items-center transition-shadow hover:shadow-xl">
      <div className="relative w-24 h-24 flex-shrink-0">
        <div className="absolute top-0 left-0 w-full h-full rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden border-2 border-white dark:border-gray-700 shadow-md">
            {imageError ? (
                <UserPlaceholderIcon />
            ) : (
                <img 
                    src={alumni.photoUrl} 
                    alt={alumni.name}
                    onError={() => setImageError(true)}
                    className="w-full h-full object-cover"
                    loading="lazy"
                />
            )}
        </div>
      </div>
      <div className="pt-4 flex-grow flex flex-col justify-between w-full">
        <div className="flex-grow">
            <h3 className="font-bold text-lg text-text-primary dark:text-dark-text-primary truncate">{alumni.name}</h3>
            <p className="text-primary font-semibold text-sm">{alumni.companyName}</p>
            {alumni.package && <p className="text-sm font-bold text-green-600 dark:text-green-400">{alumni.package}</p>}
            <p className="text-xs text-text-secondary dark:text-dark-text-secondary mt-1">{formatDate(alumni.placementDate)}</p>
        </div>
         {onEdit && onDelete && (
            <div className="mt-4 flex justify-center space-x-2">
                <Button onClick={() => onEdit(alumni)} variant="secondary" className="text-xs px-2 py-1">Edit</Button>
                <Button onClick={() => onDelete(alumni.id)} variant="danger" className="text-xs px-2 py-1">Delete</Button>
            </div>
        )}
      </div>
    </div>
  );
};

export default AlumniCard;