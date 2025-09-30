import React, { useState } from 'react';
import Button from './Button';

const UpgradeCTA: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);
  const registrationUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSd6l0-y2GIXT9fQUV04ZKMO6TBIvwoAQ__oZ9xO2hVKvADbZw/viewform?usp=sharing&ouid=115934251216838098785';

  if (!isVisible) {
    return null;
  }
  
  const handleUpgradeClick = () => {
    window.open(registrationUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="relative bg-gradient-to-r from-yellow-400 to-amber-500 dark:from-yellow-600 dark:to-amber-700 p-6 rounded-lg text-white shadow-lg my-6">
      <button 
        onClick={() => setIsVisible(false)} 
        className="absolute top-2 right-2 text-white/70 hover:text-white/100"
        aria-label="Dismiss"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-center md:text-left">
          <h3 className="text-xl font-bold">Unlock All Placement Drives</h3>
          <p className="mt-1 text-white/90">
            Go Premium to get access to top companies, higher packages, and more exclusive benefits!
          </p>
        </div>
        <div className="flex-shrink-0">
          <Button 
            onClick={handleUpgradeClick}
            variant="secondary"
            className="bg-white text-amber-600 hover:bg-amber-50 focus:ring-amber-500 font-bold shadow-md transition-transform transform hover:scale-105"
          >
            Upgrade to Premium
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UpgradeCTA;