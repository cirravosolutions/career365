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
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8">
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
                <span className="ml-3 text-text-secondary dark:text-dark-text-secondary">Low drives</span>
              </li>
              <li className="flex items-start">
                <CheckIcon />
                <span className="ml-3 text-text-secondary dark:text-dark-text-secondary">Low package</span>
              </li>
               <li className="flex items-start">
                <CheckIcon />
                <span className="ml-3 text-text-secondary dark:text-dark-text-secondary">Basic / small companies</span>
              </li>
               <li className="flex items-start">
                <CheckIcon />
                <span className="ml-3 text-text-secondary dark:text-dark-text-secondary">For all participants</span>
              </li>
            </ul>
          </div>

          {/* Premium Tier */}
          <div className="relative bg-surface dark:bg-dark-surface rounded-lg shadow-lg p-8 flex flex-col border-2 border-amber-500">
             <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2">
                <span className="px-4 py-1 text-sm text-white bg-amber-500 rounded-full font-semibold">Most Popular</span>
            </div>
            <h3 className="text-2xl font-semibold text-amber-500">Premium</h3>
            <p className="mt-4 text-text-secondary dark:text-dark-text-secondary">Unlock your full potential with access to all drives.</p>
            <div className="mt-6">
              <span className="text-4xl font-extrabold text-text-primary dark:text-dark-text-primary">₹49</span>
              <span className="text-base font-medium text-text-secondary dark:text-dark-text-secondary">/ one-time</span>
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
                <span className="ml-3 text-text-secondary dark:text-dark-text-secondary">More placement benefits</span>
              </li>
               <li className="flex items-start">
                <CheckIcon />
                <span className="ml-3 text-text-secondary dark:text-dark-text-secondary">Provides Pass</span>
              </li>
            </ul>
            <div className="mt-8">
              <Button onClick={onRegisterClick} className="w-full text-lg py-3 bg-amber-500 hover:bg-amber-600 focus:ring-amber-400 text-white">
                Choose Premium
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingTiers;