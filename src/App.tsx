import React, { useState, useEffect, useMemo } from 'react';
import { 
  User, 
  Item, 
  Claim, 
  Notification, 
  UserRole, 
  ItemCategory, 
  SystemStats 
} from './types';
import { 
  INITIAL_USERS, 
  INITIAL_ITEMS, 
  INITIAL_CLAIMS, 
  INITIAL_NOTIFICATIONS 
} from './data/mockData';
import { calculateAllMatches } from './utils/matchingEngine';

// Components
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { StudentDashboard } from './components/StudentDashboard';
import { StaffDashboard } from './components/StaffDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { SearchModule } from './components/SearchModule';
import { SmartMatchModal } from './components/SmartMatchModal';
import { SpringBootSourceViewer } from './components/SpringBootSourceViewer';
import { ReportLostModal } from './components/ReportLostModal';
import { ReportFoundModal } from './components/ReportFoundModal';
import { ClaimModal } from './components/ClaimModal';
import { ItemDetailsModal } from './components/ItemDetailsModal';
import { AuthModal } from './components/AuthModal';
import { RecoverySuccessModal } from './components/RecoverySuccessModal';

import { 
  Sparkles, 
  CheckCircle2, 
  ShieldAlert, 
  X, 
  Bell, 
  ArrowRight,
  Code2
} from 'lucide-react';

