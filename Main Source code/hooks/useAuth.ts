

import { useContext } from 'react';
// FIX: Corrected import path to point to the correct AuthContext file from the `src` directory.
import { AuthContext } from '../src/context/AuthContext';

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};