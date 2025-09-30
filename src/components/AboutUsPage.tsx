import React from 'react';

const EmailIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-5 w-5 mr-2"} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
);

const AboutUsPage: React.FC = () => {
  return (
    <div className="bg-surface dark:bg-dark-surface p-6 md:p-8 rounded-lg shadow-md space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-primary mb-4 text-center">About Us</h1>
        <p className="text-text-secondary dark:text-dark-text-secondary leading-relaxed">
          Career365 is a student-focused platform created and managed by a group of HRs and Placement Officers. Our mission is to provide accurate and timely information about upcoming placement drives, including job descriptions, eligibility, location, and schedules. We are not a recruitment agency and do not guarantee jobs — instead, we serve as a bridge by keeping students updated about opportunities. With Career365, you can stay informed, prepared, and one step ahead in your placement journey.
        </p>
      </div>

      <div className="bg-yellow-100/50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 text-yellow-800 dark:text-yellow-300 p-4 rounded-r-lg" role="alert">
        <h2 className="font-bold text-lg mb-2">Disclaimer</h2>
        <p className="text-sm leading-relaxed">
          This site is managed by a group of HRs and Placement Officers to provide information about upcoming placement drives, including location, schedule, and job descriptions. It is not affiliated with any company, and no company is responsible for the payments made here. The contributions collected are only for website maintenance and related expenses. Career365 does not provide any guarantee of jobs; our role is limited to sharing drive details, and it is the responsibility of each candidate to showcase their skills to company HRs. The site runs under Cirravo Solutions. For any technical issues, please contact the admin.
        </p>
      </div>
      
      <div>
        <h2 className="text-2xl font-bold text-text-primary dark:text-dark-text-primary mb-4">Contact</h2>
        <div className="space-y-3">
             <div className="flex items-center">
                <EmailIcon className="h-5 w-5 mr-3 flex-shrink-0 text-secondary" />
                <div>
                    <span className="font-semibold">Placement Officer:</span>
                    <a href="mailto:info@career365.co.in" className="ml-2 text-primary hover:underline">info@career365.co.in</a>
                </div>
            </div>
             <div className="flex items-center">
                <EmailIcon className="h-5 w-5 mr-3 flex-shrink-0 text-secondary" />
                <div>
                    <span className="font-semibold">Site Admin:</span>
                    <a href="mailto:cirravosolutions@gmail.com" className="ml-2 text-primary hover:underline">cirravosolutions@gmail.com</a>
                </div>
            </div>
        </div>
      </div>
      
      <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <p className="text-center text-sm text-text-secondary dark:text-dark-text-secondary">
            All copyrights reserved to Cirravo
          </p>
      </div>
    </div>
  );
};

export default AboutUsPage;