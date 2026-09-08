import React, { useState } from 'react';
import { Filter, SlidersHorizontal, RotateCcw, Flame, Users, Check, ArrowUpDown } from 'lucide-react';

export default function FilterBar({
  filters,
  onFilterChange,
  onResetFilters,
  totalCount,
}) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const gasTypes = ['All', 'Titas Line Gas', 'Cylinder (LPG)', 'Induction/Electric'];
  const tenantPolicies = [
    { label: 'All Tenants', value: 'All' },
    { label: 'Family Only', value: 'Family Only' },
    { label: 'Bachelor Friendly', value: 'Bachelor' },
    { label: 'Female Only', value: 'Bachelor (Female)' },
  ];

  return (
    <div className="glass-panel rounded-3xl p-6 sm:p-8 mb-10 border border-slate-800/90 shadow-xl">
      {/* Top Filter Row */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        
        {/* Results Counter & Search Input */}
        <div className="flex items-center gap-4 flex-1 min-w-[280px]">
          <span className="text-xs sm:text-sm font-bold px-3.5 py-2 rounded-xl bg-emerald-950/80 text-emerald-400 border border-emerald-500/30 shrink-0">
            {totalCount} Homes Available
          </span>

          <input
            type="text"
            placeholder="Filter by keyword, road, block, area..."
            value={filters.search || ''}
            onChange={(e) => onFilterChange('search', e.target.value)}
            className="w-full glass-input rounded-2xl px-4.5 py-3 text-sm placeholder:text-slate-500"
          />
        </div>

        {/* Quick Bedroom Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto py-1">
          <span className="text-xs font-bold text-slate-400 mr-1 hidden sm:inline">Bedrooms:</span>
          {['All', '1', '2', '3', '4'].map((bed) => (
            <button
              key={bed}
              onClick={() => onFilterChange('bedrooms', bed)}
              className={`text-xs sm:text-sm px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer ${
                (filters.bedrooms || 'All') === bed
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-slate-900 border border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              {bed === 'All' ? 'All Beds' : bed === '4' ? '4+ Bed' : `${bed} Bed`}
            </button>
          ))}
        </div>

        {/* Sort & Toggle More Filters */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-2xl px-4 py-2.5 text-xs sm:text-sm text-slate-300">
            <ArrowUpDown className="w-4 h-4 text-emerald-400" />
            <select
              value={filters.sort || 'newest'}
              onChange={(e) => onFilterChange('sort', e.target.value)}
              className="bg-transparent text-xs sm:text-sm font-bold text-slate-200 outline-none cursor-pointer"
            >
              <option value="newest" className="bg-slate-900">Newest First</option>
              <option value="price-asc" className="bg-slate-900">Price: Low to High</option>
              <option value="price-desc" className="bg-slate-900">Price: High to Low</option>
              <option value="rating" className="bg-slate-900">Top Rated</option>
              <option value="size-desc" className="bg-slate-900">Largest Area (Sq Ft)</option>
            </select>
          </div>

          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold border transition-all cursor-pointer ${
              showAdvanced
                ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300 shadow-md'
                : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4 text-emerald-400" />
            <span>{showAdvanced ? 'Hide Filters' : 'More Filters'}</span>
          </button>

          <button
            onClick={onResetFilters}
            className="p-2.5 rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
            title="Reset Filters"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Advanced Expandable Filters */}
      {showAdvanced && (
        <div className="mt-6 pt-6 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in text-sm">
          
          {/* Price Range */}
          <div>
            <label className="font-bold text-slate-200 block mb-2">
              Monthly Budget (BDT ৳)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                placeholder="Min ৳"
                value={filters.minRent || ''}
                onChange={(e) => onFilterChange('minRent', e.target.value)}
                className="w-full glass-input rounded-xl px-3.5 py-2.5 text-sm"
              />
              <span className="text-slate-500">-</span>
              <input
                type="number"
                placeholder="Max ৳"
                value={filters.maxRent || ''}
                onChange={(e) => onFilterChange('maxRent', e.target.value)}
                className="w-full glass-input rounded-xl px-3.5 py-2.5 text-sm"
              />
            </div>
          </div>

          {/* Gas Type */}
          <div>
            <label className="font-bold text-slate-200 block mb-2 flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-amber-400" />
              <span>Gas Connection Type</span>
            </label>
            <select
              value={filters.gasType || 'All'}
              onChange={(e) => onFilterChange('gasType', e.target.value)}
              className="w-full glass-input rounded-xl px-3.5 py-2.5 text-sm bg-slate-900 cursor-pointer"
            >
              {gasTypes.map((g) => (
                <option key={g} value={g}>
                  {g === 'All' ? 'All Gas Types' : g}
                </option>
              ))}
            </select>
          </div>

          {/* Tenant Policy */}
          <div>
            <label className="font-bold text-slate-200 block mb-2 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-sky-400" />
              <span>Tenant Eligibility</span>
            </label>
            <select
              value={filters.tenantPolicy || 'All'}
              onChange={(e) => onFilterChange('tenantPolicy', e.target.value)}
              className="w-full glass-input rounded-xl px-3.5 py-2.5 text-sm bg-slate-900 cursor-pointer"
            >
              {tenantPolicies.map((tp) => (
                <option key={tp.value} value={tp.value}>
                  {tp.label}
                </option>
              ))}
            </select>
          </div>

          {/* Key Amenities Checkboxes */}
          <div>
            <label className="font-bold text-slate-200 block mb-2">
              Essential Amenities
            </label>
            <div className="flex flex-wrap gap-3">
              <label className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white">
                <input
                  type="checkbox"
                  checked={filters.lift === 'true'}
                  onChange={(e) => onFilterChange('lift', e.target.checked ? 'true' : '')}
                  className="w-4 h-4 rounded border-slate-700 text-emerald-500 focus:ring-emerald-500 cursor-pointer"
                />
                <span>Lift / Elevator</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white">
                <input
                  type="checkbox"
                  checked={filters.generatorBackup === 'true'}
                  onChange={(e) => onFilterChange('generatorBackup', e.target.checked ? 'true' : '')}
                  className="w-4 h-4 rounded border-slate-700 text-emerald-500 focus:ring-emerald-500 cursor-pointer"
                />
                <span>Generator</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white">
                <input
                  type="checkbox"
                  checked={filters.carParking === 'true'}
                  onChange={(e) => onFilterChange('carParking', e.target.checked ? 'true' : '')}
                  className="w-4 h-4 rounded border-slate-700 text-emerald-500 focus:ring-emerald-500 cursor-pointer"
                />
                <span>Car Parking</span>
              </label>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
