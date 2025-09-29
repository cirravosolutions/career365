import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Button from './Button';
import CreateUserModal from './CreateUserModal';
import StudentNoteModal from './StudentNoteModal'; // Import the new modal

interface AdminDashboardProps {
    onCreatePostClick: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onCreatePostClick }) => {
    const { isSuperAdmin } = useAuth();
    const navigate = useNavigate();
    const [isCreateUserModalOpen, setCreateUserModalOpen] = useState(false);
    const [isStudentNoteModalOpen, setStudentNoteModalOpen] = useState(false);
    const [studentNote, setStudentNote] = useState<string | null>(null);

    useEffect(() => {
        // Load the current student note from local storage on mount
        setStudentNote(localStorage.getItem('studentNote'));
    }, []);

    const handleUserCreated = () => {
        setCreateUserModalOpen(false);
        alert('Student user created successfully!');
    };

    const handleSaveStudentNote = (note: string) => {
        const trimmedNote = note.trim();
        if (trimmedNote) {
            localStorage.setItem('studentNote', trimmedNote);
            setStudentNote(trimmedNote);
        } else {
            localStorage.removeItem('studentNote');
            setStudentNote(null);
        }
        setStudentNoteModalOpen(false);
    };

    return (
        <>
            <div className="space-y-8">
                <div className="border-b pb-4 border-gray-200 dark:border-gray-700">
                    <h1 className="text-2xl md:text-3xl font-bold text-text-primary dark:text-dark-text-primary">Admin Dashboard</h1>
                    <p className="text-text-secondary dark:text-dark-text-secondary mt-1">Manage users and site content.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* General Admin Actions */}
                    <div className="bg-surface dark:bg-dark-surface p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold mb-4">Content Management</h2>
                        <div className="space-y-3">
                            <Button onClick={onCreatePostClick} variant="primary" className="w-full justify-center">
                                Create New Drive Post
                            </Button>
                             <Button onClick={() => setStudentNoteModalOpen(true)} variant="secondary" className="w-full justify-center">
                                Manage Student Note
                            </Button>
                        </div>
                    </div>

                    {/* Student Management */}
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

                    {/* Super Admin Actions */}
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
            <StudentNoteModal
                isOpen={isStudentNoteModalOpen}
                onClose={() => setStudentNoteModalOpen(false)}
                onSave={handleSaveStudentNote}
                currentNote={studentNote}
            />
        </>
    );
};

export default AdminDashboard;
