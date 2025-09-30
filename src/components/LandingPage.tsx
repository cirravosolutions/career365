import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Button from './Button';
import { DrivePost } from '../types';
import { fetchDrives } from '../services/apiService';
import DriveCard from './DriveCard';
import Spinner from './Spinner';
import ResumeBuilderCTA from './ResumeBuilderCTA';
import PricingTiers from './PricingTiers';
import AnnouncementsFeed from './AnnouncementsFeed';

interface LandingPageProps {
  onLoginClick: () => void;
  onRegisterClick: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onLoginClick, onRegisterClick }) => {
    const [freeDrives, setFreeDrives] = useState<DrivePost[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadFreeDrives = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await fetchDrives('free');
                setFreeDrives(data.sort((a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime()));
            } catch (err) {
                setError('Failed to load free placement drives. Please check back later.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        loadFreeDrives();
    }, []);

    const drivesToDisplay = freeDrives.slice(0, 5);

  return (
    <div className="space-y-16">
        <div className="text-center py-10 md:py-16">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-text-primary dark:text-dark-text-primary">
                Find Your Dream Placement
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-text-secondary dark:text-dark-text-secondary">
               A dedicated platform connecting students with the latest placement drives. Register to unlock premium opportunities and top company listings.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center space-y-4">
                <Button 
                    onClick={onRegisterClick} 
                    className="text-lg px-8 py-3 bg-amber-500 text-white hover:bg-amber-600 focus:ring-amber-500 shadow-lg transform transition-transform hover:scale-105"
                >
                  Register Yourself Now
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
        
        <AnnouncementsFeed visibility="public" limit={5} />
        
        <PricingTiers onRegisterClick={onRegisterClick} />

        <ResumeBuilderCTA />

        <div id="free-drives" className="space-y-6 scroll-mt-20">
            <div className="border-b pb-2 border-gray-200 dark:border-gray-700">
                <h2 className="text-2xl md:text-3xl font-bold text-text-primary dark:text-dark-text-primary">Free Drives</h2>
                <p className="text-text-secondary dark:text-dark-text-secondary mt-1">Get a preview of our platform. Upgrade to Premium to see all drives.</p>
            </div>
            
            {loading && (
                <div className="flex justify-center items-center h-40">
                    <Spinner />
                </div>
            )}
            
            {error && (
                <div className="text-center text-red-600 bg-red-100 dark:bg-red-900/20 dark:text-red-400 p-4 rounded-lg">
                    {error}
                </div>
            )}

            {!loading && !error && (
                freeDrives.length > 0 ? (
                    <>
                        {drivesToDisplay.map(drive => <DriveCard key={drive.id} drive={drive} />)}
                        {freeDrives.length > 5 && (
                             <div className="text-center mt-6">
                                <Link to="/drives" className="inline-block px-6 py-3 rounded-md font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200 bg-primary text-white hover:bg-blue-700 focus:ring-blue-500">
                                    View All Free Drives
                                </Link>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center text-text-secondary dark:text-dark-text-secondary py-10">
                        <p>No free drives posted at the moment. Check back soon!</p>
                    </div>
                )
            )}
        </div>
    </div>
  );
};

export default LandingPage;
