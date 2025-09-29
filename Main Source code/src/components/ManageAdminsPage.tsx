import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, UserRole } from '../types';
import { fetchUsers, deleteUser } from '../services/apiService';
import Button from './Button';
import Spinner from './Spinner';
import AddAdminModal from './AddAdminModal';

const ManageAdminsPage: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isAddAdminModalOpen, setAddAdminModalOpen] = useState(false);
    const navigate = useNavigate();

    const loadUsers = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const allUsers = await fetchUsers();
            setUsers(allUsers);
        } catch (err: any) {
            setError(err.message || 'Failed to load users.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadUsers();
    }, [loadUsers]);

    const handleRemoveUser = async (userId: string) => {
        if (window.confirm('Are you sure you want to remove this admin? This action cannot be undone.')) {
            try {
                setError(null);
                await deleteUser(userId);
                setUsers(prevUsers => prevUsers.filter(u => u.id !== userId));
            } catch (err: any) {
                setError(err.message || 'Failed to remove user.');
            }
        }
    };

    const handleAdminCreated = () => {
        setAddAdminModalOpen(false);
        loadUsers();
    };

    const adminUsers = users.filter(u => u.role === UserRole.ADMIN);

    return (
        <div className="space-y-6">
            <Button onClick={() => navigate('/admin')} variant="secondary">
                &larr; Back to Dashboard
            </Button>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-2 border-gray-200 dark:border-gray-700">
                <h1 className="text-2xl md:text-3xl font-bold text-text-primary dark:text-dark-text-primary">Manage Admins</h1>
                <Button onClick={() => setAddAdminModalOpen(true)} variant="primary">
                    Add New Admin
                </Button>
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
            ) : (
                <div className="bg-surface dark:bg-dark-surface rounded-lg shadow-md overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-800">
                                <tr>
                                    <th scope="col" className="px-4 py-3 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                                    <th scope="col" className="px-4 py-3 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Username / Email</th>
                                    <th scope="col" className="px-4 py-3 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Role</th>
                                    <th scope="col" className="relative px-4 py-3 sm:px-6 sm:py-3">
                                        <span className="sr-only">Actions</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-dark-surface divide-y divide-gray-200 dark:divide-gray-700">
                                {adminUsers.length > 0 ? (
                                    adminUsers.map((admin) => (
                                        <tr key={admin.id}>
                                            <td className="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{admin.name}</td>
                                            <td className="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{admin.username}</td>
                                            <td className="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{admin.role}</td>
                                            <td className="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <Button onClick={() => handleRemoveUser(admin.id)} variant="danger">
                                                    Remove
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                                            No admins found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
            
            <AddAdminModal
                isOpen={isAddAdminModalOpen}
                onClose={() => setAddAdminModalOpen(false)}
                onAdminCreated={handleAdminCreated}
            />
        </div>
    );
};

export default ManageAdminsPage;