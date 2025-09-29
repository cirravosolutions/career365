import React from 'react';
import { DrivePost } from '../types';
import { useAuth } from '../hooks/useAuth';
import Button from './Button';

interface DriveCardProps {
  drive: DrivePost;
  onEdit: (drive: DrivePost) => void;
  onDelete: (driveId: string) => void;
}

const InfoPill: React.FC<{ icon: React.ReactNode; text: string }> = ({ icon, text }) => (
  <div className="flex items-center text-sm text-text-secondary dark:text-dark-text-secondary bg-gray-100 dark:bg-gray-700 rounded-full px-3 py-1">
    {icon}
    <span className="ml-2">{text}</span>
  </div>
);

const DriveCard: React.FC<DriveCardProps> = ({ drive, onEdit, onDelete }) => {
  const { user, isSuperAdmin } = useAuth();
  const isOwner = user && user.id === drive.postedById;
  const canManage = isOwner || isSuperAdmin;
  
  const timeSince = (dateString: string) => {
    const date = new Date(dateString);
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return Math.floor(seconds) + " seconds ago";
  };

  return (
    <div className="bg-surface dark:bg-dark-surface rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:scale-[1.02] hover:shadow-xl">
      <div className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
          <div className="mb-2 sm:mb-0">
            <h2 className="text-xl md:text-2xl font-bold text-primary">{drive.role}</h2>
            <p className="text-base md:text-lg text-text-secondary dark:text-dark-text-secondary">{drive.companyName}</p>
          </div>
          <div className="text-left sm:text-right flex-shrink-0">
             <div className="text-sm text-red-600 font-semibold">
                Apply by: {new Date(drive.applyDeadline).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
             </div>
          </div>
        </div>
        
        <p className="mt-4 text-text-primary dark:text-dark-text-primary">{drive.description}</p>
        
        <div className="mt-4">
          <h4 className="font-semibold text-text-primary dark:text-dark-text-primary">Eligibility:</h4>
          <ul className="list-disc list-inside text-text-secondary dark:text-dark-text-secondary mt-1">
            {Array.isArray(drive.eligibility) ? drive.eligibility.map((item, index) => <li key={index}>{item}</li>) : <li>{drive.eligibility}</li>}
          </ul>
        </div>
        
        <div className="mt-6 flex flex-wrap gap-3">
          <InfoPill icon={<LocationIcon />} text={drive.location} />
          {drive.salary && <InfoPill icon={<SalaryIcon />} text={drive.salary} />}
        </div>

        {(drive.applyLink || canManage) && (
            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
                {drive.applyLink ? (
                    <a 
                    href={drive.applyLink} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="inline-block px-4 py-2 rounded-md font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200 bg-primary text-white hover:bg-blue-700 focus:ring-blue-500"
                    >
                        Apply Now
                    </a>
                ) : <div />}
                {canManage && (
                <div className="flex space-x-3">
                    <Button onClick={() => onEdit(drive)} variant="secondary">Edit</Button>
                    <Button onClick={() => onDelete(drive.id)} variant="danger">Delete</Button>
                </div>
                )}
            </div>
        )}
      </div>
      <div className="bg-gray-50 dark:bg-gray-900/50 px-6 py-3 flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
        <span>Posted by: {drive.postedBy}</span>
        <span>{timeSince(drive.postedAt)}</span>
      </div>
    </div>
  );
};

const LocationIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const SalaryIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 8h6m-5 4h4m5 4a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

export default DriveCard;