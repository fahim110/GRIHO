import React, { useState } from 'react';
import {
  X,
  Building,
  MapPin,
  Banknote,
  Bed,
  CheckCircle2,
  Flame,
  ShieldCheck,
  Image,
  Sparkles,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';
import { createProperty } from '../api';

export default function PostPropertyModal({ isOpen, onClose, onPropertyCreated }) {
  if (!isOpen) return null;

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    propertyType: 'Family Apartment',
    division: 'Dhaka',
    city: 'Dhaka',
    area: 'Dhanmondi',
    address: '',
    rent: '',
    serviceCharge: '',
    advanceDepositMonths: 2,
    negotiable: false,
    bedrooms: 3,
    bathrooms: 3,
    balconies: 2,
    sizeSqFt: 1500,
    floor: '3rd Floor',
    facing: 'South',
    gasType: 'Titas Line Gas',
    electricityType: 'Prepaid Meter',
    tenantPolicy: 'Family Only',
    availableFrom: 'Immediate',
    contactName: '',
    contactPhone: '',
    contactWhatsApp: '',
    images: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
    ],
    amenities: {
      lift: true,
      generatorBackup: true,
      guard247: true,
      cctv: true,
      carParking: false,
      rooftopAccess: true,
      servantRoom: false,
      wifiAvailable: true,
      geyser: true,
    },
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAmenityToggle = (key) => {
    setFormData((prev) => ({
      ...prev,
      amenities: {
        ...prev.amenities,
        [key]: !prev.amenities[key],
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload = {
        ...formData,
        rent: Number(formData.rent),
        serviceCharge: Number(formData.serviceCharge || 0),
        bedrooms: Number(formData.bedrooms),
        bathrooms: Number(formData.bathrooms),
        balconies: Number(formData.balconies),
        sizeSqFt: Number(formData.sizeSqFt),
        advanceDepositMonths: Number(formData.advanceDepositMonths),
      };

      const result = await createProperty(payload);
      setLoading(false);
      onPropertyCreated(result.data);
      onClose();
    } catch (err) {
      setLoading(false);
      setError(err.message || 'Failed to submit listing');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 lg:p-10 animate-fade-in">
      <div
        className="relative w-full max-w-4xl lg:max-w-5xl 2xl:max-w-6xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-8 sm:px-12 py-7 border-b border-slate-800 bg-slate-950/95 shrink-0">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
              <Building className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
                <span>List Your Property on GRIHO</span>
              </h2>
              <p className="text-sm sm:text-base text-slate-400 mt-1 font-medium">
                Step {step} of 3 • Direct connecting with verified tenants across Bangladesh
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-3.5 rounded-full bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Multi-step Visual Indicator */}
        <div className="bg-slate-950 px-8 sm:px-12 py-5 border-b border-slate-800/80 flex items-center justify-between text-sm sm:text-base font-bold text-slate-400">
          <span className={step === 1 ? 'text-emerald-400 flex items-center gap-2.5 font-extrabold' : 'flex items-center gap-2'}>
            <span className={`w-7 h-7 rounded-full inline-flex items-center justify-center text-xs font-black ${step === 1 ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-300'}`}>1</span>
            Basic Info & Location
          </span>
          <span className="text-slate-600 font-bold">→</span>
          <span className={step === 2 ? 'text-emerald-400 flex items-center gap-2.5 font-extrabold' : 'flex items-center gap-2'}>
            <span className={`w-7 h-7 rounded-full inline-flex items-center justify-center text-xs font-black ${step === 2 ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-300'}`}>2</span>
            Specs, Utilities & Rent
          </span>
          <span className="text-slate-600 font-bold">→</span>
          <span className={step === 3 ? 'text-emerald-400 flex items-center gap-2.5 font-extrabold' : 'flex items-center gap-2'}>
            <span className={`w-7 h-7 rounded-full inline-flex items-center justify-center text-xs font-black ${step === 3 ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-300'}`}>3</span>
            Contact & Publish
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-800 h-2">
          <div
            className="bg-emerald-500 h-2 transition-all duration-300"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>

        {/* Form Body */}
        <div className="overflow-y-auto p-8 sm:p-12 space-y-8 flex-1">
          {error && (
            <div className="p-5 rounded-2xl bg-rose-950/90 border border-rose-500/50 text-rose-300 text-base font-semibold flex items-center gap-3">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* STEP 1: Basic Info & Location */}
          {step === 1 && (
            <div className="space-y-8 animate-fade-in">
              <div className="space-y-2">
                <label className="font-bold text-slate-200 text-base block">
                  Property Title *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Modern 3 BHK Flat in Dhanmondi Road 8A"
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  className="w-full glass-input rounded-2xl p-4 sm:p-5 text-base placeholder:text-slate-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="font-bold text-slate-200 text-base block">
                    Property Type
                  </label>
                  <select
                    value={formData.propertyType}
                    onChange={(e) => handleChange('propertyType', e.target.value)}
                    className="w-full glass-input rounded-2xl p-4 sm:p-5 text-base bg-slate-900 cursor-pointer"
                  >
                    <option value="Family Apartment">Family Apartment (ফ্যামিলি ফ্ল্যাট)</option>
                    <option value="Bachelor Sublet">Bachelor Sublet (ব্যাচেলর সাবলেট)</option>
                    <option value="Mess / Room">Mess / Room (মেস / রুম)</option>
                    <option value="Studio Flat">Studio Flat (স্টুডিও ফ্ল্যাট)</option>
                    <option value="Duplex House">Duplex House (ডুপ্লেক্স)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="font-bold text-slate-200 text-base block">
                    Tenant Policy
                  </label>
                  <select
                    value={formData.tenantPolicy}
                    onChange={(e) => handleChange('tenantPolicy', e.target.value)}
                    className="w-full glass-input rounded-2xl p-4 sm:p-5 text-base bg-slate-900 cursor-pointer"
                  >
                    <option value="Family Only">Family Only (শুধুমাত্র পরিবার)</option>
                    <option value="Bachelor (Male)">Bachelor - Male (ছাত্র/চাকুরিজীবী পুরুষ)</option>
                    <option value="Bachelor (Female)">Bachelor - Female (ছাত্রী/মহিলা)</option>
                    <option value="Bachelor & Family">Bachelor & Family Friendly</option>
                    <option value="Any">Any Tenant Eligible</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="font-bold text-slate-200 text-base block">
                    City / Division
                  </label>
                  <select
                    value={formData.city}
                    onChange={(e) => {
                      handleChange('city', e.target.value);
                      handleChange('division', e.target.value);
                    }}
                    className="w-full glass-input rounded-2xl p-4 sm:p-5 text-base bg-slate-900 cursor-pointer"
                  >
                    <option value="Dhaka">Dhaka (ঢাকা)</option>
                    <option value="Chittagong">Chittagong (চট্টগ্রাম)</option>
                    <option value="Sylhet">Sylhet (সিলেট)</option>
                    <option value="Rajshahi">Rajshahi (রাজশাহী)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="font-bold text-slate-200 text-base block">
                    Neighborhood / Area *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Dhanmondi, Bashundhara R/A, Gulshan"
                    value={formData.area}
                    onChange={(e) => handleChange('area', e.target.value)}
                    className="w-full glass-input rounded-2xl p-4 sm:p-5 text-base placeholder:text-slate-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="font-bold text-slate-200 text-base block">
                  Exact Address & Road No. *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Road 12, Block C, House 24"
                  value={formData.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  className="w-full glass-input rounded-2xl p-4 sm:p-5 text-base placeholder:text-slate-500"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="font-bold text-slate-200 text-base block">
                  Detailed Description *
                </label>
                <textarea
                  rows={4}
                  placeholder="Describe your flat, ventilation, rules, neighborhood perks, nearby landmarks..."
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  className="w-full glass-input rounded-2xl p-4 sm:p-5 text-base placeholder:text-slate-500"
                  required
                />
              </div>
            </div>
          )}

          {/* STEP 2: Specs, Utilities & Pricing */}
          {step === 2 && (
            <div className="space-y-8 animate-fade-in">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                <div className="space-y-2">
                  <label className="font-bold text-slate-200 text-sm block">Bedrooms</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.bedrooms}
                    onChange={(e) => handleChange('bedrooms', e.target.value)}
                    className="w-full glass-input rounded-2xl p-4 text-base text-center font-bold"
                  />
                </div>
                <div className="space-y-2">
                  <label className="font-bold text-slate-200 text-sm block">Bathrooms</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.bathrooms}
                    onChange={(e) => handleChange('bathrooms', e.target.value)}
                    className="w-full glass-input rounded-2xl p-4 text-base text-center font-bold"
                  />
                </div>
                <div className="space-y-2">
                  <label className="font-bold text-slate-200 text-sm block">Balconies</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.balconies}
                    onChange={(e) => handleChange('balconies', e.target.value)}
                    className="w-full glass-input rounded-2xl p-4 text-base text-center font-bold"
                  />
                </div>
                <div className="space-y-2">
                  <label className="font-bold text-slate-200 text-sm block">Size (Sq. Ft)</label>
                  <input
                    type="number"
                    min="100"
                    value={formData.sizeSqFt}
                    onChange={(e) => handleChange('sizeSqFt', e.target.value)}
                    className="w-full glass-input rounded-2xl p-4 text-base text-center font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="font-bold text-slate-200 text-sm block">Gas Type</label>
                  <select
                    value={formData.gasType}
                    onChange={(e) => handleChange('gasType', e.target.value)}
                    className="w-full glass-input rounded-2xl p-4 text-base bg-slate-900 cursor-pointer"
                  >
                    <option value="Titas Line Gas">🔥 Titas Line Gas</option>
                    <option value="Cylinder (LPG)">🟡 Cylinder (LPG)</option>
                    <option value="Induction/Electric">⚡ Induction / Electric</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="font-bold text-slate-200 text-sm block">Facing Direction</label>
                  <select
                    value={formData.facing}
                    onChange={(e) => handleChange('facing', e.target.value)}
                    className="w-full glass-input rounded-2xl p-4 text-base bg-slate-900 cursor-pointer"
                  >
                    <option value="South">🧭 South Facing</option>
                    <option value="South-East">🧭 South-East</option>
                    <option value="East">🧭 East</option>
                    <option value="North">🧭 North</option>
                    <option value="West">🧭 West</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="font-bold text-slate-200 text-sm block">Available From</label>
                  <input
                    type="text"
                    placeholder="e.g. Immediate / 1st Oct"
                    value={formData.availableFrom}
                    onChange={(e) => handleChange('availableFrom', e.target.value)}
                    className="w-full glass-input rounded-2xl p-4 text-base"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-4 border-t border-slate-800">
                <div className="space-y-2">
                  <label className="font-black text-emerald-400 text-base block">
                    Monthly Rent (BDT ৳) *
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 35000"
                    value={formData.rent}
                    onChange={(e) => handleChange('rent', e.target.value)}
                    className="w-full glass-input rounded-2xl p-4 sm:p-5 text-xl font-black text-emerald-400"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="font-bold text-slate-200 text-base block">
                    Service Charge (BDT ৳)
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 4000"
                    value={formData.serviceCharge}
                    onChange={(e) => handleChange('serviceCharge', e.target.value)}
                    className="w-full glass-input rounded-2xl p-4 sm:p-5 text-xl"
                  />
                </div>
              </div>

              {/* Amenities Checkboxes */}
              <div className="space-y-3">
                <label className="font-bold text-slate-200 text-base block">
                  Building Amenities Included:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    { key: 'lift', label: '🛗 Lift / Elevator' },
                    { key: 'generatorBackup', label: '⚡ Standby Generator' },
                    { key: 'guard247', label: '🛡️ 24/7 Security Guard' },
                    { key: 'cctv', label: '📹 CCTV Cameras' },
                    { key: 'carParking', label: '🚗 Car Parking' },
                    { key: 'rooftopAccess', label: '🌿 Rooftop Access' },
                    { key: 'wifiAvailable', label: '📶 High Speed WiFi' },
                    { key: 'geyser', label: '🚿 Geyser / Hot Water' },
                  ].map((amenity) => (
                    <label
                      key={amenity.key}
                      className={`flex items-center gap-3.5 p-4 rounded-2xl border cursor-pointer transition-all ${
                        formData.amenities[amenity.key]
                          ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 shadow-md'
                          : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={formData.amenities[amenity.key]}
                        onChange={() => handleAmenityToggle(amenity.key)}
                        className="w-5 h-5 rounded border-slate-700 text-emerald-500 cursor-pointer"
                      />
                      <span className="text-sm font-semibold">{amenity.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Contact Details & Photos */}
          {step === 3 && (
            <div className="space-y-8 animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="font-bold text-slate-200 text-base block">
                    Your Name (Landlord / Host) *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Md. Rafiqul Islam"
                    value={formData.contactName}
                    onChange={(e) => handleChange('contactName', e.target.value)}
                    className="w-full glass-input rounded-2xl p-4 sm:p-5 text-base placeholder:text-slate-500"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="font-bold text-slate-200 text-base block">
                    Phone Number (BD) *
                  </label>
                  <input
                    type="tel"
                    placeholder="e.g. 017XXXXXXXX"
                    value={formData.contactPhone}
                    onChange={(e) => handleChange('contactPhone', e.target.value)}
                    className="w-full glass-input rounded-2xl p-4 sm:p-5 text-base placeholder:text-slate-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="font-bold text-emerald-400 text-base block">
                  WhatsApp Number (for instant direct tenant chats)
                </label>
                <input
                  type="tel"
                  placeholder="e.g. 017XXXXXXXX"
                  value={formData.contactWhatsApp}
                  onChange={(e) => handleChange('contactWhatsApp', e.target.value)}
                  className="w-full glass-input rounded-2xl p-4 sm:p-5 text-base placeholder:text-slate-500"
                />
              </div>

              <div className="p-8 rounded-3xl bg-slate-950/90 border border-slate-800 space-y-4">
                <div className="font-black text-white text-lg flex items-center gap-2.5">
                  <Sparkles className="w-6 h-6 text-emerald-400" />
                  <span>Instant Vector Architectural Card Generation</span>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Your listing will be instantly generated with high-end architectural blueprints and verified trust badges. Zero broken images, 100% reliable presentation.
                </p>
                <div className="p-4 rounded-2xl bg-emerald-950/50 border border-emerald-500/30 text-sm text-emerald-300 font-bold flex items-center justify-between">
                  <span>✨ Pure Blueprint Architecture Visual Active</span>
                  <span>100% Free Platform</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between px-8 sm:px-12 py-7 border-t border-slate-800 bg-slate-950/95 shrink-0">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="btn-secondary px-8 py-4 rounded-2xl text-base font-bold flex items-center gap-2 cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {step < 3 ? (
            <button
              onClick={() => {
                if (step === 1 && (!formData.title || !formData.area || !formData.address)) {
                  setError('Please fill in property title, area, and address');
                  return;
                }
                setError(null);
                setStep(step + 1);
              }}
              className="btn-primary px-10 py-4 rounded-2xl text-base font-bold flex items-center gap-2.5 cursor-pointer shadow-xl shadow-emerald-500/30"
            >
              <span>Continue</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="btn-primary px-10 py-4 rounded-2xl text-base font-black flex items-center gap-2.5 cursor-pointer shadow-2xl shadow-emerald-500/40"
            >
              <Sparkles className="w-5 h-5" />
              <span>{loading ? 'Publishing Listing...' : 'Publish Rental Listing Now'}</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
