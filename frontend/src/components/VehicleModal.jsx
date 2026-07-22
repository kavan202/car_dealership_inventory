import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Save, Car, DollarSign, Tag, Hash } from 'lucide-react';

export default function VehicleModal({ isOpen, onClose, onSave, vehicle, isSubmitting }) {
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    category: 'Sedan',
    price: '',
    quantity: '',
  });

  const categories = ['Sedan', 'SUV', 'Truck', 'Electric', 'Coupe', 'Luxury', 'Sports', 'Convertible'];

  useEffect(() => {
    if (vehicle) {
      setFormData({
        make: vehicle.make || '',
        model: vehicle.model || '',
        category: vehicle.category || 'Sedan',
        price: vehicle.price || '',
        quantity: vehicle.quantity !== undefined ? vehicle.quantity : '',
      });
    } else {
      setFormData({
        make: '',
        model: '',
        category: 'Sedan',
        price: '',
        quantity: '',
      });
    }
  }, [vehicle, isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      price: parseFloat(formData.price),
      quantity: parseInt(formData.quantity, 10),
    });
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return createPortal(
    <div
      onClick={handleOverlayClick}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'rgba(0,0,0,0.6)',
        zIndex: 9998,
      }}
      className="p-4 backdrop-blur-md animate-fade-in"
    >
      <div
        style={{
          position: 'relative',
          maxWidth: '700px',
          width: '90%',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
        className="glass-card rounded-2xl border border-slate-800 shadow-2xl p-6"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-bold text-slate-100 mb-6 flex items-center space-x-2">
          <Car className="w-6 h-6 text-blue-400" />
          <span>{vehicle ? 'Edit Vehicle' : 'Add New Vehicle'}</span>
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Make</label>
            <input
              type="text"
              required
              value={formData.make}
              onChange={(e) => setFormData({ ...formData, make: e.target.value })}
              placeholder="e.g. Porsche"
              className="w-full px-3 py-2 text-sm glass-input rounded-xl text-slate-100 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Model</label>
            <input
              type="text"
              required
              value={formData.model}
              onChange={(e) => setFormData({ ...formData, model: e.target.value })}
              placeholder="e.g. Taycan"
              className="w-full px-3 py-2 text-sm glass-input rounded-xl text-slate-100 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3 py-2 text-sm glass-input rounded-xl text-slate-100 focus:outline-none bg-slate-900 cursor-pointer"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Price ($)</label>
              <input
                type="number"
                step="0.01"
                min="1"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="e.g. 85000"
                className="w-full px-3 py-2 text-sm glass-input rounded-xl text-slate-100 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Stock Quantity</label>
              <input
                type="number"
                min="0"
                required
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                placeholder="e.g. 5"
                className="w-full px-3 py-2 text-sm glass-input rounded-xl text-slate-100 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-sm font-semibold flex items-center space-x-2 transition-all shadow-md shadow-blue-500/20"
            >
              <Save className="w-4 h-4" />
              <span>{isSubmitting ? 'Saving...' : vehicle ? 'Update Vehicle' : 'Add Vehicle'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
