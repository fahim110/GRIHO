import React, { useState } from 'react';
import {
  X,
  MapPin,
  Bed,
  Bath,
  Maximize2,
  Flame,
  ShieldCheck,
  Zap,
  Users,
  Compass,
  Building,
  Calendar,
  Phone,
  MessageCircle,
  CheckCircle2,
  Sparkles,
  Calculator,
  ChevronLeft,
  ChevronRight,
  Clock,
  Heart,
  Car,
  Wifi,
} from 'lucide-react';

export default function PropertyDetailModal({
  property,
  onClose,
  isSaved,
  onToggleSave,
  onOpenTour,
}) {
  if (!property) return null;

  const [selectedImgIndex, setSelectedImgIndex] = useState(0);

  const images = property.images && property.images.length > 0
    ? property.images
    : ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80'];

  const formatBDT = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  // Cost estimates
  const estGasCost = property.gasType === 'Titas Line Gas' ? 1080 : property.gasType === 'Cylinder (LPG)' ? 1400 : 0;
  const estElectricity = 2500; // estimated monthly average for standard flat in BD
  const totalEstMonthly = (property.rent || 0) + (property.serviceCharge || 0) + estGasCost + estElectricity;
  const advanceAmount = (property.rent || 0) * (property.advanceDepositMonths || 2);

  const openWhatsApp = () => {
    const phone = property.contactWhatsApp || property.contactPhone || '+8801700000000';
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const message = encodeURIComponent(
      `Hello ${property.contactName}, I am interested in renting your property "${property.title}" in ${property.area}, listed on GRIHO (৳${formatBDT(property.rent)}/mo). Could we discuss further?`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank');
  };

  const amenitiesList = [
    { label: 'Lift / Elevator', active: property.amenities?.lift, icon: <Building className="w-4 h-4 text-emerald-400" /> },
    { label: 'Generator Backup', active: property.amenities?.generatorBackup, icon: <Zap className="w-4 h-4 text-amber-400" /> },
    { label: '24/7 Security Guard', active: property.amenities?.guard247, icon: <ShieldCheck className="w-4 h-4 text-teal-400" /> },
    { label: 'CCTV Surveillance', active: property.amenities?.cctv, icon: <ShieldCheck className="w-4 h-4 text-sky-400" /> },
    { label: 'Dedicated Car Parking', active: property.amenities?.carParking, icon: <Car className="w-4 h-4 text-indigo-400" /> },
    { label: 'Rooftop Access', active: property.amenities?.rooftopAccess, icon: <Building className="w-4 h-4 text-emerald-400" /> },
    { label: 'High Speed WiFi Ready', active: property.amenities?.wifiAvailable, icon: <Wifi className="w-4 h-4 text-sky-400" /> },
    { label: 'Geyser / Water Heater', active: property.amenities?.geyser, icon: <Zap className="w-4 h-4 text-amber-400" /> },
    { label: 'Servant Room / Bath', active: property.amenities?.servantRoom, icon: <Users className="w-4 h-4 text-slate-400" /> },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 animate-fade-in">
      <div
        className="relative w-full max-w-5xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/90 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-500/30">
              {property.propertyType}
            </span>
            {property.verified && (
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-teal-950/80 text-teal-400 border border-teal-500/30 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
                <span>Verified Listing</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleSave(property._id)}
              className={`p-2 rounded-full border transition-all ${
                isSaved
                  ? 'bg-rose-500/20 border-rose-500/50 text-rose-400'
                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
              }`}
              title="Save property"
            >
              <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-slate-800 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* Main Image Gallery */}
          <div className="space-y-3">
            <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800">
              <img
                src={images[selectedImgIndex]}
                alt={property.title}
                className="w-full h-full object-cover"
              />
              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setSelectedImgIndex((prev) => (prev - 1 + images.length) % images.length)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 text-white hover:bg-black/90 transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setSelectedImgIndex((prev) => (prev + 1) % images.length)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 text-white hover:bg-black/90 transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail Strip */}
            {images.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImgIndex(idx)}
                    className={`relative w-20 h-14 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                      idx === selectedImgIndex ? 'border-emerald-500 scale-105' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="thumb" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Title & Core Details Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left 2 Cols: Description & Details */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-white leading-tight mb-2">
                  {property.title}
                </h1>
                <div className="flex items-center gap-1.5 text-sm text-slate-300">
                  <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{property.address}, {property.area}, {property.city}</span>
                </div>
              </div>

              {/* Quick Spec Highlights */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="glass-panel p-3 rounded-xl border border-slate-800 text-center">
                  <Bed className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
                  <div className="text-sm font-bold text-white">{property.bedrooms} Bedrooms</div>
                  <div className="text-[11px] text-slate-400">Master & Guest</div>
                </div>
                <div className="glass-panel p-3 rounded-xl border border-slate-800 text-center">
                  <Bath className="w-5 h-5 text-teal-400 mx-auto mb-1" />
                  <div className="text-sm font-bold text-white">{property.bathrooms} Bathrooms</div>
                  <div className="text-[11px] text-slate-400">Fittings & Geyser</div>
                </div>
                <div className="glass-panel p-3 rounded-xl border border-slate-800 text-center">
                  <Maximize2 className="w-5 h-5 text-sky-400 mx-auto mb-1" />
                  <div className="text-sm font-bold text-white">{property.sizeSqFt} Sq. Ft</div>
                  <div className="text-[11px] text-slate-400">Carpet Area</div>
                </div>
                <div className="glass-panel p-3 rounded-xl border border-slate-800 text-center">
                  <Compass className="w-5 h-5 text-amber-400 mx-auto mb-1" />
                  <div className="text-sm font-bold text-white">{property.facing || 'South'} Facing</div>
                  <div className="text-[11px] text-slate-400">Natural Sunlight</div>
                </div>
              </div>

              {/* Property Description */}
              <div className="space-y-2">
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">
                  About this Property
                </h2>
                <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                  {property.description}
                </p>
              </div>

              {/* Bangladesh Specifications Table */}
              <div className="space-y-3">
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">
                  Key Specifications & BD Features
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-slate-400 block">Gas Supply:</span>
                    <span className="font-bold text-amber-300 flex items-center gap-1 mt-0.5">
                      <Flame className="w-3.5 h-3.5 text-amber-400" />
                      {property.gasType}
                    </span>
                  </div>
                  <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-slate-400 block">Electricity Meter:</span>
                    <span className="font-bold text-white mt-0.5 block">{property.electricityType || 'Prepaid Meter'}</span>
                  </div>
                  <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-slate-400 block">Floor Position:</span>
                    <span className="font-bold text-white mt-0.5 block">{property.floor || '3rd Floor'}</span>
                  </div>
                  <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-slate-400 block">Tenant Policy:</span>
                    <span className="font-bold text-sky-300 mt-0.5 block">{property.tenantPolicy}</span>
                  </div>
                  <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-slate-400 block">Available From:</span>
                    <span className="font-bold text-emerald-400 mt-0.5 block">{property.availableFrom || 'Immediate'}</span>
                  </div>
                  <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-slate-400 block">Advance Deposit:</span>
                    <span className="font-bold text-white mt-0.5 block">{property.advanceDepositMonths || 2} Months Rent</span>
                  </div>
                </div>
              </div>

              {/* Amenities Grid */}
              <div className="space-y-3">
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">
                  Building Amenities & Facilities
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {amenitiesList.map((item, idx) => (
                    <div
                      key={idx}
                      className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-medium ${
                        item.active
                          ? 'bg-slate-950/60 border-slate-800 text-slate-200'
                          : 'bg-slate-950/30 border-slate-900 text-slate-500 line-through opacity-50'
                      }`}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Right 1 Col: Cost Calculator & Landlord Card */}
            <div className="space-y-5">
              
              {/* Rent & Living Cost Breakdown Card */}
              <div className="glass-panel-glow rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                    <Calculator className="w-4 h-4" />
                    <span>Monthly Living Cost</span>
                  </span>
                  {property.negotiable && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-500/30">
                      Rent Negotiable
                    </span>
                  )}
                </div>

                <div className="border-b border-slate-800 pb-3">
                  <div className="text-3xl font-extrabold text-emerald-400">
                    ৳{formatBDT(property.rent)}
                  </div>
                  <div className="text-xs text-slate-400">Base Monthly Rent</div>
                </div>

                {/* Breakdown List */}
                <div className="space-y-2 text-xs text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Service / Maintenance:</span>
                    <span className="font-semibold text-white">৳{formatBDT(property.serviceCharge)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Est. Gas ({property.gasType}):</span>
                    <span className="font-semibold text-white">৳{formatBDT(estGasCost)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Est. Electricity & Water:</span>
                    <span className="font-semibold text-white">৳{formatBDT(estElectricity)}</span>
                  </div>

                  <div className="pt-2 border-t border-slate-800 flex justify-between text-sm font-bold">
                    <span className="text-white">Est. Total Monthly:</span>
                    <span className="text-emerald-400">৳{formatBDT(totalEstMonthly)}</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] text-slate-400">
                  🔒 <strong className="text-slate-200">Security Deposit:</strong> ৳{formatBDT(advanceAmount)} ({property.advanceDepositMonths || 2} months) refundable upon move-out.
                </div>
              </div>

              {/* Landlord Contact Box */}
              <div className="glass-panel rounded-2xl p-5 space-y-4 border border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white font-bold text-lg">
                    {property.contactName?.charAt(0) || 'L'}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">{property.contactName}</h3>
                    <div className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Verified Landlord</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-2">
                  <button
                    onClick={openWhatsApp}
                    className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-lg shadow-emerald-600/30"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Direct Chat on WhatsApp</span>
                  </button>

                  <button
                    onClick={() => {
                      onOpenTour(property);
                    }}
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-semibold text-xs flex items-center justify-center gap-2 border border-slate-700 transition-colors cursor-pointer"
                  >
                    <Calendar className="w-4 h-4 text-emerald-400" />
                    <span>Schedule Physical Visit</span>
                  </button>

                  <a
                    href={`tel:${property.contactPhone}`}
                    className="w-full py-2 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-[11px] font-medium flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>Call: {property.contactPhone}</span>
                  </a>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
