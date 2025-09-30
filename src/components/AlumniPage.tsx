import React, { useState, useEffect } from 'react';
import { AlumniPost } from '../types';
import { fetchAlumni, deleteAlumni } from '../services/apiService';
import { useAuth } from '../hooks/useAuth';
import Spinner from './Spinner';
import Button from './Button';
import AlumniCard from './AlumniCard';

interface AlumniPageProps {
  onAdd: () => void;
  onEdit: (alumni: AlumniPost) => void;
}

const AlumniPage: React.FC<AlumniPageProps> = ({ onAdd, onEdit }) => {
  const [alumniList, setAlumniList] = useState<AlumniPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAdmin } = useAuth();

  useEffect(() => {
    const loadAlumni = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchAlumni();
        // Sort by the posting date to show the latest entries first
        setAlumniList(data.sort((a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime()));
      } catch (err: any) {
        setError(err.message || "Failed to load alumni data.");
      } finally {
        setLoading(false);
      }
    };
    loadAlumni();
  }, []);

  const handleDelete = async (alumniId: string) => {
    if (window.confirm("Are you sure you want to remove this alumni record?")) {
      try {
        await deleteAlumni(alumniId);
        setAlumniList(prev => prev.filter(a => a.id !== alumniId));
      } catch (err: any) {
        setError(err.message || "Failed to delete alumni record.");
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-2 border-gray-200 dark:border-gray-700">
          <h1 className="text-2xl md:text-3xl font-bold text-text-primary dark:text-dark-text-primary">Our Alumni</h1>
          {isAdmin && (
              <Button onClick={onAdd} variant="primary">
                  Add New Alumni
              </Button>
          )}
      </div>

      {error && (
          <div className="text-center text-red-600 bg-red-100 dark:bg-red-900/20 dark:text-red-400 p-4 rounded-lg">
            {error}
          </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Spinner />
        </div>
      ) : alumniList.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {alumniList.map(alumnus => (
            <AlumniCard 
              key={alumnus.id} 
              alumni={alumnus}
              onEdit={isAdmin ? onEdit : undefined}
              onDelete={isAdmin ? handleDelete : undefined}
            />
          ))}
        </div>
      ) : (
        <div className="text-center text-text-secondary dark:text-dark-text-secondary py-16">
          <p>No alumni records have been added yet. Check back soon!</p>
        </div>
      )}
    </div>
  );
};

export default AlumniPage;