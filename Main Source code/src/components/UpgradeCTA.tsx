import React, { useState } from 'react';
import Button from './Button';

const UpgradeCTA: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) {
    return null;
  }
  
  const handleUpgradeClick = () => {
    // In a real app, this would navigate to a payment page.
    alert("Upgrade functionality is not yet implemented. Please contact an administrator to upgrade your account.");
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
            Go Premium for just ₹49 to get access to top companies, higher packages, and more exclusive benefits!
          </p>
        </div>
        <div className="flex-shrink-0">
          <Button 
            onClick={handleUpgradeClick}
            className="bg-white text-amber-600 hover:bg-gray-100 focus:ring-amber-400 font-bold"
          >
            Upgrade to Premium
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UpgradeCTA;