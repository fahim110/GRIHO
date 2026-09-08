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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div
        className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/90 shrink-0">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Building className="w-5 h-5 text-emerald-400" />
              <span>List Your Property on GRIHO</span>
            </h2>
            <p className="text-xs text-slate-400">Step {step} of 3 • Direct connecting with verified tenants</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-slate-800 text-slate-300 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-800 h-1">
          <div
            className="bg-emerald-500 h-1 transition-all duration-300"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>

        {/* Form Body */}
        <div className="overflow-y-auto p-6 space-y-5 flex-1">
          {error && (
            <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-500/50 text-rose-300 text-xs font-semibold">
              {error}
            </div>
          )}

          {/* STEP 1: Basic Info & Location */}
          {step === 1 && (
            <div className="space-y-4 animate-fade-in text-xs">
              <div>
                <label className="font-semibold text-slate-300 block mb-1">
                  Property Title *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Modern 3 BHK Flat in Dhanmondi Road 8A"
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  className="w-full glass-input rounded-xl p-2.5 text-xs"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">
                    Property Type
                  </label>
                  <select
                    value={formData.propertyType}
                    onChange={(e) => handleChange('propertyType', e.target.value)}
                    className="w-full glass-input rounded-xl p-2.5 text-xs bg-slate-900"
                  >
                    <option value="Family Apartment">Family Apartment</option>
                    <option value="Bachelor Sublet">Bachelor Sublet</option>
                    <option value="Mess / Room">Mess / Room</option>
                    <option value="Studio Flat">Studio Flat</option>
                    <option value="Duplex House">Duplex House</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-300 block mb-1">
                    Tenant Policy
                  </label>
                  <select
                    value={formData.tenantPolicy}
                    onChange={(e) => handleChange('tenantPolicy', e.target.value)}
                    className="w-full glass-input rounded-xl p-2.5 text-xs bg-slate-900"
                  >
                    <option value="Family Only">Family Only</option>
                    <option value="Bachelor (Male)">Bachelor (Male)</option>
                    <option value="Bachelor (Female)">Bachelor (Female)</option>
                    <option value="Bachelor & Family">Bachelor & Family</option>
                    <option value="Any">Any Tenant</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">
                    City / Division
                  </label>
                  <select
                    value={formData.city}
                    onChange={(e) => {
                      handleChange('city', e.target.value);
                      handleChange('division', e.target.value);
                    }}
                    className="w-full glass-input rounded-xl p-2.5 text-xs bg-slate-900"
                  >
                    <option value="Dhaka">Dhaka</option>
                    <option value="Chittagong">Chittagong</option>
                    <option value="Sylhet">Sylhet</option>
                    <option value="Rajshahi">Rajshahi</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-300 block mb-1">
                    Neighborhood / Area *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Dhanmondi, Bashundhara, Gulshan"
                    value={formData.area}
                    onChange={(e) => handleChange('area', e.target.value)}
                    className="w-full glass-input rounded-xl p-2.5 text-xs"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">
                  Exact Address & Road No. *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Road 12, Block C, House 24"
                  value={formData.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  className="w-full glass-input rounded-xl p-2.5 text-xs"
                  required
                />
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">
                  Detailed Description *
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe your flat, surroundings, ventilation, rules, nearby landmarks..."
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  className="w-full glass-input rounded-xl p-2.5 text-xs"
                  required
                />
              </div>
            </div>
          )}

          {/* STEP 2: Specs, Utilities & Pricing */}
          {step === 2 && (
            <div className="space-y-4 animate-fade-in text-xs">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Bedrooms</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.bedrooms}
                    onChange={(e) => handleChange('bedrooms', e.target.value)}
                    className="w-full glass-input rounded-xl p-2 text-xs"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Bathrooms</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.bathrooms}
                    onChange={(e) => handleChange('bathrooms', e.target.value)}
                    className="w-full glass-input rounded-xl p-2 text-xs"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Balconies</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.balconies}
                    onChange={(e) => handleChange('balconies', e.target.value)}
                    className="w-full glass-input rounded-xl p-2 text-xs"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Size (Sq. Ft)</label>
                  <input
                    type="number"
                    min="100"
                    value={formData.sizeSqFt}
                    onChange={(e) => handleChange('sizeSqFt', e.target.value)}
                    className="w-full glass-input rounded-xl p-2 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Gas Type</label>
                  <select
                    value={formData.gasType}
                    onChange={(e) => handleChange('gasType', e.target.value)}
                    className="w-full glass-input rounded-xl p-2.5 text-xs bg-slate-900"
                  >
                    <option value="Titas Line Gas">Titas Line Gas</option>
                    <option value="Cylinder (LPG)">Cylinder (LPG)</option>
                    <option value="Induction/Electric">Induction / Electric</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Facing</label>
                  <select
                    value={formData.facing}
                    onChange={(e) => handleChange('facing', e.target.value)}
                    className="w-full glass-input rounded-xl p-2.5 text-xs bg-slate-900"
                  >
                    <option value="South">South Facing</option>
                    <option value="South-East">South-East</option>
                    <option value="East">East</option>
                    <option value="North">North</option>
                    <option value="West">West</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Available From</label>
                  <input
                    type="text"
                    placeholder="e.g. Immediate / 1st Oct"
                    value={formData.availableFrom}
                    onChange={(e) => handleChange('availableFrom', e.target.value)}
                    className="w-full glass-input rounded-xl p-2.5 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800">
                <div>
                  <label className="font-semibold text-emerald-400 block mb-1">
                    Monthly Rent (BDT ৳) *
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 35000"
                    value={formData.rent}
                    onChange={(e) => handleChange('rent', e.target.value)}
                    className="w-full glass-input rounded-xl p-2.5 text-xs font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">
                    Service Charge (BDT ৳)
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 4000"
                    value={formData.serviceCharge}
                    onChange={(e) => handleChange('serviceCharge', e.target.value)}
                    className="w-full glass-input rounded-xl p-2.5 text-xs"
                  />
                </div>
              </div>

              {/* Amenities Checkboxes */}
              <div>
                <label className="font-semibold text-slate-300 block mb-2">
                  Building Amenities Included:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { key: 'lift', label: 'Lift / Elevator' },
                    { key: 'generatorBackup', label: 'Generator Backup' },
                    { key: 'guard247', label: '24/7 Security Guard' },
                    { key: 'cctv', label: 'CCTV Surveillance' },
                    { key: 'carParking', label: 'Car Parking' },
                    { key: 'rooftopAccess', label: 'Rooftop Access' },
                    { key: 'wifiAvailable', label: 'WiFi Setup' },
                    { key: 'geyser', label: 'Geyser' },
                  ].map((amenity) => (
                    <label
                      key={amenity.key}
                      className="flex items-center gap-2 p-2 rounded-lg bg-slate-950/60 border border-slate-800 cursor-pointer text-slate-300 hover:text-white"
                    >
                      <input
                        type="checkbox"
                        checked={formData.amenities[amenity.key]}
                        onChange={() => handleAmenityToggle(amenity.key)}
                        className="rounded border-slate-700 text-emerald-500"
                      />
                      <span>{amenity.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Contact Details & Photos */}
          {step === 3 && (
            <div className="space-y-4 animate-fade-in text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">
                    Your Name (Landlord / Host) *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Md. Rafiqul Islam"
                    value={formData.contactName}
                    onChange={(e) => handleChange('contactName', e.target.value)}
                    className="w-full glass-input rounded-xl p-2.5 text-xs"
                    required
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-300 block mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    placeholder="e.g. +88017XXXXXXXX"
                    value={formData.contactPhone}
                    onChange={(e) => handleChange('contactPhone', e.target.value)}
                    className="w-full glass-input rounded-xl p-2.5 text-xs"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-emerald-400 block mb-1">
                  WhatsApp Number (for instant tenant chats)
                </label>
                <input
                  type="tel"
                  placeholder="e.g. +88017XXXXXXXX"
                  value={formData.contactWhatsApp}
                  onChange={(e) => handleChange('contactWhatsApp', e.target.value)}
                  className="w-full glass-input rounded-xl p-2.5 text-xs"
                />
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                <div className="font-bold text-white flex items-center gap-1.5">
                  <Image className="w-4 h-4 text-emerald-400" />
                  <span>Property Photos</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Pre-filled with high-resolution interior demo photos. You can also paste your own image URLs.
                </p>
                <div className="flex gap-2 overflow-x-auto pt-1">
                  {formData.images.map((img, idx) => (
                    <div key={idx} className="w-20 h-14 rounded-lg overflow-hidden border border-slate-700 shrink-0">
                      <img src={img} alt="preview" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800 bg-slate-950/90 shrink-0">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="btn-secondary px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
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
              className="btn-primary px-5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1 cursor-pointer"
            >
              <span>Continue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="btn-primary px-6 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-lg shadow-emerald-500/30"
            >
              <Sparkles className="w-4 h-4" />
              <span>{loading ? 'Publishing...' : 'Publish Listing Now'}</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
