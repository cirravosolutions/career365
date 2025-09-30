import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import Button from './Button';

interface AdminNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (note: string) => void;
  currentNote: string | null;
}

const AdminNoteModal: React.FC<AdminNoteModalProps> = ({ isOpen, onClose, onSave, currentNote }) => {
  const [note, setNote] = useState('');

  useEffect(() => {
    if (isOpen) {
      setNote(currentNote || '');
    }
  }, [isOpen, currentNote]);

  const handleSave = () => {
    onSave(note);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={currentNote ? "Edit Admin Note" : "Add Admin Note"}>
      <div className="space-y-4">
        <label htmlFor="admin-note" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Note for all admins
        </label>
        <textarea
          id="admin-note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={5}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
          placeholder="Type your message here... This will be visible to all placement officers."
          aria-label="Admin note"
        />
      </div>
      <div className="mt-6 flex justify-end space-x-3">
        <Button type="button" variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button type="button" variant="primary" onClick={handleSave}>
          {currentNote ? 'Save Changes' : 'Save Note'}
        </Button>
      </div>
    </Modal>
  );
};

export default AdminNoteModal;
