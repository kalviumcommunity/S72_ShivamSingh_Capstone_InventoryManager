import { useState } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import styled from 'styled-components';
import CustomButton from '../common/CustomButton';

interface AddRoleModalProps {
  onClose: () => void;
  onSubmit: (roleData: any) => void;
}

const AddRoleModal = ({ onClose, onSubmit }: AddRoleModalProps) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    permissions: []
  });

  const availablePermissions = [
    'View inventory',
    'Manage inventory',
    'View users',
    'Manage users',
    'View reports',
    'Manage settings',
    'Delete records'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const togglePermission = (permission: string) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter(p => p !== permission)
        : [...prev.permissions, permission]
    }));
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
          <h2>Add New Role</h2>
          <button onClick={onClose} className="close-btn">
            <X />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Role Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              rows={3}
            />
          </div>
          <div className="form-group">
            <label>Permissions</label>
            <div className="permissions-grid">
              {availablePermissions.map(permission => (
                <label key={permission} className="permission-item">
                  <input
                    type="checkbox"
                    checked={formData.permissions.includes(permission)}
                    onChange={() => togglePermission(permission)}
                  />
                  <span>{permission}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="modal-actions">
            <CustomButton type="submit">Add Role</CustomButton>
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

    input, textarea {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid #d1d5db;
      border-radius: 0.375rem;
      transition: all 0.3s ease;

      &:focus {
        border-color: #3b82f6;
        box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
      }
    }
  }

  .permissions-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 0.5rem;
  }

  .permission-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem;
    border-radius: 0.375rem;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      background: #f3f4f6;
    }

    input {
      width: auto;
    }
  }

  .modal-actions {
    margin-top: 2rem;
    display: flex;
    justify-content: flex-end;
  }
`;

export default AddRoleModal;