export type UserRole = 'STUDENT' | 'STAFF' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  phone: string;
  studentOrStaffId: string;
  avatarUrl?: string;
  createdAt: string;
}

export type ItemCategory =
  | 'Electronics'
  | 'Cards & IDs'
  | 'Bags & Wallets'
  | 'Books & Notes'
  | 'Keys'
  | 'Bottles & Accessories'
  | 'Jewelry & Watches'
  | 'Clothing & Footwear'
  | 'Others';

export type ItemStatus = 'OPEN' | 'LOST' | 'FOUND' | 'CLAIM_PENDING' | 'VERIFIED' | 'RETURNED' | 'REJECTED';

export interface Item {
  id: string;
  type: 'LOST' | 'FOUND';
  itemName: string;
  category: ItemCategory;
  brand?: string;
  color: string;
  description: string;
  location: string;
  date: string;
  time: string;
  imageUrl: string;
  contactNumber?: string;
  handoverLocation?: string;
  status: ItemStatus;
  userId: string;
  userName: string;
  userRole: UserRole;
  userDept: string;
  createdAt: string;
  uniqueMarks?: string;
  verificationQuestion?: string;
}

export type ClaimStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface Claim {
  id: string;
  foundItemId: string;
  itemName: string;
  itemType?: 'LOST' | 'FOUND';
  itemImageUrl?: string;
  itemLocation?: string;
  studentId: string;
  studentName: string;
  studentRollNo: string;
  studentEmail?: string;
  studentPhone: string;
  studentDepartment?: string;
  verificationAnswer: string;
  uniqueMarks?: string;
  proofDocName?: string;
  status: ClaimStatus;
  staffRemarks?: string;
  verifiedByStaffId?: string;
  verifiedByStaffName?: string;
  qrPassCode?: string;
  createdAt: string;
  resolvedAt?: string;
}

export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'MATCH_ALERT' | 'CLAIM_UPDATE' | 'ITEM_RETURNED' | 'NEW_REPORT';
  itemId?: string;
  read: boolean;
  createdAt: string;
}

export type Notification = AppNotification;

export interface MatchScoreBreakdown {
  categoryScore: number;
  nameScore: number;
  colorScore: number;
  locationScore: number;
  dateScore: number;
  totalPercentage: number;
  matchReasons: string[];
}

export interface MatchPair {
  lostItem: Item;
  foundItem: Item;
  score: MatchScoreBreakdown;
}

export interface CampusLocation {
  id: string;
  name: string;
  building: string;
  zone: string;
}

export interface SystemStats {
  totalUsers: number;
  totalLost: number;
  totalFound: number;
  totalRecovered: number;
  totalPendingClaims: number;
  recoveryRatePercent: number;
  avgResolutionDays: number;
}
