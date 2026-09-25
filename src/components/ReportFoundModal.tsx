import React, { useState } from 'react';
import { 
  User, 
  Item, 
  ItemCategory 
} from '../types';
import { 
  CheckCircle2, 
  Upload, 
  MapPin, 
  Calendar, 
  Clock, 
  Building, 
  Sparkles, 
  X 
} from 'lucide-react';
import { CAMPUS_LOCATIONS } from '../data/mockData';

interface ReportFoundModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  onSubmit: (foundItemData: Omit<Item, 'id' | 'createdAt' | 'status'>) => void;
}

const CATEGORIES: ItemCategory[] = [
  'Electronics',
  'Cards & IDs',
  'Bags & Wallets',
  'Books & Notes',
  'Keys',
  'Bottles & Accessories',
  'Jewelry & Watches',
  'Clothing & Footwear',
  'Others'
];

const PRESET_IMAGES = [
  { label: 'Black Wallet', url: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&q=80&w=600' },
  { label: 'College ID Card', url: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&q=80&w=600' },
  { label: 'Casio Calculator', url: 'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&q=80&w=600' },
  { label: 'iPhone / Phone', url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=600' },
  { label: 'Water Bottle', url: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&q=80&w=600' }
];

export const ReportFoundModal: React.FC<ReportFoundModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSubmit
}) => {
  const [itemName, setItemName] = useState('');
  const [category, setCategory] = useState<ItemCategory>('Bags & Wallets');
  const [color, setColor] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState(CAMPUS_LOCATIONS[0].name);
  const [handoverLocation, setHandoverLocation] = useState('Campus Security Main Desk (Dr. Kumar)');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('16:00');
  const [imageUrl, setImageUrl] = useState(PRESET_IMAGES[0].url);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemName.trim() || !color.trim() || !description.trim() || !handoverLocation.trim()) {
      setErrorMsg('Please fill in all required fields.');
      return;
    }

    onSubmit({
      type: 'FOUND',
      itemName: itemName.trim(),
      category,
      color: color.trim(),
      description: description.trim(),
      location,
      handoverLocation: handoverLocation.trim(),
      date,
      time,
      imageUrl,
      userId: currentUser.id,
      userName: currentUser.name,
      userRole: currentUser.role,
      userDept: currentUser.department
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-850 rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 my-8 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">Report Found Item</h2>
              <p className="text-xs text-slate-500">Log found belongings to safely reunite them with fellow students</p>
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

        <form onSubmit={handleSubmit} className="mt-5 space-y-4 text-xs">
          {/* Row 1: Item Name & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                Item Title *
              </label>
              <input
                id="found-item-name-input"
                type="text"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                placeholder="e.g. Leather Wallet found on bench"
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                Category *
              </label>
              <select
                id="found-item-category-select"
                aria-label="Item Category"
                value={category}
                onChange={(e) => setCategory(e.target.value as ItemCategory)}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                {CATEGORIES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 2: Color & Found Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                Color(s) *
              </label>
              <input
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                placeholder="e.g. Black, Blue, Silver"
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                Found At Location *
              </label>
              <select
                aria-label="Found At Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                {CAMPUS_LOCATIONS.map(loc => (
                  <option key={loc.id} value={loc.name}>
                    {loc.name} ({loc.building})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 3: Handover Point */}
          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
              Current Custody / Handover Location *
            </label>
            <input
              type="text"
              value={handoverLocation}
              onChange={(e) => setHandoverLocation(e.target.value)}
              placeholder="e.g. Campus Security Main Desk (Dr. Kumar) or Library Helpdesk"
              className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              required
            />
          </div>

          {/* Row 4: Date & Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                Date Found *
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                Approximate Time
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Row 5: Description */}
          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
              Public Description *
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide a general description (keep secret marks private so owner can verify)."
              rows={2}
              className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              required
            />
          </div>

          {/* Row 6: Image Upload & Presets */}
          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
              Item Photo (Upload or Select Preset)
            </label>
            <div className="flex items-center gap-4">
              <img
                src={imageUrl}
                alt="Preview"
                className="w-16 h-16 rounded-xl object-cover ring-2 ring-slate-200 dark:ring-slate-700 shrink-0"
              />
              <div className="flex-1 space-y-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageFileUpload}
                  className="block w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 dark:file:bg-emerald-950/40 dark:file:text-emerald-300 cursor-pointer"
                />
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] text-slate-400">Presets:</span>
                  {PRESET_IMAGES.map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => setImageUrl(preset.url)}
                      className="px-2 py-0.5 rounded text-[10px] bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              id="submit-report-found-btn"
              type="submit"
              className="px-6 py-2.5 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-600/30 transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Save Item & Notify Potential Owners
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
