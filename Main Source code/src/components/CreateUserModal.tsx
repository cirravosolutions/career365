import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import Input from './Input';
import Button from './Button';
import { createUserByAdmin } from '../services/apiService';
import { SubscriptionTier } from '../types';

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUserCreated: () => void;
}

const CreateUserModal: React.FC<CreateUserModalProps> = ({ isOpen, onClose, onUserCreated }) => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [subscriptionTier, setSubscriptionTier] = useState<SubscriptionTier>(SubscriptionTier.FREE);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
        setError('Password must be at least 6 characters long.');
        return;
    }
    setLoading(true);
    setError(null);
    try {
      await createUserByAdmin(name, username, password, subscriptionTier);
      onUserCreated();
    } catch (err: any) {
      setError(err.message || 'Failed to create user. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setName('');
      setUsername('');
      setPassword('');
      setSubscriptionTier(SubscriptionTier.FREE);
      setError(null);
      setLoading(false);
    }
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Student">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Full Name"
          id="new_user_name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <Input
          label="Email ID / Username"
          id="new_user_username"
          type="email"
          value={username}
          onChange={(e) => setUsername(e.target.value.trim())}
          required
        />
        <Input
          label="Password"
          id="new_user_password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Subscription Tier</label>
            <div className="mt-2 flex items-center space-x-4">
                <div className="flex items-center">
                    <input
                        id="tier-free"
                        name="subscription-tier"
                        type="radio"
                        checked={subscriptionTier === SubscriptionTier.FREE}
                        onChange={() => setSubscriptionTier(SubscriptionTier.FREE)}
                        className="focus:ring-primary h-4 w-4 text-primary border-gray-300"
                    />
                    <label htmlFor="tier-free" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                        Free Tier
                    </label>
                </div>
                <div className="flex items-center">
                    <input
                        id="tier-premium"
                        name="subscription-tier"
                        type="radio"
                        checked={subscriptionTier === SubscriptionTier.PREMIUM}
                        onChange={() => setSubscriptionTier(SubscriptionTier.PREMIUM)}
                        className="focus:ring-primary h-4 w-4 text-primary border-gray-300"
                    />
                    <label htmlFor="tier-premium" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                        Premium Tier (₹49)
                    </label>
                </div>
            </div>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}
        
        <div className="pt-2 flex justify-end space-x-3">
            <Button type="button" variant="secondary" onClick={onClose}>
                Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={loading}>
                {loading ? 'Creating...' : 'Create User'}
            </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateUserModal;