
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Button from './Button';
import CreateUserModal from './CreateUserModal';

interface AdminDashboardProps {
    onCreatePostClick: () => void;
    onCreateAnnouncementClick: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onCreatePostClick, onCreateAnnouncementClick }) => {
    const { isSuperAdmin } = useAuth();
    const navigate = useNavigate();
    const [isCreateUserModalOpen, setCreateUserModalOpen] = useState(false);

    const handleUserCreated = () => {
        setCreateUserModalOpen(false);
        alert('Student user created successfully!');
    };

    return (
        <>
            <div className="space-y-8">
                <Button onClick={() => navigate('/')} variant="secondary">
                    &larr; Back to Main Feed
                </Button>
                <div className="border-b pb-4 border-gray-200 dark:border-gray-700">
                    <h1 className="text-2xl md:text-3xl font-bold text-text-primary dark:text-dark-text-primary">Admin Dashboard</h1>
                    <p className="text-text-secondary dark:text-dark-text-secondary mt-1">Manage users and site content.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-surface dark:bg-dark-surface p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold mb-4">Content Management</h2>
                        <div className="space-y-3">
                            <Button onClick={onCreatePostClick} variant="primary" className="w-full justify-center">
                                Create New Drive Post
                            </Button>
                            <Button onClick={onCreateAnnouncementClick} variant="primary" className="w-full justify-center">
                                Create New Announcement
                            </Button>
                        </div>
                    </div>

                    <div className="bg-surface dark:bg-dark-surface p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold mb-4">Student Management</h2>
                        <div className="space-y-3">
                           <Button onClick={() => setCreateUserModalOpen(true)} variant="primary" className="w-full justify-center">
                                Add New Student
                            </Button>
                            <Button onClick={() => navigate('/manage-students')} variant="secondary" className="w-full justify-center">
                                Manage Students
                            </Button>
                        </div>
                    </div>

                    {isSuperAdmin && (
                         <div className="bg-surface dark:bg-dark-surface p-6 rounded-lg shadow-md md:col-span-2">
                            <h2 className="text-xl font-semibold mb-4">Super Admin Tools</h2>
                            <div className="space-y-3">
                               <Button onClick={() => navigate('/manage-admins')} variant="secondary" className="w-full justify-center">
                                    Manage Admins
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <CreateUserModal
                isOpen={isCreateUserModalOpen}
                onClose={() => setCreateUserModalOpen(false)}
                onUserCreated={handleUserCreated}
            />
        </>
    );
};

export default AdminDashboard;