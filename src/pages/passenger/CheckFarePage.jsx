import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, MapPin, Navigation, Bus, Bike, Car, Bookmark, AlertTriangle, ArrowLeftRight, ChevronDown, Sparkles,
} from 'lucide-react';
import { fareService } from '../../services/api';
import { buildWhyThisFare, TRANSPORT_FILTERS } from '../../services/searchService';
import useAIStore from '../../store/aiStore';
import { formatCurrency, formatDateShort, formatTime, getTransportTypeLabel } from '../../utils/helpers';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import EmptyState from '../../components/common/EmptyState';
import LocationAutocomplete from '../../components/search/LocationAutocomplete';

const transportIcons = { bus: Bus, minibus: Bus, moto: Bike, taxi: Car };

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const itemVariants = { hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } };

export default function CheckFarePage() {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [transportType, setTransportType] = useState('');
  const [originEntry, setOriginEntry] = useState(null);
  const [destEntry, setDestEntry] = useState(null);
  const [originSug, setOriginSug] = useState([]);
  const [destSug, setDestSug] = useState([]);

  const [result, setResult] = useState(null);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expandedWhy, setExpandedWhy] = useState(null);
  const [popularRoutes, setPopularRoutes] = useState([]);

  const [savedRoutes, setSavedRoutes] = useState(() => {
    try { return JSON.parse(localStorage.getItem('tp_saved_routes') || '[]'); } catch { return []; }
  });

  useEffect(() => {
    fareService.getPopularRoutes().then(setPopularRoutes).catch(() => {});
  }, []);

  useEffect(() => {
    if (!origin.trim() || originEntry) { setOriginSug([]); return undefined; }
    const t = setTimeout(async () => {
      try { setOriginSug(await fareService.getSearchSuggestions(origin, 6)); } catch { setOriginSug([]); }
    }, 250);
    return () => clearTimeout(t);
  }, [origin, originEntry]);

  useEffect(() => {
    if (!destination.trim() || destEntry) { setDestSug([]); return undefined; }
    const t = setTimeout(async () => {
      try { setDestSug(await fareService.getSearchSuggestions(destination, 6)); } catch { setDestSug([]); }
    }, 250);
    return () => clearTimeout(t);
  }, [destination, destEntry]);

  const doSearch = async () => {
    setError(null);
    if (!origin.trim() || !destination.trim()) {
      setError('Enter both origin and destination.');
      return;
    }
    setSearched(true);
    setLoading(true);
    try {
      const r = await fareService.findFareResult({ origin, destination, transportType });
      setResult(r);
      if (r?.ok) {
        setOrigin(r.from.name);
        setDestination(r.to.name);
        setOriginEntry(r.from);
        setDestEntry(r.to);
      }
    } catch (err) {
      console.error(err);
      setError('Search failed. Please try again.');
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const handleOriginSelect = (item) => {
    setOriginSug([]);
    if (!item) { setOriginEntry(null); return; }
    if (item.kind === 'route') {
      setOrigin(item.fromEntry.name);
      setOriginEntry(item.fromEntry);
      setDestination(item.toEntry.name);
      setDestEntry(item.toEntry);
      return;
    }
    setOrigin(item.entry.name);
    setOriginEntry(item.entry);
  };

  const handleDestSelect = (item) => {
    setDestSug([]);
    if (!item) { setDestEntry(null); return; }
    if (item.kind === 'route') {
      setDestination(item.toEntry.name);
      setDestEntry(item.toEntry);
      setOrigin(item.fromEntry.name);
      setOriginEntry(item.fromEntry);
      return;
    }
    setDestination(item.entry.name);
    setDestEntry(item.entry);
  };

  const swap = () => {
    setOrigin(destination);
    setDestination(origin);
    setOriginEntry(destEntry);
    setDestEntry(originEntry);
    setResult(null);
    setSearched(false);
  };

  const handleSaveRoute = (routeId) => {
    if (!routeId) return;
    const updated = savedRoutes.includes(routeId)
      ? savedRoutes.filter((id) => id !== routeId)
      : [...savedRoutes, routeId];
    setSavedRoutes(updated);
    localStorage.setItem('tp_saved_routes', JSON.stringify(updated));
  };

  const askAboutFare = (option) => {
    useAIStore.getState().openWith(
      `Explain the transport fare from ${result.from.name} to ${result.to.name} by ${getTransportTypeLabel(option.transportType)}.`
        + (option.isOfficial ? ` The published fare is ${formatCurrency(option.finalFare)}.` : ` We estimate about ${formatCurrency(option.finalFare)}.`),
      {
        route: `${result.from.name} → ${result.to.name}`,
        transportType: option.transportType,
        distanceKm: result.distanceKm,
        isOfficial: option.isOfficial,
      }
    );
  };

  const availableOptions = result?.ok ? result.options.filter((x) => x.isAvailable) : [];

  const loadRoute = async (r) => {
    setSearched(true);
    setLoading(true);
    setError(null);
    try {
      const res = await fareService.findFareResult({ origin: r.from, destination: r.to, transportType });
      setResult(res);
      if (res?.ok) {
        setOrigin(res.from.name);
        setDestination(res.to.name);
        setOriginEntry(res.from);
        setDestEntry(res.to);
      }
    } catch (err) {
      console.error(err);
      setError('Search failed. Please try again.');
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Check Fare</h1>
        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
          Search transport fares between locations in Rwanda
        </p>
      </motion.div>

      {/* Search form */}
      <motion.div variants={itemVariants}>
        <Card>
          <form onSubmit={(e) => { e.preventDefault(); doSearch(); }} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 items-end gap-4">
              <LocationAutocomplete
                id="p-check-origin"
                label="Origin"
                name="origin"
                placeholder="e.g. Kigali, Kimironko, Muhanga…"
                value={origin}
                onChange={(v) => { setOrigin(v); setOriginEntry(null); }}
                onSelect={handleOriginSelect}
                suggestions={originSug}
                icon={MapPin}
                required
              />
              <LocationAutocomplete
                id="p-check-destination"
                label="Destination"
                name="destination"
                placeholder="e.g. Downtown, Huye, Musanze…"
                value={destination}
                onChange={(v) => { setDestination(v); setDestEntry(null); }}
                onSelect={handleDestSelect}
                suggestions={destSug}
                icon={Navigation}
                required
              />
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Transport:</span>
                {TRANSPORT_FILTERS.map((f) => {
                  const active = transportType === f.value;
                  return (
                    <button
                      key={f.value || 'all'}
                      type="button"
                      onClick={() => setTransportType(f.value)}
                      aria-pressed={active}
                      className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
                        active
                          ? 'border-green-500 bg-green-500 text-white'
                          : 'border-neutral-300 text-neutral-600 hover:border-green-400 hover:text-green-600 dark:border-neutral-600 dark:text-neutral-300'
                      }`}
                    >
                      {f.label}
                    </button>
                  );
                })}
                <button
                  type="button"
                  onClick={swap}
                  aria-label="Swap origin and destination"
                  className="rounded-lg border border-neutral-300 p-2 text-neutral-500 hover:border-green-400 hover:text-green-600 dark:border-neutral-600 dark:text-neutral-300"
                >
                  <ArrowLeftRight size={16} />
                </button>
              </div>
              <div className="flex items-center gap-3">
                <Button type="submit" fullWidth loading={loading} leftIcon={Search}>
                  Search Fares
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setOrigin('');
                    setDestination('');
                    setOriginEntry(null);
                    setDestEntry(null);
                    setResult(null);
                    setSearched(false);
                    setError(null);
                  }}
                >
                  Clear
                </Button>
              </div>
            </div>

            {error && (
              <p className="flex items-center gap-2 text-sm text-red-500" role="alert">
                <AlertTriangle size={15} /> {error}
              </p>
            )}
          </form>
        </Card>
      </motion.div>

      {/* Results */}
      <motion.div variants={itemVariants}>
        {loading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-900">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-neutral-200 dark:bg-neutral-700" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-1/3 rounded bg-neutral-200 dark:bg-neutral-700" />
                    <div className="h-3 w-1/2 rounded bg-neutral-200 dark:bg-neutral-700" />
                  </div>
                  <div className="h-8 w-24 rounded bg-neutral-200 dark:bg-neutral-700" />
                </div>
              </div>
            ))}
          </div>
        ) : result?.ok && availableOptions.length > 0 ? (
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-neutral-900 dark:text-white">{result.from.name}</span>
                <ArrowLeftRight size={15} className="text-green-500" />
                <span className="font-semibold text-neutral-900 dark:text-white">{result.to.name}</span>
              </div>
              <span className="text-xs text-neutral-500 dark:text-neutral-400">
                {result.distanceKm ? `${result.distanceKm} km` : '—'} · {result.estimatedTimeMin ? formatTime(result.estimatedTimeMin) : '—'}
              </span>
            </div>

            <p className="flex items-center gap-2 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800 dark:bg-amber-900/20 dark:text-amber-300">
              <AlertTriangle size={14} />
              {result.hasOfficial
                ? 'Showing verified fares where available.'
                : 'No published fare found — the fares below are ESTIMATES from a demo model. Confirm with the operator.'}
            </p>

            <AnimatePresence>
              {availableOptions.map((option, index) => {
                const Icon = transportIcons[option.transportType] || Bus;
                const expanded = expandedWhy === option.key;
                return (
                  <motion.div
                    key={option.key}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="overflow-hidden rounded-xl border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-900"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center p-4">
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div className="rounded-xl bg-green-50 p-3 shrink-0 dark:bg-green-900/20">
                          <Icon size={24} className="text-green-600 dark:text-green-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="font-semibold text-neutral-900 dark:text-white text-sm">
                              {getTransportTypeLabel(option.transportType)}
                            </p>
                            {option.isOfficial ? (
                              <span className="rounded-full bg-green-100 px-2 py-0.5 text-[11px] font-semibold text-green-700 dark:bg-green-900/30 dark:text-green-400">
                                Published
                              </span>
                            ) : option.isEstimate ? (
                              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
                                Estimated
                              </span>
                            ) : null}
                          </div>
                          <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                            {option.isOfficial
                              ? `${option.source} · updated ${formatDateShort(option.effectiveDate)}`
                              : option.isEstimate
                                ? `From ${option.source} · not verified`
                                : 'Not available in our dataset'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 sm:flex-shrink-0">
                        {option.finalFare != null ? (
                          <span className="text-xl font-bold text-green-600 dark:text-green-400">
                            {formatCurrency(option.finalFare)}
                          </span>
                        ) : (
                          <span className="text-sm text-neutral-400">Not available</span>
                        )}
                        {option.routeId && (
                          <Button
                            variant={savedRoutes.includes(option.routeId) ? 'primary' : 'outline'}
                            size="sm"
                            leftIcon={Bookmark}
                            onClick={() => handleSaveRoute(option.routeId)}
                          >
                            {savedRoutes.includes(option.routeId) ? 'Saved' : 'Save'}
                          </Button>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 border-t border-neutral-100 px-4 py-2.5 dark:border-neutral-800">
                      <button
                        type="button"
                        onClick={() => setExpandedWhy(expanded ? null : option.key)}
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-500 hover:text-green-600 dark:text-neutral-400"
                      >
                        <ChevronDown size={14} className={expanded ? 'rotate-180' : ''} />
                        Why this fare?
                      </button>
                      <button
                        type="button"
                        onClick={() => askAboutFare(option)}
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-green-600 hover:text-green-700 dark:text-green-400"
                      >
                        <Sparkles size={14} /> Ask TRANSPRICE AI
                      </button>
                    </div>

                    <AnimatePresence>
                      {expanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="border-t border-neutral-100 bg-neutral-50 px-4 py-3 dark:border-neutral-800 dark:bg-neutral-800/40"
                        >
                          {(buildWhyThisFare(result, option) || []).map((line, i) => (
                            <div key={i} className="mb-2 last:mb-0">
                              <p className="text-xs font-semibold text-neutral-900 dark:text-white">{line.title}</p>
                              <p className="text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">{line.text}</p>
                            </div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        ) : searched ? (
          <EmptyState
            icon={Search}
            title="No exact fare found."
            description={
              result?.ok === false
                ? 'We could not match those locations. Try a suggestion below, or a different combination.'
                : 'Try these popular routes, or remove the transport type filter.'
            }
          />
        ) : (
          <EmptyState
            icon={Search}
            title="Search for fares"
            description="Enter your origin and destination to find available transport fares."
          />
        )}
      </motion.div>

      {/* Popular route suggestions */}
      {(searched || !searched) && availableOptions.length === 0 && !loading && (
        <div>
          <h3 className="mb-3 text-sm font-semibold text-neutral-900 dark:text-white">Popular routes</h3>
          <div className="grid gap-2 sm:grid-cols-2">
            {popularRoutes.map((r) => (
              <button
                key={`${r.from}-${r.to}`}
                onClick={() => loadRoute(r)}
                className="flex items-center justify-between gap-3 rounded-xl border border-neutral-200 p-3 text-left transition hover:shadow-md dark:border-neutral-700"
              >
                <span className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
                  {r.from} → {r.to}
                </span>
                <span className="shrink-0 text-xs text-neutral-400">
                  {r.fare != null ? formatCurrency(r.fare) : ''}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}