import {
  LOCATIONS,
  normalize,
  resolvePlace,
  suggestPlaces,
  getEntry,
  getEntryByName,
  getPlaceLabel,
  isInKigali,
} from '../data/transportLocations';
import {
  estimateDistance,
  estimateFare,
  zoneForDistance,
  estimatedTimeMins,
  POPULAR_DESTINATIONS,
  POPULAR_ROUTES,
  TRANSPORT_ORDER,
  ESTIMATE_MODEL,
} from '../data/transportEstimates';
import { formatDateShort } from '../utils/helpers';

export const TRANSPORT_FILTERS = [
  { value: '', label: 'All' },
  { value: 'bus', label: 'Bus' },
  { value: 'moto', label: 'Moto' },
  { value: 'taxi', label: 'Taxi' },
];

export const TYPE_GROUPS = {
  '': ['bus', 'minibus', 'moto', 'taxi'],
  bus: ['bus', 'minibus'],
  moto: ['moto'],
  taxi: ['taxi'],
  minibus: ['minibus'],
};

function fareKey(originId, destId) {
  const o = getEntry(originId);
  const d = getEntry(destId);
  const oIn = isInKigali(o);
  const dIn = isInKigali(d);
  if (oIn && dIn) return `${originId}>${destId}`;
  const oKey = oIn ? 'kigali' : originId;
  const dKey = dIn ? 'kigali' : destId;
  return `${oKey}>${dKey}`;
}

function buildFareIndex(fares) {
  const map = {};
  for (const fare of fares || []) {
    if (!fare || !fare.origin || !fare.destination) continue;
    const oEntry = getEntryByName(fare.origin);
    const dEntry = getEntryByName(fare.destination);
    if (!oEntry || !dEntry) continue;
    const key = fareKey(oEntry.id, dEntry.id);
    if (!map[key]) map[key] = [];
    map[key].push(fare);
  }
  return map;
}

function bestFare(list, typeId) {
  if (!list) return null;
  const matches = list.filter((f) => f.transportType === typeId);
  if (!matches.length) return null;
  return matches.sort((a, b) => {
    const da = a.effectiveDate || '';
    const db = b.effectiveDate || '';
    return da > db ? -1 : da < db ? 1 : 0;
  })[0];
}

/**
 * Build the professional fare result for one origin/destination pair.
 * Returns { ok, reason?, from, to, distanceKm, zone, estimatedTimeMin, options, hasOfficial }.
 */
export function buildFareResult({ origin, destination, transportType }, data = {}) {
  const o = resolvePlace(origin);
  const d = resolvePlace(destination);

  if (!o || !d) {
    return { ok: false, reason: 'unresolved', from: null, to: null };
  }
  if (o.id === d.id) {
    return { ok: false, reason: 'same-place', from: o, to: d };
  }

  const fareIndex = buildFareIndex(data.fares || []);
  const key = fareKey(o.id, d.id);
  const matchedFares = fareIndex[key] || [];

  const route = findRoute(data.routes || [], o, d);
  const distanceKm = estimateDistance(o, d, route?.distance);
  const zone = zoneForDistance(distanceKm);
  const estimatedTimeMin = estimatedTimeMins(distanceKm);

  const types = TYPE_GROUPS[transportType] || TYPE_GROUPS[''];
  const options = [];

  for (const typeId of types) {
    const fare = bestFare(matchedFares, typeId);
    const estimated = estimateFare(distanceKm, typeId);

    if (fare) {
      options.push({
        key: `${key}-${typeId}`,
        transportType: typeId,
        fromLabel: o.name,
        toLabel: d.name,
        officialFare: Number(fare.fare),
        estimatedFare: null,
        finalFare: Number(fare.fare),
        isOfficial: true,
        isEstimate: false,
        isAvailable: true,
        source: fare.source || 'Published fare',
        sourceDate: fare.sourceDate || fare.effectiveDate,
        effectiveDate: fare.effectiveDate,
        verificationStatus: fare.verificationStatus || 'VERIFIED',
        status: 'PUBLISHED',
        routeId: fare.routeId || null,
        routeName: fare.routeName || `${o.name} to ${d.name}`,
        distanceKm,
        zone,
        estimatedTimeMin,
      });
    } else if (estimated !== null) {
      options.push({
        key: `${key}-${typeId}`,
        transportType: typeId,
        fromLabel: o.name,
        toLabel: d.name,
        officialFare: null,
        estimatedFare: estimated,
        finalFare: estimated,
        isOfficial: false,
        isEstimate: true,
        isAvailable: true,
        source: 'TRANSPRICE demo pricing model',
        sourceDate: null,
        effectiveDate: null,
        verificationStatus: 'UNVERIFIED',
        status: 'ESTIMATED',
        routeId: null,
        routeName: `${o.name} to ${d.name} (estimated)`,
        distanceKm,
        zone,
        estimatedTimeMin,
      });
    } else {
      options.push({
        key: `${key}-${typeId}`,
        transportType: typeId,
        fromLabel: o.name,
        toLabel: d.name,
        officialFare: null,
        estimatedFare: null,
        finalFare: null,
        isOfficial: false,
        isEstimate: false,
        isAvailable: false,
        source: null,
        sourceDate: null,
        effectiveDate: null,
        verificationStatus: null,
        status: 'NOT_AVAILABLE',
        routeId: null,
        routeName: `${o.name} to ${d.name}`,
        distanceKm,
        zone,
        estimatedTimeMin,
      });
    }
  }

  options.sort((a, b) => {
    if (a.isOfficial && !b.isOfficial) return -1;
    if (!a.isOfficial && b.isOfficial) return 1;
    return (a.finalFare ?? Infinity) - (b.finalFare ?? Infinity);
  });

  const officialOptions = options.filter((x) => x.isOfficial);
  const lastUpdated = officialOptions
    .map((x) => x.effectiveDate)
    .filter(Boolean)
    .sort()
    .pop();

  return {
    ok: true,
    reason: 'ok',
    from: o,
    to: d,
    distanceKm,
    zone,
    estimatedTimeMin,
    routeName: options[0]?.routeName || `${o.name} → ${d.name}`,
    options,
    hasOfficial: officialOptions.length > 0,
    hasEstimate: options.some((x) => x.isEstimate),
    lastUpdated,
    modelDisclaimer: ESTIMATE_MODEL.disclaimer,
  };
}

