import React, { useState, useEffect, useCallback } from 'react';
import { vehicleService } from '../services/vehicleService';
import { useAuth } from '../context/AuthContext';
import SearchFilters from '../components/SearchFilters';
import VehicleCard from '../components/VehicleCard';
import VehicleModal from '../components/VehicleModal';
import RestockModal from '../components/RestockModal';
import Toast from '../components/Toast';
import { Car, Layers, PackageCheck, AlertCircle, Plus } from 'lucide-react';

export default function Dashboard() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    make: '',
    model: '',
    category: '',
    min_price: '',
    max_price: '',
  });

  const [toast, setToast] = useState(null);
  const [purchasingId, setPurchasingId] = useState(null);

  // Modals for Admin
  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [isRestockModalOpen, setIsRestockModalOpen] = useState(false);
  const [restockVehicle, setRestockVehicle] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { isAdmin } = useAuth();

  const fetchVehicles = useCallback(async () => {
    try {
      setLoading(true);
      const data = await vehicleService.search(filters);
      setVehicles(data);
    } catch (err) {
      console.error(err);
      setToast({ type: 'error', message: 'Failed to load vehicle inventory' });
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  const handleResetFilters = () => {
    setFilters({
      make: '',
      model: '',
      category: '',
      min_price: '',
      max_price: '',
    });
  };

  // Step 16: Purchase flow
  const handlePurchase = async (vehicleId) => {
    try {
      setPurchasingId(vehicleId);
      const updatedVehicle = await vehicleService.purchase(vehicleId);
      setVehicles((prev) =>
        prev.map((v) => (v.id === vehicleId ? updatedVehicle : v))
      );
      setToast({
        type: 'success',
        message: `Purchased ${updatedVehicle.make} ${updatedVehicle.model}! Remaining stock: ${updatedVehicle.quantity}`,
      });
    } catch (err) {
      const msg = err.response?.data?.detail || 'Purchase failed';
      setToast({ type: 'error', message: msg });
    } finally {
      setPurchasingId(null);
    }
  };

  // Admin Actions
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
        setToast({ type: 'success', message: 'Vehicle updated successfully' });
      } else {
        await vehicleService.create(formData);
        setToast({ type: 'success', message: 'Vehicle created successfully' });
      }
      setIsVehicleModalOpen(false);
      fetchVehicles();
    } catch (err) {
      const msg = err.response?.data?.detail || 'Failed to save vehicle';
      setToast({ type: 'error', message: msg });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteVehicle = async (id) => {
    if (!window.confirm('Are you sure you want to delete this vehicle from inventory?')) return;
    try {
      await vehicleService.delete(id);
      setVehicles((prev) => prev.filter((v) => v.id !== id));
      setToast({ type: 'success', message: 'Vehicle deleted from inventory' });
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
        message: `Restocked ${updated.make} ${updated.model}. New quantity: ${updated.quantity}`,
      });
      setIsRestockModalOpen(false);
    } catch (err) {
      setToast({ type: 'error', message: 'Failed to restock vehicle' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Aggregated Stats
  const totalVehicles = vehicles.length;
  const totalStockUnits = vehicles.reduce((sum, v) => sum + v.quantity, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            Vehicle Showroom Inventory
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Browse, search, and manage available cars in real-time
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={handleOpenAddModal}
            className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-sm font-semibold flex items-center space-x-2 shadow-lg shadow-blue-500/25 transition-all hover:scale-105"
          >
            <Plus className="w-4 h-4" />
            <span>Add Vehicle</span>
          </button>
        )}
      </div>

      {/* Stats Summary Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="glass-card p-4 rounded-2xl border border-slate-800 flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20">
            <Car className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-semibold">Total Vehicle Models</p>
            <p className="text-2xl font-bold text-slate-100">{totalVehicles}</p>
          </div>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-slate-800 flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
            <PackageCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-semibold">Total Units in Stock</p>
            <p className="text-2xl font-bold text-slate-100">{totalStockUnits}</p>
          </div>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-slate-800 flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-semibold">Filter Matching</p>
            <p className="text-2xl font-bold text-purple-400">{vehicles.length} Results</p>
          </div>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <SearchFilters filters={filters} setFilters={setFilters} onReset={handleResetFilters} />

      {/* Vehicle Grid */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-slate-400">Fetching live inventory...</p>
        </div>
      ) : vehicles.length === 0 ? (
        <div className="glass-card p-12 rounded-3xl text-center border border-slate-800 my-8">
          <AlertCircle className="w-12 h-12 text-slate-500 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-200">No Vehicles Found</h3>
          <p className="text-sm text-slate-400 mt-1 max-w-sm mx-auto">
            No cars match your search filters. Try adjusting your query or click reset.
          </p>
          <button
            onClick={handleResetFilters}
            className="mt-4 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition-colors"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map((v) => (
            <VehicleCard
              key={v.id}
              vehicle={v}
              onPurchase={handlePurchase}
              onEdit={handleOpenEditModal}
              onDelete={handleDeleteVehicle}
              onRestock={handleOpenRestockModal}
              isAdmin={isAdmin}
              purchasingId={purchasingId}
            />
          ))}
        </div>
      )}

      {/* Admin Modals */}
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

      {/* Notification Toast */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
