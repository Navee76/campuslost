import React, { useState } from 'react';
import { 
  Search, 
  Sparkles, 
  ShieldAlert, 
  CheckCircle2, 
  MapPin, 
  TrendingUp, 
  ArrowRight,
  PlusCircle,
  HelpCircle,
  QrCode,
  School
} from 'lucide-react';
import { Item, SystemStats, ItemCategory } from '../types';

interface HeroSectionProps {
  stats?: SystemStats;
  onSearch?: (query: string, category?: ItemCategory) => void;
  onOpenSearch?: () => void;
  onOpenMatches?: () => void;
  onOpenReportLost?: () => void;
  onOpenReportFound?: () => void;
  onNavigateToSmartMatch?: () => void;
  onCategorySelect?: (category: ItemCategory) => void;
  recentRecoveries?: Item[];
  onSelectItem?: (item: Item) => void;
}

const CATEGORIES: ItemCategory[] = [
  'Electronics',
  'Cards & IDs',
  'Bags & Wallets',
  'Keys',
  'Bottles & Accessories',
  'Books & Notes',
  'Jewelry & Watches'
];

export const HeroSection: React.FC<HeroSectionProps> = ({
  stats = { totalUsers: 150, totalLost: 18, totalFound: 24, totalRecovered: 12, totalPendingClaims: 5, recoveryRatePercent: 72, avgResolutionDays: 2 },
  onSearch = (_query: string, _category?: ItemCategory) => {},
  onOpenSearch = () => {},
  onOpenMatches = () => {},
  onOpenReportLost = () => {},
  onOpenReportFound = () => {},
  onNavigateToSmartMatch = () => {},
  onCategorySelect = (_category: ItemCategory) => {},
  recentRecoveries = [],
  onSelectItem = (_item: Item) => {}
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ItemCategory | ''>('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery, selectedCategory || undefined);
    } else if (onOpenSearch) {
      onOpenSearch();
    }
  };

  const handleGoToMatches = () => {
    if (onOpenMatches) onOpenMatches();
    else if (onNavigateToSmartMatch) onNavigateToSmartMatch();
  };

  const handleSelectCat = (cat: ItemCategory) => {
    setSelectedCategory(cat);
    if (onCategorySelect) {
      onCategorySelect(cat);
    } else if (onSearch) {
      onSearch('', cat);
    }
  };

  return (
    <div className="relative overflow-hidden pt-8 pb-16 px-4 sm:px-6 lg:px-8">
      {/* Subtle Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-blue-500/10 via-indigo-500/5 to-transparent pointer-events-none blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto">
        {/* Main Banner Content */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300 text-xs font-semibold uppercase tracking-wider mb-4 animate-fade-in">
            <School className="w-3.5 h-3.5" />
            Official University Lost & Found Network
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-4">
            Reuniting Students with their <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Belongings</span> in Minutes.
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed mb-8 max-w-2xl mx-auto">
            Say goodbye to scattered WhatsApp groups and cluttered notice boards. CampusLost uses real-time AI-powered matching, campus security verification, and secure QR pickup passes.
          </p>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-10">
            <button
              id="hero-report-lost-btn"
              onClick={onOpenReportLost}
              className="px-6 py-3.5 rounded-xl text-sm font-bold text-white bg-rose-600 hover:bg-rose-700 shadow-lg shadow-rose-500/25 hover:shadow-rose-500/40 hover:-translate-y-0.5 transition-all flex items-center gap-2"
            >
              <ShieldAlert className="w-5 h-5" />
              Report Lost Item
            </button>

            <button
              id="hero-report-found-btn"
              onClick={onOpenReportFound}
              className="px-6 py-3.5 rounded-xl text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:-translate-y-0.5 transition-all flex items-center gap-2"
            >
              <CheckCircle2 className="w-5 h-5" />
              Report Found Item
            </button>

            <button
              id="hero-smart-match-radar-btn"
              onClick={handleGoToMatches}
              className="px-5 py-3.5 rounded-xl text-sm font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              Smart Matching Radar
            </button>
          </div>

          {/* Instant Search Bar Card */}
          <div className="bg-white/80 dark:bg-slate-850/80 backdrop-blur-md p-3 sm:p-4 rounded-2xl shadow-xl border border-slate-200/80 dark:border-slate-800 text-left max-w-2xl mx-auto">
            <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row items-center gap-2">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  id="hero-search-input"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by item name, brand, location (e.g. Wallet, Casio, CSE Block)..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <select
                id="hero-category-select"
                aria-label="Filter by Category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as ItemCategory | '')}
                className="w-full sm:w-auto px-3 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                <option value="">All Categories</option>
                {CATEGORIES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>

              <button
                id="hero-search-submit-btn"
                type="submit"
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-all"
              >
                Search
              </button>
            </form>

            {/* Quick Category Chips */}
            <div className="flex flex-wrap items-center gap-1.5 mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 text-xs">
              <span className="text-slate-400 font-medium mr-1">Trending:</span>
              {['Wallet', 'ID Card', 'Casio Calculator', 'Keys', 'iPhone', 'Water Bottle'].map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => {
                    setSearchQuery(term);
                    if (onSearch) onSearch(term);
                    else if (onOpenSearch) onOpenSearch();
                  }}
                  className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Live Campus Recovery Statistics Ticker */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto mb-12">
          <div className="bg-white dark:bg-slate-850 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm text-center">
            <div className="text-2xl sm:text-3xl font-extrabold text-blue-600 dark:text-blue-400">
              {stats.totalFound + stats.totalLost}
            </div>
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-wider">
              Total Reports
            </div>
          </div>

          <div className="bg-white dark:bg-slate-850 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm text-center">
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
              {stats.totalRecovered}
            </div>
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-wider">
              Items Recovered
            </div>
          </div>

          <div className="bg-white dark:bg-slate-850 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm text-center">
            <div className="text-2xl sm:text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">
              {stats.recoveryRatePercent}%
            </div>
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-wider">
              Match & Return Rate
            </div>
          </div>

          <div className="bg-white dark:bg-slate-850 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm text-center">
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-600 dark:text-amber-400">
              ~2.4h
            </div>
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-wider">
              Avg. Match Time
            </div>
          </div>
        </div>

        {/* Recent Verified Recoveries Showcase */}
        {recentRecoveries.length > 0 && (
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  Recent Campus Recoveries & Handover Points
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Items safely returned to verified owners through security verification</p>
              </div>
              <button
                onClick={() => onSearch('')}
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                View Full Catalog <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentRecoveries.slice(0, 3).map((item) => (
                <div
                  key={item.id}
                  onClick={() => onSelectItem(item)}
                  className="bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-600 rounded-xl p-3.5 shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center gap-3.5 group"
                >
                  <img
                    src={item.imageUrl}
                    alt={item.itemName}
                    className="w-16 h-16 rounded-lg object-cover ring-1 ring-slate-200 dark:ring-slate-700 group-hover:scale-105 transition-transform shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 uppercase tracking-wider">
                        {item.status}
                      </span>
                      <span className="text-[11px] text-slate-400">{item.date}</span>
                    </div>
                    <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate group-hover:text-blue-600 transition-colors">
                      {item.itemName}
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                      {item.location}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
