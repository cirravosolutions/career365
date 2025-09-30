
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DrivePost, DriveInterest, UserRole } from '../types';
import { useAuth } from '../hooks/useAuth';
import Button from './Button';
import { registerInterest } from '../services/apiService';

// Make jsPDF available from the global scope
declare const jspdf: any;

interface DriveCardProps {
  drive: DrivePost;
  onEdit?: (drive: DrivePost) => void;
  onDelete?: (driveId: string) => void;
  userInterest?: DriveInterest | null;
  onInterestRegistered?: (interest: DriveInterest) => void;
  interestCount?: number;
}

const InfoPill: React.FC<{ icon: React.ReactNode; text: string }> = ({ icon, text }) => (
  <div className="flex items-center text-sm text-text-secondary dark:text-dark-text-secondary bg-gray-100 dark:bg-gray-700 rounded-full px-3 py-1">
    {icon}
    <span className="ml-2">{text}</span>
  </div>
);

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

const DriveCard: React.FC<DriveCardProps> = ({ drive, onEdit, onDelete, userInterest, onInterestRegistered, interestCount = 0 }) => {
  const { user, isSuperAdmin, isAdmin, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [isRegistering, setIsRegistering] = useState(false);
  
  const isOwner = user && user.id === drive.postedById;
  const canManage = isLoggedIn && onEdit && onDelete && (isOwner || isSuperAdmin);
  const isStudent = isLoggedIn && user?.role === UserRole.STUDENT;

  const generateAndDownloadPass = (passDetails: DriveInterest) => {
    const { jsPDF } = jspdf;
    const doc = new jsPDF();

    // Header
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("Placement Drive Hall Pass", 105, 25, { align: "center" });
    
    // Line Separator
    doc.setLineWidth(0.5);
    doc.line(20, 35, 190, 35);

    // Drive Details
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text(drive.companyName, 20, 50);
    doc.setFontSize(14);
    doc.setFont("helvetica", "normal");
    doc.text(`Role: ${drive.role}`, 20, 60);

    // Attendee Details
    doc.setFont("helvetica", "bold");
    doc.text("Attendee Details:", 20, 80);
    doc.setFont("helvetica", "normal");
    doc.text(`Name: ${passDetails.userName}`, 20, 90);
    doc.text(`Student ID: ${passDetails.studentId}`, 20, 100);

    // Unique Pass ID
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("Unique Pass ID", 105, 125, { align: "center" });
    doc.setFillColor(240, 240, 240);
    doc.rect(55, 130, 100, 12, 'F');
    doc.setFont("courier", "bold");
    doc.setFontSize(16);
    doc.setTextColor(50, 50, 50);
    doc.text(passDetails.passId, 105, 138, { align: "center" });

    // Footer
    doc.setTextColor(150, 150, 150);
    doc.setFontSize(10);
    doc.text("Present this pass for verification. Powered by Career 365.", 105, 160, { align: "center" });

    doc.save(`HallPass_${drive.companyName.replace(/\s/g, '')}_${user?.name.replace(/\s/g, '')}.pdf`);
  };

  const handleInterestClick = async () => {
    if (!user || !onInterestRegistered) return;
    setIsRegistering(true);
    try {
      if (userInterest) {
        generateAndDownloadPass(userInterest);
      } else {
        const newInterest = await registerInterest(drive.id);
        onInterestRegistered(newInterest);
        generateAndDownloadPass(newInterest);
      }
    } catch (error) {
      console.error("Failed to register interest or generate pass:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsRegistering(false);
    }
  };
  
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
    <div className="relative bg-surface dark:bg-dark-surface rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:scale-[1.02] hover:shadow-xl">
       {drive.isFree && (
        <div className="absolute top-0 right-0 bg-accent text-white text-xs font-bold px-3 py-1 rounded-bl-lg z-10">
          FREE
        </div>
      )}
      <div className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
          <div className="mb-2 sm:mb-0">
            <h2 className="text-lg md:text-xl font-bold text-primary">{drive.role}</h2>
            <p className="text-base text-text-secondary dark:text-dark-text-secondary">{drive.companyName}</p>
          </div>
          <div className="text-left sm:text-right flex-shrink-0">
             <div className="text-sm text-red-600 font-semibold">
                Apply by: {formatDate(drive.applyDeadline)}
             </div>
          </div>
        </div>
        
        <p className="mt-4 text-text-primary dark:text-dark-text-primary whitespace-pre-wrap">{drive.description}</p>
        
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

        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 flex flex-wrap gap-2 justify-between items-center">
            <div className="flex items-center gap-4">
              {drive.applyLink && (
                  <a 
                  href={drive.applyLink} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-block px-4 py-2 rounded-md font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200 bg-primary text-white hover:bg-blue-700 focus:ring-blue-500"
                  >
                      Apply Now
                  </a>
              )}
               {isStudent && onInterestRegistered && (
                  <Button onClick={handleInterestClick} variant="secondary" disabled={isRegistering}>
                      {isRegistering ? 'Generating...' : (userInterest ? 'Download Pass' : "I'm Interested")}
                  </Button>
               )}
               {isAdmin && (
                 <Button onClick={() => navigate(`/drive/${drive.id}/attendees`)} variant="secondary">
                   View Attendees ({interestCount})
                 </Button>
               )}
            </div>

            {canManage && (
            <div className="flex space-x-3">
                <Button onClick={() => onEdit(drive)} variant="secondary">Edit</Button>
                <Button onClick={() => onDelete(drive.id)} variant="danger">Delete</Button>
            </div>
            )}
        </div>
      </div>
      <div className="bg-gray-50 dark:bg-gray-900/50 px-6 py-3 flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
        <span>Posted by: {drive.postedBy}</span>
        <span>{formatToIST(drive.postedAt)}</span>
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
