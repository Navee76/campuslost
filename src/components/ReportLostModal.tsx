import React, { useState } from 'react';
import { 
  User, 
  Item, 
  ItemCategory 
} from '../types';
import { 
  ShieldAlert, 
  Upload, 
  Image as ImageIcon, 
  MapPin, 
  Calendar, 
  Clock, 
  Phone, 
  Sparkles, 
  Tag, 
  Check, 
  X,
  Lock
} from 'lucide-react';
import { CAMPUS_LOCATIONS } from '../data/mockData';

interface ReportLostModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  onSubmit: (lostItemData: Omit<Item, 'id' | 'createdAt' | 'status'>) => void;
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
  { label: 'iPhone / Mobile', url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=600' },
  { label: 'Keys Keychain', url: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&q=80&w=600' },
  { label: 'Water Bottle', url: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&q=80&w=600' }
];

export const ReportLostModal: React.FC<ReportLostModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSubmit
}) => {
  const [itemName, setItemName] = useState('');
  const [category, setCategory] = useState<ItemCategory>('Bags & Wallets');
  const [brand, setBrand] = useState('');
  const [color, setColor] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState(CAMPUS_LOCATIONS[0].name);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('14:00');
  const [imageUrl, setImageUrl] = useState(PRESET_IMAGES[0].url);
  const [contactNumber, setContactNumber] = useState(currentUser.phone);
  const [uniqueMarks, setUniqueMarks] = useState('');
  const [verificationQuestion, setVerificationQuestion] = useState('');
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
    if (!itemName.trim() || !color.trim() || !description.trim() || !contactNumber.trim()) {
      setErrorMsg('Please fill in all required fields (Item Name, Color, Description, Contact).');
      return;
    }

    onSubmit({
      type: 'LOST',
      itemName: itemName.trim(),
      category,
      brand: brand.trim(),
      color: color.trim(),
      description: description.trim(),
      location,
      date,
      time,
      imageUrl,
      contactNumber: contactNumber.trim(),
      userId: currentUser.id,
      userName: currentUser.name,
      userRole: currentUser.role,
      userDept: currentUser.department,
      uniqueMarks: uniqueMarks.trim(),
      verificationQuestion: verificationQuestion.trim()
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-850 rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 my-8 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400 flex items-center justify-center font-bold">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">Report Lost Item</h2>
              <p className="text-xs text-slate-500">Provide accurate details to trigger the Smart Matching Engine</p>
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
                Item Name *
              </label>
              <input
                id="lost-item-name-input"
                type="text"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                placeholder="e.g. WildHorn Black Leather Wallet"
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-rose-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                Category *
              </label>
              <select
                id="lost-item-category-select"
                aria-label="Item Category"
                value={category}
                onChange={(e) => setCategory(e.target.value as ItemCategory)}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-rose-500 focus:outline-none"
              >
                {CATEGORIES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 2: Brand & Color */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                Brand / Manufacturer (Optional)
              </label>
              <input
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="e.g. Casio, Apple, WildHorn, Dell"
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-rose-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                Primary Color(s) *
              </label>
              <input
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                placeholder="e.g. Matte Black, Navy Blue, Silver"
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-rose-500 focus:outline-none"
                required
              />
            </div>
          </div>

          {/* Row 3: Last Seen Location */}
          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
              Last Seen Campus Location *
            </label>
            <select
              aria-label="Last Seen Campus Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-rose-500 focus:outline-none"
            >
              {CAMPUS_LOCATIONS.map(loc => (
                <option key={loc.id} value={loc.name}>
                  {loc.name} ({loc.building})
                </option>
              ))}
            </select>
          </div>

          {/* Row 4: Date, Time & Contact */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                Date Misplaced *
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-rose-500 focus:outline-none"
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
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-rose-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                Contact Phone *
              </label>
              <input
                type="tel"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-rose-500 focus:outline-none"
                required
              />
            </div>
          </div>

          {/* Row 5: Detailed Description */}
          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
              Item Description & Contents *
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe distinguishing attributes, contents inside, condition, etc."
              rows={2}
              className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-rose-500 focus:outline-none"
              required
            />
          </div>

          {/* Row 6: Security Verification Secret & Unique Marks */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center gap-1.5 text-blue-700 dark:text-blue-400 font-bold text-xs">
              <Lock className="w-3.5 h-3.5" />
              Ownership Verification Security Question & Identification Mark
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-slate-600 dark:text-slate-400 font-semibold text-[11px]">
                  Unique Identification Mark (e.g. Scratches, Engraving, Sticker)
                </label>
                <input
                  type="text"
                  value={uniqueMarks}
                  onChange={(e) => setUniqueMarks(e.target.value)}
                  placeholder="e.g. Inscription on rear, sticker on corner"
                  className="w-full p-2 mt-1 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="text-slate-600 dark:text-slate-400 font-semibold text-[11px]">
                  Verification Question for Security Desk
                </label>
                <input
                  type="text"
                  value={verificationQuestion}
                  onChange={(e) => setVerificationQuestion(e.target.value)}
                  placeholder="e.g. What is the wallpaper image or last 4 digits of card?"
                  className="w-full p-2 mt-1 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100"
                />
              </div>
            </div>
          </div>

          {/* Row 7: Image Upload & Presets */}
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
                  className="block w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-rose-50 file:text-rose-700 hover:file:bg-rose-100 dark:file:bg-rose-950/40 dark:file:text-rose-300 cursor-pointer"
                />
                {/* Presets */}
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

          {/* Submit Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              id="submit-report-lost-btn"
              type="submit"
              className="px-6 py-2.5 rounded-xl font-bold text-white bg-rose-600 hover:bg-rose-700 shadow-md shadow-rose-600/30 transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Publish Report & Run Auto-Match
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
