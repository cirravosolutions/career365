import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import Input from './Input';
import Button from './Button';
import { createAdmin } from '../services/apiService';
import { useAuth } from '../hooks/useAuth';

interface AddAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdminCreated: () => void;
}

const AddAdminModal: React.FC<AddAdminModalProps> = ({ isOpen, onClose, onAdminCreated }) => {
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
        setError("You are not authorized to perform this action.");
        return;
    }
    if (password.length < 6) {
        setError('Password must be at least 6 characters long.');
        return;
    }
    setLoading(true);
    setError(null);
    try {
      await createAdmin(name, username, password, user.id);
      onAdminCreated();
    } catch (err: any) {
      setError(err.message || 'Failed to create admin. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setName('');
      setUsername('');
      setPassword('');
      setError(null);
      setLoading(false);
    }
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Admin">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Full Name"
          id="new_admin_name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <Input
          label="Email ID / Username"
          id="new_admin_username"
          type="email"
          value={username}
          onChange={(e) => setUsername(e.target.value.trim())}
          required
        />
        <Input
          label="Password"
          id="new_admin_password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}
        
        <div className="pt-2 flex justify-end space-x-3">
            <Button type="button" variant="secondary" onClick={onClose}>
                Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={loading}>
                {loading ? 'Creating...' : 'Create Admin'}
            </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AddAdminModal;