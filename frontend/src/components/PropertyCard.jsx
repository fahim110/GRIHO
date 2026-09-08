import React, { useState } from 'react';
import {
  Bed,
  Bath,
  Maximize2,
  MapPin,
  Heart,
  Flame,
  ShieldCheck,
  Zap,
  Users,
  MessageCircle,
  Sparkles,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

export default function PropertyCard({
  property,
  isSaved,
  onToggleSave,
  onOpenDetails,
  onOpenTour,
}) {
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  const images = property.images && property.images.length > 0
    ? property.images
    : ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80'];

  const handleNextImage = (e) => {
    e.stopPropagation();
    setCurrentImgIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrevImage = (e) => {
    e.stopPropagation();
    setCurrentImgIndex((prev) => (prev - 1 + images.length) % images.length);
  };

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
      className="property-card glass-panel rounded-2xl overflow-hidden border border-slate-800/90 bg-slate-900/90 flex flex-col justify-between group cursor-pointer"
    >
      {/* Top Image Box */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-950">
        <img
          src={images[currentImgIndex]}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          {property.featured && (
            <span className="badge-amber text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 shadow-md">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Featured</span>
            </span>
          )}
          {property.verified && (
            <span className="badge-emerald text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 shadow-md">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span>Verified Owner</span>
            </span>
          )}
        </div>

        {/* Favorite Heart Toggle */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleSave(property._id);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all z-10 ${
            isSaved
              ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30'
              : 'bg-black/50 text-slate-300 hover:text-white hover:bg-black/70'
          }`}
          title={isSaved ? 'Remove from Saved' : 'Save Property'}
        >
          <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
        </button>

        {/* Carousel Prev/Next Buttons */}
        {images.length > 1 && (
          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={handlePrevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/60 text-white hover:bg-black/90 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/60 text-white hover:bg-black/90 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Image Indicators */}
        {images.length > 1 && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1 z-10">
            {images.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 rounded-full transition-all ${
                  i === currentImgIndex ? 'w-4 bg-emerald-400' : 'w-1.5 bg-white/50'
                }`}
              />
            ))}
          </div>
        )}

        {/* Property Type Badge */}
        <div className="absolute bottom-3 left-3 z-10">
          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-slate-900/90 text-slate-200 border border-slate-700/60 shadow">
            {property.propertyType}
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Price Header */}
          <div className="flex items-baseline justify-between gap-2 mb-1.5">
            <div>
              <span className="text-xl font-extrabold text-emerald-400">
                ৳{formatBDT(property.rent)}
              </span>
              <span className="text-xs text-slate-400 font-medium"> / month</span>
            </div>
            {property.serviceCharge > 0 && (
              <span className="text-[11px] text-slate-400">
                + ৳{formatBDT(property.serviceCharge)} service
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="font-bold text-sm text-white line-clamp-1 group-hover:text-emerald-300 transition-colors mb-2">
            {property.title}
          </h3>

          {/* Location */}
          <div className="flex items-center gap-1 text-xs text-slate-400 mb-3">
            <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="truncate">{property.area}, {property.city}</span>
          </div>

          {/* BD Specific Feature Badges */}
          <div className="flex flex-wrap gap-1.5 mb-3.5">
            {/* Gas Badge */}
            <span
              className={`text-[10px] font-semibold px-2 py-0.5 rounded-md flex items-center gap-1 ${
                property.gasType === 'Titas Line Gas'
                  ? 'bg-amber-950/70 text-amber-300 border border-amber-500/30'
                  : 'bg-slate-800 text-slate-300'
              }`}
            >
              <Flame className="w-3 h-3 text-amber-400" />
              <span>{property.gasType}</span>
            </span>

            {/* Tenant Policy Badge */}
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-sky-950/70 text-sky-300 border border-sky-500/30 flex items-center gap-1">
              <Users className="w-3 h-3 text-sky-400" />
              <span>{property.tenantPolicy}</span>
            </span>

            {/* Facing Badge */}
            {property.facing && (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-800 text-slate-300">
                🧭 {property.facing}-Facing
              </span>
            )}
          </div>

          {/* Key Specs Row */}
          <div className="grid grid-cols-3 gap-2 py-2 border-y border-slate-800/80 text-xs text-slate-300 mb-4">
            <div className="flex items-center gap-1.5">
              <Bed className="w-3.5 h-3.5 text-emerald-400" />
              <span>{property.bedrooms} Beds</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Bath className="w-3.5 h-3.5 text-teal-400" />
              <span>{property.bathrooms} Baths</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Maximize2 className="w-3.5 h-3.5 text-sky-400" />
              <span>{property.sizeSqFt} sqft</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={() => onOpenDetails(property)}
            className="btn-secondary flex-1 py-2 px-3 rounded-xl text-xs font-semibold text-center hover:text-white"
          >
            Details & Costs
          </button>
          <button
            onClick={openWhatsApp}
            className="p-2 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500 hover:text-white transition-all shadow-sm"
            title="Chat directly on WhatsApp"
          >
            <MessageCircle className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
