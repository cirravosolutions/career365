import React from 'react';
import Button from './Button';

interface LandingPageProps {
  onLoginClick: () => void;
  onRegisterClick: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onLoginClick, onRegisterClick }) => {
  return (
    <div className="text-center py-16 md:py-24">
      <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-text-primary dark:text-dark-text-primary">
        Find Your Dream Placement
      </h1>
      <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-text-secondary dark:text-dark-text-secondary">
        A dedicated platform connecting students with the latest placement drives from top companies. Access is now free for everyone!
      </p>
      <div className="mt-8 flex flex-col items-center justify-center space-y-4">
        <Button onClick={onRegisterClick} variant="primary" className="text-lg px-8 py-3">
          Register Yourself
        </Button>
        <p className="text-sm text-text-secondary dark:text-dark-text-secondary">
          Login credentials will be sent to your mail after registration.
        </p>
      </div>
      <p className="mt-10 text-text-secondary dark:text-dark-text-secondary">
        Already have an account?{' '}
        <button onClick={onLoginClick} className="font-semibold text-primary hover:underline">
          Log in
        </button>
      </p>
    </div>
  );
};

export default LandingPage;