function findRoute(routes, o, d) {
  for (const route of routes || []) {
    const ro = getEntryByName(route.origin);
    const rd = getEntryByName(route.destination);
    if (ro && rd && ro.id === o.id && rd.id === d.id) return route;
  }
  return null;
}

/**
 * Build contextual explanation for a fare option.
 */
export function buildWhyThisFare(result, option) {
  const lines = [];
  if (!result || !option) return lines;

  lines.push({
    title: 'What you pay',
    text: option.isOfficial
      ? `This is the published ${option.transportType} fare of ${formatCurrencySafe(option.finalFare)} for ${result.from.name} → ${result.to.name}.`
      : option.isEstimate
        ? `This estimated ${option.transportType} fare of ${formatCurrencySafe(option.finalFare)} is generated by our demo model. It is not an official price — confirm with the operator.`
        : `No ${option.transportType} fare is available for this route in our dataset. Check with the terminal for current rates.`,
  });

  if (result.distanceKm) {
    lines.push({
      title: 'Distance & time',
      text: `The route is about ${result.distanceKm} km${result.estimatedTimeMin ? ` (~${formatTimeSafe(result.estimatedTimeMin)})` : ''} and falls in ${result.zone}. Longer routes and multi-stop terminals typically cost more.`,
    });
  }

  lines.push({
    title: 'How fares are set',
    text: 'Fares are set by transport operators and regulated bodies in Rwanda, and vary by operator, vehicle type, and time of day (peak vs. off-peak).',
  });

  lines.push({
    title: 'Fuel influence',
    text: 'Operator costs follow fuel prices. Check the Fuel Prices page for the latest petrol and diesel rates that influence these fares.',
  });

  if (option.isOfficial) {
    lines.push({
      title: 'Source & status',
      text: `Sourced from ${option.source} and last updated ${formatDateShort(option.effectiveDate)}. Fares may exclude baggage and terminal/platform fees.`,
    });
  }

  return lines;
}

// Local currency/time formatting (avoids pulling full helpers into every import).
function formatCurrencySafe(value) {
  if (value === null || value === undefined) return 'RWF 0';
  return `RWF ${Number(value).toLocaleString('en-RW')}`;
}

function formatTimeSafe(minutes) {
  if (!minutes) return '';
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m ? `${h}h ${m}m` : `${h}h`;
}

/**
 * Search suggestions combining places and popular routes.
 */
export function searchSuggestions(query, { limit = 6 } = {}) {
  const q = normalize(query);
  if (!q) return [];

  const suggestions = suggestPlaces(query, { limit: limit + 3 }).map((entry) => ({
    id: `place-${entry.id}`,
    kind: 'place',
    label: entry.name,
    sublabel: getEntryLabel(entry),
    entry,
  }));

  for (const route of POPULAR_ROUTES) {
    const o = resolvePlace(route.origin);
    const d = resolvePlace(route.destination);
    if (!o || !d) continue;
    const full = normalize(`${o.name} ${d.name}`);
    const parts = q.split(' ');
    const match = parts.every((part) => full.includes(part));
    if (match) {
      suggestions.push({
        id: `route-${o.id}-${d.id}`,
        kind: 'route',
        label: `${o.name} → ${d.name}`,
        sublabel: 'Popular route',
        fromEntry: o,
        toEntry: d,
      });
    }
  }

  const seen = new Set();
  return suggestions.filter((s) => {
    const k = s.id;
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  }).slice(0, limit);
}

function getEntryLabel(entry) {
  const parts = [];
  if (entry.district && entry.district !== entry.name) parts.push(entry.district);
  if (entry.province && !parts.includes(entry.province)) parts.push(entry.province);
  return parts.join(' · ');
}

/**
 * Popular destinations grid entries (with a hint about the best fare from Kigali).
 */
export function getPopularDestinations() {
  return POPULAR_DESTINATIONS.map((id) => {
    const entry = getEntry(id);
    if (!entry) return null;
    return { id: entry.id, name: entry.name, district: entry.district, province: entry.province };
  }).filter(Boolean);
}

/**
 * Popular routes with a representative (best official or estimated) fare summary.
 */
export function getPopularRoutes(data = {}) {
  return POPULAR_ROUTES.map((route) => {
    const o = resolvePlace(route.origin);
    const d = resolvePlace(route.destination);
    if (!o || !d) return null;

    const result = buildFareResult(
      { origin: o.name, destination: d.name, transportType: 'bus' },
      data
    );
    if (!result.ok) return null;
    const option = result.options.find((x) => x.isOfficial) || result.options.find((x) => x.isEstimate) || result.options[0];

    return {
      from: o.name,
      to: d.name,
      fromId: o.id,
      toId: d.id,
      distanceKm: result.distanceKm,
      zone: result.zone,
      fare: option?.finalFare ?? null,
      isOfficial: !!option?.isOfficial,
      isEstimate: !!option?.isEstimate,
      transportType: option?.transportType || 'bus',
    };
  }).filter(Boolean);
}

export { LOCATIONS, normalize, resolvePlace, getEntry, getPlaceLabel };