import { useState } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import styled from 'styled-components';
import CustomButton from '../common/CustomButton';

interface AddUserModalProps {
  onClose: () => void;
  onSubmit: (userData: any) => void;
}

const AddUserModal = ({ onClose, onSubmit }: AddUserModalProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'staff',
    password: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <StyledModal>
      <motion.div 
        className="overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      <motion.div 
        className="modal"
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
      >
        <div className="modal-header">
          <h2>Add New User</h2>
          <button onClick={onClose} className="close-btn">
            <X />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              placeholder="Enter full name"
              autoComplete="name"
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              placeholder="Enter email address"
              autoComplete="email"
            />
          </div>
          <div className="form-group">
            <label>Role</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              required
            >
              <option value="staff">Staff Member</option>
              <option value="manager">Store Manager</option>
            </select>
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              placeholder="Enter password"
              autoComplete="new-password"
            />
          </div>
          <div className="modal-actions">
            <CustomButton onClick={onClose} className="cancel-btn">Cancel</CustomButton>
            <CustomButton type="submit">Add User</CustomButton>
          </div>
        </form>
      </motion.div>
    </StyledModal>
  );
};

const StyledModal = styled.div`
  position: fixed;
  inset: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;

  .overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(4px);
  }

  .modal {
    position: relative;
    width: 100%;
    max-width: 500px;
    background: white;
    border-radius: 12px;
    padding: 1.5rem;
    z-index: 51;
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;

    h2 {
      font-size: 1.5rem;
      font-weight: 600;
      color: #1f2937;
    }

    .close-btn {
      padding: 0.5rem;
      border-radius: 0.5rem;
      color: #6b7280;
      transition: all 0.3s ease;

      &:hover {
        background: #f3f4f6;
        color: #1f2937;
      }
    }
  }

  .form-group {
    margin-bottom: 1rem;

    label {
      display: block;
      font-size: 0.875rem;
      font-weight: 500;
      color: #374151;
      margin-bottom: 0.5rem;
    }

    input, select {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #d1d5db;
      border-radius: 0.5rem;
      transition: all 0.3s ease;
      font-size: 0.875rem;

      &:focus {
        border-color: #3b82f6;
        box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
      }

      &::placeholder {
        color: #9ca3af;
      }
    }
  }

  .modal-actions {
    margin-top: 2rem;
    display: flex;
    justify-content: flex-end;
    gap: 1rem;

    .cancel-btn {
      background: #f3f4f6;
      color: #4b5563;

      &:hover {
        background: #e5e7eb;
      }
    }
  }
`;

export default AddUserModal;