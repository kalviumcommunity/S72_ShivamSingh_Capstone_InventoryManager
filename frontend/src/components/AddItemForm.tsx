import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CurrencyDollarIcon, PhotoIcon, TagIcon, ArchiveBoxIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { createApi } from 'unsplash-js';

interface FormData {
  name: string;
  category: string;
  quantity: number;
  price: number;
  image?: string | File;
  minimumQuantity: number;
  prompt?: string;
  formData?: globalThis.FormData;
}

const initialFormData: FormData = {
  name: '',
  category: '',
  quantity: 0,
  price: 0,
  minimumQuantity: 10,
};

const categories = [
  'Mobiles & Tablets',
  'Computers & Laptops',
  'TVs & Electronics',
  'Home Appliances',
  'Paan Corner',
  'Dairy, Bread & Eggs',
  'Fruits & Vegetables',
  'Cold Drinks & Juices',
  'Snacks & Munchies',
  'Breakfast & Instant Food',
  'Sweet Tooth',
  'Bakery & Biscuits',
  'Tea, Coffee & Health Drink',
  'Atta, Rice & Dal',
  'Masala, Oil & More',
  'Sauces & Spreads',
  'Chicken, Meat & Fish',
  'Organic & Healthy Living',
  'Baby Care',
  'Pharma & Wellness',
  'Cleaning Essentials',
  'Home & Office',
  'Personal Care',
  'Pet Care'
];

interface Props {
  onSubmit: (data: FormData | globalThis.FormData) => Promise<void>;
  onClose: () => void;
  isSubmitting: boolean;
  initialData?: Partial<FormData>;
  isEdit?: boolean;
  isOpen: boolean;
}

// Initialize Unsplash API
const unsplash = createApi({
  accessKey: '3a3bFOhn9yQA18ICIam3y0TYYvUYE7suTC8bJICocZo',
});

