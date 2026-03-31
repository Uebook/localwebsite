'use client';

import { useState, useEffect, useRef } from 'react';
import { X, Image as ImageIcon, ChevronDown, ChevronUp, Upload, Camera } from 'lucide-react';
import Image from 'next/image';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: any) => void;
  editingProduct?: any;
}

export default function ProductFormModal({ isOpen, onClose, onSave, editingProduct }: ProductFormModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    mrp: '',
    type: 'Product',
    category: '',
    unit: '',
    description: '',
    inStock: true,
    bestSeller: false,
    stockQty: '',
    imageUrl: '',
  });

  const [imagePreview, setImagePreview] = useState<string>('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showUnitDropdown, setShowUnitDropdown] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const categories = ['Snacks', 'Beverages', 'Electronics', 'Clothing', 'Home & Kitchen', 'Beauty', 'Sports', 'Grocery', 'Medicines'];
  const units = ['Piece', 'Kg', 'Litre', 'Pack', 'Box', 'Dozen', 'Gram', 'Meter'];

  useEffect(() => {
    if (editingProduct) {
      const imageUrl = editingProduct.imageUrl || '';
      setFormData({
        name: editingProduct.name || '',
        price: editingProduct.price?.replace('₹', '') || '',
        mrp: editingProduct.mrp?.replace('₹', '') || '',
        type: editingProduct.type || 'Product',
        category: editingProduct.category || '',
        unit: editingProduct.uom || editingProduct.unit || '',
        description: editingProduct.description || '',
        inStock: editingProduct.inStock !== false,
        bestSeller: editingProduct.isFastMoving || false,
        stockQty: editingProduct.stockQty || '',
        imageUrl: imageUrl,
      });
      setImagePreview(imageUrl);
    } else {
      setFormData({
        name: '',
        price: '',
        mrp: '',
        type: 'Product',
        category: '',
        unit: '',
        description: '',
        inStock: true,
        bestSeller: false,
        stockQty: '',
        imageUrl: '',
      });
      setImagePreview('');
      setImageFile(null);
    }
    setErrors({});
  }, [editingProduct, isOpen]);

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }
    if (!formData.price.trim()) {
      newErrors.price = 'Price is required';
    }
    if (formData.mrp && parseFloat(formData.mrp) < parseFloat(formData.price)) {
      newErrors.mrp = 'MRP should be greater than or equal to price';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const product = {
      id: editingProduct?.id || `product-${Date.now()}`,
      name: formData.name,
      category: formData.category,
      price: `₹${formData.price}`,
      mrp: formData.mrp ? `₹${formData.mrp}` : undefined,
      type: formData.type,
      uom: formData.unit,
      unit: formData.unit,
      description: formData.description,
      inStock: formData.inStock,
      isFastMoving: formData.bestSeller,
      stockQty: formData.stockQty,
      imageUrl: formData.imageUrl || imagePreview || 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?auto=format&fit=crop&w=400&q=80',
    };

    onSave(product);
    onClose();
  };

  const handleImageUrlChange = (url: string) => {
    // Basic URL validation
    if (url.trim() === '' || url.startsWith('http://') || url.startsWith('https://')) {
      handleChange('imageUrl', url);
      setImagePreview(url);
      setImageFile(null);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, image: 'Please select a valid image file' }));
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, image: 'Image size should be less than 5MB' }));
        return;
      }

      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        handleChange('imageUrl', result);
      };
      reader.readAsDataURL(file);
      if (errors.image) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.image;
          return newErrors;
        });
      }
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveImage = () => {
    setImagePreview('');
    setImageFile(null);
    handleChange('imageUrl', '');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (showCategoryDropdown || showUnitDropdown) {
        const target = e.target as HTMLElement;
        if (!target.closest('.dropdown-container')) {
          setShowCategoryDropdown(false);
          setShowUnitDropdown(false);
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showCategoryDropdown, showUnitDropdown]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
            {editingProduct ? 'Edit Product' : 'Add New Product'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={24} className="text-gray-500" />
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6 space-y-6">
            {/* Image Upload Section - More Prominent */}
            <div className="bg-gray-50 rounded-xl p-4 border-2 border-dashed border-gray-300">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Product Image <span className="text-orange-500">*</span>
              </label>
              <div className="flex flex-col sm:flex-row gap-6">
                {/* Image Preview */}
                <div className="w-full sm:w-64 flex-shrink-0">
                  <div className="relative w-full aspect-square bg-white rounded-xl overflow-hidden border-2 border-gray-300 shadow-sm">
                    {imagePreview ? (
                      <>
                        <Image
                          src={imagePreview}
                          alt="Product preview"
                          fill
                          className="object-cover"
                          unoptimized={imagePreview.startsWith('data:')}
                        />
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          className="absolute top-2 right-2 p-2 bg-black/70 text-white rounded-lg hover:bg-black transition-colors z-10"
                          title="Remove image"
                        >
                          <X size={18} />
                        </button>
                      </>
                    ) : (
                      <div
                        className="w-full h-full flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={handleImageClick}
                      >
                        <div className="bg-orange-100 rounded-full p-4 mb-3">
                          <Camera className="text-orange-500" size={32} />
                        </div>
                        <span className="text-gray-700 text-sm font-medium">Click to upload image</span>
                        <span className="text-gray-500 text-xs mt-1">or paste image URL below</span>
                      </div>
                    )}
                  </div>

                  {/* File Upload Input (Hidden) */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />

                  {/* Upload Button */}
                  <button
                    type="button"
                    onClick={handleImageClick}
                    className="w-full mt-3 px-4 py-2.5 bg-white border-2 border-orange-500 text-orange-500 rounded-lg font-semibold hover:bg-orange-50 transition-colors flex items-center justify-center gap-2"
                  >
                    <Upload size={18} />
                    <span>{imagePreview ? 'Change Image' : 'Upload Image'}</span>
                  </button>

                  {/* URL Input */}
                  <div className="mt-3">
                    <label className="block text-xs text-gray-600 mb-1">Or enter image URL:</label>
                    <input
                      type="url"
                      value={formData.imageUrl && !imagePreview.includes('data:') ? formData.imageUrl : ''}
                      onChange={(e) => handleImageUrlChange(e.target.value)}
                      placeholder="https://example.com/image.jpg"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900"
                    />
                    {errors.image && <p className="text-red-500 text-xs mt-1">{errors.image}</p>}
                  </div>
                </div>

                {/* Form Fields */}
                <div className="flex-1 space-y-4">
                  {/* Product Name */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Product Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      placeholder="Enter product name"
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900 ${errors.name ? 'border-red-500' : 'border-gray-300'
                        }`}
                    />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                  </div>

                  {/* Price and MRP */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Price <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600">₹</span>
                        <input
                          type="number"
                          value={formData.price}
                          onChange={(e) => handleChange('price', e.target.value.replace(/[^0-9]/g, ''))}
                          placeholder="0"
                          className={`w-full pl-8 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900 ${errors.price ? 'border-red-500' : 'border-gray-300'
                            }`}
                        />
                      </div>
                      {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">MRP</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600">₹</span>
                        <input
                          type="number"
                          value={formData.mrp}
                          onChange={(e) => handleChange('mrp', e.target.value.replace(/[^0-9]/g, ''))}
                          placeholder="0"
                          className={`w-full pl-8 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900 ${errors.mrp ? 'border-red-500' : 'border-gray-300'
                            }`}
                        />
                      </div>
                      {errors.mrp && <p className="text-red-500 text-sm mt-1">{errors.mrp}</p>}
                    </div>
                  </div>

                  {/* Product/Service Toggle */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Type</label>
                    <div className="flex gap-2 bg-gray-100 rounded-lg p-1">
                      <button
                        type="button"
                        onClick={() => handleChange('type', 'Product')}
                        className={`flex-1 py-2 rounded-lg font-medium transition-all ${formData.type === 'Product'
                          ? 'bg-white text-gray-900 shadow-sm'
                          : 'text-gray-600'
                          }`}
                      >
                        Product
                      </button>
                      <button
                        type="button"
                        onClick={() => handleChange('type', 'Service')}
                        className={`flex-1 py-2 rounded-lg font-medium transition-all ${formData.type === 'Service'
                          ? 'bg-white text-gray-900 shadow-sm'
                          : 'text-gray-600'
                          }`}
                      >
                        Service
                      </button>
                    </div>
                  </div>

                  {/* Category and Unit */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="relative dropdown-container">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                      <button
                        type="button"
                        onClick={() => {
                          setShowCategoryDropdown(!showCategoryDropdown);
                          setShowUnitDropdown(false);
                        }}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg flex items-center justify-between text-left focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900 bg-white"
                      >
                        <span className={formData.category ? 'text-gray-900' : 'text-gray-400'}>
                          {formData.category || 'Select Category'}
                        </span>
                        {showCategoryDropdown ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </button>
                      {showCategoryDropdown && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto dropdown-container">
                          {categories.map((cat) => (
                            <button
                              key={cat}
                              type="button"
                              onClick={() => {
                                handleChange('category', cat);
                                setShowCategoryDropdown(false);
                              }}
                              className="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors text-gray-900"
                            >
                              {cat}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="relative dropdown-container">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Unit</label>
                      <button
                        type="button"
                        onClick={() => {
                          setShowUnitDropdown(!showUnitDropdown);
                          setShowCategoryDropdown(false);
                        }}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg flex items-center justify-between text-left focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900 bg-white"
                      >
                        <span className={formData.unit ? 'text-gray-900' : 'text-gray-400'}>
                          {formData.unit || 'Select Unit'}
                        </span>
                        {showUnitDropdown ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </button>
                      {showUnitDropdown && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto dropdown-container">
                          {units.map((unit) => (
                            <button
                              key={unit}
                              type="button"
                              onClick={() => {
                                handleChange('unit', unit);
                                setShowUnitDropdown(false);
                              }}
                              className="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors text-gray-900"
                            >
                              {unit}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Stock Quantity */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Stock Quantity</label>
                    <input
                      type="number"
                      value={formData.stockQty}
                      onChange={(e) => handleChange('stockQty', e.target.value.replace(/[^0-9]/g, ''))}
                      placeholder="Enter stock quantity"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => handleChange('description', e.target.value)}
                      placeholder="Enter product description"
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none text-gray-900"
                    />
                  </div>

                  {/* Toggles */}
                  <div className="space-y-3">
                    <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer">
                      <div>
                        <p className="font-semibold text-gray-900">In Stock</p>
                        <p className="text-sm text-gray-600">Product is available for sale</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={formData.inStock}
                        onChange={(e) => handleChange('inStock', e.target.checked)}
                        className="w-5 h-5 text-orange-500 rounded focus:ring-orange-500"
                      />
                    </label>
                    <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer">
                      <div>
                        <p className="font-semibold text-gray-900">Best Seller</p>
                        <p className="text-sm text-gray-600">Mark as fast-moving product</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={formData.bestSeller}
                        onChange={(e) => handleChange('bestSeller', e.target.checked)}
                        className="w-5 h-5 text-orange-500 rounded focus:ring-orange-500"
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="border-t border-gray-200 p-4 sm:p-6 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors"
            >
              {editingProduct ? 'Update Product' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

