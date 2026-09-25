import React, { useState } from 'react';
import { 
  User, 
  Item, 
  Claim, 
  AppNotification 
} from '../types';
import { 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  MapPin, 
  Phone, 
  UserCheck, 
  FileCheck, 
  FileText, 
  Printer, 
  Download,
  Search,
  Check,
  Building,
  Eye
} from 'lucide-react';
import { printClaimPickupPass, exportClaimsToCSV } from '../utils/exportUtils';
import confetti from 'canvas-confetti';

interface StaffDashboardProps {
  currentUser: User;
  items?: Item[];
  claims?: Claim[];
  onApproveClaim?: (claimId: string, remarks: string) => void;
  onRejectClaim?: (claimId: string, remarks: string) => void;
  onMarkItemReturned?: (itemId: string) => void;
  onSelectItem?: (item: Item) => void;
  onOpenReportFound?: () => void;
}

export const StaffDashboard: React.FC<StaffDashboardProps> = ({
  currentUser,
  items = [],
  claims = [],
  onApproveClaim = (_claimId: string, _remarks: string) => {},
  onRejectClaim = (_claimId: string, _remarks: string) => {},
  onMarkItemReturned = (_itemId: string) => {},
  onSelectItem = (_item: Item) => {},
  onOpenReportFound = () => {}
}) => {
  const [selectedClaimForReview, setSelectedClaimForReview] = useState<Claim | null>(null);
  const [reviewRemarks, setReviewRemarks] = useState('');
  const [activeTab, setActiveTab] = useState<'PENDING_CLAIMS' | 'CUSTODY_ITEMS' | 'RESOLVED_CLAIMS'>('PENDING_CLAIMS');
  const [filterSearch, setFilterSearch] = useState('');

  const pendingClaims = items && claims ? claims.filter(c => c.status === 'PENDING') : [];
  const resolvedClaims = items && claims ? claims.filter(c => c.status !== 'PENDING') : [];
  const foundItemsInCustody = items ? items.filter(i => i.type === 'FOUND' && i.status !== 'RETURNED') : [];
  const returnedItems = items ? items.filter(i => i.status === 'RETURNED') : [];

  const handleApprove = (claim: Claim) => {
    onApproveClaim(claim.id, reviewRemarks || 'Verified by ' + currentUser.name + ' via in-person check.');
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 }
    });
    setSelectedClaimForReview(null);
    setReviewRemarks('');
  };

  const handleReject = (claim: Claim) => {
    onRejectClaim(claim.id, reviewRemarks || 'Ownership details could not be substantiated.');
    setSelectedClaimForReview(null);
    setReviewRemarks('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Staff Header */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 rounded-2xl p-6 sm:p-8 text-white shadow-xl mb-8 relative">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-lg ring-4 ring-white/10 shrink-0">
              <ShieldCheck className="w-9 h-9" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-500/30 text-blue-200 border border-blue-400/30 uppercase">
                  Staff & Campus Security Desk
                </span>
                <span className="text-xs text-slate-300 font-mono">Staff ID: {currentUser.studentOrStaffId}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1">{currentUser.name}</h1>
              <p className="text-xs sm:text-sm text-blue-200/80 mt-0.5">{currentUser.department} • Verification Officer</p>
            </div>
          </div>

          <button
            onClick={() => exportClaimsToCSV(claims)}
            className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-all flex items-center gap-2 self-start md:self-auto"
          >
            <Download className="w-4 h-4" />
            Export Claims (CSV)
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div 
          onClick={() => setActiveTab('PENDING_CLAIMS')}
          className="bg-white dark:bg-slate-850 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-amber-400 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Pending Verification</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-600 dark:text-amber-400 mt-2">
            {pendingClaims.length}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Awaiting staff decision</div>
        </div>

        <div 
          onClick={() => setActiveTab('CUSTODY_ITEMS')}
          className="bg-white dark:bg-slate-850 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-blue-400 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">In Security Storage</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400 flex items-center justify-center">
              <Building className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-2">
            {foundItemsInCustody.length}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Ready for claimant pickup</div>
        </div>

        <div 
          onClick={() => setActiveTab('RESOLVED_CLAIMS')}
          className="bg-white dark:bg-slate-850 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-emerald-400 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Approved Claims</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-2">
            {claims.filter(c => c.status === 'APPROVED').length}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">QR Passes issued</div>
        </div>

        <div className="bg-white dark:bg-slate-850 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Returned to Owner</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400 flex items-center justify-center">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-indigo-600 dark:text-indigo-400 mt-2">
            {returnedItems.length}
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1">Case closed successfully</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 mb-6 pb-1">
        <button
          onClick={() => setActiveTab('PENDING_CLAIMS')}
          className={`px-4 py-2.5 rounded-t-xl text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'PENDING_CLAIMS'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-950/40'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400'
          }`}
        >
          <Clock className="w-4 h-4" />
          Verification Queue ({pendingClaims.length})
        </button>

        <button
          onClick={() => setActiveTab('CUSTODY_ITEMS')}
          className={`px-4 py-2.5 rounded-t-xl text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'CUSTODY_ITEMS'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-950/40'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400'
          }`}
        >
          <Building className="w-4 h-4" />
          Items in Custody ({foundItemsInCustody.length})
        </button>

        <button
          onClick={() => setActiveTab('RESOLVED_CLAIMS')}
          className={`px-4 py-2.5 rounded-t-xl text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'RESOLVED_CLAIMS'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-950/40'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400'
          }`}
        >
          <FileCheck className="w-4 h-4" />
          Claim History ({resolvedClaims.length})
        </button>
      </div>

      {/* Tab 1: Pending Claims Queue */}
      {activeTab === 'PENDING_CLAIMS' && (
        <div className="space-y-4">
          {pendingClaims.length === 0 ? (
            <div className="bg-white dark:bg-slate-850 rounded-2xl p-12 text-center border border-dashed border-slate-300 dark:border-slate-700">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">All claims are up to date!</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                No students are currently waiting for claim verification.
              </p>
            </div>
          ) : (
            pendingClaims.map((claim) => {
              const matchedFoundItem = items.find(i => i.id === claim.itemId);
              return (
                <div
                  key={claim.id}
                  className="bg-white dark:bg-slate-850 rounded-2xl border-2 border-amber-200 dark:border-amber-900/60 p-5 shadow-sm hover:shadow-md transition-all"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-start gap-4">
                      <img
                        src={claim.itemImageUrl}
                        alt={claim.itemName}
                        className="w-16 h-16 rounded-xl object-cover ring-2 ring-amber-400/40 shrink-0"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono text-slate-400">Claim ID: {claim.id}</span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 uppercase">
                            Pending Staff Verification
                          </span>
                        </div>
                        <h3 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                          {claim.itemName}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          Found at: {claim.itemLocation}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedClaimForReview(claim);
                          setReviewRemarks('');
                        }}
                        className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5"
                      >
                        <FileCheck className="w-4 h-4" />
                        Review & Verify
                      </button>
                    </div>
                  </div>

                  {/* Claimant & Verification Info */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4 text-xs">
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <span className="font-bold text-slate-700 dark:text-slate-300 uppercase text-[10px]">Student Claimant Info</span>
                      <div className="font-bold text-slate-900 dark:text-slate-100 mt-1">{claim.studentName}</div>
                      <div className="text-slate-500 mt-0.5">Roll: {claim.studentRollNo} ({claim.studentDept})</div>
                      <div className="text-blue-600 dark:text-blue-400 flex items-center gap-1 mt-1 font-semibold">
                        <Phone className="w-3 h-3" /> {claim.studentPhone}
                      </div>
                    </div>

                    <div className="md:col-span-2 p-3 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40">
                      <span className="font-bold text-amber-900 dark:text-amber-300 uppercase text-[10px]">Student's Ownership Answers:</span>
                      <p className="text-slate-800 dark:text-slate-200 mt-1 font-medium italic">
                        "{claim.verificationAnswer}"
                      </p>
                      {claim.uniqueMarksDescription && (
                        <div className="mt-1 text-[11px] text-slate-600 dark:text-slate-400">
                          <span className="font-semibold text-slate-700 dark:text-slate-300">Identification marks:</span> {claim.uniqueMarksDescription}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Tab 2: Custody Inventory */}
      {activeTab === 'CUSTODY_ITEMS' && (
        <div className="bg-white dark:bg-slate-850 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Physical Items in Campus Storage</h3>
            <span className="text-xs text-slate-500">{foundItemsInCustody.length} items logged</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-900 text-slate-500 uppercase font-semibold text-[10px] border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="p-3.5">Item</th>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5">Found Location</th>
                  <th className="p-3.5">Handover Point</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {foundItemsInCustody.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="p-3.5 flex items-center gap-3">
                      <img src={item.imageUrl} alt={item.itemName} className="w-10 h-10 rounded-lg object-cover ring-1 ring-slate-200 shrink-0" />
                      <div>
                        <div className="font-bold text-slate-900 dark:text-slate-100">{item.itemName}</div>
                        <div className="text-[10px] text-slate-400">{item.date} • {item.color}</div>
                      </div>
                    </td>
                    <td className="p-3.5 text-slate-600 dark:text-slate-300">{item.category}</td>
                    <td className="p-3.5 text-slate-600 dark:text-slate-300">{item.location}</td>
                    <td className="p-3.5 font-semibold text-blue-600 dark:text-blue-400">{item.handoverLocation}</td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        {item.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onSelectItem(item)}
                          className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold"
                        >
                          View
                        </button>
                        <button
                          onClick={() => onMarkItemReturned(item.id)}
                          className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-semibold flex items-center gap-1"
                        >
                          <Check className="w-3 h-3" /> Mark Returned
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

      {/* Tab 3: Resolved Claims History */}
      {activeTab === 'RESOLVED_CLAIMS' && (
        <div className="space-y-3">
          {resolvedClaims.map((claim) => (
            <div
              key={claim.id}
              className="bg-white dark:bg-slate-850 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-center gap-3">
                <img src={claim.itemImageUrl} alt={claim.itemName} className="w-12 h-12 rounded-lg object-cover shrink-0" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-slate-100">{claim.itemName}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      claim.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {claim.status}
                    </span>
                  </div>
                  <div className="text-slate-500 mt-0.5">
                    Claimant: {claim.studentName} ({claim.studentRollNo}) • Verified By: {claim.verifiedByStaffName || 'Staff'}
                  </div>
                  {claim.staffRemarks && (
                    <div className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5 italic">
                      Remarks: "{claim.staffRemarks}"
                    </div>
                  )}
                </div>
              </div>

              {claim.status === 'APPROVED' && (
                <button
                  onClick={() => printClaimPickupPass(claim)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 transition-colors flex items-center gap-1"
                >
                  <Printer className="w-3.5 h-3.5" /> Print QR Pass
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal: Interactive Claim Review & Decision */}
      {selectedClaimForReview && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-850 rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Claim Verification & Decision</h3>
                <p className="text-xs text-slate-500">Claim ID: {selectedClaimForReview.id}</p>
              </div>
              <button
                onClick={() => setSelectedClaimForReview(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <img src={selectedClaimForReview.itemImageUrl} alt={selectedClaimForReview.itemName} className="w-14 h-14 rounded-lg object-cover shrink-0" />
                <div>
                  <div className="font-bold text-slate-900 dark:text-slate-100 text-sm">{selectedClaimForReview.itemName}</div>
                  <div className="text-slate-500">{selectedClaimForReview.itemLocation}</div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800">
                <span className="font-bold text-blue-900 dark:text-blue-300 uppercase text-[10px]">Student Claiming:</span>
                <div className="font-bold text-slate-800 dark:text-slate-200 mt-1">
                  {selectedClaimForReview.studentName} ({selectedClaimForReview.studentRollNo})
                </div>
                <div className="text-slate-600 dark:text-slate-400">{selectedClaimForReview.studentDept} • {selectedClaimForReview.studentPhone}</div>
              </div>

              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800">
                <span className="font-bold text-amber-900 dark:text-amber-300 uppercase text-[10px]">Student's Answer to Verification Question:</span>
                <p className="text-slate-800 dark:text-slate-100 font-semibold mt-1">
                  "{selectedClaimForReview.verificationAnswer}"
                </p>
                {selectedClaimForReview.uniqueMarksDescription && (
                  <p className="text-slate-600 dark:text-slate-300 mt-1">
                    <span className="font-bold">Identification Mark:</span> {selectedClaimForReview.uniqueMarksDescription}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                  Staff Verification Notes / Decision Remarks:
                </label>
                <textarea
                  value={reviewRemarks}
                  onChange={(e) => setReviewRemarks(e.target.value)}
                  placeholder="e.g. Inscription matches student card ME21-ARUN. Verified in person."
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  rows={3}
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800 mt-5">
              <button
                onClick={() => handleReject(selectedClaimForReview)}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors flex items-center gap-1.5"
              >
                <XCircle className="w-4 h-4" /> Reject Claim
              </button>

              <button
                onClick={() => handleApprove(selectedClaimForReview)}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-500/20 transition-all flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" /> Approve & Issue QR Pass
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
