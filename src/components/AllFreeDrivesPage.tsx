import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DrivePost } from '../types';
import { fetchDrives } from '../services/apiService';
import DriveCard from './DriveCard';
import Spinner from './Spinner';
import Button from './Button';

const AllFreeDrivesPage: React.FC = () => {
  const [drives, setDrives] = useState<DrivePost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadDrives = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchDrives('free');
        setDrives(data.sort((a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime()));
      } catch (err: any) {
        setError('Failed to load placement drives. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadDrives();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
       <div className="border-b pb-4 border-gray-200 dark:border-gray-700">
           <Button onClick={() => navigate('/')} variant="secondary" className="mb-4">
                &larr; Back to Home
           </Button>
            <h1 className="text-2xl md:text-3xl font-bold text-text-primary dark:text-dark-text-primary">All Free Drives</h1>
            <p className="text-text-secondary dark:text-dark-text-secondary mt-1">
                All publicly available placement opportunities. Register to see premium drives.
            </p>
       </div>

       {error && (
        <div className="text-center text-red-600 bg-red-100 dark:bg-red-900/20 dark:text-red-400 p-4 rounded-lg">
          {error}
        </div>
      )}
      {drives.length > 0 ? (
        drives.map(drive => <DriveCard key={drive.id} drive={drive} />)
      ) : (
        <div className="text-center text-text-secondary dark:text-dark-text-secondary py-10">
           <p>No free placement drives posted yet. Check back soon!</p>
        </div>
      )}
    </div>
  );
};

export default AllFreeDrivesPage;
