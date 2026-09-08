import React, { useState } from 'react';
import { X, FileText, Download, Printer, Copy, CheckCircle2, ShieldCheck } from 'lucide-react';
import { generateLeaseAgreement } from '../api';

export default function LeaseGeneratorModal({ isOpen, onClose, defaultProperty, lang = 'en' }) {
  if (!isOpen) return null;

  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState({
    landlordName: defaultProperty?.contactName || '',
    landlordNID: '',
    landlordPhone: defaultProperty?.contactPhone || '',
    tenantName: '',
    tenantNID: '',
    tenantPhone: '',
    propertyAddress: defaultProperty?.address || '',
    propertyArea: defaultProperty?.area || 'Dhanmondi, Dhaka',
    monthlyRent: defaultProperty?.rent || '',
    serviceCharge: defaultProperty?.serviceCharge || '',
    advanceDeposit: defaultProperty ? (defaultProperty.rent * (defaultProperty.advanceDepositMonths || 2)) : '',
    leaseTermMonths: 12,
    commencementDate: new Date().toISOString().split('T')[0],
    gasType: defaultProperty?.gasType || 'Titas Line Gas',
    electricityType: defaultProperty?.electricityType || 'Prepaid Meter',
  });

  const [agreementOutput, setAgreementOutput] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await generateLeaseAgreement(formData);
      if (res.success) {
        setAgreementOutput(res.data.agreementText);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!agreementOutput) return;
    navigator.clipboard.writeText(agreementOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>বাড়ি ও ফ্ল্যাট ভাড়া চুক্তিপত্র - GRIHO</title>
          <style>
            body { font-family: monospace; white-space: pre-wrap; padding: 30px; font-size: 14px; line-height: 1.6; }
          </style>
        </head>
        <body>${agreementOutput}</body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div
        className="relative w-full max-w-3xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/90 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                {lang === 'bn' ? 'বাংলাদেশ বাড়ি ও ফ্ল্যাট ভাড়া চুক্তিপত্র জেনারেটর' : 'Bangladesh Rental Lease Agreement Helper'}
              </h2>
              <p className="text-[11px] text-slate-400">
                {lang === 'bn' ? 'প্রমিত আইনি ফরম্যাটে তৈরি করুন নির্ভরযোগ্য চুক্তিপত্র' : 'Generate standard legal tenancy agreements in Bengali'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full bg-slate-800 text-slate-300 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-6 space-y-6 text-xs flex-1">
          {agreementOutput ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{lang === 'bn' ? 'চুক্তিপত্র সফলভাবে তৈরি হয়েছে' : 'Agreement Generated Successfully'}</span>
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopy}
                    className="btn-secondary px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copied ? 'Copied!' : 'Copy Text'}</span>
                  </button>
                  <button
                    onClick={handlePrint}
                    className="btn-primary px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>{lang === 'bn' ? 'প্রিন্ট / PDF করুন' : 'Print / Save PDF'}</span>
                  </button>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-slate-200 font-mono text-[11px] leading-relaxed whitespace-pre-wrap max-h-[50vh] overflow-y-auto">
                {agreementOutput}
              </div>

              <button
                onClick={() => setAgreementOutput(null)}
                className="btn-secondary w-full py-2 rounded-xl text-xs font-semibold"
              >
                {lang === 'bn' ? 'তথ্য পরিবর্তন করুন' : 'Edit Information'}
              </button>
            </div>
          ) : (
            <form onSubmit={handleGenerate} className="space-y-4">
              {/* Landlord Details */}
              <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-3">
                <div className="font-bold text-emerald-400 uppercase tracking-wider text-[11px]">
                  ১. প্রথম পক্ষ (মালিক / Landlord Details)
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="font-semibold text-slate-300 block mb-1">মালিকের নাম *</label>
                    <input
                      type="text"
                      placeholder="e.g. মোঃ শফিকুল ইসলাম"
                      value={formData.landlordName}
                      onChange={(e) => setFormData({ ...formData, landlordName: e.target.value })}
                      className="w-full glass-input rounded-xl p-2 text-xs"
                      required
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-300 block mb-1">মালিকের NID নম্বর</label>
                    <input
                      type="text"
                      placeholder="NID No."
                      value={formData.landlordNID}
                      onChange={(e) => setFormData({ ...formData, landlordNID: e.target.value })}
                      className="w-full glass-input rounded-xl p-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-300 block mb-1">মোবাইল নম্বর *</label>
                    <input
                      type="tel"
                      placeholder="017XXXXXXXX"
                      value={formData.landlordPhone}
                      onChange={(e) => setFormData({ ...formData, landlordPhone: e.target.value })}
                      className="w-full glass-input rounded-xl p-2 text-xs"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Tenant Details */}
              <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-3">
                <div className="font-bold text-sky-400 uppercase tracking-wider text-[11px]">
                  ২. দ্বিতীয় পক্ষ (ভাড়াটিয়া / Tenant Details)
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="font-semibold text-slate-300 block mb-1">ভাড়াটিয়ার নাম *</label>
                    <input
                      type="text"
                      placeholder="e.g. তানভীর আহমেদ"
                      value={formData.tenantName}
                      onChange={(e) => setFormData({ ...formData, tenantName: e.target.value })}
                      className="w-full glass-input rounded-xl p-2 text-xs"
                      required
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-300 block mb-1">ভাড়াটিয়ার NID নম্বর</label>
                    <input
                      type="text"
                      placeholder="NID No."
                      value={formData.tenantNID}
                      onChange={(e) => setFormData({ ...formData, tenantNID: e.target.value })}
                      className="w-full glass-input rounded-xl p-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-300 block mb-1">মোবাইল নম্বর *</label>
                    <input
                      type="tel"
                      placeholder="018XXXXXXXX"
                      value={formData.tenantPhone}
                      onChange={(e) => setFormData({ ...formData, tenantPhone: e.target.value })}
                      className="w-full glass-input rounded-xl p-2 text-xs"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Terms & Financials */}
              <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-3">
                <div className="font-bold text-amber-400 uppercase tracking-wider text-[11px]">
                  ৩. ফ্ল্যাটের বিবরণ ও আর্থিক শর্তাবলী
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-slate-300 block mb-1">ফ্ল্যাটের পূর্ণ ঠিকানা *</label>
                    <input
                      type="text"
                      placeholder="বাড়ি নং, রোড নং, এলাকা"
                      value={formData.propertyAddress}
                      onChange={(e) => setFormData({ ...formData, propertyAddress: e.target.value })}
                      className="w-full glass-input rounded-xl p-2 text-xs"
                      required
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-300 block mb-1">এলাকা</label>
                    <input
                      type="text"
                      value={formData.propertyArea}
                      onChange={(e) => setFormData({ ...formData, propertyArea: e.target.value })}
                      className="w-full glass-input rounded-xl p-2 text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="font-semibold text-slate-300 block mb-1">মাসিক ভাড়া (৳) *</label>
                    <input
                      type="number"
                      placeholder="35000"
                      value={formData.monthlyRent}
                      onChange={(e) => setFormData({ ...formData, monthlyRent: e.target.value })}
                      className="w-full glass-input rounded-xl p-2 text-xs font-bold"
                      required
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-300 block mb-1">সার্ভিস চার্জ (৳)</label>
                    <input
                      type="number"
                      placeholder="4000"
                      value={formData.serviceCharge}
                      onChange={(e) => setFormData({ ...formData, serviceCharge: e.target.value })}
                      className="w-full glass-input rounded-xl p-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-300 block mb-1">অগ্রিম জামানত (৳) *</label>
                    <input
                      type="number"
                      placeholder="70000"
                      value={formData.advanceDeposit}
                      onChange={(e) => setFormData({ ...formData, advanceDeposit: e.target.value })}
                      className="w-full glass-input rounded-xl p-2 text-xs"
                      required
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/30"
              >
                <FileText className="w-4 h-4" />
                <span>{loading ? 'জেনারেট হচ্ছে...' : 'ভাড়া চুক্তিপত্র প্রস্তুত করুন (Generate Agreement)'}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
