import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { DriveInterest, DrivePost } from '../types';
import { getInterestDetailsForDrive, fetchDrives } from '../services/apiService';
import Button from './Button';
import Spinner from './Spinner';
import Input from './Input';

const DriveInterestDetails: React.FC = () => {
    const { driveId } = useParams<{ driveId: string }>();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [attendees, setAttendees] = useState<DriveInterest[]>([]);
    const [drive, setDrive] = useState<DrivePost | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const loadDetails = useCallback(async () => {
        if (!user || !driveId) return;
        try {
            setLoading(true);
            setError(null);
            const [attendeesData, allDrives] = await Promise.all([
                getInterestDetailsForDrive(driveId, user.id),
                fetchDrives() 
            ]);
            const currentDrive = allDrives.find(d => d.id === driveId);

            setAttendees(attendeesData);
            setDrive(currentDrive || null);

        } catch (err: any) {
            setError(err.message || 'Failed to load attendee details.');
        } finally {
            setLoading(false);
        }
    }, [user, driveId]);

    useEffect(() => {
        loadDetails();
    }, [loadDetails]);
    
    const filteredAttendees = useMemo(() => {
        if (!searchTerm) {
            return attendees;
        }
        return attendees.filter(attendee =>
            attendee.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            attendee.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
            attendee.passId.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [attendees, searchTerm]);

    const handleDownloadCsv = () => {
        if (filteredAttendees.length === 0) {
            alert("No attendee data to download.");
            return;
        }
    
        const headers = ["Student Name", "Student ID", "Pass ID"];
        
        const escapeCsvCell = (cell: any) => {
            const cellStr = String(cell ?? '');
            if (cellStr.includes(',') || cellStr.includes('"') || cellStr.includes('\n')) {
                return `"${cellStr.replace(/"/g, '""')}"`;
            }
            return cellStr;
        };
    
        const csvContent = [
            headers.join(','),
            ...filteredAttendees.map(attendee => [
                escapeCsvCell(attendee.userName),
                escapeCsvCell(attendee.studentId),
                escapeCsvCell(attendee.passId),
            ].join(','))
        ].join('\n');
    
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        const fileName = `attendees_${drive?.companyName.replace(/\s/g, '') || 'drive'}_${new Date().toISOString().split('T')[0]}.csv`;
        link.setAttribute("href", url);
        link.setAttribute("download", fileName);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (loading) {
        return <div className="flex justify-center items-center h-64"><Spinner /></div>;
    }

    if (error) {
        return <div className="text-center text-red-600 bg-red-100 dark:bg-red-900/20 dark:text-red-400 p-4 rounded-lg">{error}</div>;
    }

    if (!drive) {
        return <div className="text-center text-text-secondary dark:text-dark-text-secondary py-10">Drive not found.</div>;
    }

    return (
        <div className="space-y-6">
            <div className="border-b pb-4 border-gray-200 dark:border-gray-700">
                <Button onClick={() => navigate(-1)} variant="secondary" className="mb-4">
                    &larr; Back to Feed
                </Button>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-text-primary dark:text-dark-text-primary">Attendees for {drive.companyName}</h1>
                        <p className="text-text-secondary dark:text-dark-text-secondary mt-1">{drive.role}</p>
                    </div>
                    <Button onClick={handleDownloadCsv} variant="secondary">
                        Download CSV
                    </Button>
                </div>
            </div>
            
            <Input 
                id="search-attendees"
                label="Search Attendees"
                placeholder="Enter name, student ID, or pass ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />

            <div className="bg-surface dark:bg-dark-surface rounded-lg shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-800">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Student Name</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Student ID</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Pass ID</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-dark-surface divide-y divide-gray-200 dark:divide-gray-700">
                            {filteredAttendees.length > 0 ? (
                                filteredAttendees.map((attendee) => (
                                    <tr key={attendee.passId}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{attendee.userName}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{attendee.studentId}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500 dark:text-gray-300">{attendee.passId}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                                        {searchTerm ? 'No attendees match your search.' : 'No students have registered interest yet.'}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default DriveInterestDetails;