export default function App() {
  // Local state persistence
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('campuslost_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [currentUser, setCurrentUser] = useState<User>(() => {
    return INITIAL_USERS[0]; // Default: Naveen Kumar (Student)
  });

  const [items, setItems] = useState<Item[]>(() => {
    const saved = localStorage.getItem('campuslost_items');
    return saved ? JSON.parse(saved) : INITIAL_ITEMS;
  });

  const [claims, setClaims] = useState<Claim[]>(() => {
    const saved = localStorage.getItem('campuslost_claims');
    return saved ? JSON.parse(saved) : INITIAL_CLAIMS;
  });

  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const saved = localStorage.getItem('campuslost_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('campuslost_theme');
    return saved ? saved === 'dark' : false;
  });
  const [activeView, setActiveView] = useState<
    'HOME' | 'SEARCH' | 'STUDENT_DASH' | 'STAFF_DASH' | 'ADMIN_DASH' | 'SMART_MATCH' | 'SPRING_BOOT_CODE'
  >('HOME');

  // Search filter carry-over
  const [catalogSearchQuery, setCatalogSearchQuery] = useState('');
  const [catalogCategory, setCatalogCategory] = useState<ItemCategory | undefined>(undefined);

  // Modals state
  const [isReportLostOpen, setIsReportLostOpen] = useState(false);
  const [isReportFoundOpen, setIsReportFoundOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isClaimOpen, setIsClaimOpen] = useState(false);
  const [isItemDetailsOpen, setIsItemDetailsOpen] = useState(false);
  const [recoverySuccessData, setRecoverySuccessData] = useState<{
    lostItem: Item;
    foundItem: Item;
    matchScore?: number;
  } | null>(null);

  // Selection targets
  const [selectedItemForDetails, setSelectedItemForDetails] = useState<Item | null>(null);
  const [selectedItemForClaim, setSelectedItemForClaim] = useState<Item | null>(null);

  // Live Toast Notification
  const [toastMessage, setToastMessage] = useState<{ title: string; desc: string; type: 'SUCCESS' | 'ALERT' | 'INFO' } | null>(null);

  // Save to LocalStorage on state changes
  useEffect(() => {
    localStorage.setItem('campuslost_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('campuslost_items', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem('campuslost_claims', JSON.stringify(claims));
  }, [claims]);

  useEffect(() => {
    localStorage.setItem('campuslost_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Dark Mode Class Handler & Storage Persistence
  useEffect(() => {
    localStorage.setItem('campuslost_theme', darkMode ? 'dark' : 'light');
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Computed Matches
  const matches = useMemo(() => {
    return calculateAllMatches(items);
  }, [items]);

  // Computed System Stats
  const stats: SystemStats = useMemo(() => {
    const totalLost = items.filter(i => i.type === 'LOST').length;
    const totalFound = items.filter(i => i.type === 'FOUND').length;
    const totalRecovered = items.filter(i => i.status === 'RETURNED').length;
    const totalPendingClaims = claims.filter(c => c.status === 'PENDING').length;
    const totalClaims = claims.length;
    const recoveryRatePercent = totalLost > 0 ? Math.round((totalRecovered / totalLost) * 100) : 85;

    return {
      totalLost,
      totalFound,
      totalRecovered,
      totalPendingClaims,
      totalClaims,
      recoveryRatePercent
    };
  }, [items, claims]);

  // Show Toast Helper
  const showToast = (title: string, desc: string, type: 'SUCCESS' | 'ALERT' | 'INFO' = 'SUCCESS') => {
    setToastMessage({ title, desc, type });
    setTimeout(() => setToastMessage(null), 5000);
  };

  // Handlers
  const handleRoleChange = (role: UserRole) => {
    const matchingUser = users.find(u => u.role === role) || users[0];
    setCurrentUser(matchingUser);

    if (role === 'STUDENT') setActiveView('STUDENT_DASH');
    else if (role === 'STAFF') setActiveView('STAFF_DASH');
    else if (role === 'ADMIN') setActiveView('ADMIN_DASH');

    showToast(`Switched Role to ${role}`, `Acting as ${matchingUser.name} (${matchingUser.department})`, 'INFO');
  };

  const handleAddLostItem = (lostItemData: Omit<Item, 'id' | 'createdAt' | 'status'>) => {
    const newItem: Item = {
      ...lostItemData,
      id: 'item-lost-' + Date.now(),
      status: 'OPEN',
      createdAt: new Date().toISOString()
    };

    const updated = [newItem, ...items];
    setItems(updated);

    // Calculate smart matches for this new lost item
    const newMatches = calculateAllMatches(updated).filter(m => m.lostItem.id === newItem.id);

    if (newMatches.length > 0) {
      showToast(
        'Lost Item Reported & Match Detected!',
        `Smart Matcher found ${newMatches.length} candidate item(s) with high similarity.`,
        'SUCCESS'
      );
      // Create notification
      const newNotif: Notification = {
        id: 'notif-' + Date.now(),
        userId: currentUser.id,
        title: `Possible Match Found for "${newItem.itemName}"!`,
        message: `A found item matches ${newMatches[0].score.totalPercentage}% with your report. Click to inspect.`,
        type: 'MATCH_ALERT',
        read: false,
        createdAt: new Date().toISOString(),
        itemId: newItem.id
      };
      setNotifications(prev => [newNotif, ...prev]);
    } else {
      showToast(
        'Lost Item Published Successfully',
        'Campus community and security desks have been notified.',
        'SUCCESS'
      );
    }
  };

  const handleAddFoundItem = (foundItemData: Omit<Item, 'id' | 'createdAt' | 'status'>) => {
    const newItem: Item = {
      ...foundItemData,
      id: 'item-found-' + Date.now(),
      status: 'OPEN',
      createdAt: new Date().toISOString()
    };

    const updated = [newItem, ...items];
    setItems(updated);

    // Check matches
    const newMatches = calculateAllMatches(updated).filter(m => m.foundItem.id === newItem.id);

    if (newMatches.length > 0) {
      showToast(
        'Found Item Logged & Match Found!',
        `Identified potential owner complaint (${newMatches[0].lostItem.itemName}).`,
        'SUCCESS'
      );
    } else {
      showToast(
        'Found Item Successfully Logged',
        'Item placed in secure custody. Available in public catalog.',
        'SUCCESS'
      );
    }
  };

  const handleInitiateClaim = (item: Item) => {
    setSelectedItemForClaim(item);
    setIsClaimOpen(true);
  };

  const handleSubmitClaim = (
    itemId: string,
    verificationAnswer: string,
    uniqueMarks: string,
    proofDocName?: string
  ) => {
    const targetItem = items.find(i => i.id === itemId);
    if (!targetItem) return;

    const newClaim: Claim = {
      id: 'CLM-' + Math.floor(1000 + Math.random() * 9000),
      foundItemId: targetItem.id,
      itemName: targetItem.itemName,
      studentId: currentUser.id,
      studentName: currentUser.name,
      studentRollNo: currentUser.studentOrStaffId,
      studentDepartment: currentUser.department,
      studentPhone: currentUser.phone,
      verificationAnswer,
      uniqueMarks,
      proofDocName,
      status: 'PENDING',
      createdAt: new Date().toISOString()
    };

    setClaims(prev => [newClaim, ...prev]);

    // Notify student
    const studentNotif: Notification = {
      id: 'notif-' + Date.now(),
      userId: currentUser.id,
      title: `Claim Submitted for ${targetItem.itemName}`,
      message: `Your claim (${newClaim.id}) is under review by Campus Security (Dr. Kumar).`,
      type: 'CLAIM_UPDATE',
      read: false,
      createdAt: new Date().toISOString(),
      itemId: targetItem.id
    };

    // Notify staff
    const staffNotif: Notification = {
      id: 'notif-staff-' + Date.now(),
      userId: 'user-3', // Dr. Kumar
      title: `New Claim (${newClaim.id}) from ${currentUser.name}`,
      message: `Review claim for ${targetItem.itemName} at security desk.`,
      type: 'CLAIM_UPDATE',
      read: false,
      createdAt: new Date().toISOString(),
      itemId: targetItem.id
    };

    setNotifications(prev => [studentNotif, staffNotif, ...prev]);

    showToast(
      'Claim Successfully Submitted',
      `Claim reference #${newClaim.id} is queued for security verification.`,
      'SUCCESS'
    );
  };

  const handleApproveClaim = (claimId: string, remarks?: string) => {
    const qrPassCode = 'QR-PASS-' + Math.random().toString(36).substring(2, 9).toUpperCase();

    setClaims(prev => prev.map(c => {
      if (c.id === claimId) {
        return {
          ...c,
          status: 'APPROVED',
          verifiedByStaffId: currentUser.id,
          verifiedByStaffName: currentUser.name,
          staffRemarks: remarks || 'Ownership verified via identification answers & security check.',
          qrPassCode,
          resolvedAt: new Date().toISOString()
        };
      }
      return c;
    }));

    const claim = claims.find(c => c.id === claimId);
    if (claim) {
      // Mark item as returned
      setItems(prev => prev.map(item => {
        if (item.id === claim.foundItemId) {
          return { ...item, status: 'RETURNED' };
        }
        return item;
      }));

      // Notify claimant
      const approvedNotif: Notification = {
        id: 'notif-approved-' + Date.now(),
        userId: claim.studentId,
        title: `Claim Approved! Collection QR Pass Generated`,
        message: `Your claim for ${claim.itemName} was approved. Present QR code (${qrPassCode}) at Security Desk.`,
        type: 'CLAIM_UPDATE',
        read: false,
        createdAt: new Date().toISOString(),
        itemId: claim.foundItemId
      };
      setNotifications(prev => [approvedNotif, ...prev]);
    }

    showToast('Claim Approved & Pass Issued', `QR Pickup Pass generated for student collection.`, 'SUCCESS');
  };

  const handleRejectClaim = (claimId: string, remarks?: string) => {
    setClaims(prev => prev.map(c => {
      if (c.id === claimId) {
        return {
          ...c,
          status: 'REJECTED',
          verifiedByStaffId: currentUser.id,
          verifiedByStaffName: currentUser.name,
          staffRemarks: remarks || 'Verification answers did not match records.',
          resolvedAt: new Date().toISOString()
        };
      }
      return c;
    }));

    const claim = claims.find(c => c.id === claimId);
    if (claim) {
      const rejectedNotif: Notification = {
        id: 'notif-rejected-' + Date.now(),
        userId: claim.studentId,
        title: `Claim Verification Update for ${claim.itemName}`,
        message: `Your claim was reviewed. Please visit security desk with physical ID proof.`,
        type: 'CLAIM_UPDATE',
        read: false,
        createdAt: new Date().toISOString(),
        itemId: claim.foundItemId
      };
      setNotifications(prev => [rejectedNotif, ...prev]);
    }

    showToast('Claim Rejected', 'Student has been notified to provide physical documentation.', 'ALERT');
  };

  const handleMarkNotificationRead = (notifId: string) => {
    setNotifications(prev => prev.map(n => n.id === notifId ? { ...n, read: true } : n));
  };

  const handleClearAllNotifications = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleUpdateUserRole = (userId: string, newRole: UserRole) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
    showToast('User Role Updated', `Role changed to ${newRole}`, 'SUCCESS');
  };

  const handleDeleteItem = (itemId: string) => {
    setItems(prev => prev.filter(i => i.id !== itemId));
    showToast('Item Removed', 'The item has been deleted from the catalog.', 'INFO');
  };

  const handleMarkMatchRecovered = (lostItem: Item, foundItem: Item, matchScore: number = 92) => {
    // 1. Mark both items as RETURNED
    setItems(prev => prev.map(item => {
      if (item.id === lostItem.id || item.id === foundItem.id) {
        return { ...item, status: 'RETURNED' };
      }
      return item;
    }));

    // 2. Resolve any related claim to APPROVED
    setClaims(prev => prev.map(c => {
      if (c.foundItemId === foundItem.id || (c.studentId === lostItem.userId && c.itemName === lostItem.itemName)) {
        return {
          ...c,
          status: 'APPROVED',
          verifiedByStaffId: currentUser.id,
          verifiedByStaffName: currentUser.name,
          staffRemarks: `Resolved automatically via Smart Match Verification (${matchScore}% match).`,
          resolvedAt: new Date().toISOString()
        };
      }
      return c;
    }));

    // 3. Create celebratory notification
    const recoveryNotif: Notification = {
      id: 'notif-rec-' + Date.now(),
      userId: lostItem.userId || currentUser.id,
      title: `🎉 Lost Item Recovered: "${lostItem.itemName}"!`,
      message: `Your lost item has been officially verified and marked as recovered through CampusLost smart matching.`,
      type: 'MATCH_ALERT',
      read: false,
      createdAt: new Date().toISOString(),
      itemId: lostItem.id
    };
    setNotifications(prev => [recoveryNotif, ...prev]);

    // 4. Show Toast and open celebratory recovery modal
    showToast(
      'Lost Item Recovered Successfully!',
      `"${lostItem.itemName}" has been marked as recovered and returned to owner.`,
      'SUCCESS'
    );

    setRecoverySuccessData({
      lostItem,
      foundItem,
      matchScore
    });
  };

  const handleSelectItem = (item: Item) => {
    setSelectedItemForDetails(item);
    setIsItemDetailsOpen(true);
  };

  // Find if current user has an approved claim for the selected item
  const userApprovedClaim = useMemo(() => {
    if (!selectedItemForDetails) return null;
    return claims.find(c => c.foundItemId === selectedItemForDetails.id && c.studentId === currentUser.id);
  }, [claims, selectedItemForDetails, currentUser]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 animate-in slide-in-from-bottom-5 duration-300 max-w-sm">
          <div className={`p-4 rounded-2xl shadow-2xl border flex items-start gap-3 text-xs ${
            toastMessage.type === 'SUCCESS' 
              ? 'bg-slate-900 text-white border-emerald-500/50 dark:bg-slate-950 ring-2 ring-emerald-500/20'
              : toastMessage.type === 'ALERT'
              ? 'bg-rose-950 text-white border-rose-500/50 ring-2 ring-rose-500/20'
              : 'bg-slate-900 text-white border-blue-500/50 ring-2 ring-blue-500/20'
          }`}>
            {toastMessage.type === 'SUCCESS' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            ) : toastMessage.type === 'ALERT' ? (
              <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            ) : (
              <Sparkles className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
            )}
            <div className="flex-1 min-w-0">
              <div className="font-bold text-sm">{toastMessage.title}</div>
              <div className="text-slate-300 mt-0.5 leading-relaxed">{toastMessage.desc}</div>
            </div>
            <button
              onClick={() => setToastMessage(null)}
              className="text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main Navigation Bar */}
      <Navbar
        currentUser={currentUser}
        activeView={activeView}
        onNavigate={(view) => setActiveView(view as any)}
        onOpenReportLost={() => setIsReportLostOpen(true)}
        onOpenReportFound={() => setIsReportFoundOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onRoleChange={handleRoleChange}
        notifications={notifications}
        onMarkNotificationRead={handleMarkNotificationRead}
        onClearAllNotifications={handleClearAllNotifications}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
      />

      {/* Spring Boot Floating Quick Inspector Link */}
      <div className="bg-gradient-to-r from-emerald-900 to-teal-950 text-white text-xs px-4 py-2 flex items-center justify-between border-b border-emerald-800/60 shadow-inner">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/30 text-emerald-300 font-bold uppercase text-[10px] border border-emerald-400/40">
              Spring Boot MVC Architecture
            </span>
            <span className="hidden sm:inline text-slate-200">
              Fully implemented backend with MySQL JPA repositories, Matching Service, and Spring Security 6.
            </span>
          </div>

          <button
            onClick={() => setActiveView('SPRING_BOOT_CODE')}
            className="font-bold text-emerald-300 hover:text-white underline flex items-center gap-1 shrink-0"
          >
            <Code2 className="w-3.5 h-3.5" />
            View Java Source Code ({SPRING_BOOT_PROJECT_FILES_COUNT || 14} files)
          </button>
        </div>
      </div>

      {/* Main Dynamic View Content */}
      <main className="flex-1">
        {activeView === 'HOME' && (
          <HeroSection
            stats={stats}
            recentRecoveries={items.filter(i => i.status === 'RETURNED' || i.status === 'VERIFIED')}
            onOpenReportLost={() => setIsReportLostOpen(true)}
            onOpenReportFound={() => setIsReportFoundOpen(true)}
            onOpenSearch={() => setActiveView('SEARCH')}
            onOpenMatches={() => setActiveView('SMART_MATCH')}
            onNavigateToSmartMatch={() => setActiveView('SMART_MATCH')}
            onSelectItem={handleSelectItem}
            onCategorySelect={(cat) => {
              setCatalogCategory(cat);
              setActiveView('SEARCH');
            }}
          />
        )}

        {activeView === 'SEARCH' && (
          <SearchModule
            items={items}
            initialQuery={catalogSearchQuery}
            initialCategory={catalogCategory}
            onSelectItem={handleSelectItem}
            onInitiateClaim={handleInitiateClaim}
            onOpenReportLost={() => setIsReportLostOpen(true)}
            onOpenReportFound={() => setIsReportFoundOpen(true)}
          />
        )}

        {activeView === 'STUDENT_DASH' && (
          <StudentDashboard
            currentUser={currentUser}
            items={items}
            claims={claims}
            matches={matches}
            potentialMatches={matches}
            notifications={notifications}
            onOpenReportLost={() => setIsReportLostOpen(true)}
            onOpenReportFound={() => setIsReportFoundOpen(true)}
            onOpenSearch={() => setActiveView('SEARCH')}
            onNavigateToSmartMatch={() => setActiveView('SMART_MATCH')}
            onSelectItem={handleSelectItem}
            onDeleteReport={handleDeleteItem}
            onInitiateClaim={handleInitiateClaim}
            onConfirmRecovery={handleMarkMatchRecovered}
          />
        )}

        {activeView === 'STAFF_DASH' && (
          <StaffDashboard
            currentUser={currentUser}
            items={items}
            claims={claims}
            onOpenReportFound={() => setIsReportFoundOpen(true)}
            onApproveClaim={handleApproveClaim}
            onRejectClaim={handleRejectClaim}
            onMarkItemReturned={(itemId) => {
              setItems(prev => prev.map(i => i.id === itemId ? { ...i, status: 'RETURNED' } : i));
            }}
            onSelectItem={handleSelectItem}
          />
        )}

        {activeView === 'ADMIN_DASH' && (
          <AdminDashboard
            currentUser={currentUser}
            users={users}
            items={items}
            claims={claims}
            stats={stats}
            onUpdateUserRole={handleUpdateUserRole}
            onDeleteItem={handleDeleteItem}
            onSelectItem={handleSelectItem}
          />
        )}

        {activeView === 'SMART_MATCH' && (
          <SmartMatchModal
            matches={matches}
            currentUser={currentUser}
            onInitiateClaim={handleInitiateClaim}
            onSelectItem={handleSelectItem}
            onConfirmRecovery={handleMarkMatchRecovered}
          />
        )}

        {activeView === 'SPRING_BOOT_CODE' && (
          <SpringBootSourceViewer />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 py-8 px-4 sm:px-6 lg:px-8 text-xs text-slate-500 dark:text-slate-400 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center">
              CL
            </div>
            <div>
              <div className="font-extrabold text-slate-900 dark:text-white">CampusLost System</div>
              <div>Smart College Lost & Found Platform • Spring Boot 3 & React</div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-slate-600 dark:text-slate-400 font-semibold">
            <button onClick={() => setActiveView('HOME')} className="hover:text-blue-600">Home</button>
            <button onClick={() => setActiveView('SEARCH')} className="hover:text-blue-600">Search Catalog</button>
            <button onClick={() => setActiveView('SMART_MATCH')} className="hover:text-blue-600">Smart Matching Radar</button>
            <button onClick={() => setActiveView('SPRING_BOOT_CODE')} className="hover:text-blue-600">Java Codebase</button>
          </div>

          <div>
            © 2026 Campus Security & Student Welfare Office. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Modal Dialogs */}
      <ReportLostModal
        isOpen={isReportLostOpen}
        onClose={() => setIsReportLostOpen(false)}
        currentUser={currentUser}
        onSubmit={handleAddLostItem}
      />

      <ReportFoundModal
        isOpen={isReportFoundOpen}
        onClose={() => setIsReportFoundOpen(false)}
        currentUser={currentUser}
        onSubmit={handleAddFoundItem}
      />

      <ClaimModal
        isOpen={isClaimOpen}
        item={selectedItemForClaim}
        currentUser={currentUser}
        onClose={() => {
          setIsClaimOpen(false);
          setSelectedItemForClaim(null);
        }}
        onSubmitClaim={handleSubmitClaim}
      />

      <ItemDetailsModal
        item={selectedItemForDetails}
        currentUser={currentUser}
        approvedClaim={userApprovedClaim}
        onClose={() => {
          setIsItemDetailsOpen(false);
          setSelectedItemForDetails(null);
        }}
        onInitiateClaim={handleInitiateClaim}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLogin={(user) => {
          setCurrentUser(user);
          if (user.role === 'STUDENT') setActiveView('STUDENT_DASH');
          else if (user.role === 'STAFF') setActiveView('STAFF_DASH');
          else if (user.role === 'ADMIN') setActiveView('ADMIN_DASH');
          showToast(`Welcome back, ${user.name}`, `Signed in as ${user.role} (${user.department})`, 'SUCCESS');
        }}
        onRegister={(newUser) => {
          const created: User = {
            ...newUser,
            id: 'user-' + Date.now(),
            createdAt: new Date().toISOString()
          };
          setUsers(prev => [created, ...prev]);
          setCurrentUser(created);
          if (created.role === 'STUDENT') setActiveView('STUDENT_DASH');
          else if (created.role === 'STAFF') setActiveView('STAFF_DASH');
          showToast(`Account Created`, `Welcome to CampusLost, ${created.name}!`, 'SUCCESS');
        }}
      />

      {/* Recovery Success Modal & Printable Certificate */}
      {recoverySuccessData && (
        <RecoverySuccessModal
          isOpen={!!recoverySuccessData}
          onClose={() => setRecoverySuccessData(null)}
          lostItem={recoverySuccessData.lostItem}
          foundItem={recoverySuccessData.foundItem}
          matchScore={recoverySuccessData.matchScore}
          currentUser={currentUser}
        />
      )}
    </div>
  );
}

const SPRING_BOOT_PROJECT_FILES_COUNT = 14;
