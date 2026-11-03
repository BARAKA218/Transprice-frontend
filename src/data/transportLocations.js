import { mockDistricts, mockSectors } from './mockData';

/**
 * Transport location catalog for Rwanda (demo dataset).
 * Used by the search engine to resolve typed place names against routes and fares.
 * Every entry carries: id, name, district, province, type, aliases, coordinates.
 */

const EXTRA_PLACES = [
  {
    id: 'kigali',
    name: 'Kigali',
    district: 'Kigali',
    province: 'Kigali City',
    type: 'city',
    lat: -1.9441,
    lng: 30.0619,
    aliases: ['Kigali City', 'Kigali city center', 'Kigali Urban'],
  },
  {
    id: 'downtown',
    name: 'Downtown',
    district: 'Nyarugenge',
    province: 'Kigali City',
    type: 'neighborhood',
    lat: -1.9461,
    lng: 30.0613,
    aliases: ['Downtown Kigali', 'CBD', 'City centre', 'Kigali City Centre'],
  },
  {
    id: 'nyabugogo',
    name: 'Nyabugogo',
    district: 'Nyarugenge',
    province: 'Kigali City',
    type: 'hub',
    lat: -1.9461,
    lng: 30.0442,
    aliases: ['Nyabugogo bus park', 'Nyabugogo terminal', 'Nyabugogo Bus Terminal', 'Nyabugogo Central'],
  },
  {
    id: 'kimironko',
    name: 'Kimironko',
    district: 'Gasabo',
    province: 'Kigali City',
    type: 'neighborhood',
    lat: -1.9385,
    lng: 30.1437,
    aliases: ['Kimironko bus park', 'Kimironko market'],
  },
  {
    id: 'remera',
    name: 'Remera',
    district: 'Gasabo',
    province: 'Kigali City',
    type: 'neighborhood',
    lat: -1.9501,
    lng: 30.1086,
    aliases: ['Remera bus park', 'Remera bus terminal', 'Remera Kigali'],
  },
  {
    id: 'kacyiru',
    name: 'Kacyiru',
    district: 'Gasabo',
    province: 'Kigali City',
    type: 'sector',
    lat: -1.946,
    lng: 30.093,
    aliases: [],
  },
  {
    id: 'gisozi',
    name: 'Gisozi',
    district: 'Gasabo',
    province: 'Kigali City',
    type: 'sector',
    lat: -1.936,
    lng: 30.034,
    aliases: [],
  },
  {
    id: 'kimihurura',
    name: 'Kimihurura',
    district: 'Gasabo',
    province: 'Kigali City',
    type: 'sector',
    lat: -1.9573,
    lng: 30.1053,
    aliases: [],
  },
  {
    id: 'nyamirambo',
    name: 'Nyamirambo',
    district: 'Nyarugenge',
    province: 'Kigali City',
    type: 'neighborhood',
    lat: -1.9842,
    lng: 30.0508,
    aliases: ['Nyamirambo Kigali'],
  },
  {
    id: 'kimisagara',
    name: 'Kimisagara',
    district: 'Nyarugenge',
    province: 'Kigali City',
    type: 'sector',
    lat: -1.9812,
    lng: 30.0409,
    aliases: [],
  },
  {
    id: 'kgl-airport',
    name: 'Kigali International Airport',
    district: 'Kicukiro',
    province: 'Kigali City',
    type: 'airport',
    lat: -1.9686,
    lng: 30.1395,
    aliases: ['Kanombe Airport', 'Kigali airport', 'Airport', 'KGL', 'Kanombe'],
  },
  {
    id: 'bugesera-airport',
    name: 'Bugesera International Airport',
    district: 'Bugesera',
    province: 'Eastern',
    type: 'airport',
    lat: -2.1516,
    lng: 30.2264,
    aliases: ['Bugesera airport', 'new Kigali airport', 'Rilima airport'],
  },
  {
    id: 'huye',
    name: 'Huye',
    district: 'Huye',
    province: 'Southern',
    type: 'town',
    lat: -2.5967,
    lng: 29.7435,
    aliases: ['Butare', 'Huye Town', 'Butare Town'],
  },
  {
    id: 'musanze',
    name: 'Musanze',
    district: 'Musanze',
    province: 'Northern',
    type: 'town',
    lat: -1.4994,
    lng: 29.6333,
    aliases: ['Ruhengeri', 'Musanze Town', 'Ruhengeri Town'],
  },
  {
    id: 'gisenyi',
    name: 'Gisenyi',
    district: 'Rubavu',
    province: 'Western',
    type: 'town',
    lat: -1.7028,
    lng: 29.2564,
    aliases: ['Rubavu', 'Rubavu Gisenyi', 'Gisenyi Town', 'RubavuTown'],
  },
  {
    id: 'muhanga',
    name: 'Muhanga',
    district: 'Muhanga',
    province: 'Southern',
    type: 'town',
    lat: -2.0794,
    lng: 29.7567,
    aliases: ['Muhanga Town', 'Gitarama', 'Kabgayi'],
  },
  {
    id: 'rusizi',
    name: 'Rusizi',
    district: 'Rusizi',
    province: 'Western',
    type: 'town',
    lat: -2.4833,
    lng: 28.8961,
    aliases: ['Cyangugu', 'Rusizi Town', 'Cyangugu Town'],
  },
  {
    id: 'karongi',
    name: 'Karongi',
    district: 'Karongi',
    province: 'Western',
    type: 'town',
    lat: -2.05,
    lng: 29.35,
    aliases: ['Kibuye', 'Karongi Town', 'Kibuye Town'],
  },
  {
    id: 'nyagatare',
    name: 'Nyagatare',
    district: 'Nyagatare',
    province: 'Eastern',
    type: 'town',
    lat: -1.2953,
    lng: 30.3278,
    aliases: ['Nyagatare Town'],
  },
  {
    id: 'rwamagana',
    name: 'Rwamagana',
    district: 'Rwamagana',
    province: 'Eastern',
    type: 'town',
    lat: -1.9486,
    lng: 30.4333,
    aliases: ['Rwamagana Town'],
  },
  {
    id: 'kayonza',
    name: 'Kayonza',
    district: 'Kayonza',
    province: 'Eastern',
    type: 'town',
    lat: -1.8564,
    lng: 30.5625,
    aliases: ['Kayonza Town'],
  },
  {
    id: 'nyanza',
    name: 'Nyanza',
    district: 'Nyanza',
    province: 'Southern',
    type: 'town',
    lat: -2.3525,
    lng: 29.7508,
    aliases: ['Nyanza Town', 'Nyanza Rwanda'],
  },
  {
    id: 'ruhango',
    name: 'Ruhango',
    district: 'Ruhango',
    province: 'Southern',
    type: 'district',
    lat: -2.1667,
    lng: 29.7833,
    aliases: [],
  },
  {
    id: 'ngoma',
    name: 'Ngoma',
    district: 'Ngoma',
    province: 'Eastern',
    type: 'district',
    lat: -2.1833,
    lng: 30.5167,
    aliases: ['Ngoma Town'],
  },
  {
    id: 'kirehe',
    name: 'Kirehe',
    district: 'Kirehe',
    province: 'Eastern',
    type: 'district',
    lat: -2.1917,
    lng: 30.7333,
    aliases: ['Kirehe Town'],
  },
  {
    id: 'gatsibo',
    name: 'Gatsibo',
    district: 'Gatsibo',
    province: 'Eastern',
    type: 'district',
    lat: -1.5833,
    lng: 30.4333,
    aliases: [],
  },
  {
    id: 'gicumbi',
    name: 'Gicumbi',
    district: 'Gicumbi',
    province: 'Northern',
    type: 'district',
    lat: -1.5833,
    lng: 30.0667,
    aliases: ['Byumba'],
  },
  {
    id: 'nyabihu',
    name: 'Nyabihu',
    district: 'Nyabihu',
    province: 'Western',
    type: 'district',
    lat: -1.6375,
    lng: 29.4936,
    aliases: [],
  },
  {
    id: 'nyamasheke',
    name: 'Nyamasheke',
    district: 'Nyamasheke',
    province: 'Western',
    type: 'district',
    lat: -2.3167,
    lng: 29.15,
    aliases: [],
  },
  {
    id: 'burera',
    name: 'Burera',
    district: 'Burera',
    province: 'Northern',
    type: 'district',
    lat: -1.4478,
    lng: 29.865,
    aliases: [],
  },
  {
    id: 'gakenke',
    name: 'Gakenke',
    district: 'Gakenke',
    province: 'Northern',
    type: 'district',
    lat: -1.6822,
    lng: 29.7933,
    aliases: [],
  },
  {
    id: 'rulindo',
    name: 'Rulindo',
    district: 'Rulindo',
    province: 'Northern',
    type: 'district',
    lat: -1.7283,
    lng: 29.9325,
    aliases: [],
  },
  {
    id: 'kamonyi',
    name: 'Kamonyi',
    district: 'Kamonyi',
    province: 'Southern',
    type: 'district',
    lat: -2.0167,
    lng: 29.8833,
    aliases: [],
  },
  {
    id: 'gisagara',
    name: 'Gisagara',
    district: 'Gisagara',
    province: 'Southern',
    type: 'district',
    lat: -2.5167,
    lng: 29.8667,
    aliases: [],
  },
  {
    id: 'nyaruguru',
    name: 'Nyaruguru',
    district: 'Nyaruguru',
    province: 'Southern',
    type: 'district',
    lat: -2.6167,
    lng: 29.6333,
    aliases: [],
  },
  {
    id: 'nyamagabe',
    name: 'Nyamagabe',
    district: 'Nyamagabe',
    province: 'Southern',
    type: 'district',
    lat: -2.4686,
    lng: 29.5567,
    aliases: [],
  },
  {
    id: 'gasabo',
    name: 'Gasabo',
    district: 'Gasabo',
    province: 'Kigali City',
    type: 'district',
    lat: -1.9403,
    lng: 29.9955,
    aliases: [],
  },
  {
    id: 'kicukiro',
    name: 'Kicukiro',
    district: 'Kicukiro',
    province: 'Kigali City',
    type: 'district',
    lat: -1.9768,
    lng: 30.0861,
    aliases: [],
  },
  {
    id: 'nyarugenge',
    name: 'Nyarugenge',
    district: 'Nyarugenge',
    province: 'Kigali City',
    type: 'district',
    lat: -1.9536,
    lng: 30.0607,
    aliases: [],
  },
  {
    id: 'bugesera',
    name: 'Bugesera',
    district: 'Bugesera',
    province: 'Eastern',
    type: 'district',
    lat: -2.2333,
    lng: 30.2,
    aliases: [],
  },
];

