import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, UserRole } from '../types';
import { fetchUsers, deleteUser } from '../services/apiService';
import Button from './Button';
import Spinner from './Spinner';
import Input from './Input';

const ManageStudentsPage: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const loadUsers = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const allUsers = await fetchUsers();
            setUsers(allUsers.filter(u => u.role === UserRole.STUDENT));
        } catch (err: any) {
            setError(err.message || 'Failed to load users.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadUsers();
    }, [loadUsers]);

    const handleRemoveUser = async (userId: string, studentName: string) => {
        if (window.confirm(`Are you sure you want to remove ${studentName}? This action cannot be undone.`)) {
            try {
                setError(null);
                await deleteUser(userId);
                setUsers(prevUsers => prevUsers.filter(u => u.id !== userId));
            } catch (err: any) {
                setError(err.message || 'Failed to remove user.');
            }
        }
    };

    const filteredStudents = useMemo(() => {
        if (!searchTerm) {
            return users;
        }
        return users.filter(student =>
            student.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [users, searchTerm]);

    const handleDownloadCsv = () => {
        if (filteredStudents.length === 0) {
            alert("No student data to download.");
            return;
        }
    
        const headers = ["ID", "Name", "Username/Email", "Subscription"];
        
        const escapeCsvCell = (cell: any) => {
            const cellStr = String(cell ?? '');
            if (cellStr.includes(',') || cellStr.includes('"') || cellStr.includes('\n')) {
                return `"${cellStr.replace(/"/g, '""')}"`;
            }
            return cellStr;
        };
    
        const csvContent = [
            headers.join(','),
            ...filteredStudents.map(student => [
                escapeCsvCell(student.id),
                escapeCsvCell(student.name),
                escapeCsvCell(student.username),
                escapeCsvCell(student.subscriptionTier),
            ].join(','))
        ].join('\n');
    
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `students_list_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="space-y-6">
            <Button onClick={() => navigate('/admin')} variant="secondary">
                &larr; Back to Dashboard
            </Button>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-2 border-gray-200 dark:border-gray-700">
                <h1 className="text-2xl md:text-3xl font-bold text-text-primary dark:text-dark-text-primary">Manage Students</h1>
                <Button onClick={handleDownloadCsv} variant="secondary">
                    Download CSV
                </Button>
            </div>
            
            <Input 
                id="search-students"
                label="Search Students"
                placeholder="Enter name, username or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />

            {error && (
                <div className="text-center text-red-600 bg-red-100 dark:bg-red-900/20 dark:text-red-400 p-4 rounded-lg">
                  {error}
                </div>
            )}

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <Spinner />
                </div>
            ) : (
                <div className="bg-surface dark:bg-dark-surface rounded-lg shadow-md overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-800">
                                <tr>
                                    <th scope="col" className="px-4 py-3 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                                    <th scope="col" className="px-4 py-3 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Username / Email</th>
                                    <th scope="col" className="px-4 py-3 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Subscription</th>
                                    <th scope="col" className="relative px-4 py-3 sm:px-6 sm:py-3">
                                        <span className="sr-only">Actions</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-dark-surface divide-y divide-gray-200 dark:divide-gray-700">
                                {filteredStudents.length > 0 ? (
                                    filteredStudents.map((student) => (
                                        <tr key={student.id}>
                                            <td className="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{student.name}</td>
                                            <td className="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{student.username}</td>
                                            <td className="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{student.subscriptionTier}</td>
                                            <td className="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <Button onClick={() => handleRemoveUser(student.id, student.name)} variant="danger">
                                                    Remove
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                                            No students found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageStudentsPage;