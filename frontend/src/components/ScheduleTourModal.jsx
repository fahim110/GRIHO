import React, { useState } from 'react';
import { X, Calendar, Clock, User, Phone, Mail, CheckCircle2, Building } from 'lucide-react';
import { createInquiry } from '../api';

export default function ScheduleTourModal({ property, isOpen, onClose, onSuccess }) {
  if (!isOpen || !property) return null;

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    tenantType: 'Family',
    preferredVisitDate: '',
    preferredVisitTime: 'Afternoon (3:00 PM - 6:00 PM)',
    message: `Hi, I am interested in visiting "${property.title}" in ${property.area}. Please confirm a suitable time slot.`,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await createInquiry({
        propertyId: property._id,
        ...formData,
      });
      setLoading(false);
      setSubmitted(true);
      if (onSuccess) onSuccess();
    } catch (err) {
      setLoading(false);
      setError(err.message || 'Failed to submit visit request');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 animate-fade-in">
      <div
        className="relative w-full max-w-xl 2xl:max-w-2xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-8 sm:px-10 py-7 border-b border-slate-800 bg-slate-950/95">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white">Schedule Physical Visit</h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">Book in-person tour appointment with property owner</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-3 rounded-full bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 sm:p-10">
          {submitted ? (
            <div className="text-center py-10 space-y-5">
              <div className="w-20 h-20 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto animate-bounce shadow-xl shadow-emerald-500/30">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-black text-white">Visit Request Sent!</h3>
              <p className="text-base text-slate-300 max-w-md mx-auto leading-relaxed">
                The property owner <strong className="text-emerald-400">{property.contactName}</strong> will call/WhatsApp you at <strong className="text-white">{formData.phone}</strong> to confirm your appointment.
              </p>
              <button
                onClick={onClose}
                className="btn-primary w-full py-4 rounded-2xl text-base font-bold mt-4 cursor-pointer"
              >
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6 text-base">
              <div className="p-5 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-1">
                <div className="text-xs text-slate-400 uppercase tracking-wider font-bold">Visiting Property:</div>
                <div className="font-extrabold text-white text-lg line-clamp-1">{property.title}</div>
                <div className="text-xs sm:text-sm text-emerald-400 font-semibold">{property.area}, {property.city} • ৳{property.rent?.toLocaleString('en-IN')}/mo</div>
              </div>

              {error && (
                <div className="p-4 rounded-2xl bg-rose-950/90 border border-rose-500/50 text-rose-300 text-sm font-semibold">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <label className="font-bold text-slate-200 block text-sm">Your Full Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Shakib Al Hasan"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full glass-input rounded-2xl p-4 text-base placeholder:text-slate-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="font-bold text-slate-200 block text-sm">Phone Number *</label>
                  <input
                    type="tel"
                    placeholder="017XXXXXXXX"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full glass-input rounded-2xl p-4 text-base placeholder:text-slate-500"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="font-bold text-slate-200 block text-sm">Tenant Type</label>
                  <select
                    value={formData.tenantType}
                    onChange={(e) => setFormData({ ...formData, tenantType: e.target.value })}
                    className="w-full glass-input rounded-2xl p-4 text-base bg-slate-900 cursor-pointer"
                  >
                    <option value="Family">Family (পরিবার)</option>
                    <option value="Bachelor (Male)">Bachelor (Male)</option>
                    <option value="Bachelor (Female)">Bachelor (Female)</option>
                    <option value="Student">Student (ছাত্র)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="font-bold text-slate-200 block text-sm">Preferred Date</label>
                  <input
                    type="date"
                    value={formData.preferredVisitDate}
                    onChange={(e) => setFormData({ ...formData, preferredVisitDate: e.target.value })}
                    className="w-full glass-input rounded-2xl p-4 text-base bg-slate-900 text-slate-200"
                  />
                </div>

                <div className="space-y-2">
                  <label className="font-bold text-slate-200 block text-sm">Time Slot</label>
                  <select
                    value={formData.preferredVisitTime}
                    onChange={(e) => setFormData({ ...formData, preferredVisitTime: e.target.value })}
                    className="w-full glass-input rounded-2xl p-4 text-base bg-slate-900 cursor-pointer"
                  >
                    <option value="Morning (10:00 AM - 1:00 PM)">Morning (10AM - 1PM)</option>
                    <option value="Afternoon (3:00 PM - 6:00 PM)">Afternoon (3PM - 6PM)</option>
                    <option value="Evening (6:00 PM - 8:30 PM)">Evening (6PM - 8:30PM)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="font-bold text-slate-200 block text-sm">Message / Questions</label>
                <textarea
                  rows={2}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full glass-input rounded-2xl p-4 text-base placeholder:text-slate-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-5 rounded-2xl font-black text-base flex items-center justify-center gap-2.5 cursor-pointer shadow-xl shadow-emerald-500/30 mt-2"
              >
                <span>{loading ? 'Submitting...' : 'Confirm Physical Tour Appointment'}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
