import React, { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import HeroSearch from './components/HeroSearch';
import StatsBar from './components/StatsBar';
import PopularNeighborhoods from './components/PopularNeighborhoods';
import FilterBar from './components/FilterBar';
import PropertyCard from './components/PropertyCard';
import PropertyDetailModal from './components/PropertyDetailModal';
import PostPropertyModal from './components/PostPropertyModal';
import ScheduleTourModal from './components/ScheduleTourModal';
import SavedFavoritesModal from './components/SavedFavoritesModal';
import CompareModal from './components/CompareModal';
import AffordabilityCalculatorModal from './components/AffordabilityCalculatorModal';
import LeaseGeneratorModal from './components/LeaseGeneratorModal';
import RoommatesSection from './components/RoommatesSection';
import AuthModal from './components/AuthModal';
import UserProfileModal from './components/UserProfileModal';
import Footer from './components/Footer';
import { fetchProperties, fetchStatsOverview, toggleSavePropertyApi } from './api';
import { useAuth } from './context/AuthContext';
import { translations } from './translations';
import { Sparkles, Building, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';

export default function App() {
  const [lang, setLang] = useState('en'); // 'en' | 'bn'
  const t = translations[lang] || translations.en;
  const { user, token, isLoggedIn } = useAuth();

  const [properties, setProperties] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters state
  const [selectedCity, setSelectedCity] = useState('All');
  const [filters, setFilters] = useState({
    search: '',
    city: 'All',
    area: '',
    propertyType: 'All',
    minRent: '',
    maxRent: '',
    bedrooms: 'All',
    bathrooms: 'All',
    gasType: 'All',
    tenantPolicy: 'All',
    lift: '',
    generatorBackup: '',
    carParking: '',
    sort: 'newest',
  });

  // Saved / Bookmarks (persisted to localStorage)
  const [savedIds, setSavedIds] = useState(() => {
    try {
      const stored = localStorage.getItem('griho_saved_flats');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Compared Properties (up to 3)
  const [comparedProperties, setComparedProperties] = useState([]);

  // Modals state
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [tourProperty, setTourProperty] = useState(null);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [isSavedModalOpen, setIsSavedModalOpen] = useState(false);
  const [isTourModalOpen, setIsTourModalOpen] = useState(false);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [isLeaseModalOpen, setIsLeaseModalOpen] = useState(false);
  const [leaseTargetProperty, setLeaseTargetProperty] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Toast feedback state
  const [toast, setToast] = useState(null);

  const exploreRef = useRef(null);
  const roommatesRef = useRef(null);

  useEffect(() => {
    try {
      localStorage.setItem('griho_saved_flats', JSON.stringify(savedIds));
    } catch (e) {
      console.error(e);
    }
  }, [savedIds]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Load Properties
  const loadProperties = async (activeFilters = filters) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchProperties(activeFilters);
      if (res.success) {
        setProperties(res.data);
      }
    } catch (err) {
      setError(err.message || 'Could not connect to server.');
    } finally {
      setLoading(false);
    }
  };

  // Load Stats
  const loadStats = async () => {
    try {
      const res = await fetchStatsOverview();
      if (res.success) {
        setStats(res.stats);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadProperties(filters);
    loadStats();
  }, [filters]);

  const handleCityChange = (city) => {
    setSelectedCity(city);
    const updated = { ...filters, city: city === 'All' ? 'All' : city };
    setFilters(updated);
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleQuickSelect = (customFilter) => {
    setFilters((prev) => ({ ...prev, ...customFilter }));
    if (exploreRef.current) {
      exploreRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectArea = (areaName) => {
    setFilters((prev) => ({ ...prev, area: areaName }));
    if (exploreRef.current) {
      exploreRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleResetFilters = () => {
    const reset = {
      search: '',
      city: selectedCity === 'All' ? 'All' : selectedCity,
      area: '',
      propertyType: 'All',
      minRent: '',
      maxRent: '',
      bedrooms: 'All',
      bathrooms: 'All',
      gasType: 'All',
      tenantPolicy: 'All',
      lift: '',
      generatorBackup: '',
      carParking: '',
      sort: 'newest',
    };
    setFilters(reset);
    showToast('Filters reset to default');
  };

  const handleToggleSave = async (propertyId) => {
    if (savedIds.includes(propertyId)) {
      setSavedIds(savedIds.filter((id) => id !== propertyId));
      showToast('Removed from saved homes', 'info');
    } else {
      setSavedIds([...savedIds, propertyId]);
      showToast('Saved to your favorites! ❤️');
    }

    if (token) {
      try {
        await toggleSavePropertyApi(propertyId, token);
      } catch (e) {
        console.error('Failed to sync save with backend:', e);
      }
    }
  };

  const handleToggleCompare = (property) => {
    const exists = comparedProperties.find((p) => p._id === property._id);
    if (exists) {
      setComparedProperties(comparedProperties.filter((p) => p._id !== property._id));
      showToast('Removed from comparison', 'info');
    } else {
      if (comparedProperties.length >= 3) {
        showToast('You can compare up to 3 properties at a time', 'info');
        setIsCompareModalOpen(true);
        return;
      }
      setComparedProperties([...comparedProperties, property]);
      showToast(`Added "${property.title.slice(0, 24)}..." to comparison! ⚖️`);
    }
  };

  const handlePropertyCreated = (newProperty) => {
    setProperties([newProperty, ...properties]);
    showToast('🎉 Your rental listing has been published successfully!');
    loadStats();
  };

  const handleApplyAffordableBudget = (maxBudget) => {
    setFilters((prev) => ({ ...prev, maxRent: maxBudget }));
    if (exploreRef.current) {
      exploreRef.current.scrollIntoView({ behavior: 'smooth' });
    }
    showToast(`Showing homes within your budget: ৳${maxBudget.toLocaleString('en-IN')}`);
  };

  const handleOpenPostModal = () => {
    if (!isLoggedIn) {
      showToast('Please sign in or create an account to post a property listing', 'info');
      setIsAuthModalOpen(true);
      return;
    }
    setIsPostModalOpen(true);
  };

  const savedProperties = properties.filter((p) => savedIds.includes(p._id));

  return (
    <div className="min-h-screen flex flex-col justify-between">
      {/* Toast Notification Banner */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-fade-in">
          <div
            className={`px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs font-bold border backdrop-blur-xl ${
              toast.type === 'success'
                ? 'bg-emerald-950/90 text-emerald-300 border-emerald-500/50'
                : 'bg-slate-900/95 text-slate-200 border-slate-700'
            }`}
          >
            {toast.type === 'success' ? (
              <CheckCircle className="w-4 h-4 text-emerald-400" />
            ) : (
              <AlertCircle className="w-4 h-4 text-sky-400" />
            )}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Main Navbar */}
      <Navbar
        selectedCity={selectedCity}
        onCityChange={handleCityChange}
        savedCount={savedIds.length}
        onOpenSaved={() => setIsSavedModalOpen(true)}
        onOpenPostModal={handleOpenPostModal}
        onScrollToExplore={() => exploreRef.current?.scrollIntoView({ behavior: 'smooth' })}
        onOpenCalculator={() => setIsCalculatorOpen(true)}
        onOpenLease={() => {
          setLeaseTargetProperty(null);
          setIsLeaseModalOpen(true);
        }}
        onScrollToRoommates={() => roommatesRef.current?.scrollIntoView({ behavior: 'smooth' })}
        compareCount={comparedProperties.length}
        onOpenCompare={() => setIsCompareModalOpen(true)}
        lang={lang}
        onToggleLang={() => setLang(lang === 'en' ? 'bn' : 'en')}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenProfile={() => setIsProfileModalOpen(true)}
      />

      <main className="flex-1">
        {/* Hero Search Section */}
        <HeroSearch
          filters={filters}
          onFilterChange={handleFilterChange}
          onSearchSubmit={() => {
            if (exploreRef.current) exploreRef.current.scrollIntoView({ behavior: 'smooth' });
          }}
          onQuickSelect={handleQuickSelect}
          onOpenCalculator={() => setIsCalculatorOpen(true)}
          onOpenLease={() => {
            setLeaseTargetProperty(null);
            setIsLeaseModalOpen(true);
          }}
          lang={lang}
        />

        {/* Stats & Trust Bar */}
        <StatsBar stats={stats} />

        {/* Popular Neighborhoods */}
        <PopularNeighborhoods onSelectArea={handleSelectArea} />

        {/* Explore & Listings Section */}
        <section ref={exploreRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20 scroll-mt-24">
          
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1">
                <Sparkles className="w-4 h-4" />
                <span>{t.verifiedListings}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {filters.area
                  ? `${t.flatsIn} ${filters.area}`
                  : selectedCity !== 'All'
                  ? `${t.flatsIn} ${selectedCity}`
                  : t.allAvailableHomes}
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-2 sm:mt-0">
              Showing direct verified listings with verified landlords
            </p>
          </div>

          {/* Interactive Filter Bar */}
          <FilterBar
            filters={filters}
            onFilterChange={handleFilterChange}
            onResetFilters={handleResetFilters}
            totalCount={properties.length}
          />

          {/* Listings Grid */}
          {loading ? (
            <div className="py-24 text-center space-y-4">
              <RefreshCw className="w-10 h-10 text-emerald-400 animate-spin mx-auto" />
              <div className="text-sm font-semibold text-slate-300">
                Fetching verified rental homes from MongoDB Atlas...
              </div>
            </div>
          ) : error ? (
            <div className="glass-panel p-8 rounded-3xl text-center space-y-4 border-rose-500/30">
              <AlertCircle className="w-10 h-10 text-rose-400 mx-auto" />
              <h3 className="text-base font-bold text-white">Could not load properties</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">{error}</p>
              <button
                onClick={() => loadProperties(filters)}
                className="btn-primary py-2 px-5 rounded-xl text-xs font-semibold"
              >
                Retry Loading
              </button>
            </div>
          ) : properties.length === 0 ? (
            <div className="glass-panel p-12 rounded-3xl text-center space-y-4 border-slate-800">
              <Building className="w-12 h-12 text-slate-600 mx-auto" />
              <h3 className="text-lg font-bold text-white">No Properties Found</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                We couldn't find any flats matching your exact search filters. Try clearing some filters or searching for another area.
              </p>
              <button
                onClick={handleResetFilters}
                className="btn-primary py-2 px-5 rounded-xl text-xs font-semibold"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((property) => (
                <PropertyCard
                  key={property._id}
                  property={property}
                  isSaved={savedIds.includes(property._id)}
                  onToggleSave={handleToggleSave}
                  onOpenDetails={(p) => setSelectedProperty(p)}
                  onOpenTour={(p) => {
                    setTourProperty(p);
                    setIsTourModalOpen(true);
                  }}
                />
              ))}
            </div>
          )}

        </section>

        {/* Roommates & Sublet Finder Section */}
        <div ref={roommatesRef} className="scroll-mt-24">
          <RoommatesSection lang={lang} onSelectArea={handleSelectArea} />
        </div>

      </main>

      {/* Property Detail Modal */}
      {selectedProperty && (
        <PropertyDetailModal
          property={selectedProperty}
          onClose={() => setSelectedProperty(null)}
          isSaved={savedIds.includes(selectedProperty._id)}
          onToggleSave={handleToggleSave}
          onOpenTour={(p) => {
            setTourProperty(p);
            setIsTourModalOpen(true);
          }}
          onAddToCompare={handleToggleCompare}
          isCompared={comparedProperties.some((p) => p._id === selectedProperty._id)}
          onOpenLease={(p) => {
            setLeaseTargetProperty(p);
            setIsLeaseModalOpen(true);
          }}
          lang={lang}
        />
      )}

      {/* Landlord Post Property Modal */}
      <PostPropertyModal
        isOpen={isPostModalOpen}
        onClose={() => setIsPostModalOpen(false)}
        onPropertyCreated={handlePropertyCreated}
      />

      {/* Schedule Tour / Visit Modal */}
      {isTourModalOpen && (
        <ScheduleTourModal
          property={tourProperty || selectedProperty}
          isOpen={isTourModalOpen}
          onClose={() => setIsTourModalOpen(false)}
          onSuccess={() => {
            showToast('Visit appointment scheduled! Landlord will confirm via phone/WhatsApp.');
          }}
        />
      )}

      {/* Saved / Favorites Modal */}
      <SavedFavoritesModal
        isOpen={isSavedModalOpen}
        onClose={() => setIsSavedModalOpen(false)}
        savedProperties={savedProperties}
        onRemoveSave={handleToggleSave}
        onOpenDetails={(p) => setSelectedProperty(p)}
      />

      {/* Side-by-Side Comparison Modal */}
      <CompareModal
        isOpen={isCompareModalOpen}
        onClose={() => setIsCompareModalOpen(false)}
        properties={comparedProperties}
        onRemoveProperty={(id) => setComparedProperties(comparedProperties.filter((p) => p._id !== id))}
        onOpenDetails={(p) => setSelectedProperty(p)}
        lang={lang}
      />

      {/* Affordability Calculator Modal */}
      <AffordabilityCalculatorModal
        isOpen={isCalculatorOpen}
        onClose={() => setIsCalculatorOpen(false)}
        onApplyBudget={handleApplyAffordableBudget}
        lang={lang}
      />

      {/* Tenancy Agreement Generator Modal */}
      <LeaseGeneratorModal
        isOpen={isLeaseModalOpen}
        onClose={() => setIsLeaseModalOpen(false)}
        defaultProperty={leaseTargetProperty}
        lang={lang}
      />

      {/* User Login / Registration Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={() => {
          showToast('Welcome to GRIHO! You are now signed in. 🎉');
        }}
        lang={lang}
      />

      {/* User Profile Modal */}
      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onOpenSaved={() => setIsSavedModalOpen(true)}
        lang={lang}
      />

      {/* Footer */}
      <Footer
        onOpenPostModal={handleOpenPostModal}
        onSelectArea={handleSelectArea}
      />
    </div>
  );
}
