import React from 'react';
import { ShoppingCart, Edit, Trash2, PlusCircle, CheckCircle2, AlertTriangle, XCircle, Tag, DollarSign } from 'lucide-react';

export default function VehicleCard({ vehicle, onPurchase, onEdit, onDelete, onRestock, isAdmin, purchasingId }) {
  const isOutOfStock = vehicle.quantity === 0;
  const isLowStock = vehicle.quantity > 0 && vehicle.quantity <= 3;
  const isPurchasing = purchasingId === vehicle.id;

  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(vehicle.price);

  return (
    <div className="glass-card rounded-2xl p-6 flex flex-col justify-between hover:border-slate-700 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10 group relative overflow-hidden">
      {/* Background Subtle Gradient Glow */}
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all" />

      <div>
        {/* Header Badges */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center space-x-1">
            <Tag className="w-3 h-3 mr-1" />
            {vehicle.category}
          </span>

          {/* Stock Pill */}
          <span
            className={`text-xs font-bold px-2.5 py-1 rounded-full flex items-center space-x-1 border ${
              isOutOfStock
                ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                : isLowStock
                ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
            }`}
          >
            {isOutOfStock ? (
              <>
                <XCircle className="w-3 h-3" />
                <span>Out of Stock</span>
              </>
            ) : isLowStock ? (
              <>
                <AlertTriangle className="w-3 h-3" />
                <span>Only {vehicle.quantity} left</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-3 h-3" />
                <span>In Stock ({vehicle.quantity})</span>
              </>
            )}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-slate-100 group-hover:text-blue-400 transition-colors">
          {vehicle.make} <span className="font-light text-slate-400">{vehicle.model}</span>
        </h3>

        {/* Price */}
        <div className="mt-4 mb-6">
          <span className="text-2xl font-extrabold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
            {formattedPrice}
          </span>
        </div>
      </div>

      {/* Actions Footer */}
      <div className="space-y-3 pt-4 border-t border-slate-800/80">
        {/* Purchase Button */}
        <button
          onClick={() => onPurchase(vehicle.id)}
          disabled={isOutOfStock || isPurchasing}
          className={`w-full py-2.5 px-4 rounded-xl text-sm font-semibold flex items-center justify-center space-x-2 transition-all shadow-md ${
            isOutOfStock
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
              : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-blue-500/25 hover:scale-[1.02] active:scale-[0.98]'
          }`}
        >
          <ShoppingCart className="w-4 h-4" />
          <span>{isPurchasing ? 'Processing...' : isOutOfStock ? 'Sold Out' : 'Purchase Vehicle'}</span>
        </button>

        {/* Admin Controls */}
        {isAdmin && (
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800/50">
            <button
              onClick={() => onRestock(vehicle)}
              className="py-1.5 px-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 rounded-lg text-xs font-semibold flex items-center justify-center space-x-1 transition-colors"
              title="Restock Inventory"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Restock</span>
            </button>

            <button
              onClick={() => onEdit(vehicle)}
              className="py-1.5 px-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 rounded-lg text-xs font-semibold flex items-center justify-center space-x-1 transition-colors"
              title="Edit Vehicle"
            >
              <Edit className="w-3.5 h-3.5" />
              <span>Edit</span>
            </button>

            <button
              onClick={() => onDelete(vehicle.id)}
              className="py-1.5 px-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 rounded-lg text-xs font-semibold flex items-center justify-center space-x-1 transition-colors"
              title="Delete Vehicle"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
