import React from 'react';
import { X, Heart, Trash2, ArrowRight, Bed, Bath, Maximize2, MapPin } from 'lucide-react';

export default function SavedFavoritesModal({
  isOpen,
  onClose,
  savedProperties,
  onRemoveSave,
  onOpenDetails,
}) {
  if (!isOpen) return null;

  const formatBDT = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div
        className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/90 shrink-0">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
            <h2 className="text-base font-bold text-white">
              Saved Rental Homes ({savedProperties.length})
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-800 text-slate-300 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* List Body */}
        <div className="overflow-y-auto p-6 space-y-3 flex-1">
          {savedProperties.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <Heart className="w-12 h-12 text-slate-600 mx-auto" />
              <h3 className="text-base font-bold text-white">No Saved Homes Yet</h3>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                Click the heart icon on any flat card to save and compare your favorite homes here.
              </p>
            </div>
          ) : (
            savedProperties.map((p) => (
              <div
                key={p._id}
                className="flex flex-col sm:flex-row items-center gap-4 p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 transition-colors"
              >
                <img
                  src={p.images?.[0] || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=400&q=80'}
                  alt={p.title}
                  className="w-full sm:w-28 h-20 rounded-xl object-cover shrink-0"
                />

                <div className="flex-1 min-w-0 w-full">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-sm font-bold text-white line-clamp-1">{p.title}</h4>
                    <span className="text-sm font-extrabold text-emerald-400 shrink-0">
                      ৳{formatBDT(p.rent)}/mo
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-slate-400 mt-0.5 mb-2">
                    <MapPin className="w-3 h-3 text-emerald-400" />
                    <span>{p.area}, {p.city}</span>
                  </div>

                  <div className="flex items-center gap-3 text-[11px] text-slate-300">
                    <span>{p.bedrooms} Beds</span>
                    <span>•</span>
                    <span>{p.bathrooms} Baths</span>
                    <span>•</span>
                    <span>{p.gasType}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <button
                    onClick={() => {
                      onClose();
                      onOpenDetails(p);
                    }}
                    className="btn-primary py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center gap-1"
                  >
                    <span>View</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => onRemoveSave(p._id)}
                    className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-rose-400 transition-colors"
                    title="Remove"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}
