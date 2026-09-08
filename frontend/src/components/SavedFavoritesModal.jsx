import React from 'react';
import { X, Heart, Trash2, ArrowRight, Bed, Bath, Maximize2, MapPin } from 'lucide-react';
import PropertyVisual from './PropertyVisual';

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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 animate-fade-in">
      <div
        className="relative w-full max-w-4xl lg:max-w-5xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-8 sm:px-12 py-7 border-b border-slate-800 bg-slate-950/95 shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center">
              <Heart className="w-6 h-6 fill-rose-400" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                Saved Rental Homes ({savedProperties.length})
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5 font-medium">Your bookmarked flats and apartments across Bangladesh</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-3 rounded-full bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List Body */}
        <div className="overflow-y-auto p-8 sm:p-12 space-y-5 flex-1">
          {savedProperties.length === 0 ? (
            <div className="text-center py-20 space-y-4">
              <Heart className="w-16 h-16 text-slate-600 mx-auto" />
              <h3 className="text-xl font-bold text-white">No Saved Homes Yet</h3>
              <p className="text-sm sm:text-base text-slate-400 max-w-sm mx-auto">
                Click the heart icon on any flat card to save and compare your favorite homes here.
              </p>
            </div>
          ) : (
            savedProperties.map((p) => (
              <div
                key={p._id}
                className="flex flex-col sm:flex-row items-center gap-6 p-6 rounded-3xl bg-slate-950/90 border border-slate-800 hover:border-slate-700 transition-all shadow-md"
              >
                <div className="w-full sm:w-44 h-28 rounded-2xl overflow-hidden shrink-0 border border-slate-800">
                  <PropertyVisual property={p} aspect="aspect-[16/10]" showBadges={false} className="h-full p-2" />
                </div>

                <div className="flex-1 min-w-0 w-full space-y-1.5">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-lg font-bold text-white line-clamp-1">{p.title}</h4>
                    <span className="text-xl font-black text-emerald-400 shrink-0">
                      ৳{formatBDT(p.rent)}/mo
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-slate-400">
                    <MapPin className="w-4 h-4 text-emerald-400" />
                    <span>{p.area}, {p.city}</span>
                  </div>

                  <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-300 pt-1">
                    <span className="font-semibold">{p.bedrooms} Beds</span>
                    <span>•</span>
                    <span className="font-semibold">{p.bathrooms} Baths</span>
                    <span>•</span>
                    <span className="font-semibold text-amber-300">🔥 {p.gasType}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto justify-end pt-2 sm:pt-0">
                  <button
                    onClick={() => {
                      onClose();
                      onOpenDetails(p);
                    }}
                    className="btn-primary py-3 px-6 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/25"
                  >
                    <span>View</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onRemoveSave(p._id)}
                    className="p-3 rounded-xl bg-slate-800 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
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