const AddItemForm: React.FC<Props> = ({ onSubmit, onClose, isSubmitting, initialData, isEdit, isOpen }) => {
  console.log('AddItemForm mounted');
  const [formData, setFormData] = useState<FormData>({ ...initialFormData, ...initialData });
  const [step, setStep] = useState(1);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [isGenerating, setIsGenerating] = useState(false);

  // Reset step to 1 only when modal is first opened
  const prevIsOpen = React.useRef(isOpen);
  React.useEffect(() => {
    if (!prevIsOpen.current && isOpen) {
      setStep(1);
    }
    prevIsOpen.current = isOpen;
  }, [isOpen]);

  const validateStep = (currentStep: number): boolean => {
    console.log('Validating step', currentStep);
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    switch (currentStep) {
      case 1:
        if (!formData.name.trim()) {
          newErrors.name = 'Name is required';
        }
        if (!formData.category) {
          newErrors.category = 'Category is required';
        }
        break;
      case 2:
        if (formData.price < 0) {
          newErrors.price = 'Price cannot be negative';
        }
        break;
      case 3:
        console.log('Validating step 3. Quantity:', formData.quantity, 'Minimum Quantity:', formData.minimumQuantity);
        if (formData.quantity < 0) {
          newErrors.quantity = 'Quantity cannot be negative';
        }
        if (formData.minimumQuantity < 0) {
          newErrors.minimumQuantity = 'Minimum quantity cannot be negative';
        }
        if (formData.minimumQuantity > formData.quantity) {
          newErrors.minimumQuantity = 'Minimum quantity cannot be greater than current quantity';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === 'file') {
      const fileInput = e.target as HTMLInputElement;
      const file = fileInput.files?.[0];
      
      if (file) {
        if (file.type.startsWith('image/')) {
          // Create preview
          const reader = new FileReader();
          reader.onloadend = () => {
            setImagePreview(reader.result as string);
          };
          reader.readAsDataURL(file);
          
          // Update form data with the file
          setFormData(prev => ({ ...prev, image: file }));
        } else {
          toast.error('Please upload an image file');
        }
      }
    } else {
      setFormData(prev => {
        // If the name is 'name', also set prompt
        if (name === 'name') {
          return { ...prev, name: value, prompt: value };
        }
        return {
          ...prev,
          [name]: type === 'number' ? parseFloat(value) || 0 : value
        };
      });
    }
  };

  const handleGenerateImage = async () => {
    if (!formData.name) {
      toast.error('Please enter the item name first!');
      return;
    }
    setIsGenerating(true);
    try {
      const result = await unsplash.search.getPhotos({
        query: formData.name,
        perPage: 1,
      });
      if (result.response && result.response.results.length > 0) {
        const url = result.response.results[0].urls.small;
        setImagePreview(url);
        setFormData(prev => ({ ...prev, image: url }));
      } else {
        toast.error('No image found for this item.');
      }
    } catch (error) {
      toast.error('Failed to generate image.');
    }
    setIsGenerating(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('handleSubmit called');
    if (validateStep(step)) {
      console.log('Validation passed for step', step);
      try {
        // Create FormData object
        const formDataObj = new FormData();
        formDataObj.append('name', formData.name);
        formDataObj.append('category', formData.category);
        formDataObj.append('quantity', formData.quantity.toString());
        formDataObj.append('price', formData.price.toString());
        formDataObj.append('minimumQuantity', formData.minimumQuantity.toString());

        // Handle image
        if (formData.image instanceof File) {
          formDataObj.append('image', formData.image);
        } else if (typeof formData.image === 'string' && formData.image.startsWith('http')) {
          formDataObj.append('imageUrl', formData.image);
        } else if (isEdit && typeof formData.image === 'string' && formData.image) {
          formDataObj.append('image', formData.image);
        }

        // Log the FormData contents for debugging
        console.log('Submitting form data:');
        for (let pair of formDataObj.entries()) {
          console.log(pair[0] + ': ' + pair[1]);
        }

        console.log('Submitting form data:', Object.fromEntries(formDataObj.entries()));
        console.log('Calling onSubmit prop...');

        await onSubmit(formDataObj);
        console.log('onSubmit call finished');
      } catch (error) {
        console.error('Error submitting form:', error);
        toast.error('Failed to submit form');
      }
    } else {
      console.log('Validation failed for step', step);
    }
  };

  const preventEnterSubmit = (e: React.KeyboardEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Item Name
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <ArchiveBoxIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  onKeyDown={preventEnterSubmit}
                  className={`block w-full pl-10 pr-3 py-2 rounded-md ${errors.name ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600 focus:border-indigo-500 focus:ring-indigo-500'} dark:bg-gray-700 shadow-sm sm:text-sm dark:text-white`}
                  placeholder="Enter item name"
                  autoComplete="off"
                />
              </div>
              {errors.name && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>
              )}
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Category
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <TagIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <select
                  name="category"
                  id="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  onKeyDown={preventEnterSubmit}
                  className={`block w-full pl-10 pr-3 py-2 rounded-md ${errors.category ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600 focus:border-indigo-500 focus:ring-indigo-500'} dark:bg-gray-700 shadow-sm sm:text-sm dark:text-white`}
                  autoComplete="off"
                >
                  <option value="">Select a category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              {errors.category && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.category}</p>
              )}
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex flex-col gap-4 p-4 sm:p-6 max-w-md mx-auto"
          >
            <div className="flex flex-col items-center gap-2 w-full">
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Price
              </label>
              <div className="flex flex-col items-center gap-1 w-full">
                <div className="flex items-center justify-center gap-1">
                  <button type="button" className="w-8 h-7 rounded bg-red-200 dark:bg-red-700 text-base font-bold text-red-800 dark:text-red-200" onClick={() => setFormData(prev => ({ ...prev, price: Math.max(0, prev.price - 10) }))}>-10</button>
                  <button type="button" className="w-8 h-7 rounded bg-red-200 dark:bg-red-700 text-base font-bold text-red-800 dark:text-red-200" onClick={() => setFormData(prev => ({ ...prev, price: Math.max(0, prev.price - 5) }))}>-5</button>
                  <button type="button" className="w-8 h-7 rounded bg-red-200 dark:bg-red-700 text-base font-bold text-red-800 dark:text-red-200" onClick={() => setFormData(prev => ({ ...prev, price: Math.max(0, prev.price - 1) }))}>-1</button>
                  <div className="relative flex items-center">
                    <span className="absolute left-2 text-base text-gray-500 dark:text-gray-300">₹</span>
                    <input
                      type="number"
                      name="price"
                      id="price"
                      min="0"
                      step="0.01"
                      value={formData.price === 0 ? '' : formData.price}
                      onChange={handleInputChange}
                      onKeyDown={preventEnterSubmit}
                      onFocus={(e) => {
                        if (formData.price === 0) {
                          e.target.value = '';
                        }
                      }}
                      onBlur={(e) => {
                        if (e.target.value === '') {
                          setFormData(prev => ({ ...prev, price: 0 }));
                        }
                      }}
                      placeholder="e.g., 100.00"
                      className={`block w-32 pl-6 pr-2 py-1 rounded-md text-center text-base font-semibold ${errors.price ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600 focus:border-indigo-500 focus:ring-indigo-500'} dark:bg-gray-700 shadow-sm sm:text-sm dark:text-white`}
                      autoComplete="off"
                    />
                  </div>
                  <button type="button" className="w-8 h-7 rounded bg-green-200 dark:bg-green-700 text-base font-bold text-green-800 dark:text-green-200" onClick={() => setFormData(prev => ({ ...prev, price: prev.price + 1 }))}>+1</button>
                  <button type="button" className="w-8 h-7 rounded bg-green-200 dark:bg-green-700 text-base font-bold text-green-800 dark:text-green-200" onClick={() => setFormData(prev => ({ ...prev, price: prev.price + 5 }))}>+5</button>
                  <button type="button" className="w-8 h-7 rounded bg-green-200 dark:bg-green-700 text-base font-bold text-green-800 dark:text-green-200" onClick={() => setFormData(prev => ({ ...prev, price: prev.price + 10 }))}>+10</button>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10000"
                  step="0.01"
                  value={formData.price}
                  onChange={e => setFormData(prev => ({ ...prev, price: Number(e.target.value) }))}
                  className="w-full mt-2 accent-indigo-600"
                />
                {errors.price && (
                  <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.price}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Item Image (optional)
              </label>
              <div className="flex flex-col gap-4 mt-2">
                <div className="mb-1 text-xs text-gray-500 dark:text-gray-400">Upload your own image or generate with AI</div>
                <div className="flex flex-col md:flex-row gap-4 items-stretch">
                  {/* Upload a file */}
                  <div className="flex-1 min-w-0 flex flex-col items-center p-4 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md bg-gray-50 dark:bg-gray-900 max-w-xs w-full">
                    <PhotoIcon className="mx-auto h-8 w-8 text-gray-400 mb-2" aria-hidden="true" />
                    <label
                      htmlFor="image"
                      className="cursor-pointer rounded-md bg-white dark:bg-gray-700 font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 px-4 py-2 border border-indigo-200 dark:border-indigo-700 shadow-sm"
                    >
                      Upload a file
                      <input
                        id="image"
                        name="image"
                        type="file"
                        accept="image/*"
                        onChange={handleInputChange}
                        className="sr-only"
                        autoComplete="off"
                      />
                    </label>
                    <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-center">PNG, JPG, GIF up to 10MB<br/>or drag and drop</p>
                  </div>
                  {/* AI Generate section with border and same width */}
                  <div className="flex-1 min-w-0 flex flex-col items-center p-4 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md bg-gray-50 dark:bg-gray-900 max-w-xs w-full justify-center">
                    <button
                      type="button"
                      onClick={handleGenerateImage}
                      disabled={isGenerating}
                      className="px-4 py-2 bg-indigo-500 text-white rounded shadow hover:bg-indigo-600 disabled:opacity-60 mb-2"
                    >
                      {isGenerating ? 'Generating...' : 'Generate with AI'}
                    </button>
                    {/* Image preview outside bordered box but within the same flex container */}
                    {imagePreview && (
                      <div className="flex flex-col items-center mt-4 w-full">
                        <div className="relative">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="mx-auto h-24 w-24 object-cover rounded-md border border-gray-300 dark:border-gray-600"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setImagePreview(null);
                              setFormData(prev => ({ ...prev, image: undefined }));
                            }}
                            className="absolute -top-2 -right-2 rounded-full bg-red-500 text-white p-1 hover:bg-red-600"
                          >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">Preview</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex flex-col gap-4 p-4 sm:p-6 max-w-md mx-auto"
          >
            <div>
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Quantity
              </label>
              <div className="mt-1 flex items-center justify-center gap-2">
                <div className="flex gap-1">
                  <button type="button" className="w-8 h-7 rounded bg-red-200 dark:bg-red-700 text-base font-bold text-red-800 dark:text-red-200" onClick={() => setFormData(prev => ({ ...prev, quantity: Math.max(0, prev.quantity - 10) }))}>-10</button>
                  <button type="button" className="w-8 h-7 rounded bg-red-200 dark:bg-red-700 text-base font-bold text-red-800 dark:text-red-200" onClick={() => setFormData(prev => ({ ...prev, quantity: Math.max(0, prev.quantity - 5) }))}>-5</button>
                  <button type="button" className="w-8 h-7 rounded bg-red-200 dark:bg-red-700 text-base font-bold text-red-800 dark:text-red-200" onClick={() => setFormData(prev => ({ ...prev, quantity: Math.max(0, prev.quantity - 1) }))}>-1</button>
                </div>
                <input
                  type="number"
                  name="quantity"
                  id="quantity"
                  min="0"
                  value={formData.quantity === 0 ? '' : formData.quantity}
                  onChange={handleInputChange}
                  onKeyDown={preventEnterSubmit}
                  onFocus={(e) => {
                    if (formData.quantity === 0) {
                      e.target.value = '';
                    }
                  }}
                  onBlur={(e) => {
                    if (e.target.value === '') {
                      setFormData(prev => ({ ...prev, quantity: 0 }));
                    }
                  }}
                  placeholder="e.g., 50"
                  className={`block rounded-md w-24 h-10 text-center text-base font-semibold ${errors.quantity ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600 focus:border-indigo-500 focus:ring-indigo-500'} dark:bg-gray-700 shadow-sm sm:text-sm dark:text-white`}
                  autoComplete="off"
                />
                <div className="flex gap-1">
                  <button type="button" className="w-8 h-7 rounded bg-green-200 dark:bg-green-700 text-base font-bold text-green-800 dark:text-green-200" onClick={() => setFormData(prev => ({ ...prev, quantity: prev.quantity + 1 }))}>+1</button>
                  <button type="button" className="w-8 h-7 rounded bg-green-200 dark:bg-green-700 text-base font-bold text-green-800 dark:text-green-200" onClick={() => setFormData(prev => ({ ...prev, quantity: prev.quantity + 5 }))}>+5</button>
                  <button type="button" className="w-8 h-7 rounded bg-green-200 dark:bg-green-700 text-base font-bold text-green-800 dark:text-green-200" onClick={() => setFormData(prev => ({ ...prev, quantity: prev.quantity + 10 }))}>+10</button>
                </div>
              </div>
              <input
                type="range"
                min="0"
                max="1000"
                step="1"
                value={formData.quantity}
                onChange={e => setFormData(prev => ({ ...prev, quantity: Number(e.target.value) }))}
                className="w-full mt-2 accent-indigo-600"
              />
              {errors.quantity && (
                <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.quantity}</p>
              )}
            </div>

            <div>
              <label htmlFor="minimumQuantity" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Minimum Quantity (for low stock alerts)
              </label>
              <div className="mt-1 flex items-center justify-center gap-2">
                <div className="flex gap-1">
                  <button type="button" className="w-8 h-7 rounded bg-red-200 dark:bg-red-700 text-base font-bold text-red-800 dark:text-red-200" onClick={() => setFormData(prev => ({ ...prev, minimumQuantity: Math.max(0, prev.minimumQuantity - 10) }))}>-10</button>
                  <button type="button" className="w-8 h-7 rounded bg-red-200 dark:bg-red-700 text-base font-bold text-red-800 dark:text-red-200" onClick={() => setFormData(prev => ({ ...prev, minimumQuantity: Math.max(0, prev.minimumQuantity - 5) }))}>-5</button>
                  <button type="button" className="w-8 h-7 rounded bg-red-200 dark:bg-red-700 text-base font-bold text-red-800 dark:text-red-200" onClick={() => setFormData(prev => ({ ...prev, minimumQuantity: Math.max(0, prev.minimumQuantity - 1) }))}>-1</button>
                </div>
                <input
                  type="number"
                  name="minimumQuantity"
                  id="minimumQuantity"
                  min="0"
                  value={formData.minimumQuantity}
                  onChange={handleInputChange}
                  onKeyDown={preventEnterSubmit}
                  className={`block rounded-md w-24 h-10 text-center text-base font-semibold ${errors.minimumQuantity ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600 focus:border-indigo-500 focus:ring-indigo-500'} dark:bg-gray-700 shadow-sm sm:text-sm dark:text-white`}
                  autoComplete="off"
                />
                <div className="flex gap-1">
                  <button type="button" className="w-8 h-7 rounded bg-green-200 dark:bg-green-700 text-base font-bold text-green-800 dark:text-green-200" onClick={() => setFormData(prev => ({ ...prev, minimumQuantity: prev.minimumQuantity + 1 }))}>+1</button>
                  <button type="button" className="w-8 h-7 rounded bg-green-200 dark:bg-green-700 text-base font-bold text-green-800 dark:text-green-200" onClick={() => setFormData(prev => ({ ...prev, minimumQuantity: prev.minimumQuantity + 5 }))}>+5</button>
                  <button type="button" className="w-8 h-7 rounded bg-green-200 dark:bg-green-700 text-base font-bold text-green-800 dark:text-green-200" onClick={() => setFormData(prev => ({ ...prev, minimumQuantity: prev.minimumQuantity + 10 }))}>+10</button>
                </div>
              </div>
              <input
                type="range"
                min="0"
                max="1000"
                step="1"
                value={formData.minimumQuantity}
                onChange={e => setFormData(prev => ({ ...prev, minimumQuantity: Number(e.target.value) }))}
                className="w-full mt-2 accent-indigo-600"
              />
              {errors.minimumQuantity && (
                <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.minimumQuantity}</p>
              )}
            </div>
          </motion.div>
        );
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-lg w-full mx-auto p-6" style={{ maxHeight: '90vh', overflow: 'visible' }}>
      <div className="sm:flex sm:items-start">
        <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
          <h3 className="text-lg font-semibold leading-6 text-gray-900 dark:text-white mb-4">
            {isEdit ? `Edit Item - Step ${step} of 3` : `Add New Item - Step ${step} of 3`}
          </h3>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-6">
            <div
              className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            ></div>
          </div>

          {/* Scrollable Content Area */}
          <div className="flex-1 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 180px)' }}>
            <form onSubmit={handleSubmit} className="space-y-6" autoComplete="off">
              <AnimatePresence mode="wait">
                {renderStepContent()}
              </AnimatePresence>
            </form>
          </div>

          <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse gap-2">
            {step < 3 ? (
              <button
                type="button"
                onClick={handleNext}
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (isEdit ? 'Updating...' : 'Adding...') : (isEdit ? 'Update Item' : 'Add Item')}
              </button>
            )}
            
            {step > 1 && (
              <button
                type="button"
                onClick={handleBack}
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-700 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
              >
                Back
              </button>
            )}
            
            <button
              type="button"
              onClick={onClose}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-700 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddItemForm; 