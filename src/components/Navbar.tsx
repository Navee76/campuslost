import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Search, 
  Bell, 
  Sparkles, 
  Moon, 
  Sun, 
  LogOut, 
  LogIn, 
  UserCheck, 
  Code2, 
  LayoutDashboard, 
  PlusCircle,
  X,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { User, Notification, UserRole } from '../types';

interface NavbarProps {
  currentUser: User;
  activeView: string;
  onNavigate: (view: string) => void;
  onOpenReportLost: () => void;
  onOpenReportFound: () => void;
  onOpenAuth: () => void;
  onRoleChange: (role: UserRole) => void;
  notifications?: Notification[];
  onMarkNotificationRead?: (notifId: string) => void;
  onClearAllNotifications?: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  activeView,
  onNavigate,
  onOpenReportLost,
  onOpenReportFound,
  onOpenAuth,
  onRoleChange = (_role: UserRole) => {},
  notifications = [],
  onMarkNotificationRead = (_notifId: string) => {},
  onClearAllNotifications = () => {},
  darkMode,
  onToggleDarkMode
}) => {
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const unreadCount = (notifications || []).filter(n => !n.read && n.userId === currentUser.id).length;

  return (
    <header className="sticky top-0 z-40 w-full shadow-sm shrink-0 border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md transition-colors">
      {/* College Emergency / Top Alert Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-800 text-white text-xs py-1.5 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="bg-blue-600/80 px-2 py-0.5 rounded font-semibold text-[10px] uppercase tracking-wider">Campus Lost & Found</span>
            <span className="hidden sm:inline">Centralized Campus Recovery Helpline: +91 80 2345 6789 | Security Desk CSE Block & Library</span>
            <span className="sm:hidden">Campus Lost & Found Active</span>
          </div>

          {/* Quick Role Switcher */}
          <div className="flex items-center gap-2">
            <span className="text-blue-200 text-[11px] hidden md:inline font-medium">Active Role:</span>
            <select
              id="navbar-role-switcher"
              aria-label="Switch User Role"
              value={currentUser.role}
              onChange={(e) => onRoleChange(e.target.value as UserRole)}
              className="bg-blue-950/90 border border-blue-700 text-white text-xs rounded-lg px-2.5 py-0.5 focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer font-semibold"
            >
              <option value="STUDENT">Student (Naveen K.)</option>
              <option value="STAFF">Staff (Dr. R. Kumar)</option>
              <option value="ADMIN">Admin (Dean Office)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo with Vibrant Palette "C" emblem */}
          <div 
            onClick={() => onNavigate('HOME')}
            className="flex items-center gap-3 cursor-pointer group shrink-0"
          >
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-md shadow-blue-600/30 group-hover:scale-105 transition-transform">
              C
            </div>
            <div>
              <span className="text-xl font-extrabold text-blue-900 dark:text-blue-400 tracking-tight">
                CampusLost
              </span>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 -mt-1 hidden sm:block font-medium">
                Smart College Lost & Found
              </p>
            </div>
          </div>

          {/* Navigation Links with Vibrant Palette tab highlights */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
            <button
              id="nav-home-btn"
              onClick={() => onNavigate('HOME')}
              className={`h-16 flex items-center transition-colors font-semibold ${
                activeView === 'HOME'
                  ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600'
                  : 'hover:text-blue-600 dark:hover:text-blue-400'
              }`}
            >
              Home
            </button>

            <button
              id="nav-search-btn"
              onClick={() => onNavigate('SEARCH')}
              className={`h-16 flex items-center transition-colors font-semibold gap-1.5 ${
                activeView === 'SEARCH'
                  ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600'
                  : 'hover:text-blue-600 dark:hover:text-blue-400'
              }`}
            >
              <Search className="w-4 h-4" />
              Search Items
            </button>

            <button
              id="nav-smartmatch-btn"
              onClick={() => onNavigate('SMART_MATCH')}
              className={`h-16 flex items-center transition-colors font-semibold gap-1.5 ${
                activeView === 'SMART_MATCH'
                  ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600'
                  : 'hover:text-blue-600 dark:hover:text-blue-400'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              Smart Matching
            </button>

            {currentUser.role === 'STUDENT' && (
              <button
                id="nav-student-dash-btn"
                onClick={() => onNavigate('STUDENT_DASH')}
                className={`h-16 flex items-center transition-colors font-semibold gap-1.5 ${
                  activeView === 'STUDENT_DASH'
                    ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600'
                    : 'hover:text-blue-600 dark:hover:text-blue-400'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                Student Dashboard
              </button>
            )}

            {currentUser.role === 'STAFF' && (
              <button
                id="nav-staff-dash-btn"
                onClick={() => onNavigate('STAFF_DASH')}
                className={`h-16 flex items-center transition-colors font-semibold gap-1.5 ${
                  activeView === 'STAFF_DASH'
                    ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600'
                    : 'hover:text-blue-600 dark:hover:text-blue-400'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                Staff Verification Desk
              </button>
            )}

            {currentUser.role === 'ADMIN' && (
              <button
                id="nav-admin-dash-btn"
                onClick={() => onNavigate('ADMIN_DASH')}
                className={`h-16 flex items-center transition-colors font-semibold gap-1.5 ${
                  activeView === 'ADMIN_DASH'
                    ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600'
                    : 'hover:text-blue-600 dark:hover:text-blue-400'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                Admin Hub
              </button>
            )}

            <button
              id="nav-spring-boot-btn"
              onClick={() => onNavigate('SPRING_BOOT_CODE')}
              className={`h-16 flex items-center transition-colors font-semibold gap-1.5 ${
                activeView === 'SPRING_BOOT_CODE'
                  ? 'text-emerald-600 dark:text-emerald-400 border-b-2 border-emerald-600'
                  : 'text-emerald-600 hover:text-emerald-700 dark:text-emerald-400'
              }`}
            >
              <Code2 className="w-4 h-4" />
              Spring Boot Code
            </button>
          </nav>

          {/* Action Buttons, Notification Bell & User Profile */}
          <div className="flex items-center gap-3">
            {/* Quick Action Buttons */}
            <button
              id="header-report-lost-btn"
              onClick={onOpenReportLost}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800 transition-colors"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              Report Lost
            </button>

            <button
              id="header-report-found-btn"
              onClick={onOpenReportFound}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800 transition-colors"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              Report Found
            </button>

            {/* Notification Bell with Vibrant Red Badge */}
            <div className="relative">
              <button
                id="nav-notification-bell"
                aria-label="View Notifications"
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className="relative p-2 rounded-xl text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
              >
                <Bell className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                {unreadCount > 0 && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white dark:border-slate-900 text-[10px] flex items-center justify-center text-white font-bold animate-pulse">
                    {unreadCount}
                  </div>
                )}
              </button>

              {/* Notification Dropdown Drawer */}
              {isNotifOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white dark:bg-slate-850 shadow-2xl border border-slate-200 dark:border-slate-800 py-3 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-4 pb-2 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bell className="w-4 h-4 text-blue-600" />
                      <span className="font-bold text-xs text-slate-900 dark:text-white">Campus Notifications</span>
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={onClearAllNotifications}
                        className="text-[11px] text-blue-600 hover:underline font-semibold"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>

                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-xs text-slate-400">
                        No notifications at this time.
                      </div>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => onMarkNotificationRead(n.id)}
                          className={`p-3.5 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors flex items-start gap-3 ${
                            !n.read ? 'bg-blue-50/50 dark:bg-blue-950/20' : ''
                          }`}
                        >
                          <div className="w-2 h-2 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-bold text-slate-900 dark:text-white">{n.title}</div>
                            <div className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5 leading-snug">{n.message}</div>
                            <div className="text-[9px] text-slate-400 mt-1">
                              {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Dark & Bright Mode Toggle Button */}
            <button
              id="theme-toggle-btn"
              onClick={onToggleDarkMode}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border shadow-sm ${
                darkMode
                  ? 'bg-slate-800 text-amber-300 border-slate-700 hover:bg-slate-750 hover:text-amber-200'
                  : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
              }`}
              title={darkMode ? 'Switch to Bright Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle Bright/Dark Mode"
            >
              {darkMode ? (
                <>
                  <Sun className="w-4 h-4 text-amber-400 animate-spin-slow" />
                  <span className="hidden sm:inline">Bright Mode</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-indigo-600" />
                  <span className="hidden sm:inline">Dark Mode</span>
                </>
              )}
            </button>

            {/* User Profile Pill */}
            <div 
              onClick={onOpenAuth}
              className="flex items-center gap-2 pl-3 border-l border-slate-200 dark:border-slate-800 cursor-pointer group"
              title="Click to switch or log in"
            >
              <img
                src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=100'}
                alt={currentUser.name}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-blue-500/30"
              />
              <div className="hidden sm:block text-left">
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-blue-600">
                  {currentUser.name}
                </div>
                <div className="text-[10px] text-slate-400 font-semibold uppercase">
                  {currentUser.role}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
