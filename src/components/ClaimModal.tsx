import React, { useState } from 'react';
import { 
  Item, 
  User 
} from '../types';
import { 
  FileCheck, 
  Lock, 
  MapPin, 
  Upload, 
  AlertCircle, 
  CheckCircle2, 
  X 
} from 'lucide-react';

interface ClaimModalProps {
  isOpen: boolean;
  item: Item | null;
  currentUser: User;
  onClose: () => void;
  onSubmitClaim: (itemId: string, answer: string, uniqueMarks: string, proofDocName?: string) => void;
}

export const ClaimModal: React.FC<ClaimModalProps> = ({
  isOpen,
  item,
  currentUser,
  onClose,
  onSubmitClaim
}) => {
  const [verificationAnswer, setVerificationAnswer] = useState('');
  const [uniqueMarks, setUniqueMarks] = useState('');
  const [proofDocName, setProofDocName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen || !item) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!verificationAnswer.trim()) {
      setErrorMsg('Please answer the verification question to prove authentic ownership.');
      return;
    }

    onSubmitClaim(
      item.id,
      verificationAnswer.trim(),
      uniqueMarks.trim(),
      proofDocName || undefined
    );

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-850 rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 my-8 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400 flex items-center justify-center font-bold">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">Submit Recovery Claim</h2>
              <p className="text-xs text-slate-500">Security Ownership Verification Process</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
            {errorMsg}
          </div>
        )}

        {/* Found Item Preview */}
        <div className="mt-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center gap-3">
          <img src={item.imageUrl} alt={item.itemName} className="w-14 h-14 rounded-lg object-cover ring-1 ring-slate-200 shrink-0" />
          <div className="min-w-0">
            <span className="text-[10px] font-bold uppercase text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
              Found Item in Custody
            </span>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate mt-0.5">{item.itemName}</h4>
            <div className="text-xs text-slate-500 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
              Handover Point: {item.handoverLocation || item.location}
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
          {/* Claimant Identification */}
          <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/40">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Student Claimant</span>
              <div className="font-bold text-slate-800 dark:text-slate-200">{currentUser.name}</div>
              <div className="text-slate-500">{currentUser.studentOrStaffId}</div>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Department</span>
              <div className="font-bold text-slate-800 dark:text-slate-200">{currentUser.department}</div>
              <div className="text-blue-600 font-semibold">{currentUser.phone}</div>
            </div>
          </div>

          {/* Question: Ownership Proof */}
          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
              Verification Question / Detailed Proof of Ownership *
            </label>
            <p className="text-[11px] text-slate-500 mb-1.5">
              Describe items inside, lock screen wallpaper, specific scratches, serial number digits, or contents not shown in public photo.
            </p>
            <textarea
              id="claim-verification-answer-input"
              value={verificationAnswer}
              onChange={(e) => setVerificationAnswer(e.target.value)}
              placeholder="e.g. Has a small SBI debit card ending in 4921 inside the inner fold and a stamp on top right."
              rows={3}
              className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

          {/* Unique Identification Marks */}
          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
              Unique Secret Mark or Inscription (Optional)
            </label>
            <input
              type="text"
              value={uniqueMarks}
              onChange={(e) => setUniqueMarks(e.target.value)}
              placeholder="e.g. Name written in silver marker on battery cover"
              className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Document Upload */}
          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
              Supporting Proof (e.g. Purchase Invoice, ID Card Photo, Box Serial)
            </label>
            <input
              type="file"
              onChange={(e) => setProofDocName(e.target.files?.[0]?.name || '')}
              className="block w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
            />
          </div>

          {/* Footer Notice */}
          <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-900 text-[11px] text-slate-500 flex items-start gap-2">
            <Lock className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <span>
              Your answers are securely transmitted directly to Dr. Kumar and Campus Security officers. Once verified, a digital QR Pickup Pass will be issued in your dashboard.
            </span>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              id="submit-claim-confirm-btn"
              type="submit"
              className="px-5 py-2.5 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5"
            >
              <FileCheck className="w-4 h-4" />
              Submit Claim for Verification
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
