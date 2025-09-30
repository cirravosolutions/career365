import React from 'react';
import Button from './Button';

const ResumeBuilderCTA: React.FC = () => {
  const resumeBuilderUrl = 'https://buildmyresume.free.nf/';

  const handleClick = () => {
    window.open(resumeBuilderUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="bg-primary/10 dark:bg-primary/20 p-6 md:p-8 rounded-lg text-center my-8">
      <h2 className="text-2xl md:text-3xl font-bold text-primary dark:text-blue-300">
        Ready to Impress Recruiters?
      </h2>
      <p className="mt-2 max-w-2xl mx-auto text-md text-text-secondary dark:text-dark-text-secondary">
        Craft a professional resume that stands out from the crowd. Use our recommended free tool to build a job-winning resume in minutes.
      </p>
      <div className="mt-6">
        <Button onClick={handleClick} variant="primary" className="text-base px-6 py-3">
          Build My Resume Now
        </Button>
      </div>
    </div>
  );
};

export default ResumeBuilderCTA;