const EXTRA_SECTORS = [
  { id: 'muhazi', name: 'Muhazi', district: 'Rwamagana', province: 'Eastern', aliases: [] },
  { id: 'fumba', name: 'Fumba', district: 'Rwamagana', province: 'Eastern', aliases: [] },
  { id: 'ntarama', name: 'Ntarama', district: 'Bugesera', province: 'Eastern', aliases: [] },
  { id: 'rilima', name: 'Rilima', district: 'Bugesera', province: 'Eastern', aliases: [] },
  { id: 'tumba', name: 'Tumba', district: 'Huye', province: 'Southern', aliases: [] },
  { id: 'kinigi', name: 'Kinigi', district: 'Musanze', province: 'Northern', aliases: [] },
  { id: 'muhoza', name: 'Muhoza', district: 'Musanze', province: 'Northern', aliases: [] },
  { id: 'cyarubare', name: 'Cyarubare', district: 'Muhanga', province: 'Southern', aliases: [] },
  { id: 'kabare', name: 'Kabare', district: 'Kayonza', province: 'Eastern', aliases: [] },
  { id: 'rwimbogo', name: 'Rwimbogo', district: 'Kayonza', province: 'Eastern', aliases: [] },
  { id: 'gikondo', name: 'Gikondo', district: 'Kicukiro', province: 'Kigali City', aliases: [] },
  { id: 'niboye', name: 'Niboye', district: 'Kicukiro', province: 'Kigali City', aliases: [] },
  { id: 'gatenga', name: 'Gatenga', district: 'Kicukiro', province: 'Kigali City', aliases: [] },
  { id: 'kagugu', name: 'Kagugu', district: 'Kicukiro', province: 'Kigali City', aliases: [] },
  { id: 'kabuga', name: 'Kabuga', district: 'Gasabo', province: 'Kigali City', aliases: [] },
  { id: 'rwezamenyo', name: 'Rwezamenyo', district: 'Nyarugenge', province: 'Kigali City', aliases: [] },
  { id: 'muhima', name: 'Muhima', district: 'Nyarugenge', province: 'Kigali City', aliases: [] },
  { id: 'nyakabanda', name: 'Nyakabanda', district: 'Nyarugenge', province: 'Kigali City', aliases: [] },
  { id: 'gitega', name: 'Gitega', district: 'Nyarugenge', province: 'Kigali City', aliases: [] },
  { id: 'karama', name: 'Karama', district: 'Nyarugenge', province: 'Kigali City', aliases: [] },
  { id: 'nyarugunga', name: 'Nyarugunga', district: 'Kicukiro', province: 'Kigali City', aliases: [] },
  { id: 'kiruhura', name: 'Kiruhura', district: 'Nyarugenge', province: 'Kigali City', aliases: [] },
  { id: 'kivumu', name: 'Kivumu', district: 'Nyarugenge', province: 'Kigali City', aliases: [] },
];

