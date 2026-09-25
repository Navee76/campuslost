import { Item, MatchScoreBreakdown, MatchPair } from '../types';

/**
 * Computes token similarity between two strings using Jaccard index and token inclusion.
 */
function computeTextSimilarity(str1: string, str2: string): number {
  if (!str1 || !str2) return 0;
  const s1 = str1.toLowerCase().replace(/[^a-z0-9\s]/g, ' ');
  const s2 = str2.toLowerCase().replace(/[^a-z0-9\s]/g, ' ');
  
  if (s1 === s2) return 1.0;
  if (s1.includes(s2) || s2.includes(s1)) return 0.85;

  const tokens1 = new Set(s1.split(/\s+/).filter(t => t.length > 2));
  const tokens2 = new Set(s2.split(/\s+/).filter(t => t.length > 2));

  if (tokens1.size === 0 || tokens2.size === 0) return 0;

  let intersectionCount = 0;
  tokens1.forEach(t => {
    if (tokens2.has(t)) intersectionCount++;
  });

  const unionCount = new Set([...tokens1, ...tokens2]).size;
  return unionCount === 0 ? 0 : intersectionCount / unionCount;
}

/**
 * Computes color matching score
 */
function computeColorSimilarity(color1: string, color2: string): number {
  if (!color1 || !color2) return 0;
  const c1 = color1.toLowerCase();
  const c2 = color2.toLowerCase();
  if (c1 === c2) return 1.0;
  if (c1.includes(c2) || c2.includes(c1)) return 0.8;

  const words1 = c1.split(/[\s,&/]+/);
  const words2 = c2.split(/[\s,&/]+/);
  const hasCommon = words1.some(w => words2.includes(w) && w.length > 2);
  return hasCommon ? 0.75 : 0;
}

/**
 * Computes location matching score
 */
function computeLocationSimilarity(loc1: string, loc2: string): number {
  if (!loc1 || !loc2) return 0;
  const l1 = loc1.toLowerCase();
  const l2 = loc2.toLowerCase();
  if (l1 === l2) return 1.0;
  if (l1.includes(l2) || l2.includes(l1)) return 0.85;

  // Extract key zone or department (e.g., 'CSE', 'Library', 'Mech', 'Food Court')
  const keywords = ['cse', 'library', 'cafeteria', 'food court', 'mech', 'sports', 'auditorium', 'ece', 'admin', 'hostel', 'parking', 'bus'];
  for (const kw of keywords) {
    if (l1.includes(kw) && l2.includes(kw)) {
      return 0.8;
    }
  }
  return 0.2;
}

/**
 * Computes date difference similarity (within 7 days = high, up to 14 days)
 */
function computeDateSimilarity(date1: string, date2: string): number {
  try {
    const d1 = new Date(date1).getTime();
    const d2 = new Date(date2).getTime();
    const diffDays = Math.abs(d1 - d2) / (1000 * 3600 * 24);
    if (diffDays <= 1) return 1.0;
    if (diffDays <= 3) return 0.85;
    if (diffDays <= 7) return 0.65;
    if (diffDays <= 14) return 0.4;
    return 0.15;
  } catch {
    return 0.5;
  }
}

/**
 * Calculates detailed score breakdown and matching percentage
 */
export function calculateMatchScore(lost: Item, found: Item): MatchScoreBreakdown {
  const matchReasons: string[] = [];

  // 1. Category Score (Weight: 30%)
  const isCategoryMatch = lost.category.toLowerCase() === found.category.toLowerCase();
  const categoryScore = isCategoryMatch ? 30 : 0;
  if (isCategoryMatch) {
    matchReasons.push(`Identical Category: ${lost.category} (+30%)`);
  }

  // 2. Name & Brand Score (Weight: 30%)
  const nameSim = computeTextSimilarity(lost.itemName + ' ' + (lost.brand || ''), found.itemName + ' ' + (found.brand || ''));
  const nameScore = Math.round(nameSim * 30);
  if (nameScore >= 18) {
    matchReasons.push(`Strong Name/Brand match: "${lost.itemName}" vs "${found.itemName}" (+${nameScore}%)`);
  } else if (nameScore > 5) {
    matchReasons.push(`Partial keyword match (+${nameScore}%)`);
  }

  // 3. Color Score (Weight: 20%)
  const colorSim = computeColorSimilarity(lost.color, found.color);
  const colorScore = Math.round(colorSim * 20);
  if (colorScore >= 14) {
    matchReasons.push(`Color match: ${lost.color} vs ${found.color} (+${colorScore}%)`);
  }

  // 4. Location Proximity Score (Weight: 10%)
  const locSim = computeLocationSimilarity(lost.location, found.location);
  const locationScore = Math.round(locSim * 10);
  if (locationScore >= 7) {
    matchReasons.push(`Found in nearby or same area: ${lost.location} (+${locationScore}%)`);
  }

  // 5. Date Proximity Score (Weight: 10%)
  const dateSim = computeDateSimilarity(lost.date, found.date);
  const dateScore = Math.round(dateSim * 10);
  if (dateScore >= 6) {
    matchReasons.push(`Dates are close in timeline: ${lost.date} & ${found.date} (+${dateScore}%)`);
  }

  const totalPercentage = Math.min(100, Math.max(0, categoryScore + nameScore + colorScore + locationScore + dateScore));

  return {
    categoryScore,
    nameScore,
    colorScore,
    locationScore,
    dateScore,
    totalPercentage,
    matchReasons
  };
}

/**
 * Finds all potential matches for a given item against a pool of items.
 */
export function findMatchesForItem(targetItem: Item, allItems: Item[], minScoreThreshold = 55): MatchPair[] {
  const oppositeType = targetItem.type === 'LOST' ? 'FOUND' : 'LOST';
  const candidatePool = allItems.filter(item => item.type === oppositeType && item.status !== 'RETURNED');

  const matches: MatchPair[] = [];

  for (const candidate of candidatePool) {
    const lost = targetItem.type === 'LOST' ? targetItem : candidate;
    const found = targetItem.type === 'FOUND' ? targetItem : candidate;
    const score = calculateMatchScore(lost, found);

    if (score.totalPercentage >= minScoreThreshold) {
      matches.push({
        lostItem: lost,
        foundItem: found,
        score
      });
    }
  }

  // Sort descending by score
  return matches.sort((a, b) => b.score.totalPercentage - a.score.totalPercentage);
}

/**
 * Finds top matches across the entire database.
 */
export function findAllSystemMatches(allItems: Item[], minScoreThreshold = 55): MatchPair[] {
  const lostItems = allItems.filter(item => item.type === 'LOST' && item.status !== 'RETURNED');
  const foundItems = allItems.filter(item => item.type === 'FOUND' && item.status !== 'RETURNED');

  const pairs: MatchPair[] = [];

  for (const lost of lostItems) {
    for (const found of foundItems) {
      const score = calculateMatchScore(lost, found);
      if (score.totalPercentage >= minScoreThreshold) {
        pairs.push({
          lostItem: lost,
          foundItem: found,
          score
        });
      }
    }
  }

  return pairs.sort((a, b) => b.score.totalPercentage - a.score.totalPercentage);
}

export const calculateAllMatches = findAllSystemMatches;
