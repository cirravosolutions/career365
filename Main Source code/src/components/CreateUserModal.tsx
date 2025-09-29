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

const EyeIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-5 h-5"}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.432 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const EyeSlashIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-5 h-5"}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.243 4.243l-4.243-4.243" />
    </svg>
);

const CreateUserModal: React.FC<CreateUserModalProps> = ({ isOpen, onClose, onUserCreated }) => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
      setShowPassword(false);
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
        <div>
            <label htmlFor="new_user_password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
            <div className="mt-1 relative">
                <input
                    id="new_user_password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white pr-10"
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                    {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
                </button>
            </div>
        </div>

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
                        Premium Tier
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
