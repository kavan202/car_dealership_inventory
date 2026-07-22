import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { vehicleService } from '../services/vehicleService';
import { useAuth } from '../context/AuthContext';
import VehicleModal from '../components/VehicleModal';
import RestockModal from '../components/RestockModal';
import Toast from '../components/Toast';
import { ShieldCheck, Plus, Edit, Trash2, PlusCircle, Search, Car, AlertTriangle } from 'lucide-react';

export default function AdminPanel() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Modals state
  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [isRestockModalOpen, setIsRestockModalOpen] = useState(false);
  const [restockVehicle, setRestockVehicle] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [toast, setToast] = useState(null);

  const { isAdmin, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAdmin) {
      navigate('/dashboard');
      return;
    }
    fetchVehicles();
  }, [isAdmin, navigate]);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const data = await vehicleService.getAll();
      setVehicles(data);
    } catch (err) {
      setToast({ type: 'error', message: 'Failed to fetch inventory' });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddModal = () => {
    setSelectedVehicle(null);
    setIsVehicleModalOpen(true);
  };

  const handleOpenEditModal = (v) => {
    setSelectedVehicle(v);
    setIsVehicleModalOpen(true);
  };

  const handleSaveVehicle = async (formData) => {
    try {
      setIsSubmitting(true);
      if (selectedVehicle) {
        await vehicleService.update(selectedVehicle.id, formData);
        setToast({ type: 'success', message: `Updated ${formData.make} ${formData.model}` });
      } else {
        await vehicleService.create(formData);
        setToast({ type: 'success', message: `Added ${formData.make} ${formData.model} to inventory` });
      }
      setIsVehicleModalOpen(false);
      fetchVehicles();
    } catch (err) {
      const msg = err.response?.data?.detail || 'Error saving vehicle';
      setToast({ type: 'error', message: msg });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteVehicle = async (id, name) => {
    if (!window.confirm(`Are you sure you want to permanently delete ${name}?`)) return;
    try {
      await vehicleService.delete(id);
      setVehicles((prev) => prev.filter((v) => v.id !== id));
      setToast({ type: 'success', message: `${name} deleted successfully` });
    } catch (err) {
      setToast({ type: 'error', message: 'Failed to delete vehicle' });
    }
  };

  const handleOpenRestockModal = (v) => {
    setRestockVehicle(v);
    setIsRestockModalOpen(true);
  };

  const handleRestockSubmit = async (id, qty) => {
    try {
      setIsSubmitting(true);
      const updated = await vehicleService.restock(id, qty);
      setVehicles((prev) => prev.map((v) => (v.id === id ? updated : v)));
      setToast({
        type: 'success',
        message: `Restocked ${updated.make} ${updated.model} +${qty} units`,
      });
      setIsRestockModalOpen(false);
    } catch (err) {
      setToast({ type: 'error', message: 'Restock failed' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredVehicles = vehicles.filter(
    (v) =>
      v.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Admin Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-slate-100 flex items-center gap-2">
              Admin Management Console
            </h1>
            <p className="text-sm text-slate-400">
              Manage inventory CRUD, stock adjustments, and dealership records
            </p>
          </div>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl text-sm font-semibold flex items-center space-x-2 shadow-lg shadow-indigo-500/25 transition-all hover:scale-105"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Vehicle</span>
        </button>
      </div>

      {/* Admin Table Controls */}
      <div className="glass-card p-4 rounded-2xl mb-6 border border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search catalog..."
            className="w-full pl-10 pr-4 py-2 text-sm glass-input rounded-xl text-slate-100 focus:outline-none"
          />
        </div>
        <p className="text-xs text-slate-400">
          Showing <span className="text-slate-100 font-bold">{filteredVehicles.length}</span> of {vehicles.length} total models
        </p>
      </div>

      {/* Inventory Management Data Table */}
      <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-900/80 text-xs uppercase font-semibold text-slate-400 border-b border-slate-800">
              <tr>
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Vehicle Detail</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Stock Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-12 text-slate-400">
                    Loading management console...
                  </td>
                </tr>
              ) : filteredVehicles.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-12 text-slate-400">
                    No vehicles match your search.
                  </td>
                </tr>
              ) : (
                filteredVehicles.map((v) => (
                  <tr key={v.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4 text-xs font-mono text-slate-500">#{v.id}</td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-100">
                        {v.make} <span className="font-normal text-slate-400">{v.model}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        {v.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-200">
                      ${v.price.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-xs px-2.5 py-1 rounded-full font-bold inline-flex items-center space-x-1 ${
                          v.quantity === 0
                            ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                            : v.quantity <= 3
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                            : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        }`}
                      >
                        {v.quantity === 0 ? 'Out of Stock (0)' : `${v.quantity} Available`}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenRestockModal(v)}
                        className="p-2 text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-colors"
                        title="Restock Stock"
                      >
                        <PlusCircle className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleOpenEditModal(v)}
                        className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                        title="Edit Details"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteVehicle(v.id, `${v.make} ${v.model}`)}
                        className="p-2 text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                        title="Delete Vehicle"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <VehicleModal
        isOpen={isVehicleModalOpen}
        onClose={() => setIsVehicleModalOpen(false)}
        onSave={handleSaveVehicle}
        vehicle={selectedVehicle}
        isSubmitting={isSubmitting}
      />

      <RestockModal
        isOpen={isRestockModalOpen}
        onClose={() => setIsRestockModalOpen(false)}
        onRestock={handleRestockSubmit}
        vehicle={restockVehicle}
        isSubmitting={isSubmitting}
      />

      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
