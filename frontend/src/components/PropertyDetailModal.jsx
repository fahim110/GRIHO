import React, { useState, useEffect } from 'react';
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
  Heart,
  Car,
  Wifi,
  Star,
  FileText,
  Train,
  Check,
  Send,
} from 'lucide-react';
import { fetchReviews, submitReview } from '../api';
import PropertyVisual from './PropertyVisual';

export default function PropertyDetailModal({
  property,
  onClose,
  isSaved,
  onToggleSave,
  onOpenTour,
  onAddToCompare,
  isCompared,
  onOpenLease,
  lang = 'en',
}) {
  if (!property) return null;

  const [selectedImgIndex, setSelectedImgIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'reviews' | 'costs'
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);

  // Review form state
  const [reviewForm, setReviewForm] = useState({
    authorName: '',
    authorRole: 'Tenant',
    rating: 5,
    safetyRating: 5,
    gasWaterRating: 5,
    comment: '',
  });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);

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
  const estElectricity = 2500;
  const totalEstMonthly = (property.rent || 0) + (property.serviceCharge || 0) + estGasCost + estElectricity;
  const advanceAmount = (property.rent || 0) * (property.advanceDepositMonths || 2);

  useEffect(() => {
    if (property?._id) {
      setLoadingReviews(true);
      fetchReviews(property._id)
        .then((res) => {
          if (res.success) setReviews(res.data);
        })
        .finally(() => setLoadingReviews(false));
    }
  }, [property?._id]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setSubmittingReview(true);
    try {
      const res = await submitReview({
        propertyId: property._id,
        ...reviewForm,
      });
      if (res.success) {
        setReviews([res.data, ...reviews]);
        setReviewSuccess(true);
        setReviewForm({ authorName: '', authorRole: 'Tenant', rating: 5, safetyRating: 5, gasWaterRating: 5, comment: '' });
        setTimeout(() => setReviewSuccess(false), 4000);
      }
    } catch (e) {
      alert(e.message);
    } finally {
      setSubmittingReview(false);
    }
  };

  const openWhatsApp = () => {
    const phone = property.contactWhatsApp || property.contactPhone || '+8801700000000';
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const message = encodeURIComponent(
      `Hello ${property.contactName}, I am interested in renting "${property.title}" in ${property.area} on GRIHO (৳${formatBDT(property.rent)}/mo). Could we discuss details?`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank');
  };

  const amenitiesList = [
    { label: 'Lift / Elevator', active: property.amenities?.lift, icon: <Building className="w-5 h-5 text-emerald-400" /> },
    { label: 'Generator Backup', active: property.amenities?.generatorBackup, icon: <Zap className="w-5 h-5 text-amber-400" /> },
    { label: '24/7 Security Guard', active: property.amenities?.guard247, icon: <ShieldCheck className="w-5 h-5 text-teal-400" /> },
    { label: 'CCTV Surveillance', active: property.amenities?.cctv, icon: <ShieldCheck className="w-5 h-5 text-sky-400" /> },
    { label: 'Dedicated Car Parking', active: property.amenities?.carParking, icon: <Car className="w-5 h-5 text-indigo-400" /> },
    { label: 'Rooftop Access', active: property.amenities?.rooftopAccess, icon: <Building className="w-5 h-5 text-emerald-400" /> },
    { label: 'High Speed WiFi Ready', active: property.amenities?.wifiAvailable, icon: <Wifi className="w-5 h-5 text-sky-400" /> },
    { label: 'Geyser / Water Heater', active: property.amenities?.geyser, icon: <Zap className="w-5 h-5 text-amber-400" /> },
    { label: 'Servant Room / Bath', active: property.amenities?.servantRoom, icon: <Users className="w-5 h-5 text-slate-400" /> },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 lg:p-10 animate-fade-in">
      <div
        className="relative w-full max-w-5xl 2xl:max-w-6xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[94vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Sticky Header */}
        <div className="flex items-center justify-between px-8 sm:px-10 py-6 border-b border-slate-800 bg-slate-950/95 shrink-0">
          <div className="flex flex-wrap items-center gap-3.5">
            <span className="text-sm font-extrabold px-4 py-1.5 rounded-full bg-emerald-950/90 text-emerald-400 border border-emerald-500/40">
              {property.propertyType}
            </span>
            {property.nidVerified && (
              <span className="text-sm font-bold px-4 py-1.5 rounded-full bg-teal-950/90 text-teal-300 border border-teal-500/40 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-teal-400" />
                <span>NID Verified Owner</span>
              </span>
            )}
            {property.deedVerified && (
              <span className="text-sm font-bold px-4 py-1.5 rounded-full bg-sky-950/90 text-sky-300 border border-sky-500/40">
                ✅ Deed Verified
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* Compare Toggle */}
            <button
              onClick={() => onAddToCompare(property)}
              className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold border transition-all cursor-pointer ${
                isCompared
                  ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
              }`}
            >
              {isCompared ? '✓ Compared' : '⚖️ Compare'}
            </button>

            {/* Favorite Heart */}
            <button
              onClick={() => onToggleSave(property._id)}
              className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                isSaved ? 'bg-rose-500/20 border-rose-500/50 text-rose-400' : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
              }`}
            >
              <Heart className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
            </button>

            <button
              onClick={onClose}
              className="p-3 rounded-2xl bg-slate-800 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 bg-slate-950/80 px-8 sm:px-10 shrink-0">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-4 px-6 text-sm sm:text-base font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'overview' ? 'border-emerald-500 text-emerald-400' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Property Overview & Specs
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`py-4 px-6 text-sm sm:text-base font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'reviews' ? 'border-emerald-500 text-emerald-400' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>Tenant Reviews & Safety</span>
            <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-xs font-bold text-slate-300">{reviews.length}</span>
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="overflow-y-auto p-8 sm:p-10 space-y-8 flex-1 text-base">
          
          {activeTab === 'overview' ? (
            <>
              {/* Architectural Visual Banner (Pure CSS/SVG) */}
              <div className="rounded-3xl overflow-hidden border border-slate-800 shadow-2xl">
                <PropertyVisual property={property} aspect="aspect-[21/9]" interactive={true} />
              </div>

              {/* Title & Core Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Left 2 Cols */}
                <div className="lg:col-span-2 space-y-8">
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight mb-3">
                      {property.title}
                    </h1>
                    <div className="flex items-center gap-2 text-slate-300 text-sm sm:text-base">
                      <MapPin className="w-5 h-5 text-emerald-400 shrink-0" />
                      <span>{property.address}, {property.area}, {property.city}</span>
                    </div>

                    {property.metroNearby && (
                      <div className="mt-3 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-sky-950/80 border border-sky-500/40 text-sky-300 text-xs sm:text-sm font-semibold">
                        <Train className="w-4 h-4 text-sky-400" />
                        <span>🚇 {property.metroNearby}</span>
                      </div>
                    )}
                  </div>

                  {/* Quick Highlight Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="glass-panel p-4 sm:p-5 rounded-2xl border border-slate-800 text-center space-y-1">
                      <Bed className="w-6 h-6 text-emerald-400 mx-auto" />
                      <div className="text-base font-extrabold text-white">{property.bedrooms} Beds</div>
                      <div className="text-xs text-slate-400">Master & Guest</div>
                    </div>
                    <div className="glass-panel p-4 sm:p-5 rounded-2xl border border-slate-800 text-center space-y-1">
                      <Bath className="w-6 h-6 text-teal-400 mx-auto" />
                      <div className="text-base font-extrabold text-white">{property.bathrooms} Baths</div>
                      <div className="text-xs text-slate-400">Fittings & Geyser</div>
                    </div>
                    <div className="glass-panel p-4 sm:p-5 rounded-2xl border border-slate-800 text-center space-y-1">
                      <Maximize2 className="w-6 h-6 text-sky-400 mx-auto" />
                      <div className="text-base font-extrabold text-white">{property.sizeSqFt} Sq. Ft</div>
                      <div className="text-xs text-slate-400">Carpet Area</div>
                    </div>
                    <div className="glass-panel p-4 sm:p-5 rounded-2xl border border-slate-800 text-center space-y-1">
                      <Compass className="w-6 h-6 text-amber-400 mx-auto" />
                      <div className="text-base font-extrabold text-white">{property.facing || 'South'} Facing</div>
                      <div className="text-xs text-slate-400">Natural Breeze</div>
                    </div>
                  </div>

                  {/* Nearby Landmarks */}
                  {property.landmarks && property.landmarks.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="font-bold text-slate-400 uppercase tracking-wider text-xs sm:text-sm">
                        Nearby Landmarks & Conveniences
                      </h3>
                      <div className="flex flex-wrap gap-2.5">
                        {property.landmarks.map((lm, idx) => (
                          <span key={idx} className="px-3.5 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-200 text-xs sm:text-sm">
                            📍 {lm}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Description */}
                  <div className="space-y-3">
                    <h3 className="font-bold text-slate-400 uppercase tracking-wider text-xs sm:text-sm">
                      About this Property
                    </h3>
                    <p className="text-slate-300 leading-relaxed whitespace-pre-line text-sm sm:text-base">
                      {property.description}
                    </p>
                  </div>

                  {/* Bangladesh Specs Table */}
                  <div className="space-y-4">
                    <h3 className="font-bold text-slate-400 uppercase tracking-wider text-xs sm:text-sm">
                      Key Bangladesh Housing Specifications
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800">
                        <span className="text-xs text-slate-400 block">Gas Connection:</span>
                        <span className="font-bold text-amber-300 flex items-center gap-1.5 mt-1 text-sm sm:text-base">
                          <Flame className="w-4 h-4 text-amber-400" />
                          {property.gasType}
                        </span>
                      </div>
                      <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800">
                        <span className="text-xs text-slate-400 block">Electricity Meter:</span>
                        <span className="font-bold text-white mt-1 block text-sm sm:text-base">{property.electricityType || 'Prepaid Meter'}</span>
                      </div>
                      <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800">
                        <span className="text-xs text-slate-400 block">Floor Position:</span>
                        <span className="font-bold text-white mt-1 block text-sm sm:text-base">{property.floor || '3rd Floor'}</span>
                      </div>
                      <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800">
                        <span className="text-xs text-slate-400 block">Tenant Policy:</span>
                        <span className="font-bold text-sky-300 mt-1 block text-sm sm:text-base">{property.tenantPolicy}</span>
                      </div>
                      <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800">
                        <span className="text-xs text-slate-400 block">Available From:</span>
                        <span className="font-bold text-emerald-400 mt-1 block text-sm sm:text-base">{property.availableFrom || 'Immediate'}</span>
                      </div>
                      <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800">
                        <span className="text-xs text-slate-400 block">Advance Deposit:</span>
                        <span className="font-bold text-white mt-1 block text-sm sm:text-base">{property.advanceDepositMonths || 2} Months Rent</span>
                      </div>
                    </div>
                  </div>

                  {/* Amenities */}
                  <div className="space-y-4">
                    <h3 className="font-bold text-slate-400 uppercase tracking-wider text-xs sm:text-sm">
                      Building Amenities & Facilities
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {amenitiesList.map((item, idx) => (
                        <div
                          key={idx}
                          className={`flex items-center gap-3 p-3.5 rounded-2xl border text-sm ${
                            item.active
                              ? 'bg-slate-950/80 border-slate-800 text-slate-200'
                              : 'bg-slate-950/30 border-slate-900 text-slate-500 line-through opacity-50'
                          }`}
                        >
                          {item.icon}
                          <span className="font-semibold">{item.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Right 1 Col */}
                <div className="space-y-6">
                  
                  {/* Living Cost Calculator */}
                  <div className="glass-panel-glow rounded-3xl p-6 sm:p-8 space-y-6">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
                        <Calculator className="w-4 h-4" />
                        <span>Monthly Living Cost</span>
                      </span>
                      {property.negotiable && (
                        <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-950/80 text-amber-300 border border-amber-500/30">
                          Negotiable
                        </span>
                      )}
                    </div>

                    <div className="border-b border-slate-800 pb-4">
                      <div className="text-3xl sm:text-4xl font-black text-emerald-400">
                        ৳{formatBDT(property.rent)}
                      </div>
                      <div className="text-xs sm:text-sm text-slate-400 mt-0.5">Base Monthly Rent</div>
                    </div>

                    <div className="space-y-3 text-sm sm:text-base text-slate-300">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Service Charge:</span>
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

                      <div className="pt-3 border-t border-slate-800 flex justify-between text-base font-bold">
                        <span className="text-white">Est. Total Monthly:</span>
                        <span className="text-emerald-400 font-extrabold text-lg">৳{formatBDT(totalEstMonthly)}</span>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs sm:text-sm text-slate-400">
                      🔒 <strong className="text-slate-200">Security Deposit:</strong> ৳{formatBDT(advanceAmount)} ({property.advanceDepositMonths || 2} months).
                    </div>
                  </div>

                  {/* Landlord Contact Box */}
                  <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6 border border-slate-800">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white font-bold text-xl shrink-0">
                        {property.contactName?.charAt(0) || 'L'}
                      </div>
                      <div>
                        <h3 className="font-extrabold text-white text-base sm:text-lg">{property.contactName}</h3>
                        <div className="text-xs sm:text-sm text-emerald-400 font-medium flex items-center gap-1.5 mt-0.5">
                          <ShieldCheck className="w-4 h-4" />
                          <span>Verified Landlord</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <button
                        onClick={openWhatsApp}
                        className="w-full py-3.5 px-5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2.5 transition-colors cursor-pointer shadow-xl shadow-emerald-600/30"
                      >
                        <MessageCircle className="w-5 h-5" />
                        <span>Direct Chat on WhatsApp</span>
                      </button>

                      <button
                        onClick={() => onOpenTour(property)}
                        className="w-full py-3.5 px-5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2.5 border border-slate-700 transition-colors cursor-pointer"
                      >
                        <Calendar className="w-5 h-5 text-emerald-400" />
                        <span>Schedule Physical Visit</span>
                      </button>

                      <button
                        onClick={() => onOpenLease(property)}
                        className="w-full py-3 px-4 rounded-2xl bg-amber-950/40 border border-amber-500/30 hover:bg-amber-900/40 text-amber-300 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                      >
                        <FileText className="w-4 h-4" />
                        <span>Generate Tenancy Lease Agreement</span>
                      </button>

                      <a
                        href={`tel:${property.contactPhone}`}
                        className="w-full py-2.5 px-4 rounded-2xl bg-slate-900 text-slate-400 hover:text-slate-200 text-xs font-medium flex items-center justify-center gap-2"
                      >
                        <Phone className="w-4 h-4 text-slate-400" />
                        <span>Call: {property.contactPhone}</span>
                      </a>
                    </div>
                  </div>

                </div>

              </div>
            </>
          ) : (
            /* REVIEWS TAB */
            <div className="space-y-8 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                
                {/* Reviews List (2 cols) */}
                <div className="md:col-span-2 space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="font-extrabold text-white text-lg sm:text-xl">
                      Verified Tenant Ratings ({reviews.length})
                    </h3>
                    <div className="flex items-center gap-2 text-amber-400 font-extrabold text-base">
                      <Star className="w-5 h-5 fill-amber-400" />
                      <span>{property.rating || 4.8} / 5.0</span>
                    </div>
                  </div>

                  {loadingReviews ? (
                    <div className="py-12 text-center text-slate-400 text-base">Loading reviews...</div>
                  ) : reviews.length === 0 ? (
                    <div className="glass-panel p-10 rounded-3xl text-center text-slate-400 text-base">
                      No reviews yet for this flat. Be the first to leave feedback!
                    </div>
                  ) : (
                    reviews.map((r, idx) => (
                      <div key={idx} className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-bold text-white text-base">{r.authorName}</div>
                            <div className="text-xs text-emerald-400 font-semibold">{r.authorRole}</div>
                          </div>
                          <div className="flex items-center gap-1 text-amber-400 font-bold">
                            {'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}
                          </div>
                        </div>
                        <p className="text-slate-300 leading-relaxed text-sm sm:text-base">
                          {r.comment}
                        </p>
                        <div className="flex items-center gap-6 text-xs text-slate-400 pt-2 border-t border-slate-800/60">
                          <span>🛡️ Safety: {r.safetyRating}/5</span>
                          <span>🔥 Gas & Water: {r.gasWaterRating}/5</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Review Form (1 col) */}
                <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-5">
                  <h4 className="font-extrabold text-white text-base">Leave Tenant Review</h4>
                  {reviewSuccess && (
                    <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-sm font-bold">
                      🎉 Review posted successfully!
                    </div>
                  )}
                  <form onSubmit={handleReviewSubmit} className="space-y-4 text-sm">
                    <div>
                      <label className="font-bold text-slate-200 text-xs block mb-1">Your Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Tanvir Ahmed"
                        value={reviewForm.authorName}
                        onChange={(e) => setReviewForm({ ...reviewForm, authorName: e.target.value })}
                        className="w-full glass-input rounded-xl p-3 text-sm"
                        required
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-200 text-xs block mb-1">Your Role</label>
                      <select
                        value={reviewForm.authorRole}
                        onChange={(e) => setReviewForm({ ...reviewForm, authorRole: e.target.value })}
                        className="w-full glass-input rounded-xl p-3 text-sm bg-slate-900 cursor-pointer"
                      >
                        <option value="Current Tenant">Current Tenant</option>
                        <option value="Previous Tenant">Previous Tenant</option>
                        <option value="Visited for Tour">Visited for Tour</option>
                      </select>
                    </div>
                    <div>
                      <label className="font-bold text-slate-200 text-xs block mb-1">Overall Rating (1-5)</label>
                      <input
                        type="number"
                        min="1"
                        max="5"
                        value={reviewForm.rating}
                        onChange={(e) => setReviewForm({ ...reviewForm, rating: Number(e.target.value) })}
                        className="w-full glass-input rounded-xl p-3 text-sm text-center font-bold"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-200 text-xs block mb-1">Comment & Advice</label>
                      <textarea
                        rows={3}
                        placeholder="Water supply, gas pressure, landlord cooperation, lift condition..."
                        value={reviewForm.comment}
                        onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                        className="w-full glass-input rounded-xl p-3 text-sm"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={submittingReview}
                      className="btn-primary w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/30"
                    >
                      <Send className="w-4 h-4" />
                      <span>{submittingReview ? 'Submitting...' : 'Submit Review'}</span>
                    </button>
                  </form>
                </div>

              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
