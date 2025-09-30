import React, { useState } from 'react';
import Modal from './Modal';
import Input from './Input';
import Button from './Button';
import { useAuth } from '../hooks/useAuth';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegisterClick: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onRegisterClick }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login(username, password);
      onClose(); // Close modal on successful login
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };
  
  // Reset state when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setUsername('');
      setPassword('');
      setError(null);
      setLoading(false);
    }
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Account Login">
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <Input
            label="Username"
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value.trim())}
            required
            autoComplete="username"
          />
          <Input
            label="Password"
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
        <div className="mt-6 flex items-center justify-between">
            <p className="text-sm">
                No account?{' '}
                <button type="button" onClick={onRegisterClick} className="font-medium text-primary hover:underline">
                    Register
                </button>
            </p>
            <div className="flex justify-end space-x-3">
                <Button type="button" variant="secondary" onClick={onClose}>
                    Cancel
                </Button>
                <Button type="submit" variant="primary" disabled={loading}>
                    {loading ? 'Logging in...' : 'Login'}
                </Button>
            </div>
        </div>
        <p className="text-xs text-text-secondary dark:text-dark-text-secondary text-center pt-4">
            Login using the credentials sent to your mail after registration.
        </p>
      </form>
    </Modal>
  );
};

export default LoginModal;
