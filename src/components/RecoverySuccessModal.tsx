import React, { useState } from 'react';
import { Item, User } from '../types';
import { 
  CheckCircle2, 
  Sparkles, 
  Printer, 
  Share2, 
  MapPin, 
  Calendar, 
  ShieldCheck, 
  QrCode, 
  ArrowRight, 
  X, 
  PartyPopper,
  Building,
  UserCheck,
  Award
} from 'lucide-react';

interface RecoverySuccessModalProps {
  isOpen: boolean;
  lostItem: Item | null;
  foundItem: Item | null;
  matchScore?: number;
  currentUser: User | null;
  onClose: () => void;
  onViewRecoveredCatalog?: () => void;
}

export const RecoverySuccessModal: React.FC<RecoverySuccessModalProps> = ({
  isOpen,
  lostItem,
  foundItem,
  matchScore = 92,
  currentUser,
  onClose,
  onViewRecoveredCatalog
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !lostItem) return null;

  const recoveryId = `REC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
  const recoveryDate = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const handlePrintPass = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>CampusLost - Recovery Certificate ${recoveryId}</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; color: #0f172a; background: #fff; }
          .pass-card { max-width: 650px; margin: 0 auto; border: 2px solid #2563eb; border-radius: 16px; padding: 32px; box-shadow: 0 4px 20px rgba(0,0,0,0.06); }
          .header { display: flex; align-items: center; justify-content: space-between; border-bottom: 2px dashed #cbd5e1; padding-bottom: 20px; margin-bottom: 24px; }
          .logo { font-size: 24px; font-weight: 800; color: #1e40af; }
          .badge { background: #dcfce7; color: #15803d; padding: 6px 14px; border-radius: 9999px; font-weight: 700; font-size: 13px; text-transform: uppercase; }
          .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px; }
          .label { font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: 700; letter-spacing: 0.5px; }
          .val { font-size: 15px; font-weight: 600; color: #0f172a; margin-top: 2px; }
          .qr-section { display: flex; align-items: center; justify-content: space-between; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px; margin-top: 20px; }
          .instructions { font-size: 12px; color: #475569; line-height: 1.5; }
          .footer { text-align: center; margin-top: 30px; font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 15px; }
          @media print {
            body { padding: 0; }
            .pass-card { border: 2px solid #000; box-shadow: none; }
          }
        </style>
      </head>
      <body>
        <div class="pass-card">
          <div class="header">
            <div>
              <div class="logo">CAMPUSLOST 🛡️</div>
              <div style="font-size: 13px; color: #64748b; margin-top: 2px;">Official Item Recovery & Handover Certificate</div>
            </div>
            <div class="badge">RECOVERED & RETURNED</div>
          </div>

          <div class="grid">
            <div>
              <div class="label">Recovery Reference</div>
              <div class="val">${recoveryId}</div>
            </div>
            <div>
              <div class="label">Date of Recovery</div>
              <div class="val">${recoveryDate}</div>
            </div>
            <div>
              <div class="label">Item Name</div>
              <div class="val">${lostItem.itemName}</div>
            </div>
            <div>
              <div class="label">Category & Color</div>
              <div class="val">${lostItem.category} (${lostItem.color})</div>
            </div>
            <div>
              <div class="label">Original Owner / Student</div>
              <div class="val">${lostItem.userName} (${lostItem.userDept})</div>
            </div>
            <div>
              <div class="label">Handover Desk / Custody</div>
              <div class="val">${foundItem ? foundItem.handoverLocation || foundItem.location : 'Campus Security Desk'}</div>
            </div>
          </div>

          <div class="qr-section">
            <div class="instructions">
              <strong>OFFICIAL VERIFICATION SEAL</strong><br>
              Match Heuristic Confidence: ${matchScore}%<br>
              Handled via Smart Match Engine & Verified by Campus Administration.
            </div>
            <div style="text-align: center; border-left: 1px solid #cbd5e1; padding-left: 20px;">
              <div style="font-size: 32px;">📱</div>
              <div style="font-size: 10px; font-weight: bold; color: #2563eb; margin-top: 4px;">${recoveryId}</div>
            </div>
          </div>

          <div class="footer">
            Generated via CampusLost Smart College Lost & Found System • Keep for college records
          </div>
        </div>
        <script>
          window.onload = function() { window.print(); }
        </script>
      </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
  };

  const handleCopyReference = () => {
    navigator.clipboard.writeText(recoveryId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-emerald-100 dark:border-emerald-900/50 my-6 relative overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Decorative Festive Background Glow */}
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Success Icon & Celebration Title */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-3xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30 ring-8 ring-emerald-50 dark:ring-emerald-950/50 mb-4 animate-bounce">
            <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            Lost Item Recovered Successfully
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Item Successfully Returned!
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
            The smart matching system paired the lost complaint with the found item. Item is now logged as recovered and resolved.
          </p>
        </div>

        {/* Recovery Summary Card */}
        <div className="bg-slate-50 dark:bg-slate-850 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 mb-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3 min-w-0">
              <img
                src={lostItem.imageUrl}
                alt={lostItem.itemName}
                className="w-14 h-14 rounded-xl object-cover ring-2 ring-emerald-500/40 shrink-0"
              />
              <div className="min-w-0">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  {lostItem.category} • {matchScore}% Match
                </span>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                  {lostItem.itemName}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  Owner: {lostItem.userName} ({lostItem.userDept})
                </p>
              </div>
            </div>

            <div className="text-right shrink-0">
              <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-500 text-white uppercase shadow-sm">
                VERIFIED
              </span>
            </div>
          </div>

          {/* Key Details Grid */}
          <div className="grid grid-cols-2 gap-2.5 text-xs">
            <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60">
              <span className="text-[10px] text-slate-400 uppercase font-bold">Recovery Ref ID</span>
              <div className="font-mono font-bold text-blue-600 dark:text-blue-400 text-xs mt-0.5 flex items-center justify-between">
                <span>{recoveryId}</span>
                <button
                  onClick={handleCopyReference}
                  className="text-[10px] text-slate-400 hover:text-blue-600 underline font-normal"
                >
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60">
              <span className="text-[10px] text-slate-400 uppercase font-bold">Recovery Date</span>
              <div className="font-bold text-slate-800 dark:text-slate-200 text-xs mt-0.5">
                {recoveryDate}
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60">
              <span className="text-[10px] text-slate-400 uppercase font-bold">Loss Reported At</span>
              <div className="font-bold text-slate-800 dark:text-slate-200 text-xs mt-0.5 truncate">
                {lostItem.location}
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60">
              <span className="text-[10px] text-slate-400 uppercase font-bold">Handover / Custody Desk</span>
              <div className="font-bold text-slate-800 dark:text-slate-200 text-xs mt-0.5 truncate">
                {foundItem ? foundItem.handoverLocation || foundItem.location : 'Campus Security Desk'}
              </div>
            </div>
          </div>
        </div>

        {/* Digital Verification Certificate Box */}
        <div className="p-3.5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/60 flex items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shrink-0 shadow-md">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-bold text-emerald-950 dark:text-emerald-200">
                Official Digital Recovery Certificate
              </div>
              <p className="text-[11px] text-emerald-800/80 dark:text-emerald-400 leading-tight">
                Verified and synchronized with Central Campus Security Records.
              </p>
            </div>
          </div>
          <div className="text-xl">🎓</div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            id="print-recovery-certificate-btn"
            onClick={handlePrintPass}
            className="w-full sm:flex-1 py-3 px-4 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
          >
            <Printer className="w-4 h-4" />
            Print / Download Recovery Pass
          </button>

          {onViewRecoveredCatalog && (
            <button
              onClick={() => {
                onClose();
                onViewRecoveredCatalog();
              }}
              className="w-full sm:w-auto py-3 px-4 rounded-xl text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/60 dark:hover:bg-blue-900/60 border border-blue-200 dark:border-blue-800 transition-colors flex items-center justify-center gap-1.5"
            >
              <span>View in Catalog</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            onClick={onClose}
            className="w-full sm:w-auto py-3 px-5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
