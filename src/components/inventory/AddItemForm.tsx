import { useState } from 'react';
import { motion } from 'framer-motion';
import { Package } from 'lucide-react';
import styled from 'styled-components';
import { useInventory } from '../../hooks/useInventory';

interface AddItemFormProps {
  onSubmit: (formData: any) => void;
  onCancel: () => void;
}

const AddItemForm = ({ onSubmit, onCancel }: AddItemFormProps) => {
  const { categories } = useInventory();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    sku: '',
    categoryId: '',
    price: '',
    imageUrl: '',
    quantity: '',
    threshold: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Validate required fields before submitting
      if (!formData.name.trim() || !formData.sku.trim() || !formData.categoryId || 
          !formData.price || !formData.quantity || !formData.threshold) {
        alert('Please fill in all required fields');
        return;
      }
      onSubmit(formData);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      onCancel();
    }
  };

  return (
    <StyledForm onSubmit={(e) => e.preventDefault()}>
      <div className="steps">
        {[1, 2, 3].map((number) => (
          <div key={number} className={`step ${step >= number ? 'active' : ''}`}>
            <div className="step-number">{number}</div>
          </div>
        ))}
      </div>

      {step === 1 && (
        <motion.div
          key="step1"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="form-step"
        >
          <div className="input-group">
            <label htmlFor="name">Item Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="input"
              placeholder="Enter item name"
            />
          </div>
          <div className="input-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="input"
              placeholder="Enter item description"
              rows={3}
            />
          </div>
          <div className="input-group">
            <label htmlFor="sku">SKU (Stock Keeping Unit)</label>
            <input
              type="text"
              id="sku"
              name="sku"
              value={formData.sku}
              onChange={handleInputChange}
              required
              className="input"
              placeholder="Enter unique SKU"
            />
          </div>
          <div className="input-group">
            <label htmlFor="categoryId">Category</label>
            <select
              id="categoryId"
              name="categoryId"
              value={formData.categoryId}
              onChange={handleInputChange}
              required
              className="input"
            >
              <option value="">Select Category</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
        </motion.div>
      )}

      {step === 2 && (
        <motion.div
          key="step2"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="form-step"
        >
          <div className="input-group">
            <label htmlFor="price">Price</label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              required
              className="input"
              placeholder="Enter price"
              min="0"
              step="0.01"
            />
          </div>
          <div className="input-group">
            <label htmlFor="imageUrl">Image URL</label>
            <input
              type="url"
              id="imageUrl"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleInputChange}
              className="input"
              placeholder="Enter image URL"
            />
          </div>
        </motion.div>
      )}

      {step === 3 && (
        <motion.div
          key="step3"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="form-step"
        >
          <div className="input-group">
            <label htmlFor="quantity">Initial Quantity</label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              value={formData.quantity}
              onChange={handleInputChange}
              required
              className="input"
              placeholder="Enter quantity"
              min="0"
            />
          </div>
          <div className="input-group">
            <label htmlFor="threshold">Stock Threshold</label>
            <input
              type="number"
              id="threshold"
              name="threshold"
              value={formData.threshold}
              onChange={handleInputChange}
              required
              className="input"
              placeholder="Enter threshold"
              min="0"
            />
            <small className="help-text">Alert when stock falls below this number</small>
          </div>
        </motion.div>
      )}

      <div className="button-group">
        <button onClick={handleBack} className="btn">
          {step === 1 ? 'Cancel' : 'Back'}
        </button>
        <button onClick={handleNext} className="btn btn-primary">
          {step === 3 ? 'Submit' : 'Next'}
        </button>
      </div>
    </StyledForm>
  );
};

const StyledForm = styled.form`
  padding: 2rem;

  .steps {
    display: flex;
    justify-content: center;
    gap: 2rem;
    margin-bottom: 2rem;
  }

  .step {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    opacity: 0.5;
    transition: opacity 0.3s ease;

    &.active {
      opacity: 1;
    }
  }

  .step-number {
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    background: #e5e7eb;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    color: #6b7280;
    transition: all 0.3s ease;

    .active & {
      background: #3b82f6;
      color: white;
    }
  }

  .form-step {
    margin-bottom: 2rem;
  }

  .input-group {
    margin-bottom: 1.5rem;

    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
      color: #374151;
    }

    .input {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #d1d5db;
      border-radius: 0.5rem;
      font-size: 1rem;
      transition: border-color 0.3s ease;

      &:focus {
        outline: none;
        border-color: #3b82f6;
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
      }

      &::placeholder {
        color: #9ca3af;
      }
    }

    textarea.input {
      resize: vertical;
      min-height: 80px;
    }

    .help-text {
      display: block;
      margin-top: 0.25rem;
      font-size: 0.875rem;
      color: #6b7280;
    }
  }

  .button-group {
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
    margin-top: 2rem;
    padding-top: 1rem;
    border-top: 1px solid #e5e7eb;
  }

  .btn {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 0.5rem;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;

    &:not(.btn-primary) {
      background: #f3f4f6;
      color: #374151;

      &:hover {
        background: #e5e7eb;
      }
    }

    &.btn-primary {
      background: #3b82f6;
      color: white;

      &:hover {
        background: #2563eb;
      }
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
`;

export default AddItemForm;