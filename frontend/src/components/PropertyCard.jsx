import React from 'react';
import {
  Bed,
  Bath,
  Maximize2,
  MapPin,
  Heart,
  Flame,
  Users,
  MessageCircle,
  Building,
  Compass,
} from 'lucide-react';
import PropertyVisual from './PropertyVisual';

export default function PropertyCard({
  property,
  isSaved,
  onToggleSave,
  onOpenDetails,
  onOpenTour,
}) {
  const formatBDT = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const openWhatsApp = (e) => {
    e.stopPropagation();
    const phone = property.contactWhatsApp || property.contactPhone || '+8801700000000';
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const message = encodeURIComponent(
      `Hello ${property.contactName}, I saw your rental listing "${property.title}" in ${property.area} on GRIHO. Is it still available?`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank');
  };

  return (
    <div
      onClick={() => onOpenDetails(property)}
      className="property-card glass-panel rounded-3xl overflow-hidden border border-slate-800/90 bg-slate-900/90 flex flex-col justify-between group cursor-pointer relative shadow-lg"
    >
      {/* Top Pure CSS Architectural Preview */}
      <div className="relative w-full">
        <PropertyVisual property={property} aspect="aspect-[16/10]" />

        {/* Favorite Heart Toggle */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleSave(property._id);
          }}
          className={`absolute top-3.5 right-3.5 p-2.5 rounded-full backdrop-blur-md transition-all z-20 cursor-pointer ${
            isSaved
              ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30'
              : 'bg-black/60 text-slate-300 hover:text-white hover:bg-black/80 border border-white/10'
          }`}
          title={isSaved ? 'Remove from Saved' : 'Save Property'}
        >
          <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Card Body */}
      <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Price Header */}
          <div className="flex items-baseline justify-between gap-2 mb-2">
            <div>
              <span className="text-2xl sm:text-3xl font-black text-emerald-400">
                ৳{formatBDT(property.rent)}
              </span>
              <span className="text-xs sm:text-sm text-slate-400 font-medium"> / month</span>
            </div>
            {property.serviceCharge > 0 && (
              <span className="text-xs text-slate-400 font-medium">
                + ৳{formatBDT(property.serviceCharge)} service
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="font-bold text-base sm:text-lg text-white line-clamp-1 group-hover:text-emerald-300 transition-colors mb-2">
            {property.title}
          </h3>

          {/* Location */}
          <div className="flex items-center gap-1.5 text-xs sm:text-sm text-slate-400 mb-4">
            <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="truncate">{property.address || `${property.area}, ${property.city}`}</span>
          </div>

          {/* BD Specific Feature Badges */}
          <div className="flex flex-wrap gap-2 mb-4">
            {/* Gas Badge */}
            <span
              className={`text-xs font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1.5 ${
                property.gasType === 'Titas Line Gas'
                  ? 'bg-amber-950/70 text-amber-300 border border-amber-500/30'
                  : 'bg-slate-800 text-slate-300'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>{property.gasType}</span>
            </span>

            {/* Tenant Policy Badge */}
            <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-sky-950/70 text-sky-300 border border-sky-500/30 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-sky-400" />
              <span>{property.tenantPolicy}</span>
            </span>

            {/* Facing Badge */}
            {property.facing && (
              <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-slate-400" />
                <span>{property.facing}-Facing</span>
              </span>
            )}
          </div>

          {/* Key Specs Row */}
          <div className="grid grid-cols-3 gap-3 py-3 border-y border-slate-800/80 text-xs sm:text-sm font-semibold text-slate-300">
            <div className="flex items-center gap-2">
              <Bed className="w-4 h-4 text-emerald-400" />
              <span>{property.bedrooms} Beds</span>
            </div>
            <div className="flex items-center gap-2">
              <Bath className="w-4 h-4 text-teal-400" />
              <span>{property.bathrooms} Baths</span>
            </div>
            <div className="flex items-center gap-2">
              <Maximize2 className="w-4 h-4 text-sky-400" />
              <span>{property.sizeSqFt} sqft</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={() => onOpenDetails(property)}
            className="btn-secondary flex-1 py-3 px-4 rounded-2xl text-xs sm:text-sm font-bold text-center hover:text-white cursor-pointer"
          >
            Details & Costs
          </button>
          <button
            onClick={openWhatsApp}
            className="p-3 rounded-2xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500 hover:text-white transition-all shadow-sm cursor-pointer"
            title="Chat directly on WhatsApp"
          >
            <MessageCircle className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
