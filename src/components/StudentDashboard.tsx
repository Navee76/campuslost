import React, { useState } from 'react';
import { 
  User, 
  Item, 
  Claim, 
  AppNotification, 
  MatchPair 
} from '../types';
import { 
  PlusCircle, 
  Search, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  QrCode, 
  MapPin, 
  Calendar, 
  Trash2, 
  Eye, 
  FileText,
  Printer,
  Shield,
  Layers,
  ArrowUpRight,
  User as UserIcon,
  Tag,
  CheckCircle
} from 'lucide-react';
import { printClaimPickupPass } from '../utils/exportUtils';

interface StudentDashboardProps {
  currentUser: User;
  items?: Item[];
  claims?: Claim[];
  notifications?: AppNotification[];
  potentialMatches?: MatchPair[];
  matches?: MatchPair[];
  onOpenReportLost?: () => void;
  onOpenReportFound?: () => void;
  onOpenSearch?: () => void;
  onNavigateToSmartMatch?: () => void;
  onSelectItem?: (item: Item) => void;
  onDeleteReport?: (itemId: string) => void;
  onInitiateClaim?: (item: Item) => void;
  onConfirmRecovery?: (lostItem: Item, foundItem: Item, matchScore?: number) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  currentUser,
  items = [],
  claims = [],
  notifications = [],
  potentialMatches,
  matches,
  onOpenReportLost = () => {},
  onOpenReportFound = () => {},
  onOpenSearch = () => {},
  onNavigateToSmartMatch = () => {},
  onSelectItem = (_item: Item) => {},
  onDeleteReport = (_itemId: string) => {},
  onInitiateClaim = (_item: Item) => {},
  onConfirmRecovery = (_lostItem: Item, _foundItem: Item, _score?: number) => {}
}) => {
  const [activeTab, setActiveTab] = useState<'LOST' | 'FOUND' | 'CLAIMS' | 'PROFILE'>('LOST');

  const safeMatches = matches || potentialMatches || [];
  const myLostItems = items.filter(i => i.type === 'LOST' && i.userId === currentUser.id);
  const myFoundItems = items.filter(i => i.type === 'FOUND' && i.userId === currentUser.id);
  const myClaims = claims.filter(c => c.studentId === currentUser.id);
  const myRecoveries = items.filter(i => i.status === 'RETURNED' || i.status === 'VERIFIED');

  // Matches specifically involving this student's lost items
  const myItemMatches = safeMatches.filter(m => m.lostItem.userId === currentUser.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Vibrant Palette 4-Metric Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        <div 
          onClick={() => setActiveTab('LOST')}
          className="bg-white dark:bg-slate-850 p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col justify-center cursor-pointer hover:border-blue-300 transition-all group"
        >
          <span className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">
            My Lost Reports
          </span>
          <span className="text-3xl font-extrabold text-slate-800 dark:text-white mt-1 group-hover:text-blue-600 transition-colors">
            {myLostItems.length < 10 ? `0${myLostItems.length}` : myLostItems.length}
          </span>
        </div>

        <div 
          onClick={() => setActiveTab('FOUND')}
          className="bg-white dark:bg-slate-850 p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col justify-center cursor-pointer hover:border-emerald-300 transition-all group"
        >
          <span className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">
            Found Items
          </span>
          <span className="text-3xl font-extrabold text-slate-800 dark:text-white mt-1 group-hover:text-emerald-600 transition-colors">
            {items.filter(i => i.type === 'FOUND').length < 10 ? `0${items.filter(i => i.type === 'FOUND').length}` : items.filter(i => i.type === 'FOUND').length}
          </span>
        </div>

        <div 
          onClick={onNavigateToSmartMatch}
          className="bg-blue-600 p-5 rounded-2xl shadow-lg shadow-blue-500/25 flex flex-col justify-center text-white cursor-pointer hover:bg-blue-700 transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-blue-100 text-xs font-bold uppercase tracking-wider">
              Active Matches
            </span>
            <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
          </div>
          <span className="text-3xl font-extrabold text-white mt-1">
            {myItemMatches.length < 10 ? `0${myItemMatches.length}` : myItemMatches.length}
          </span>
        </div>

        <div 
          onClick={() => setActiveTab('CLAIMS')}
          className="bg-white dark:bg-slate-850 p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col justify-center cursor-pointer hover:border-emerald-300 transition-all group"
        >
          <span className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">
            Recovered Items
          </span>
          <span className="text-3xl font-extrabold text-slate-800 dark:text-white mt-1 group-hover:text-emerald-600 transition-colors">
            {myRecoveries.length < 10 ? `0${myRecoveries.length}` : myRecoveries.length}
          </span>
        </div>
      </div>

      {/* Main Grid: Left (8 Cols Activity & Catalog) + Right (4 Cols Actions & Smart Match) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Recent Activity Feed & Tabbed Lists (Col-span-8) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Recent Activity Table Card */}
          <div className="bg-white dark:bg-slate-850 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col overflow-hidden">
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h2 className="font-bold text-lg text-slate-800 dark:text-white">Recent Activity Feed</h2>
                <p className="text-xs text-slate-400">Live campus lost & found log updates</p>
              </div>
              <button 
                onClick={onOpenSearch}
                className="bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-950/60 dark:text-blue-300 px-4 py-1.5 rounded-full text-xs font-bold transition-colors"
              >
                View All Activity
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 text-[11px] uppercase font-bold">
                  <tr className="border-b border-slate-100 dark:border-slate-800">
                    <th className="px-5 py-3">Item Name</th>
                    <th className="px-5 py-3">Category</th>
                    <th className="px-5 py-3">Location</th>
                    <th className="px-5 py-3">Date</th>
                    <th className="px-5 py-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-slate-100 dark:divide-slate-800">
                  {items.slice(0, 5).map((item) => (
                    <tr 
                      key={item.id} 
                      onClick={() => onSelectItem(item)}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/60 cursor-pointer transition-colors"
                    >
                      <td className="px-5 py-3.5 font-semibold text-slate-800 dark:text-slate-200">
                        {item.itemName}
                      </td>
                      <td className="px-5 py-3.5 text-xs text-slate-600 dark:text-slate-400">
                        {item.category}
                      </td>
                      <td className="px-5 py-3.5 text-xs text-slate-500 dark:text-slate-400">
                        {item.location}
                      </td>
                      <td className="px-5 py-3.5 text-xs text-slate-500 dark:text-slate-400">
                        {item.date}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          item.type === 'LOST' ? 'badge-lost' : 'badge-found'
                        }`}>
                          {item.type === 'LOST' ? 'Lost' : 'Found'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Student Tabs & Records */}
          <div className="bg-white dark:bg-slate-850 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 p-6">
            {/* Tabs Header */}
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3 mb-6 overflow-x-auto">
              <button
                id="tab-my-lost-items"
                onClick={() => setActiveTab('LOST')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === 'LOST'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
                }`}
              >
                <AlertCircle className="w-3.5 h-3.5" />
                My Lost Reports ({myLostItems.length})
              </button>

              <button
                id="tab-my-found-items"
                onClick={() => setActiveTab('FOUND')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === 'FOUND'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                My Found Reports ({myFoundItems.length})
              </button>

              <button
                id="tab-my-claims"
                onClick={() => setActiveTab('CLAIMS')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === 'CLAIMS'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                My Claims ({myClaims.length})
              </button>

              <button
                id="tab-my-profile"
                onClick={() => setActiveTab('PROFILE')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === 'PROFILE'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
                }`}
              >
                <UserIcon className="w-3.5 h-3.5" />
                Student Profile
              </button>
            </div>

            {/* Tab Content: Lost Reports */}
            {activeTab === 'LOST' && (
              <div>
                {myLostItems.length === 0 ? (
                  <div className="p-8 text-center border border-dashed border-slate-200 dark:border-slate-700 rounded-2xl">
                    <AlertCircle className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                    <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">No lost items reported yet</h4>
                    <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                      Misplaced an item on campus? Report it to activate the smart AI matching engine.
                    </p>
                    <button
                      onClick={onOpenReportLost}
                      className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20"
                    >
                      Report Lost Item
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {myLostItems.map((item) => (
                      <div
                        key={item.id}
                        className="bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-4 flex flex-col justify-between hover:border-blue-300 transition-all"
                      >
                        <div className="flex items-start gap-3">
                          <img
                            src={item.imageUrl}
                            alt={item.itemName}
                            className="w-16 h-16 rounded-xl object-cover ring-1 ring-slate-200 dark:ring-slate-700 shrink-0"
                          />
                          <div className="min-w-0 flex-1">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600">
                              {item.category}
                            </span>
                            <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate mt-0.5">
                              {item.itemName}
                            </h4>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                              {item.location} • {item.date}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-200/60 dark:border-slate-800">
                          <button
                            onClick={() => onSelectItem(item)}
                            className="text-xs font-bold text-blue-600 hover:underline"
                          >
                            Details →
                          </button>
                          <button
                            onClick={() => onDeleteReport(item.id)}
                            className="text-xs font-semibold text-rose-600 hover:text-rose-700"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Tab Content: Found Reports */}
            {activeTab === 'FOUND' && (
              <div>
                {myFoundItems.length === 0 ? (
                  <div className="p-8 text-center border border-dashed border-slate-200 dark:border-slate-700 rounded-2xl">
                    <CheckCircle2 className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                    <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">No found items reported by you</h4>
                    <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                      Thank you for your honesty! If you discover unattended belongings, log them here.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {myFoundItems.map((item) => (
                      <div
                        key={item.id}
                        className="bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-4"
                      >
                        <div className="flex items-start gap-3">
                          <img
                            src={item.imageUrl}
                            alt={item.itemName}
                            className="w-16 h-16 rounded-xl object-cover ring-1 ring-slate-200 dark:ring-slate-700 shrink-0"
                          />
                          <div className="min-w-0 flex-1">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">
                              {item.category}
                            </span>
                            <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate mt-0.5">
                              {item.itemName}
                            </h4>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                              Handover: {item.handoverLocation}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Tab Content: Claims */}
            {activeTab === 'CLAIMS' && (
              <div className="space-y-3">
                {myClaims.length === 0 ? (
                  <div className="p-8 text-center border border-dashed border-slate-200 dark:border-slate-700 rounded-2xl">
                    <FileText className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                    <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">No active claims</h4>
                    <p className="text-xs text-slate-500 mt-1">Search the found catalog to claim your lost possessions.</p>
                  </div>
                ) : (
                  myClaims.map((claim) => (
                    <div
                      key={claim.id}
                      className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-blue-600">{claim.id}</span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            claim.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                          }`}>
                            {claim.status}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white mt-1">{claim.itemName}</h4>
                        <p className="text-[11px] text-slate-500 mt-0.5">Location: {claim.itemLocation}</p>
                      </div>

                      {claim.status === 'APPROVED' && (
                        <button
                          onClick={() => printClaimPickupPass(claim)}
                          className="px-3.5 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 flex items-center gap-1.5 shrink-0"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          Print QR Pass
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Tab Content: Profile */}
            {activeTab === 'PROFILE' && (
              <div className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl">
                    <span className="text-slate-400 font-bold uppercase text-[10px]">Name</span>
                    <p className="font-bold text-slate-800 dark:text-slate-100 mt-0.5">{currentUser.name}</p>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl">
                    <span className="text-slate-400 font-bold uppercase text-[10px]">Roll No</span>
                    <p className="font-bold text-slate-800 dark:text-slate-100 mt-0.5">{currentUser.studentOrStaffId}</p>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl">
                    <span className="text-slate-400 font-bold uppercase text-[10px]">Email</span>
                    <p className="font-bold text-slate-800 dark:text-slate-100 mt-0.5">{currentUser.email}</p>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl">
                    <span className="text-slate-400 font-bold uppercase text-[10px]">Department</span>
                    <p className="font-bold text-slate-800 dark:text-slate-100 mt-0.5">{currentUser.department}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Quick Actions & Smart Match Engine (Col-span-4) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Quick Actions Card with Vibrant Tinted Buttons */}
          <div className="bg-white dark:bg-slate-850 p-5 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col gap-4">
            <h3 className="font-bold text-slate-800 dark:text-white">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              <button 
                id="qa-report-lost"
                onClick={onOpenReportLost}
                className="p-4 bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-950/60 dark:text-blue-300 rounded-2xl flex flex-col items-center gap-2 transition-colors group cursor-pointer"
              >
                <PlusCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold uppercase tracking-wider">Report Lost</span>
              </button>

              <button 
                id="qa-report-found"
                onClick={onOpenReportFound}
                className="p-4 bg-green-50 text-green-700 hover:bg-green-100 dark:bg-emerald-950/60 dark:text-emerald-300 rounded-2xl flex flex-col items-center gap-2 transition-colors group cursor-pointer"
              >
                <CheckCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold uppercase tracking-wider">Report Found</span>
              </button>
            </div>
          </div>

          {/* Smart Match Engine Glass Card */}
          <div className="glass rounded-3xl p-5 flex flex-col gap-4 border-2 border-blue-100 dark:border-blue-900/60 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <h3 className="font-bold text-blue-900 dark:text-blue-300">Smart Match Engine</h3>
              </div>
              <span className="bg-blue-600 text-white px-2 py-0.5 rounded-full text-[10px] font-bold animate-pulse">
                NEW
              </span>
            </div>

            <div className="flex flex-col gap-4 pr-0.5">
              {myItemMatches.length > 0 ? (
                myItemMatches.slice(0, 2).map((m, idx) => (
                  <div 
                    key={idx}
                    className={`bg-white dark:bg-slate-800 p-4 rounded-2xl border border-blue-100 dark:border-slate-700 shadow-sm relative ${
                      idx > 0 ? 'opacity-85' : ''
                    }`}
                  >
                    <div className="absolute -top-2.5 -right-2 bg-emerald-500 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full shadow-sm">
                      {m.score.totalPercentage}% Match
                    </div>
                    <span className="text-[10px] font-bold text-blue-600 uppercase mb-1 block">
                      {idx === 0 ? 'Possible Match Found' : 'Suggestive Match'}
                    </span>
                    <h4 className="font-bold text-sm text-slate-800 dark:text-white mb-2">
                      {m.lostItem.itemName}
                    </h4>
                    <div className="grid grid-cols-2 gap-2 mb-3 bg-slate-50 dark:bg-slate-900/80 p-2.5 rounded-xl text-[10px]">
                      <div>
                        <p className="text-slate-400">Your Report</p>
                        <p className="font-bold text-slate-700 dark:text-slate-200 truncate">Lost @ {m.lostItem.location.split('-')[0]}</p>
                      </div>
                      <div>
                        <p className="text-slate-400">Found Entry</p>
                        <p className="font-bold text-slate-700 dark:text-slate-200 truncate">Found @ {m.foundItem.location.split('-')[0]}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => onConfirmRecovery(m.lostItem, m.foundItem, m.score.totalPercentage)}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-xl text-[11px] font-bold shadow-md shadow-emerald-500/20 transition-all flex items-center justify-center gap-1"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Item Recovered
                      </button>
                      <button 
                        onClick={onNavigateToSmartMatch}
                        className="px-3 bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-slate-700 dark:text-blue-300 py-2 rounded-xl text-[11px] font-bold transition-all"
                      >
                        Inspect
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <>
                  {/* Preset High-Confidence Demo Matches matching the design spec */}
                  <div className="bg-white dark:bg-slate-850 p-4 rounded-2xl border border-blue-100 dark:border-slate-700 shadow-sm relative">
                    <div className="absolute -top-2.5 -right-2 bg-emerald-500 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full shadow-sm">
                      92% Match
                    </div>
                    <span className="text-[10px] font-bold text-blue-600 uppercase mb-1 block">
                      Possible Match Found
                    </span>
                    <h4 className="font-bold text-sm text-slate-800 dark:text-white mb-2">
                      Black Leather Wallet
                    </h4>
                    <div className="grid grid-cols-2 gap-2 mb-3 bg-slate-50 dark:bg-slate-900/80 p-2.5 rounded-xl text-[10px]">
                      <div>
                        <p className="text-slate-400">Your Report</p>
                        <p className="font-bold text-slate-700 dark:text-slate-200">Lost @ CSE Block</p>
                      </div>
                      <div>
                        <p className="text-slate-400">Found Entry</p>
                        <p className="font-bold text-slate-700 dark:text-slate-200">Found @ CSE Block</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => {
                          const demoLost = items.find(i => i.itemName.toLowerCase().includes('wallet')) || items[0];
                          const demoFound = items.find(i => i.type === 'FOUND') || items[1] || items[0];
                          if (demoLost && demoFound) onConfirmRecovery(demoLost, demoFound, 92);
                          else onNavigateToSmartMatch();
                        }}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-xl text-[11px] font-bold shadow-md shadow-emerald-500/20 transition-all flex items-center justify-center gap-1"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Item Recovered
                      </button>
                      <button 
                        onClick={onNavigateToSmartMatch}
                        className="px-3 bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-slate-700 dark:text-blue-300 py-2 rounded-xl text-[11px] font-bold transition-all"
                      >
                        Inspect
                      </button>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-slate-850 p-4 rounded-2xl border border-blue-100 dark:border-slate-700 shadow-sm opacity-80">
                    <div className="absolute -top-2.5 -right-2 bg-amber-500 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full shadow-sm">
                      75% Match
                    </div>
                    <span className="text-[10px] font-bold text-blue-600 uppercase mb-1 block">
                      Suggestive Match
                    </span>
                    <h4 className="font-bold text-sm text-slate-800 dark:text-white mb-2">
                      College ID Card
                    </h4>
                    <div className="grid grid-cols-2 gap-2 mb-3 bg-slate-50 dark:bg-slate-900/80 p-2.5 rounded-xl text-[10px]">
                      <div>
                        <p className="text-slate-400">Your Report</p>
                        <p className="font-bold text-slate-700 dark:text-slate-200">Naveen (2021-CS)</p>
                      </div>
                      <div>
                        <p className="text-slate-400">Found Entry</p>
                        <p className="font-bold text-slate-700 dark:text-slate-200">Student ID (CS)</p>
                      </div>
                    </div>
                    <button 
                      onClick={onNavigateToSmartMatch}
                      className="w-full border border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 py-2 rounded-xl text-xs font-bold transition-colors"
                    >
                      Check Match Details
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
