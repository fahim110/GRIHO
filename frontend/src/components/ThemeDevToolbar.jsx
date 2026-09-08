import React, { useState } from 'react';
import {
  Palette,
  Sliders,
  Code2,
  RotateCcw,
  Check,
  X,
  Sparkles,
  Copy,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function ThemeDevToolbar() {
  const {
    activeThemeId,
    currentPreset,
    activeColors,
    presets,
    selectPreset,
    updateCustomColor,
    resetToDefault,
    generateCssExport,
  } = useTheme();

  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('presets'); // 'presets' | 'tuner' | 'export'
  const [copied, setCopied] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(generateCssExport());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Convert Hue slider (0 - 360) to primary/secondary colors
  const handleHueChange = (hue) => {
    const primary = `hsl(${hue}, 80%, 48%)`;
    const primaryLight = `hsl(${hue}, 80%, 65%)`;
    const primaryHover = `hsl(${hue}, 85%, 40%)`;
    const secondary = `hsl(${(Number(hue) + 30) % 360}, 85%, 52%)`;

    updateCustomColor('primary', primary);
    updateCustomColor('primaryLight', primaryLight);
    updateCustomColor('primaryHover', primaryHover);
    updateCustomColor('secondary', secondary);
  };

  return (
    <aside aria-label="Development Theme Controls" className="fixed bottom-6 right-6 z-50 font-sans">
      
      {/* ========================================================= */}
      {/* 1. COLLAPSED FLOATING PILL BUTTON */}
      {/* ========================================================= */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group flex items-center gap-3.5 px-5 py-3.5 rounded-full bg-slate-900/95 border border-slate-700/80 shadow-2xl shadow-black/80 hover:border-emerald-400/80 hover:scale-105 active:scale-95 transition-all cursor-pointer backdrop-blur-xl"
          title="Open Theme Studio Dev Tab"
        >
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-base shadow-md shrink-0"
            style={{ background: activeColors.primary }}
          >
            <span>{currentPreset.icon}</span>
          </div>
          <div className="text-left">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-white">Theme Dev</span>
              <span className="w-2.5 h-2.5 rounded-full animate-ping" style={{ background: activeColors.primary }} />
            </div>
            <div className="text-xs text-slate-300 font-medium leading-none mt-1">
              {currentPreset.name}
            </div>
          </div>
          <Palette className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors ml-1" />
        </button>
      )}

      {/* ========================================================= */}
      {/* 2. EXPANDED THEME STUDIO DEV PANEL */}
      {/* ========================================================= */}
      {isOpen && (
        <div
          className="w-[390px] sm:w-[450px] max-w-[94vw] max-h-[88vh] flex flex-col bg-slate-900/95 border border-slate-700/90 rounded-[28px] shadow-2xl shadow-black/90 backdrop-blur-2xl overflow-hidden animate-fade-in text-slate-100"
          style={{ boxShadow: '0 25px 60px -15px rgba(0,0,0,0.9), 0 0 35px -5px rgba(16,185,129,0.2)' }}
        >
          
          {/* Header with Generous Padding */}
          <div
            className="border-b border-slate-800 bg-slate-950/95 flex items-center justify-between"
            style={{ padding: '20px 24px' }}
          >
            <div className="flex items-center gap-3.5">
              <div
                className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl shadow-lg border border-white/10 shrink-0"
                style={{ background: activeColors.primary }}
              >
                <span>{currentPreset.icon}</span>
              </div>
              <div>
                <div className="flex items-center gap-2.5">
                  <h3 className="text-base sm:text-lg font-black text-white leading-tight">Theme Studio</h3>
                  <span className="text-[11px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    Dev Tab
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">Live color switcher & design adjuster</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={resetToDefault}
                className="p-2.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
                title="Reset to Default Theme"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
                title="Minimize Dev Tab"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Tab Navigation with Proper Margin & Padding */}
          <div
            className="border-b border-slate-800/80 bg-slate-950/60"
            style={{ padding: '12px 20px' }}
          >
            <div className="grid grid-cols-3 gap-2 text-xs font-bold">
              <button
                onClick={() => setActiveTab('presets')}
                className={`py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  activeTab === 'presets'
                    ? 'bg-slate-800 text-white shadow-sm border border-slate-600'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                <Palette className="w-3.5 h-3.5" />
                <span>Presets ({presets.length})</span>
              </button>
              <button
                onClick={() => setActiveTab('tuner')}
                className={`py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  activeTab === 'tuner'
                    ? 'bg-slate-800 text-white shadow-sm border border-slate-600'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Adjust</span>
              </button>
              <button
                onClick={() => setActiveTab('export')}
                className={`py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  activeTab === 'export'
                    ? 'bg-slate-800 text-white shadow-sm border border-slate-600'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>CSS</span>
              </button>
            </div>
          </div>

          {/* Panel Content (Scrollable with 24px horizontal padding so boxes NEVER touch borders) */}
          <div
            className="overflow-y-auto max-h-[52vh]"
            style={{ padding: '20px 24px' }}
          >
            
            {/* ========================================================= */}
            {/* TAB 1: PRESETS */}
            {/* ========================================================= */}
            {activeTab === 'presets' && (
              <div className="space-y-3">
                <div
                  className="text-xs font-black text-slate-300 uppercase tracking-wider"
                  style={{ marginBottom: '14px', letterSpacing: '0.06em' }}
                >
                  Select a Curated Color Theme:
                </div>
                {presets.map((preset) => {
                  const isSelected = activeThemeId === preset.id;
                  return (
                    <button
                      key={preset.id}
                      onClick={() => selectPreset(preset.id)}
                      className={`w-full rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-slate-800/95 border-slate-500 shadow-xl scale-[1.01]'
                          : 'bg-slate-950/70 border-slate-800/90 hover:bg-slate-800/60 hover:border-slate-700'
                      }`}
                      style={{ padding: '14px 18px', marginBottom: '10px' }}
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        {/* Swatches Icon */}
                        <div
                          className="w-11 h-11 rounded-xl flex items-center justify-center text-lg shadow-md shrink-0 border border-white/10"
                          style={{ background: preset.colors.primary }}
                        >
                          <span>{preset.icon}</span>
                        </div>
                        <div className="min-w-0 pr-2">
                          <div className="flex items-center gap-2">
                            <span className="font-black text-sm text-white truncate">{preset.name}</span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white/10 text-slate-300 shrink-0">
                              {preset.badge}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 leading-snug mt-1 truncate">
                            {preset.subtitle}
                          </p>
                        </div>
                      </div>

                      {/* Color dots preview with comfortable margin */}
                      <div className="flex items-center gap-2 pl-3 shrink-0">
                        <span className="w-3.5 h-3.5 rounded-full border border-white/20 shadow-sm" style={{ background: preset.colors.primary }} />
                        <span className="w-3.5 h-3.5 rounded-full border border-white/20 shadow-sm" style={{ background: preset.colors.secondary }} />
                        <span className="w-3.5 h-3.5 rounded-full border border-white/20 shadow-sm" style={{ background: preset.colors.bgMain }} />
                        {isSelected && <Check className="w-4 h-4 text-emerald-400 ml-1.5 shrink-0" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {/* ========================================================= */}
            {/* TAB 2: LIVE COLOR TUNER / ADJUSTER */}
            {/* ========================================================= */}
            {activeTab === 'tuner' && (
              <div className="space-y-4">
                {/* 1. Quick Rainbow Hue Slider */}
                <div
                  className="rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2.5"
                  style={{ padding: '16px 18px' }}
                >
                  <div className="flex items-center justify-between text-xs font-black">
                    <span className="text-slate-200">🌈 Quick Hue Shift (0° - 360°)</span>
                    <span className="text-emerald-400 font-bold">Morph Palette</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="360"
                    defaultValue="160"
                    onChange={(e) => handleHueChange(e.target.value)}
                    className="w-full h-3.5 rounded-lg appearance-none cursor-pointer mt-1"
                    style={{
                      background: 'linear-gradient(to right, #ff0000, #ff8800, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)',
                    }}
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Slide right or left to morph all site buttons, badges, and glow orbs instantly!
                  </p>
                </div>

                {/* 2. Primary Color Picker */}
                <div
                  className="flex items-center justify-between rounded-2xl bg-slate-950/80 border border-slate-800"
                  style={{ padding: '16px 18px' }}
                >
                  <div>
                    <span className="text-xs font-black block text-slate-200">Primary Brand Accent</span>
                    <span className="text-[11px] text-slate-400 mt-0.5 block">Buttons, Active Tabs, Highlights</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="text-xs font-mono text-slate-300 font-bold uppercase">{activeColors.primary}</span>
                    <input
                      type="color"
                      value={activeColors.primary.startsWith('#') ? activeColors.primary : '#10b981'}
                      onChange={(e) => updateCustomColor('primary', e.target.value)}
                      className="w-9 h-9 rounded-xl border border-white/20 cursor-pointer bg-transparent"
                    />
                  </div>
                </div>

                {/* 3. Secondary Color Picker */}
                <div
                  className="flex items-center justify-between rounded-2xl bg-slate-950/80 border border-slate-800"
                  style={{ padding: '16px 18px' }}
                >
                  <div>
                    <span className="text-xs font-black block text-slate-200">Secondary Accent</span>
                    <span className="text-[11px] text-slate-400 mt-0.5 block">Glow trails, sub-highlights</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="text-xs font-mono text-slate-300 font-bold uppercase">{activeColors.secondary}</span>
                    <input
                      type="color"
                      value={activeColors.secondary.startsWith('#') ? activeColors.secondary : '#14b8a6'}
                      onChange={(e) => updateCustomColor('secondary', e.target.value)}
                      className="w-9 h-9 rounded-xl border border-white/20 cursor-pointer bg-transparent"
                    />
                  </div>
                </div>

                {/* 4. Canvas Background Options */}
                <div
                  className="rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2.5"
                  style={{ padding: '16px 18px' }}
                >
                  <span className="text-xs font-black block text-slate-200">Canvas Background Tone</span>
                  <div className="grid grid-cols-4 gap-2 pt-1">
                    {[
                      { name: 'Deep Slate', bg: '#070b14', card: 'rgba(15, 23, 42, 0.94)' },
                      { name: 'Espresso', bg: '#0e0a0d', card: 'rgba(28, 18, 24, 0.94)' },
                      { name: 'Midnight', bg: '#050a16', card: 'rgba(12, 22, 45, 0.94)' },
                      { name: 'Pure Onyx', bg: '#020408', card: 'rgba(10, 12, 18, 0.96)' },
                    ].map((shade) => (
                      <button
                        key={shade.name}
                        onClick={() => {
                          updateCustomColor('bgMain', shade.bg);
                          updateCustomColor('bgCard', shade.card);
                        }}
                        className="p-2.5 rounded-xl border border-slate-700 flex flex-col items-center gap-1.5 hover:border-white transition-all cursor-pointer"
                        style={{ background: shade.bg }}
                      >
                        <span className="w-3.5 h-3.5 rounded-full border border-white/30" style={{ background: shade.card }} />
                        <span className="text-[10px] text-slate-300 font-bold leading-none">{shade.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================= */}
            {/* TAB 3: EXPORT CSS */}
            {/* ========================================================= */}
            {activeTab === 'export' && (
              <div className="space-y-3.5">
                <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                  <span>Active CSS Variables</span>
                  <button
                    onClick={handleCopyCode}
                    className="flex items-center gap-2 text-xs text-emerald-400 hover:text-emerald-300 transition-colors font-bold cursor-pointer bg-emerald-950/60 px-3 py-1.5 rounded-xl border border-emerald-500/40"
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied!' : 'Copy Snippet'}</span>
                  </button>
                </div>
                <pre
                  className="rounded-2xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-emerald-300 overflow-x-auto leading-relaxed"
                  style={{ padding: '16px 18px' }}
                >
                  {generateCssExport()}
                </pre>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  You can copy these variables to lock in this color scheme permanently if you prefer it as the default.
                </p>
              </div>
            )}

          </div>

          {/* Footer Bar with Guaranteed Safe Margins & No Text Cropping */}
          <div
            className="border-t border-slate-800 bg-slate-950/95 flex items-center justify-between"
            style={{ padding: '16px 24px' }}
          >
            <div className="flex items-center gap-2.5 min-w-0 pr-3">
              <span
                className="w-3 h-3 rounded-full shrink-0 shadow-sm"
                style={{ background: activeColors.primary }}
              />
              <span className="text-xs text-slate-400 font-medium shrink-0">Active:</span>
              <span className="text-xs font-black text-white truncate">{currentPreset.name}</span>
            </div>
            <button
              onClick={resetToDefault}
              className="text-xs font-bold text-slate-300 hover:text-rose-400 underline underline-offset-4 transition-colors cursor-pointer shrink-0 pl-2"
            >
              Reset to Default
            </button>
          </div>

        </div>
      )}

    </aside>
  );
}
