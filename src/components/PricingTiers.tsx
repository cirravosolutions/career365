import React from 'react';
import Button from './Button';

interface PricingTiersProps {
  onRegisterClick: () => void;
}

const CheckIcon: React.FC = () => (
  <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
);

const PricingTiers: React.FC<PricingTiersProps> = ({ onRegisterClick }) => {
  return (
    <div className="py-12 bg-background dark:bg-dark-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-text-primary dark:text-dark-text-primary sm:text-4xl">
            Choose Your Plan
          </h2>
          <p className="mt-4 text-lg text-text-secondary dark:text-dark-text-secondary">
            Start for free and upgrade anytime to unlock exclusive placement opportunities.
          </p>
        </div>
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          
          {/* Free Tier */}
          <div className="bg-surface dark:bg-dark-surface rounded-lg shadow-lg p-8 flex flex-col">
            <h3 className="text-2xl font-semibold text-text-primary dark:text-dark-text-primary">Free</h3>
            <p className="mt-4 text-text-secondary dark:text-dark-text-secondary">A great way to get started and see what we offer.</p>
            <div className="mt-6">
              <span className="text-4xl font-extrabold text-text-primary dark:text-dark-text-primary">₹0</span>
            </div>
            <ul className="mt-6 space-y-4 flex-grow">
              <li className="flex items-start">
                <CheckIcon />
                <span className="ml-3 text-text-secondary dark:text-dark-text-secondary">View free placement drives</span>
              </li>
              <li className="flex items-start">
                <CheckIcon />
                <span className="ml-3 text-text-secondary dark:text-dark-text-secondary">Access to public announcements</span>
              </li>
              <li className="flex items-start">
                <CheckIcon />
                <span className="ml-3 text-text-secondary dark:text-dark-text-secondary">Limited to smaller companies</span>
              </li>
            </ul>
             <div className="mt-8">
                <Button onClick={onRegisterClick} variant="secondary" className="w-full text-lg py-3">
                    Get Started
                </Button>
            </div>
          </div>

          {/* Premium Tier */}
          <div className="relative bg-surface dark:bg-dark-surface rounded-lg shadow-lg p-8 flex flex-col border-2 border-primary">
             <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2">
                <span className="px-4 py-1 text-sm text-white bg-primary rounded-full font-semibold">Premium</span>
            </div>
            <h3 className="text-2xl font-semibold text-primary">Unlock Everything</h3>
            <p className="mt-4 text-text-secondary dark:text-dark-text-secondary">Get full access to all placement drives and features.</p>
            
            <div className="my-6 space-y-3">
              <div className="flex justify-between items-center p-3 rounded-lg bg-gray-100 dark:bg-gray-800">
                  <span className="font-semibold text-text-primary dark:text-dark-text-primary">Monthly</span>
                  <span className="text-lg font-bold text-text-primary dark:text-dark-text-primary">₹99</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-gray-100 dark:bg-gray-800 ring-2 ring-amber-500">
                  <div>
                    <span className="font-semibold text-text-primary dark:text-dark-text-primary">6 Months</span>
                    <span className="ml-2 text-xs font-bold text-amber-500 bg-amber-100 dark:bg-amber-900/50 px-2 py-0.5 rounded-full">POPULAR</span>
                  </div>
                  <span className="text-lg font-bold text-text-primary dark:text-dark-text-primary">₹499</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-gray-100 dark:bg-gray-800">
                   <div>
                    <span className="font-semibold text-text-primary dark:text-dark-text-primary">12 Months</span>
                     <span className="ml-2 text-xs font-bold text-green-600 bg-green-100 dark:bg-green-900/50 px-2 py-0.5 rounded-full">BEST VALUE</span>
                  </div>
                  <span className="text-lg font-bold text-text-primary dark:text-dark-text-primary">₹999</span>
              </div>
            </div>

            <ul className="mt-6 space-y-4 flex-grow">
              <li className="flex items-start">
                <CheckIcon />
                <span className="ml-3 text-text-secondary dark:text-dark-text-secondary"><strong>Everything in Free, plus:</strong></span>
              </li>
               <li className="flex items-start">
                <CheckIcon />
                <span className="ml-3 text-text-secondary dark:text-dark-text-secondary">Access to all <strong>Premium drives</strong></span>
              </li>
              <li className="flex items-start">
                <CheckIcon />
                <span className="ml-3 text-text-secondary dark:text-dark-text-secondary">Opportunities from <strong>Top MNCs</strong></span>
              </li>
              <li className="flex items-start">
                <CheckIcon />
                <span className="ml-3 text-text-secondary dark:text-dark-text-secondary">Higher salary packages</span>
              </li>
               <li className="flex items-start">
                <CheckIcon />
                <span className="ml-3 text-text-secondary dark:text-dark-text-secondary">Generate Hall Pass for drives</span>
              </li>
            </ul>
            <div className="mt-8">
              <Button onClick={onRegisterClick} variant="primary" className="w-full text-lg py-3">
                Choose Plan on Registration
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingTiers;
