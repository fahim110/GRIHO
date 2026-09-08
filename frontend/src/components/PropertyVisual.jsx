import React from 'react';
import {
  Building2,
  Home,
  Layers,
  Flame,
  ShieldCheck,
  Sparkles,
  MapPin,
  Compass,
  Zap,
} from 'lucide-react';

export default function PropertyVisual({
  property,
  aspect = 'aspect-[16/10]',
  showBadges = true,
  interactive = false,
  className = '',
}) {
  if (!property) return null;

  // Derive unique luxury aesthetic based on property type or area
  const getTheme = (type = '', area = '') => {
    if (type.includes('Duplex') || type.includes('Penthouse')) {
      return {
        bg: 'from-amber-950/90 via-slate-900 to-slate-950',
        accent: 'text-amber-400',
        border: 'border-amber-500/30',
        iconBg: 'bg-amber-500/20 text-amber-300',
        badge: 'badge-amber',
        label: 'LUXURY RESIDENCE',
      };
    }
    if (type.includes('Bachelor') || type.includes('Sublet') || type.includes('Room')) {
      return {
        bg: 'from-sky-950/90 via-slate-900 to-slate-950',
        accent: 'text-sky-400',
        border: 'border-sky-500/30',
        iconBg: 'bg-sky-500/20 text-sky-300',
        badge: 'badge-sky',
        label: 'STUDENT / BACHELOR',
      };
    }
    if (type.includes('Studio')) {
      return {
        bg: 'from-indigo-950/90 via-slate-900 to-slate-950',
        accent: 'text-indigo-400',
        border: 'border-indigo-500/30',
        iconBg: 'bg-indigo-500/20 text-indigo-300',
        badge: 'badge-indigo',
        label: 'COMPACT STUDIO',
      };
    }
    return {
      bg: 'from-emerald-950/90 via-slate-900 to-slate-950',
      accent: 'text-emerald-400',
      border: 'border-emerald-500/30',
      iconBg: 'bg-emerald-500/20 text-emerald-300',
      badge: 'badge-emerald',
      label: 'FAMILY RESIDENCE',
    };
  };

  const theme = getTheme(property.propertyType, property.area);

  return (
    <div
      className={`relative ${aspect} w-full overflow-hidden bg-gradient-to-br ${theme.bg} flex flex-col justify-between p-4 select-none ${className}`}
    >
      {/* Blueprint Grid Lines (Pure CSS/SVG) */}
      <svg
        className="absolute inset-0 w-full h-full opacity-15 pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id={`grid-${property._id || 'prop'}`} width="28" height="28" patternUnits="userSpaceOnUse">
            <path d="M 28 0 L 0 0 0 28" fill="none" stroke="currentColor" strokeWidth="0.75" className="text-slate-300" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#grid-${property._id || 'prop'})`} />
        {/* Isometric architectural silhouette */}
        <circle cx="85%" cy="30%" r="60" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-emerald-400/40" />
        <line x1="0" y1="80%" x2="100%" y2="80%" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" className="text-slate-600" />
      </svg>

      {/* Ambient Radial Glow */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-sky-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Top Header: Category Label & Feature Badges */}
      <div className="relative z-10 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg bg-slate-950/80 text-slate-300 border border-slate-700/80 backdrop-blur-md flex items-center gap-1.5 shadow-sm">
            <Layers className="w-3 h-3 text-emerald-400" />
            <span>{property.propertyType || 'Apartment'}</span>
          </span>

          {property.featured && (
            <span className="badge-amber text-[10px] font-bold px-2 py-0.5 rounded-lg flex items-center gap-1 shadow-sm">
              <Sparkles className="w-3 h-3" />
              <span>Featured</span>
            </span>
          )}
        </div>

        {property.verified && (
          <span className="badge-emerald text-[10px] font-bold px-2 py-0.5 rounded-lg flex items-center gap-1 shadow-sm">
            <ShieldCheck className="w-3 h-3" />
            <span>Verified</span>
          </span>
        )}
      </div>

      {/* Centerpiece: Architectural Emblem & Area Banner */}
      <div className="relative z-10 my-auto flex flex-col items-center justify-center text-center py-2">
        <div className={`w-14 h-14 rounded-2xl ${theme.iconBg} border ${theme.border} flex items-center justify-center mb-2 shadow-xl backdrop-blur-md transform group-hover:scale-110 transition-transform duration-300`}>
          {property.propertyType?.includes('Duplex') ? (
            <Home className="w-7 h-7 text-amber-300" />
          ) : property.propertyType?.includes('Sublet') || property.propertyType?.includes('Room') ? (
            <Layers className="w-7 h-7 text-sky-300" />
          ) : (
            <Building2 className="w-7 h-7 text-emerald-300" />
          )}
        </div>

        <div className="flex items-center gap-1.5 text-white font-extrabold text-sm tracking-tight drop-shadow-md">
          <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>{property.area}, {property.city}</span>
        </div>

        <div className="text-[11px] text-slate-400 font-medium mt-0.5">
          {property.floor || '3rd Floor'} • {property.facing ? `${property.facing}-Facing` : 'South-Facing'}
        </div>
      </div>

      {/* Bottom Footer Info Strip */}
      <div className="relative z-10 flex items-center justify-between gap-2 pt-2 border-t border-slate-800/80 text-[11px]">
        <div className="flex items-center gap-1 text-slate-300 font-semibold">
          <span className="text-emerald-400 font-bold">{property.bedrooms || 2} Beds</span>
          <span className="text-slate-600">•</span>
          <span>{property.bathrooms || 2} Baths</span>
          <span className="text-slate-600">•</span>
          <span>{property.sizeSqFt || 1200} sqft</span>
        </div>

        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-900/90 text-amber-300 border border-amber-500/30 flex items-center gap-1">
          <Flame className="w-3 h-3 text-amber-400" />
          <span>{property.gasType?.includes('Titas') ? 'Line Gas' : property.gasType || 'LPG'}</span>
        </span>
      </div>
    </div>
  );
}