export const LOCATIONS = [];

// Merge curated districts/towns first (they win on id collisions).
for (const item of EXTRA_PLACES) {
  const entry = {
    id: item.id,
    name: item.name,
    district: item.district,
    province: item.province,
    type: item.type || 'district',
    lat: item.lat,
    lng: item.lng,
    aliases: item.aliases || [],
  };
  LOCATIONS.push(entry);
}

// Fill in any districts from mockData that we did not already define,
// skipping names/aliases already covered by an entry.
const existingIds = new Set(LOCATIONS.map((l) => l.id));
const existingKeys = new Set(
  LOCATIONS.flatMap((l) => [l.name, ...(l.aliases || [])].map(normalize))
);
const addIfNew = (entry) => {
  if (existingIds.has(entry.id)) return;
  const keys = [entry.name, ...(entry.aliases || [])].map(normalize);
  if (keys.some((k) => existingKeys.has(k))) {
    // Merge into existing entry that already covers this place name/alias.
    return;
  }
  existingIds.add(entry.id);
  keys.forEach((k) => existingKeys.add(k));
  LOCATIONS.push(entry);
};

for (const d of mockDistricts) {
  const id = d.name.toLowerCase().replace(/[^a-z0-9]/g, '');
  addIfNew({
    id,
    name: d.name,
    district: d.name,
    province: d.province,
    type: 'district',
    lat: d.lat,
    lng: d.lng,
    aliases: [],
  });
}

