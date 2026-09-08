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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div
        className="relative w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/90">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-emerald-400" />
            <h2 className="text-base font-bold text-white">Schedule Physical Visit</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-800 text-slate-300 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {submitted ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto animate-bounce">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-white">Visit Request Sent!</h3>
              <p className="text-xs text-slate-300 max-w-xs mx-auto">
                The property manager <strong className="text-emerald-400">{property.contactName}</strong> will call/WhatsApp you at <strong className="text-white">{formData.phone}</strong> to confirm your visit time.
              </p>
              <button
                onClick={onClose}
                className="btn-primary w-full py-2.5 rounded-xl text-xs font-bold mt-4"
              >
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                <div className="text-[11px] text-slate-400">Visiting Property:</div>
                <div className="font-bold text-white line-clamp-1">{property.title}</div>
                <div className="text-[11px] text-emerald-400 font-semibold">{property.area}, {property.city}</div>
              </div>

              {error && (
                <div className="p-2.5 rounded-xl bg-rose-950/80 border border-rose-500/50 text-rose-300 text-xs">
                  {error}
                </div>
              )}

              <div>
                <label className="font-semibold text-slate-300 block mb-1">Your Full Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Shakib Al Hasan"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full glass-input rounded-xl p-2.5 text-xs"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    placeholder="017XXXXXXXX"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full glass-input rounded-xl p-2.5 text-xs"
                    required
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Tenant Type</label>
                  <select
                    value={formData.tenantType}
                    onChange={(e) => setFormData({ ...formData, tenantType: e.target.value })}
                    className="w-full glass-input rounded-xl p-2.5 text-xs bg-slate-900"
                  >
                    <option value="Family">Family</option>
                    <option value="Bachelor (Male)">Bachelor (Male)</option>
                    <option value="Bachelor (Female)">Bachelor (Female)</option>
                    <option value="Student">Student</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Preferred Date</label>
                  <input
                    type="date"
                    value={formData.preferredVisitDate}
                    onChange={(e) => setFormData({ ...formData, preferredVisitDate: e.target.value })}
                    className="w-full glass-input rounded-xl p-2 text-xs bg-slate-900 text-slate-200"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Time Slot</label>
                  <select
                    value={formData.preferredVisitTime}
                    onChange={(e) => setFormData({ ...formData, preferredVisitTime: e.target.value })}
                    className="w-full glass-input rounded-xl p-2 text-xs bg-slate-900"
                  >
                    <option value="Morning (10:00 AM - 1:00 PM)">Morning (10AM - 1PM)</option>
                    <option value="Afternoon (3:00 PM - 6:00 PM)">Afternoon (3PM - 6PM)</option>
                    <option value="Evening (6:00 PM - 8:30 PM)">Evening (6PM - 8:30PM)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">Message / Questions</label>
                <textarea
                  rows={2}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full glass-input rounded-xl p-2 text-xs"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/25"
              >
                <span>{loading ? 'Submitting...' : 'Confirm Visit Appointment'}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
