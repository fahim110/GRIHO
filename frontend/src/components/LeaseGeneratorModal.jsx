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
            body { font-family: monospace; white-space: pre-wrap; padding: 40px; font-size: 15px; line-height: 1.7; color: #111; }
          </style>
        </head>
        <body>${agreementOutput}</body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 lg:p-10 animate-fade-in">
      <div
        className="relative w-full max-w-4xl lg:max-w-5xl 2xl:max-w-6xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-8 sm:px-12 py-7 border-b border-slate-800 bg-slate-950/95 shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0">
              <FileText className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                {lang === 'bn' ? 'বাংলাদেশ বাড়ি ও ফ্ল্যাট ভাড়া চুক্তিপত্র জেনারেটর' : 'Bangladesh Rental Lease Agreement Helper'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 font-medium">
                {lang === 'bn' ? 'প্রমিত আইনি ফরম্যাটে তৈরি করুন নির্ভরযোগ্য চুক্তিপত্র' : 'Generate standard legal tenancy agreements in Bengali'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-3 rounded-full bg-slate-800 text-slate-300 hover:text-white cursor-pointer">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-8 sm:p-12 space-y-8 text-base flex-1">
          {agreementOutput ? (
            <div className="space-y-6 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <span className="font-extrabold text-emerald-400 flex items-center gap-2 text-base sm:text-lg">
                  <CheckCircle2 className="w-6 h-6" />
                  <span>চুক্তিপত্র প্রস্তুত সম্পন্ন! (Draft Agreement Ready)</span>
                </span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleCopy}
                    className="btn-secondary px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 cursor-pointer"
                  >
                    <Copy className="w-4 h-4 text-emerald-400" />
                    <span>{copied ? 'Copied! ✓' : 'Copy Text'}</span>
                  </button>
                  <button
                    onClick={handlePrint}
                    className="btn-primary px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 cursor-pointer"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Print Agreement</span>
                  </button>
                  <button
                    onClick={() => setAgreementOutput(null)}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs sm:text-sm font-bold hover:text-white cursor-pointer"
                  >
                    Edit Details
                  </button>
                </div>
              </div>

              {/* Bangla Agreement Box */}
              <div className="p-8 sm:p-10 rounded-3xl bg-slate-950 border border-slate-800 font-mono text-sm sm:text-base text-slate-200 leading-relaxed whitespace-pre-wrap select-all max-h-[55vh] overflow-y-auto shadow-inner">
                {agreementOutput}
              </div>
            </div>
          ) : (
            <form onSubmit={handleGenerate} className="space-y-8">
              
              {/* Landlord Info */}
              <div className="space-y-4">
                <h3 className="font-extrabold text-white text-base sm:text-lg flex items-center gap-2">
                  <span className="w-7 h-7 rounded-xl bg-amber-500/20 text-amber-400 inline-flex items-center justify-center text-xs font-bold">1</span>
                  <span>১ম পক্ষ: বাড়িওয়ালা / মালিকের তথ্য (Landlord Details)</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div>
                    <label className="text-xs sm:text-sm text-slate-300 font-bold block mb-1">বাড়ির মালিকের নাম *</label>
                    <input
                      type="text"
                      placeholder="মালিকের পূর্ণ নাম"
                      value={formData.landlordName}
                      onChange={(e) => setFormData({ ...formData, landlordName: e.target.value })}
                      className="w-full glass-input rounded-2xl p-4 text-sm sm:text-base"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs sm:text-sm text-slate-300 font-bold block mb-1">জাতীয় পরিচয়পত্র (NID) নম্বর</label>
                    <input
                      type="text"
                      placeholder="মালিকের NID নম্বর"
                      value={formData.landlordNID}
                      onChange={(e) => setFormData({ ...formData, landlordNID: e.target.value })}
                      className="w-full glass-input rounded-2xl p-4 text-sm sm:text-base"
                    />
                  </div>
                  <div>
                    <label className="text-xs sm:text-sm text-slate-300 font-bold block mb-1">মোবাইল নম্বর *</label>
                    <input
                      type="tel"
                      placeholder="০১৭XXXXXXXX"
                      value={formData.landlordPhone}
                      onChange={(e) => setFormData({ ...formData, landlordPhone: e.target.value })}
                      className="w-full glass-input rounded-2xl p-4 text-sm sm:text-base"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Tenant Info */}
              <div className="space-y-4">
                <h3 className="font-extrabold text-white text-base sm:text-lg flex items-center gap-2">
                  <span className="w-7 h-7 rounded-xl bg-emerald-500/20 text-emerald-400 inline-flex items-center justify-center text-xs font-bold">2</span>
                  <span>২য় পক্ষ: ভাড়াটিয়ার তথ্য (Tenant Details)</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div>
                    <label className="text-xs sm:text-sm text-slate-300 font-bold block mb-1">ভাড়াটিয়ার নাম *</label>
                    <input
                      type="text"
                      placeholder="ভাড়াটিয়ার পূর্ণ নাম"
                      value={formData.tenantName}
                      onChange={(e) => setFormData({ ...formData, tenantName: e.target.value })}
                      className="w-full glass-input rounded-2xl p-4 text-sm sm:text-base"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs sm:text-sm text-slate-300 font-bold block mb-1">জাতীয় পরিচয়পত্র (NID) নম্বর</label>
                    <input
                      type="text"
                      placeholder="ভাড়াটিয়ার NID নম্বর"
                      value={formData.tenantNID}
                      onChange={(e) => setFormData({ ...formData, tenantNID: e.target.value })}
                      className="w-full glass-input rounded-2xl p-4 text-sm sm:text-base"
                    />
                  </div>
                  <div>
                    <label className="text-xs sm:text-sm text-slate-300 font-bold block mb-1">মোবাইল নম্বর *</label>
                    <input
                      type="tel"
                      placeholder="০১৮XXXXXXXX"
                      value={formData.tenantPhone}
                      onChange={(e) => setFormData({ ...formData, tenantPhone: e.target.value })}
                      className="w-full glass-input rounded-2xl p-4 text-sm sm:text-base"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Financial & Terms */}
              <div className="space-y-4">
                <h3 className="font-extrabold text-white text-base sm:text-lg flex items-center gap-2">
                  <span className="w-7 h-7 rounded-xl bg-sky-500/20 text-sky-400 inline-flex items-center justify-center text-xs font-bold">3</span>
                  <span>ভাড়া ও আর্থিক শর্তাবলী (Rent & Financial Terms)</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div>
                    <label className="text-xs sm:text-sm text-slate-300 font-bold block mb-1">মাসিক বাড়ি ভাড়া (৳ BDT) *</label>
                    <input
                      type="number"
                      placeholder="e.g. 25000"
                      value={formData.monthlyRent}
                      onChange={(e) => setFormData({ ...formData, monthlyRent: e.target.value })}
                      className="w-full glass-input rounded-2xl p-4 text-sm sm:text-base font-bold text-emerald-400"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs sm:text-sm text-slate-300 font-bold block mb-1">অগ্রিম জামানত / সিকিউরিটি (৳ BDT) *</label>
                    <input
                      type="number"
                      placeholder="e.g. 50000"
                      value={formData.advanceDeposit}
                      onChange={(e) => setFormData({ ...formData, advanceDeposit: e.target.value })}
                      className="w-full glass-input rounded-2xl p-4 text-sm sm:text-base font-bold"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs sm:text-sm text-slate-300 font-bold block mb-1">মাসিক সার্ভিস চার্জ (৳ BDT)</label>
                    <input
                      type="number"
                      placeholder="e.g. 3500"
                      value={formData.serviceCharge}
                      onChange={(e) => setFormData({ ...formData, serviceCharge: e.target.value })}
                      className="w-full glass-input rounded-2xl p-4 text-sm sm:text-base"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div>
                  <label className="text-xs sm:text-sm text-slate-300 font-bold block mb-1">ভাড়ার মেয়াদ (মাস)</label>
                  <input
                    type="number"
                    value={formData.leaseTermMonths}
                    onChange={(e) => setFormData({ ...formData, leaseTermMonths: Number(e.target.value) })}
                    className="w-full glass-input rounded-2xl p-4 text-sm sm:text-base"
                  />
                </div>
                <div>
                  <label className="text-xs sm:text-sm text-slate-300 font-bold block mb-1">চুক্তি শুরুর তারিখ</label>
                  <input
                    type="date"
                    value={formData.commencementDate}
                    onChange={(e) => setFormData({ ...formData, commencementDate: e.target.value })}
                    className="w-full glass-input rounded-2xl p-4 text-sm sm:text-base text-slate-200"
                  />
                </div>
                <div>
                  <label className="text-xs sm:text-sm text-slate-300 font-bold block mb-1">গ্যাস সরবরাহ</label>
                  <select
                    value={formData.gasType}
                    onChange={(e) => setFormData({ ...formData, gasType: e.target.value })}
                    className="w-full glass-input rounded-2xl p-4 text-sm sm:text-base bg-slate-900 cursor-pointer"
                  >
                    <option value="Titas Line Gas">তিতাস লাইন গ্যাস</option>
                    <option value="Cylinder (LPG)">সিলিন্ডার গ্যাস (LPG)</option>
                    <option value="Induction">ইন্ডাকশন / বিদ্যুৎ</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-5 rounded-2xl font-black text-base sm:text-lg flex items-center justify-center gap-3 cursor-pointer shadow-xl shadow-emerald-500/30"
              >
                <FileText className="w-5 h-5" />
                <span>{loading ? 'জেনারেট করা হচ্ছে...' : 'বাংলা চুক্তিপত্র তৈরি করুন (Generate Bangla Lease)'}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
