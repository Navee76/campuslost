import React, { useState, useMemo } from 'react';
import { 
  Item, 
  ItemCategory, 
  ItemStatus 
} from '../types';
import { 
  Search, 
  Filter, 
  Grid, 
  List, 
  MapPin, 
  Calendar, 
  ShieldAlert, 
  CheckCircle2, 
  ArrowUpDown, 
  Eye, 
  FileCheck,
  X,
  SlidersHorizontal
} from 'lucide-react';
import { CAMPUS_LOCATIONS } from '../data/mockData';

interface SearchModuleProps {
  items?: Item[];
  initialQuery?: string;
  initialCategory?: ItemCategory;
  onSelectItem?: (item: Item) => void;
  onInitiateClaim?: (item: Item) => void;
  onOpenReportLost?: () => void;
  onOpenReportFound?: () => void;
}

const CATEGORIES: ItemCategory[] = [
  'Electronics',
  'Cards & IDs',
  'Bags & Wallets',
  'Books & Notes',
  'Keys',
  'Bottles & Accessories',
  'Jewelry & Watches',
  'Clothing & Footwear',
  'Others'
];

export const SearchModule: React.FC<SearchModuleProps> = ({
  items = [],
  initialQuery = '',
  initialCategory,
  onSelectItem = (_item: Item) => {},
  onInitiateClaim = (_item: Item) => {},
  onOpenReportLost = () => {},
  onOpenReportFound = () => {}
}) => {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [typeFilter, setTypeFilter] = useState<'ALL' | 'LOST' | 'FOUND' | 'RETURNED'>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<ItemCategory | ''>(initialCategory || '');
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [sortBy, setSortBy] = useState<'NEWEST' | 'OLDEST' | 'NAME'>('NEWEST');
  const [viewMode, setViewMode] = useState<'GRID' | 'LIST'>('GRID');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      // Type Filter
      if (typeFilter === 'LOST' && item.type !== 'LOST') return false;
      if (typeFilter === 'FOUND' && item.type !== 'FOUND') return false;
      if (typeFilter === 'RETURNED' && item.status !== 'RETURNED') return false;

      // Category Filter
      if (selectedCategory && item.category !== selectedCategory) return false;

      // Location Filter
      if (selectedLocation && !item.location.toLowerCase().includes(selectedLocation.toLowerCase())) return false;

      // Query Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = item.itemName.toLowerCase().includes(q);
        const matchesBrand = (item.brand || '').toLowerCase().includes(q);
        const matchesDesc = item.description.toLowerCase().includes(q);
        const matchesColor = item.color.toLowerCase().includes(q);
        const matchesLoc = item.location.toLowerCase().includes(q);
        const matchesUser = item.userName.toLowerCase().includes(q);

        if (!matchesName && !matchesBrand && !matchesDesc && !matchesColor && !matchesLoc && !matchesUser) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'NEWEST') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sortBy === 'OLDEST') return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      return a.itemName.localeCompare(b.itemName);
    });
  }, [items, typeFilter, selectedCategory, selectedLocation, searchQuery, sortBy]);

  const clearFilters = () => {
    setSearchQuery('');
    setTypeFilter('ALL');
    setSelectedCategory('');
    setSelectedLocation('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Search Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Campus Items Catalog & Search
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Explore all active lost and found items across departments, labs, libraries, and campus zones.
        </p>
      </div>

      {/* Main Search Controls */}
      <div className="bg-white dark:bg-slate-850 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm mb-6 space-y-4">
        {/* Row 1: Search Input + View Mode */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              id="search-catalog-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by keywords (e.g. Wallet, iPhone, Casio, Blue Bottle, CSE Lab)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="sm:hidden px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-1.5"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Filters
            </button>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
              <button
                id="view-mode-grid"
                aria-label="Grid View"
                onClick={() => setViewMode('GRID')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'GRID' ? 'bg-white dark:bg-slate-700 shadow-sm text-blue-600 dark:text-blue-400' : 'text-slate-400'
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                id="view-mode-list"
                aria-label="List View"
                onClick={() => setViewMode('LIST')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'LIST' ? 'bg-white dark:bg-slate-700 shadow-sm text-blue-600 dark:text-blue-400' : 'text-slate-400'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Row 2: Filter Pills & Dropdowns */}
        <div className={`sm:flex items-center justify-between gap-4 pt-3 border-t border-slate-100 dark:border-slate-800 ${showMobileFilters ? 'block space-y-3' : 'hidden sm:flex'}`}>
          {/* Type Buttons */}
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              id="filter-type-all"
              onClick={() => setTypeFilter('ALL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                typeFilter === 'ALL'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
              }`}
            >
              All Items ({items.length})
            </button>

            <button
              id="filter-type-lost"
              onClick={() => setTypeFilter('LOST')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                typeFilter === 'LOST'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              Lost Only ({items.filter(i => i.type === 'LOST').length})
            </button>

            <button
              id="filter-type-found"
              onClick={() => setTypeFilter('FOUND')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                typeFilter === 'FOUND'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Found Only ({items.filter(i => i.type === 'FOUND').length})
            </button>
          </div>

          {/* Select dropdowns */}
          <div className="flex flex-wrap items-center gap-2">
            <select
              aria-label="Filter by Category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as ItemCategory | '')}
              className="px-2.5 py-1.5 rounded-lg text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 focus:outline-none"
            >
              <option value="">All Categories</option>
              {CATEGORIES.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            <select
              aria-label="Filter by Campus Location"
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 focus:outline-none max-w-[160px] truncate"
            >
              <option value="">All Campus Locations</option>
              {CAMPUS_LOCATIONS.map(loc => (
                <option key={loc.id} value={loc.name}>{loc.name}</option>
              ))}
            </select>

            <select
              aria-label="Sort Catalog Items"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-2.5 py-1.5 rounded-lg text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 focus:outline-none"
            >
              <option value="NEWEST">Newest First</option>
              <option value="OLDEST">Oldest First</option>
              <option value="NAME">Item Name (A-Z)</option>
            </select>

            {(searchQuery || selectedCategory || selectedLocation || typeFilter !== 'ALL') && (
              <button
                onClick={clearFilters}
                className="text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline px-1"
              >
                Reset
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Search Result Count */}
      <div className="flex items-center justify-between mb-4 text-xs text-slate-500 dark:text-slate-400">
        <div>
          Showing <span className="font-bold text-slate-800 dark:text-slate-200">{filteredItems.length}</span> results
          {selectedCategory && <span> in <span className="font-semibold text-blue-600">{selectedCategory}</span></span>}
        </div>
      </div>

      {/* Grid View */}
      {viewMode === 'GRID' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-slate-850 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-700 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="relative h-48 bg-slate-100 dark:bg-slate-900 overflow-hidden">
                  <img
                    src={item.imageUrl}
                    alt={item.itemName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      item.type === 'LOST'
                        ? 'bg-rose-600 text-white shadow-sm'
                        : 'bg-emerald-600 text-white shadow-sm'
                    }`}>
                      {item.type}
                    </span>
                    {item.status === 'RETURNED' && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-600 text-white">
                        Returned
                      </span>
                    )}
                  </div>

                  <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white px-2 py-0.5 rounded text-[11px] font-mono">
                    {item.date}
                  </div>
                </div>

                <div className="p-4">
                  <div className="text-[11px] font-semibold text-blue-600 dark:text-blue-400">
                    {item.category} {item.brand ? `• ${item.brand}` : ''}
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1 mt-0.5">
                    {item.itemName}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 mt-1.5">
                    {item.description}
                  </p>

                  <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 mt-3">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{item.location}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 pt-0 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2 mt-3">
                <button
                  onClick={() => onSelectItem(item)}
                  className="flex-1 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors flex items-center justify-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" /> Details
                </button>

                {item.type === 'FOUND' && item.status !== 'RETURNED' && (
                  <button
                    onClick={() => onInitiateClaim(item)}
                    className="flex-1 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-colors flex items-center justify-center gap-1"
                  >
                    <FileCheck className="w-3.5 h-3.5" /> Claim Item
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* List View */
        <div className="space-y-3">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-slate-850 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                <img
                  src={item.imageUrl}
                  alt={item.itemName}
                  className="w-16 h-16 rounded-xl object-cover ring-1 ring-slate-200 dark:ring-slate-700 shrink-0"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      item.type === 'LOST' ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {item.type}
                    </span>
                    <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                      {item.category}
                    </span>
                    <span className="text-xs text-slate-400">• {item.date}</span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                    {item.itemName}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" /> {item.location}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <button
                  onClick={() => onSelectItem(item)}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                >
                  View Details
                </button>
                {item.type === 'FOUND' && item.status !== 'RETURNED' && (
                  <button
                    onClick={() => onInitiateClaim(item)}
                    className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Claim Item
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {filteredItems.length === 0 && (
        <div className="bg-white dark:bg-slate-850 rounded-2xl p-12 text-center border border-dashed border-slate-300 dark:border-slate-700 my-8">
          <Search className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">No items matched your query</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
            Try adjusting keywords or selecting a broader campus location. If you recently misplaced an item, file a lost report so the smart matcher can alert you.
          </p>
          <div className="flex items-center justify-center gap-3 mt-5">
            <button
              onClick={onOpenReportLost}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white"
            >
              Report Lost Item
            </button>
            <button
              onClick={clearFilters}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
            >
              Clear Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
