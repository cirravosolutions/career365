import React, { useState } from 'react';
import Modal from '../../components/Modal';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { useAuth } from '../../hooks/useAuth';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginClick: () => void;
}

const RegisterModal: React.FC<RegisterModalProps> = ({ isOpen, onClose, onLoginClick }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
        setError('Password must be at least 6 characters long.');
        return;
    }
    setLoading(true);
    setError(null);
    try {
      await register(username, password);
      onClose(); // Close modal on successful registration
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (isOpen) {
      setUsername('');
      setPassword('');
      setError(null);
      setLoading(false);
    }
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create an Account">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Username"
          id="reg_username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value.trim())}
          required
          autoComplete="username"
        />
        <Input
          label="Password"
          id="reg_password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="new-password"
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}
        
        <div className="pt-2 flex items-center justify-between">
            <p className="text-sm">
                Have an account?{' '}
                <button type="button" onClick={onLoginClick} className="font-medium text-primary hover:underline">
                    Login
                </button>
            </p>
            <div className="flex justify-end space-x-3">
                <Button type="button" variant="secondary" onClick={onClose}>
                    Cancel
                </Button>
                <Button type="submit" variant="primary" disabled={loading}>
                    {loading ? 'Registering...' : 'Register'}
                </Button>
            </div>
        </div>
      </form>
    </Modal>
  );
};

export default RegisterModal;