// Contextual sectors/hubs with approximate coordinates.
const sectorCoords = {
  muhazi: [-1.9422, 30.3239],
  fumba: [-1.9564, 30.4563],
  ntarama: [-2.1689, 30.1541],
  rilima: [-2.1836, 30.2278],
  tumba: [-2.6332, 29.7525],
  kinigi: [-1.462, 29.569],
  muhoza: [-1.4999, 29.6242],
  cyarubare: [-2.0514, 29.8281],
  kabare: [-1.8928, 30.5285],
  rwimbogo: [-1.7856, 30.5855],
  gikondo: [-1.9617, 30.1736],
  niboye: [-1.9789, 30.1982],
  gatenga: [-1.9854, 30.1625],
  kagugu: [-1.9781, 30.1157],
  kabuga: [-1.9833, 30.2518],
  rwezamenyo: [-1.9533, 30.0493],
  muhima: [-1.9422, 30.0509],
  nyakabanda: [-1.9779, 30.044],
  gitega: [-1.937, 30.0222],
  karama: [-1.9895, 30.1114],
  nyarugunga: [-1.9989, 30.1352],
  kiruhura: [-1.9668, 30.0348],
  kivumu: [-1.9689, 30.0646],
};

for (const s of EXTRA_SECTORS) {
  const [lat, lng] = sectorCoords[s.id] || [null, null];
  LOCATIONS.push({
    id: s.id,
    name: s.name,
    district: s.district,
    province: s.province,
    type: 'sector',
    lat,
    lng,
    aliases: s.aliases || [],
  });
  [s.name, ...(s.aliases || [])].map(normalize).forEach((k) => existingKeys.add(k));
}

// Also register useful sectors from mockSectors that are not already present
// (by name or alias, to avoid splitting canonical places like Musanze/Huye).
for (const s of mockSectors) {
  const key = normalize(s.name);
  if (existingKeys.has(key)) continue;
  const districtEntry = LOCATIONS.find((l) => l.name.toLowerCase() === s.districtName.toLowerCase());
  existingKeys.add(key);
  LOCATIONS.push({
    id: s.id,
    name: s.name,
    district: s.districtName,
    province: districtEntry?.province || '',
    type: 'sector',
    lat: districtEntry?.lat ?? null,
    lng: districtEntry?.lng ?? null,
    aliases: [],
  });
}

