import React, { useState } from 'react';
import { 
  User, 
  Item, 
  Claim, 
  SystemStats, 
  UserRole,
  ItemCategory
} from '../types';
import { 
  ShieldAlert, 
  Users, 
  Package, 
  CheckCircle2, 
  TrendingUp, 
  Download, 
  FileSpreadsheet, 
  FileText, 
  Filter, 
  Search, 
  Trash2, 
  Edit3, 
  BarChart3, 
  PieChart, 
  Layers, 
  Check, 
  X,
  Building,
  UserCheck
} from 'lucide-react';
import { exportItemsToCSV, exportClaimsToCSV } from '../utils/exportUtils';

interface AdminDashboardProps {
  currentUser: User;
  users?: User[];
  items?: Item[];
  claims?: Claim[];
  stats?: SystemStats;
  onUpdateUserRole?: (userId: string, newRole: UserRole) => void;
  onDeleteItem?: (itemId: string) => void;
  onSelectItem?: (item: Item) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  currentUser,
  users = [],
  items = [],
  claims = [],
  stats = { totalUsers: 150, totalLost: 18, totalFound: 24, totalRecovered: 12, totalPendingClaims: 5, recoveryRatePercent: 72, avgResolutionDays: 2 },
  onUpdateUserRole = (_userId: string, _newRole: UserRole) => {},
  onDeleteItem = (_itemId: string) => {},
  onSelectItem = (_item: Item) => {}
}) => {
  const [activeTab, setActiveTab] = useState<'ANALYTICS' | 'USERS' | 'ITEMS' | 'CLAIMS'>('ANALYTICS');
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState<string>('ALL');
  const [itemSearch, setItemSearch] = useState('');

  // Analytics Aggregations
  const categoryCounts: Record<string, number> = {};
  const locationCounts: Record<string, number> = {};

  items.forEach(item => {
    categoryCounts[item.category] = (categoryCounts[item.category] || 0) + 1;
    const locKey = item.location.split('-')[0].trim();
    locationCounts[locKey] = (locationCounts[locKey] || 0) + 1;
  });

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(userSearch.toLowerCase()) || 
                          u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
                          u.studentOrStaffId.toLowerCase().includes(userSearch.toLowerCase()) ||
                          u.department.toLowerCase().includes(userSearch.toLowerCase());
    const matchesRole = userRoleFilter === 'ALL' || u.role === userRoleFilter;
    return matchesSearch && matchesRole;
  });

  const filteredItems = items.filter(i => 
    i.itemName.toLowerCase().includes(itemSearch.toLowerCase()) ||
    i.location.toLowerCase().includes(itemSearch.toLowerCase()) ||
    i.category.toLowerCase().includes(itemSearch.toLowerCase()) ||
    i.userName.toLowerCase().includes(itemSearch.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Admin Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 rounded-2xl p-6 sm:p-8 text-white shadow-xl mb-8 relative">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-indigo-600 to-blue-700 flex items-center justify-center text-white shadow-lg ring-4 ring-white/10 shrink-0">
              <ShieldAlert className="w-9 h-9" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/30 text-amber-200 border border-amber-400/30 uppercase">
                  Central Administrator
                </span>
                <span className="text-xs text-slate-300 font-mono">Control ID: ADM-001</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1">Campus Recovery Governance Hub</h1>
              <p className="text-xs sm:text-sm text-blue-200/80 mt-0.5">Full System Telemetry, User Directory & Master Database Controls</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => exportItemsToCSV(items, 'campuslost-master-inventory.csv')}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-all flex items-center gap-1.5"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              Export Items (CSV)
            </button>

            <button
              onClick={() => exportClaimsToCSV(claims, 'campuslost-master-claims.csv')}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-all flex items-center gap-1.5"
            >
              <Download className="w-4 h-4 text-blue-400" />
              Export Claims
            </button>
          </div>
        </div>
      </div>

      {/* System Key Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 mb-8">
        <div className="bg-white dark:bg-slate-850 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-xs font-bold text-slate-400 uppercase">Total Users</div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">{users.length}</div>
          <div className="text-[10px] text-blue-500 font-semibold mt-0.5">Students & Staff</div>
        </div>

        <div className="bg-white dark:bg-slate-850 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-xs font-bold text-rose-500 uppercase">Lost Items</div>
          <div className="text-2xl font-extrabold text-rose-600 dark:text-rose-400 mt-1">{stats.totalLost}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Active search cases</div>
        </div>

        <div className="bg-white dark:bg-slate-850 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-xs font-bold text-emerald-500 uppercase">Found Items</div>
          <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">{stats.totalFound}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Reported & Logged</div>
        </div>

        <div className="bg-white dark:bg-slate-850 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-xs font-bold text-indigo-500 uppercase">Recovered</div>
          <div className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400 mt-1">{stats.totalRecovered}</div>
          <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">Returned safely</div>
        </div>

        <div className="bg-white dark:bg-slate-850 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-xs font-bold text-amber-500 uppercase">Pending Claims</div>
          <div className="text-2xl font-extrabold text-amber-600 dark:text-amber-400 mt-1">{stats.totalPendingClaims}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">In security queue</div>
        </div>

        <div className="bg-white dark:bg-slate-850 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-xs font-bold text-blue-500 uppercase">Success Rate</div>
          <div className="text-2xl font-extrabold text-blue-600 dark:text-blue-400 mt-1">{stats.recoveryRatePercent}%</div>
          <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">Campus benchmark</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 mb-6 pb-1">
        <button
          onClick={() => setActiveTab('ANALYTICS')}
          className={`px-4 py-2.5 rounded-t-xl text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'ANALYTICS'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-950/40'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          Analytics & Heatmaps
        </button>

        <button
          onClick={() => setActiveTab('USERS')}
          className={`px-4 py-2.5 rounded-t-xl text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'USERS'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-950/40'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400'
          }`}
        >
          <Users className="w-4 h-4" />
          User Management ({users.length})
        </button>

        <button
          onClick={() => setActiveTab('ITEMS')}
          className={`px-4 py-2.5 rounded-t-xl text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'ITEMS'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-950/40'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400'
          }`}
        >
          <Package className="w-4 h-4" />
          Master Items ({items.length})
        </button>

        <button
          onClick={() => setActiveTab('CLAIMS')}
          className={`px-4 py-2.5 rounded-t-xl text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'CLAIMS'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-950/40'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400'
          }`}
        >
          <FileText className="w-4 h-4" />
          Claims Audit ({claims.length})
        </button>
      </div>

      {/* Tab 1: Visual Analytics Charts & Heatmaps */}
      {activeTab === 'ANALYTICS' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Category Distribution Chart */}
          <div className="bg-white dark:bg-slate-850 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
              <PieChart className="w-4 h-4 text-blue-600" />
              Lost & Found Reports by Category
            </h3>
            <div className="space-y-3">
              {Object.entries(categoryCounts).map(([cat, count]) => {
                const pct = Math.round((count / items.length) * 100) || 0;
                return (
                  <div key={cat} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                      <span>{cat}</span>
                      <span>{count} items ({pct}%)</span>
                    </div>
                    <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Campus Location Hotspots */}
          <div className="bg-white dark:bg-slate-850 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
              <Building className="w-4 h-4 text-emerald-600" />
              Campus Location Incident Frequency
            </h3>
            <div className="space-y-3">
              {Object.entries(locationCounts).map(([loc, count]) => {
                const pct = Math.round((count / items.length) * 100) || 0;
                return (
                  <div key={loc} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                      <span className="truncate max-w-[200px]">{loc}</span>
                      <span>{count} incidents ({pct}%)</span>
                    </div>
                    <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Monthly Trend Visualizer */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-850 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-indigo-600" />
              Semester Recovery & Resolution Timeline
            </h3>
            <p className="text-xs text-slate-500 mb-6">Comparison of total reported losses vs confirmed returns over recent academic months.</p>

            <div className="grid grid-cols-4 gap-4 text-center">
              {[
                { month: 'May 2026', lost: 14, recovered: 12, rate: '85%' },
                { month: 'Jun 2026', lost: 19, recovered: 17, rate: '89%' },
                { month: 'Jul 2026', lost: 24, recovered: 21, rate: '87%' },
                { month: 'Aug 2026 (Current)', lost: 10, recovered: 8, rate: '80%' }
              ].map((m) => (
                <div key={m.month} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200">{m.month}</div>
                  <div className="flex items-center justify-center gap-2 mt-2">
                    <span className="text-xs text-rose-500 font-bold">{m.lost} Lost</span>
                    <span className="text-slate-300">/</span>
                    <span className="text-xs text-emerald-500 font-bold">{m.recovered} Recovered</span>
                  </div>
                  <div className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 mt-1">
                    {m.rate} Return Rate
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: User Directory & Role Assignment */}
      {activeTab === 'USERS' && (
        <div className="bg-white dark:bg-slate-850 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder="Search by name, roll, email..."
                className="w-full pl-9 pr-3 py-1.5 rounded-lg text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs text-slate-400">Filter Role:</span>
              <select
                aria-label="Filter Users by Role"
                value={userRoleFilter}
                onChange={(e) => setUserRoleFilter(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200"
              >
                <option value="ALL">All Roles</option>
                <option value="STUDENT">Student</option>
                <option value="STAFF">Staff</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-900 text-slate-500 uppercase font-semibold text-[10px] border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="p-3.5">User</th>
                  <th className="p-3.5">ID / Roll No</th>
                  <th className="p-3.5">Department</th>
                  <th className="p-3.5">Role</th>
                  <th className="p-3.5">Contact</th>
                  <th className="p-3.5 text-right">Role Authorization</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="p-3.5 flex items-center gap-3">
                      <img src={u.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100'} alt={u.name} className="w-8 h-8 rounded-full object-cover shrink-0" />
                      <div>
                        <div className="font-bold text-slate-900 dark:text-slate-100">{u.name}</div>
                        <div className="text-[11px] text-slate-400">{u.email}</div>
                      </div>
                    </td>
                    <td className="p-3.5 font-mono text-slate-600 dark:text-slate-300 font-semibold">{u.studentOrStaffId}</td>
                    <td className="p-3.5 text-slate-600 dark:text-slate-300">{u.department}</td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        u.role === 'ADMIN'
                          ? 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300'
                          : u.role === 'STAFF'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                          : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="p-3.5 text-slate-500">{u.phone}</td>
                    <td className="p-3.5 text-right">
                      <select
                        aria-label={`Change Role for ${u.name}`}
                        value={u.role}
                        onChange={(e) => onUpdateUserRole(u.id, e.target.value as UserRole)}
                        className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-semibold cursor-pointer"
                      >
                        <option value="STUDENT">Student</option>
                        <option value="STAFF">Staff</option>
                        <option value="ADMIN">Admin</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Master Items Inventory */}
      {activeTab === 'ITEMS' && (
        <div className="bg-white dark:bg-slate-850 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <input
              type="text"
              value={itemSearch}
              onChange={(e) => setItemSearch(e.target.value)}
              placeholder="Search items by name, category, reporter..."
              className="w-72 px-3 py-1.5 rounded-lg text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-xs text-slate-500">{filteredItems.length} items cataloged</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-900 text-slate-500 uppercase font-semibold text-[10px] border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="p-3.5">Type</th>
                  <th className="p-3.5">Item Name</th>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5">Reported By</th>
                  <th className="p-3.5">Location</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        item.type === 'LOST' ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {item.type}
                      </span>
                    </td>
                    <td className="p-3.5 font-bold text-slate-900 dark:text-slate-100">{item.itemName}</td>
                    <td className="p-3.5 text-slate-600 dark:text-slate-300">{item.category}</td>
                    <td className="p-3.5 text-slate-600 dark:text-slate-300">{item.userName} ({item.userRole})</td>
                    <td className="p-3.5 text-slate-500 truncate max-w-[150px]">{item.location}</td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200">
                        {item.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onSelectItem(item)}
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                          title="View"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteItem(item.id)}
                          className="p-1 text-rose-600 hover:bg-rose-50 rounded"
                          title="Delete Post"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Master Claims Audit */}
      {activeTab === 'CLAIMS' && (
        <div className="bg-white dark:bg-slate-850 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Complete Claims Audit Trail</h3>
            <button
              onClick={() => exportClaimsToCSV(claims)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-1"
            >
              <Download className="w-3.5 h-3.5" /> Export All Claims
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-900 text-slate-500 uppercase font-semibold text-[10px] border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="p-3.5">Claim ID</th>
                  <th className="p-3.5">Item</th>
                  <th className="p-3.5">Student Claimant</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5">Verified By</th>
                  <th className="p-3.5">Created Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {claims.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="p-3.5 font-mono font-bold text-slate-700 dark:text-slate-300">{c.id}</td>
                    <td className="p-3.5 font-semibold text-slate-900 dark:text-slate-100">{c.itemName}</td>
                    <td className="p-3.5 text-slate-600 dark:text-slate-300">{c.studentName} ({c.studentRollNo})</td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        c.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' : c.status === 'REJECTED' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-slate-500">{c.verifiedByStaffName || 'Pending'}</td>
                    <td className="p-3.5 text-slate-400">{new Date(c.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
