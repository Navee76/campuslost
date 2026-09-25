import React from 'react';
import { 
  Item, 
  Claim, 
  User 
} from '../types';
import { 
  X, 
  MapPin, 
  Calendar, 
  Clock, 
  Phone, 
  ShieldCheck, 
  Tag, 
  UserCheck, 
  FileCheck, 
  Printer, 
  QrCode,
  Building,
  Sparkles
} from 'lucide-react';
import { printClaimPickupPass } from '../utils/exportUtils';

interface ItemDetailsModalProps {
  item: Item | null;
  currentUser: User | null;
  approvedClaim?: Claim | null;
  onClose: () => void;
  onInitiateClaim: (item: Item) => void;
}

export const ItemDetailsModal: React.FC<ItemDetailsModalProps> = ({
  item,
  currentUser,
  approvedClaim,
  onClose,
  onInitiateClaim
}) => {
  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-850 rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 my-8 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
              item.type === 'LOST'
                ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
            }`}>
              {item.type} Item
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              {item.status}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 space-y-4">
          {/* Main Image */}
          <div className="relative h-64 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <img
              src={item.imageUrl}
              alt={item.itemName}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Title & Category */}
          <div>
            <div className="text-xs font-bold text-blue-600 dark:text-blue-400">
              {item.category} {item.brand ? `• Brand: ${item.brand}` : ''} • Color: {item.color}
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
              {item.itemName}
            </h2>
          </div>

          {/* Description */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 text-xs text-slate-700 dark:text-slate-300 leading-relaxed border border-slate-200 dark:border-slate-800">
            <span className="font-bold text-slate-900 dark:text-white block mb-1">Description:</span>
            {item.description}
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center gap-2.5">
              <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
              <div>
                <div className="text-[10px] text-slate-400 font-semibold uppercase">Location</div>
                <div className="font-bold text-slate-800 dark:text-slate-200">{item.location}</div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center gap-2.5">
              <Calendar className="w-4 h-4 text-blue-500 shrink-0" />
              <div>
                <div className="text-[10px] text-slate-400 font-semibold uppercase">Date & Time</div>
                <div className="font-bold text-slate-800 dark:text-slate-200">{item.date} at {item.time}</div>
              </div>
            </div>

            {item.handoverLocation && (
              <div className="sm:col-span-2 p-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 flex items-center gap-2.5">
                <Building className="w-4 h-4 text-emerald-600 shrink-0" />
                <div>
                  <div className="text-[10px] text-emerald-800 dark:text-emerald-300 font-bold uppercase">Custody / Handover Location</div>
                  <div className="font-bold text-slate-900 dark:text-slate-100">{item.handoverLocation}</div>
                </div>
              </div>
            )}

            {item.contactNumber && (
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-indigo-500 shrink-0" />
                <div>
                  <div className="text-[10px] text-slate-400 font-semibold uppercase">Emergency Contact</div>
                  <div className="font-bold text-blue-600">{item.contactNumber}</div>
                </div>
              </div>
            )}

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center gap-2.5">
              <UserCheck className="w-4 h-4 text-slate-500 shrink-0" />
              <div>
                <div className="text-[10px] text-slate-400 font-semibold uppercase">Reported By</div>
                <div className="font-bold text-slate-800 dark:text-slate-200">{item.userName} ({item.userRole})</div>
              </div>
            </div>
          </div>

          {/* Approved Claim QR Code Pass Display */}
          {approvedClaim && approvedClaim.status === 'APPROVED' && (
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border-2 border-emerald-300 dark:border-emerald-800 flex items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-300">
                  <ShieldCheck className="w-4 h-4" />
                  Your Claim Has Been Approved!
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
                  Present your digital QR Pass at the Security desk for verification and physical collection.
                </p>
              </div>

              <button
                onClick={() => printClaimPickupPass(approvedClaim, item)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md flex items-center gap-1.5 shrink-0"
              >
                <Printer className="w-3.5 h-3.5" />
                View & Print Pass
              </button>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Close
            </button>

            {item.type === 'FOUND' && item.status !== 'RETURNED' && (!approvedClaim || approvedClaim.status !== 'APPROVED') && (
              <button
                onClick={() => {
                  onClose();
                  onInitiateClaim(item);
                }}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5"
              >
                <FileCheck className="w-4 h-4" />
                Claim This Item
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
