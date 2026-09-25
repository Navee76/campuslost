import React, { useState } from 'react';
import { 
  MatchPair, 
  Item, 
  User 
} from '../types';
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  MapPin, 
  Calendar, 
  ShieldCheck, 
  Sliders, 
  FileCheck, 
  Layers,
  ChevronRight,
  Info
} from 'lucide-react';

interface SmartMatchModalProps {
  matches?: MatchPair[];
  currentUser: User | null;
  onInitiateClaim?: (foundItem: Item) => void;
  onSelectItem?: (item: Item) => void;
  onConfirmRecovery?: (lostItem: Item, foundItem: Item, matchScore?: number) => void;
}

export const SmartMatchModal: React.FC<SmartMatchModalProps> = ({
  matches = [],
  currentUser,
  onInitiateClaim = (_foundItem: Item) => {},
  onSelectItem = (_item: Item) => {},
  onConfirmRecovery = (_lostItem: Item, _foundItem: Item, _score?: number) => {}
}) => {
  const [selectedPairIndex, setSelectedPairIndex] = useState(0);
  const activePair = matches[selectedPairIndex] || matches[0] || null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Smart Match Radar Header */}
      <div className="bg-gradient-to-r from-indigo-900 via-purple-950 to-blue-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl mb-8 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-amber-400 to-indigo-600 flex items-center justify-center text-slate-900 shadow-xl ring-4 ring-white/10 shrink-0">
              <Sparkles className="w-9 h-9 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-400/30 text-amber-200 border border-amber-400/40 uppercase">
                  Deterministic Heuristic Engine
                </span>
                <span className="text-xs text-indigo-200">5-Factor Weight Analysis</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1">Smart AI Matching Radar</h1>
              <p className="text-xs sm:text-sm text-indigo-200/80 mt-0.5">
                Automatically computing cross-similarity between lost complaints and found items reported on campus.
              </p>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md px-4 py-3 rounded-xl border border-white/20 text-center">
            <div className="text-2xl font-extrabold text-amber-300">{matches.length}</div>
            <div className="text-[10px] uppercase font-bold tracking-wider text-white/80">Active Match Pairs</div>
          </div>
        </div>
      </div>

      {matches.length === 0 ? (
        <div className="bg-white dark:bg-slate-850 rounded-2xl p-12 text-center border border-dashed border-slate-300 dark:border-slate-700">
          <Sparkles className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">No high-confidence matches at this moment</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
            The matching algorithm continuously scans incoming lost and found reports. As soon as a student or staff logs a candidate with ≥55% correlation, it will appear here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Match Pairs List (Left 4 cols) */}
          <div className="lg:col-span-4 space-y-3">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
              Top Detected Correlations
            </div>
            {matches.map((pair, idx) => {
              const isSelected = idx === selectedPairIndex;
              return (
                <div
                  key={`${pair.lostItem.id}-${pair.foundItem.id}`}
                  onClick={() => setSelectedPairIndex(idx)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-blue-50/80 dark:bg-blue-950/60 border-blue-500 shadow-md ring-2 ring-blue-500/20'
                      : 'bg-white dark:bg-slate-850 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative shrink-0">
                      <img
                        src={pair.lostItem.imageUrl}
                        alt="Lost"
                        className="w-12 h-12 rounded-xl object-cover ring-1 ring-slate-200"
                      />
                      <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-indigo-600 text-white text-[9px] font-bold flex items-center justify-center">
                        VS
                      </span>
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300">
                          {pair.score.totalPercentage}% Match
                        </span>
                        <span className="text-[10px] text-slate-400">{pair.lostItem.category}</span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                        {pair.lostItem.itemName}
                      </h4>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                        Found at {pair.foundItem.location.split('-')[0]}
                      </p>
                    </div>
                  </div>

                  <ChevronRight className={`w-4 h-4 shrink-0 ${isSelected ? 'text-blue-600' : 'text-slate-400'}`} />
                </div>
              );
            })}
          </div>

          {/* Selected Match Inspection Card (Right 8 cols) */}
          {activePair && (
            <div className="lg:col-span-8 bg-white dark:bg-slate-850 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
              {/* Top Match Badge */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100 dark:border-slate-800 mb-6">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                      Match Verification Inspector
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-sm">
                      {activePair.score.totalPercentage}% Match Probability
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                    Side-by-Side Comparison
                  </h3>
                </div>

                <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-auto">
                  <button
                    id="smartmatch-claim-btn"
                    onClick={() => onInitiateClaim(activePair.foundItem)}
                    className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition-all flex items-center gap-1.5"
                  >
                    <FileCheck className="w-4 h-4 text-blue-600" />
                    Initiate Claim
                  </button>

                  <button
                    id="smartmatch-recover-btn"
                    onClick={() => onConfirmRecovery(activePair.lostItem, activePair.foundItem, activePair.score.totalPercentage)}
                    className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-md shadow-emerald-600/20 transition-all flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Submit Item Recovered Success
                  </button>
                </div>
              </div>

              {/* Side-by-Side Columns */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {/* Left: Lost Item */}
                <div className="p-4 rounded-xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40">
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-600 text-white uppercase">
                      Reported Lost
                    </span>
                    <span className="text-[11px] text-slate-500">{activePair.lostItem.date}</span>
                  </div>

                  <img
                    src={activePair.lostItem.imageUrl}
                    alt={activePair.lostItem.itemName}
                    className="w-full h-40 rounded-xl object-cover mb-3 ring-1 ring-rose-300 dark:ring-rose-800"
                  />

                  <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">{activePair.lostItem.itemName}</h4>
                  <div className="text-xs text-rose-700 dark:text-rose-400 font-semibold mt-0.5">
                    Category: {activePair.lostItem.category} • Color: {activePair.lostItem.color}
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-300 mt-2 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                    <span className="truncate">{activePair.lostItem.location}</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-2 italic bg-white/60 dark:bg-slate-900/60 p-2 rounded-lg">
                    "{activePair.lostItem.description}"
                  </p>
                  <div className="text-[10px] text-slate-400 mt-2">
                    Reported by Student: {activePair.lostItem.userName}
                  </div>
                </div>

                {/* Right: Found Item */}
                <div className="p-4 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40">
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-600 text-white uppercase">
                      Reported Found
                    </span>
                    <span className="text-[11px] text-slate-500">{activePair.foundItem.date}</span>
                  </div>

                  <img
                    src={activePair.foundItem.imageUrl}
                    alt={activePair.foundItem.itemName}
                    className="w-full h-40 rounded-xl object-cover mb-3 ring-1 ring-emerald-300 dark:ring-emerald-800"
                  />

                  <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">{activePair.foundItem.itemName}</h4>
                  <div className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold mt-0.5">
                    Category: {activePair.foundItem.category} • Color: {activePair.foundItem.color}
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-300 mt-2 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span className="truncate">{activePair.foundItem.location}</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-2 italic bg-white/60 dark:bg-slate-900/60 p-2 rounded-lg">
                    "{activePair.foundItem.description}"
                  </p>
                  <div className="text-[10px] text-slate-400 mt-2">
                    Turned in by: {activePair.foundItem.userName} ({activePair.foundItem.handoverLocation})
                  </div>
                </div>
              </div>

              {/* Algorithm Multi-Factor Score Breakdown */}
              <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800">
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-blue-600" />
                  Algorithm Score Attribution Matrix
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center mb-4">
                  <div className="p-2 bg-white dark:bg-slate-850 rounded-lg border border-slate-200 dark:border-slate-800">
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">Category (30%)</div>
                    <div className="text-base font-extrabold text-blue-600 mt-0.5">{activePair.score.categoryScore}%</div>
                  </div>

                  <div className="p-2 bg-white dark:bg-slate-850 rounded-lg border border-slate-200 dark:border-slate-800">
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">Keywords (30%)</div>
                    <div className="text-base font-extrabold text-indigo-600 mt-0.5">{activePair.score.nameScore}%</div>
                  </div>

                  <div className="p-2 bg-white dark:bg-slate-850 rounded-lg border border-slate-200 dark:border-slate-800">
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">Color (20%)</div>
                    <div className="text-base font-extrabold text-purple-600 mt-0.5">{activePair.score.colorScore}%</div>
                  </div>

                  <div className="p-2 bg-white dark:bg-slate-850 rounded-lg border border-slate-200 dark:border-slate-800">
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">Location (10%)</div>
                    <div className="text-base font-extrabold text-emerald-600 mt-0.5">{activePair.score.locationScore}%</div>
                  </div>

                  <div className="p-2 bg-white dark:bg-slate-850 rounded-lg border border-slate-200 dark:border-slate-800 col-span-2 sm:col-span-1">
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">Date Timeline (10%)</div>
                    <div className="text-base font-extrabold text-amber-600 mt-0.5">{activePair.score.dateScore}%</div>
                  </div>
                </div>

                <div className="space-y-1 text-xs">
                  {activePair.score.matchReasons.map((reason, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                      <span>{reason}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
