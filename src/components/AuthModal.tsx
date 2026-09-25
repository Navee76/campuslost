import React, { useState } from 'react';
import { 
  User, 
  UserRole 
} from '../types';
import { 
  LogIn, 
  UserPlus, 
  ShieldCheck, 
  Lock, 
  Mail, 
  Phone, 
  Building, 
  User as UserIcon, 
  X,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { INITIAL_USERS } from '../data/mockData';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: User) => void;
  onRegister: (newUser: Omit<User, 'id' | 'createdAt'>) => void;
}

const DEPARTMENTS = [
  'Computer Science & Engineering',
  'Electronics & Communication',
  'Mechanical Engineering',
  'Civil Engineering',
  'Information Technology',
  'Campus Security & Welfare Office',
  'Student Affairs & Mentorship',
  'Central University Administration'
];

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLogin,
  onRegister
}) => {
  const [authMode, setAuthMode] = useState<'LOGIN' | 'REGISTER'>('LOGIN');
  
  // Login Form
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('password123');

  // Register Form
  const [name, setName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [role, setRole] = useState<UserRole>('STUDENT');
  const [department, setDepartment] = useState(DEPARTMENTS[0]);
  const [phone, setPhone] = useState('');
  const [studentOrStaffId, setStudentOrStaffId] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleQuickLogin = (demoUser: User) => {
    onLogin(demoUser);
    onClose();
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const user = INITIAL_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (user) {
      onLogin(user);
      onClose();
    } else {
      // Default to standard user profile
      const fallbackUser: User = {
        id: 'user-' + Date.now(),
        name: email.split('@')[0],
        email: email,
        role: 'STUDENT',
        department: 'General Engineering',
        phone: '+91 98765 43210',
        studentOrStaffId: '21CS' + Math.floor(1000 + Math.random() * 9000),
        createdAt: new Date().toISOString()
      };
      onLogin(fallbackUser);
      onClose();
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !regEmail.trim() || !phone.trim() || !studentOrStaffId.trim()) {
      setErrorMsg('Please fill in all registration fields.');
      return;
    }

    onRegister({
      name: name.trim(),
      email: regEmail.trim(),
      role,
      department,
      phone: phone.trim(),
      studentOrStaffId: studentOrStaffId.trim().toUpperCase()
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-850 rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 my-8 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                {authMode === 'LOGIN' ? 'Sign In to CampusLost' : 'Register New Account'}
              </h3>
              <p className="text-[11px] text-slate-500">University Single Sign-On & Verification</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Demo Logins Banner */}
        <div className="mt-4 p-3 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800">
          <span className="text-[11px] font-bold text-blue-900 dark:text-blue-300 block mb-2">
            ⚡ One-Click Instant Demo Login:
          </span>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {INITIAL_USERS.slice(0, 4).map((u) => (
              <button
                key={u.id}
                type="button"
                onClick={() => handleQuickLogin(u)}
                className="p-2 rounded-lg bg-white dark:bg-slate-900 hover:bg-blue-100 dark:hover:bg-blue-900/60 border border-blue-200/80 dark:border-blue-700/50 text-left transition-all group"
              >
                <div className="font-bold text-slate-800 dark:text-slate-200 text-xs truncate group-hover:text-blue-600">
                  {u.name}
                </div>
                <div className="text-[10px] text-slate-400 font-semibold uppercase mt-0.5">
                  {u.role} • {u.studentOrStaffId}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Mode Switcher */}
        <div className="flex items-center rounded-xl bg-slate-100 dark:bg-slate-900 p-1 mt-4">
          <button
            type="button"
            onClick={() => setAuthMode('LOGIN')}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
              authMode === 'LOGIN' ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-500'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setAuthMode('REGISTER')}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
              authMode === 'REGISTER' ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-500'
            }`}
          >
            Register Student / Staff
          </button>
        </div>

        {errorMsg && (
          <div className="mt-3 p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
            {errorMsg}
          </div>
        )}

        {authMode === 'LOGIN' ? (
          <form onSubmit={handleLoginSubmit} className="mt-4 space-y-3 text-xs">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                College Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. naveen.cs21@college.edu"
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-1.5 mt-2"
            >
              <LogIn className="w-4 h-4" />
              Sign In to Account
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegisterSubmit} className="mt-4 space-y-3 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Full Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Arun Varma"
                  className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Roll / Staff ID *</label>
                <input
                  type="text"
                  value={studentOrStaffId}
                  onChange={(e) => setStudentOrStaffId(e.target.value)}
                  placeholder="e.g. 21ME3019 or STF-102"
                  className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-mono"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Role *</label>
                <select
                  aria-label="User Account Role"
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                >
                  <option value="STUDENT">Student</option>
                  <option value="STAFF">Campus Staff / Security</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Mobile Contact *</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Department *</label>
              <select
                aria-label="Academic Department"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100"
              >
                {DEPARTMENTS.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">College Email Address *</label>
              <input
                type="email"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                placeholder="name@college.edu"
                className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-1.5 mt-2"
            >
              <UserPlus className="w-4 h-4" />
              Create Verified Account
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