// ─── Lookup indexes ─────────────────────────────────────────────────────────────
export function normalize(text) {
  if (!text) return '';
  return String(text)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

const ENTRY_BY_ID = new Map();
const ENTRY_BY_NAME = new Map();
const ENTRY_BY_ALIAS = new Map();

for (const entry of LOCATIONS) {
  ENTRY_BY_ID.set(entry.id, entry);
  if (!ENTRY_BY_NAME.has(normalize(entry.name))) ENTRY_BY_NAME.set(normalize(entry.name), entry);
  for (const alias of entry.aliases || []) {
    const a = normalize(alias);
    if (!ENTRY_BY_ALIAS.has(a)) ENTRY_BY_ALIAS.set(a, entry);
  }
}

export function getEntry(id) {
  return ENTRY_BY_ID.get(id) || null;
}

export function getEntryByName(name) {
  const key = normalize(name);
  return ENTRY_BY_NAME.get(key) || ENTRY_BY_ALIAS.get(key) || null;
}

function levenshtein(a, b) {
  if (Math.abs(a.length - b.length) > 1) return 99;
  const dp = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 0; j <= b.length; j += 1) dp[0][j] = j;
  for (let i = 1; i <= a.length; i += 1) {
    for (let j = 1; j <= b.length; j += 1) {
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
      );
    }
  }
  return dp[a.length][b.length];
}

/**
 * Resolve a free-text query to a single best-matching location entry.
 * Matching priority: exact name/alias > prefix > contains > fuzzy (levenshtein<=1, len>=4).
 */
export function resolvePlace(query) {
  const q = normalize(query);
  if (!q) return null;

  const byName = ENTRY_BY_NAME.get(q);
  if (byName) return byName;
  const byAlias = ENTRY_BY_ALIAS.get(q);
  if (byAlias) return byAlias;

  let best = null;
  let bestScore = -1;

  for (const entry of LOCATIONS) {
    const keywords = [entry.name, ...(entry.aliases || [])];
    for (const kw of keywords) {
      const k = normalize(kw);
      if (k === q) {
        return entry;
      }
      if (k.startsWith(q)) {
        if (bestScore < 90) {
          bestScore = 90;
          best = entry;
        }
      } else if (k.includes(q)) {
        if (bestScore < 70) {
          bestScore = 70;
          best = entry;
        }
      } else if (q.length >= 4 && levenshtein(k.slice(0, q.length), q) <= 1) {
        if (bestScore < 45) {
          bestScore = 45;
          best = entry;
        }
      }
    }
  }
  return best;
}

/**
 * Return ranked place suggestions for an autocomplete dropdown.
 */
export function suggestPlaces(query, { limit = 8, excludeId } = {}) {
  const q = normalize(query);
  if (!q) return [];

  const exact = [];
  const prefix = [];
  const contains = [];
  const fuzzy = [];

  for (const entry of LOCATIONS) {
    if (excludeId && entry.id === excludeId) continue;
    const keywords = [entry.name, ...(entry.aliases || [])];
    let bestKind = null;
    for (const kw of keywords) {
      const k = normalize(kw);
      if (k === q) bestKind = bestKind === 'exact' ? 'exact' : 'exact';
      else if (!bestKind && k.startsWith(q)) bestKind = 'prefix';
      else if (!bestKind && k.includes(q)) bestKind = 'contains';
      else if (!bestKind && q.length >= 4 && levenshtein(k.slice(0, q.length), q) <= 1) bestKind = 'fuzzy';
    }
    if (bestKind === 'exact') exact.push(entry);
    else if (bestKind === 'prefix') prefix.push(entry);
    else if (bestKind === 'contains') contains.push(entry);
    else if (bestKind === 'fuzzy') fuzzy.push(entry);
  }

  const sorted = [...exact, ...prefix, ...contains, ...fuzzy];
  return sorted.slice(0, limit);
}

export function isInKigali(place) {
  if (!place) return false;
  return (
    place.id === 'kigali' ||
    place.province === 'Kigali City' ||
    place.id === 'downtown' ||
    place.id === 'nyabugogo' ||
    place.id === 'kimironko' ||
    place.id === 'remera' ||
    place.province === 'Kigali City'
  );
}

export function getPlaceLabel(entry) {
  if (!entry) return '';
  const district = entry.district && entry.district !== entry.name ? ` · ${entry.district}` : '';
  const province = entry.province ? ` · ${entry.province}` : '';
  return `${entry.name}${district}${province}`;
}