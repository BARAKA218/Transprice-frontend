import { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  MapPin,
  Bus,
  Bike,
  Car,
  ArrowLeftRight,
  Info,
  TrendingUp,
  History,
  ChevronDown,
  Route,
  Sparkles,
  AlertTriangle,
  RefreshCw,
  Calendar,
  Users,
  Bell,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import { fareService, transportUpdateService } from '../../services/api';
import {
  buildWhyThisFare,
  getPopularDestinations,
  TRANSPORT_FILTERS,
} from '../../services/searchService';
import useAIStore from '../../store/aiStore';
import { formatCurrency, formatDate, formatDateShort, formatTime, getTransportTypeLabel } from '../../utils/helpers';
import Button from '../../components/common/Button';
import EmptyState from '../../components/common/EmptyState';
import LocationAutocomplete from '../../components/search/LocationAutocomplete';
import { CardSkeleton } from '../../components/common/LoadingSkeleton';
import heroCity from '../../assets/hero-city.png';
import transportNetwork from '../../assets/transport-network.png';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.45 } }),
};

const transportIcons = { bus: Bus, minibus: Bus, moto: Bike, taxi: Car };

export default function FareSearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [origin, setOrigin] = useState(searchParams.get('origin') || '');
  const [destination, setDestination] = useState(searchParams.get('destination') || '');
  const [originEntry, setOriginEntry] = useState(null);
  const [destEntry, setDestEntry] = useState(null);
  const [originSug, setOriginSug] = useState([]);
  const [destSug, setDestSug] = useState([]);
  const [transportType, setTransportType] = useState(searchParams.get('transportType') || '');
  const [passengers, setPassengers] = useState(1);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState(null);
  const [expandedWhy, setExpandedWhy] = useState(null);

  const [recentSearches, setRecentSearches] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('recentFareSearches') || '[]');
    } catch {
      return [];
    }
  });
  const [popularRoutes, setPopularRoutes] = useState([]);
  const [popularDestinations, setPopularDestinations] = useState([]);
  const [updates, setUpdates] = useState([]);
  const [updatesLoading, setUpdatesLoading] = useState(true);
  const [updatesError, setUpdatesError] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [routes, dests, { data }] = await Promise.all([
          fareService.getPopularRoutes(),
          Promise.resolve(getPopularDestinations()),
          transportUpdateService.getUpdates({ status: 'PUBLISHED' }),
        ]);
        setPopularRoutes(routes);
        setPopularDestinations(dests);
        setUpdates(data.slice(0, 4));
      } catch (err) {
        setUpdatesError(true);
        console.error(err);
      } finally {
        setUpdatesLoading(false);
      }
    };
    load();
  }, []);

  // Debounced origin suggestions
  useEffect(() => {
    if (!origin.trim() || originEntry) return undefined;
    const t = setTimeout(async () => {
      try {
        const sug = await fareService.getSearchSuggestions(origin, 6);
        setOriginSug(sug);
      } catch {
        setOriginSug([]);
      }
    }, 250);
    return () => clearTimeout(t);
  }, [origin, originEntry]);

  // Debounced destination suggestions
  useEffect(() => {
    if (!destination.trim() || destEntry) return undefined;
    const t = setTimeout(async () => {
      try {
        const sug = await fareService.getSearchSuggestions(destination, 6);
        setDestSug(sug);
      } catch {
        setDestSug([]);
      }
    }, 250);
    return () => clearTimeout(t);
  }, [destination, destEntry]);

  const saveRecent = useCallback((entry) => {
    setRecentSearches((prev) => {
      const updated = [
        entry,
        ...prev.filter(
          (s) => !(s.origin === entry.origin && s.destination === entry.destination && s.transportType === entry.transportType)
        ),
      ].slice(0, 5);
      localStorage.setItem('recentFareSearches', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const doSearch = useCallback(
    async (overrides = {}) => {
      const o = overrides.origin ?? origin;
      const d = overrides.destination ?? destination;
      setError(null);
      if (!o.trim() || !d.trim()) {
        setError('Enter both origin and destination.');
        setSearched(false);
        return;
      }
      setSearched(true);
      setLoading(true);
      try {
        const r = await fareService.findFareResult({
          origin: o,
          destination: d,
          transportType,
        });
        setResult(r);
        if (r?.ok) {
          setOrigin(r.from.name);
          setDestination(r.to.name);
          setOriginEntry(r.from);
          setDestEntry(r.to);
          setSearchParams({
            origin: r.from.name,
            destination: r.to.name,
            ...(transportType ? { transportType } : {}),
          });
          saveRecent({ origin: r.from.name, destination: r.to.name, transportType });
        } else {
          setSearchParams({ origin: o, destination: d, ...(transportType ? { transportType } : {}) });
        }
      } catch (err) {
        console.error(err);
        setError('We could not reach the fare service. Please try again.');
        setResult(null);
      } finally {
        setLoading(false);
      }
    },
    [origin, destination, transportType, saveRecent, setSearchParams]
  );

  // Search triggered directly by URL params (e.g. from Routes page or a shared link).
  const bootRef = useRef(false);
  useEffect(() => {
    if (bootRef.current) return;
    const o = searchParams.get('origin');
    const d = searchParams.get('destination');
    if (o && d) {
      bootRef.current = true;
      doSearch({ origin: o, destination: d });
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (loading) return;
    doSearch();
  };

  const handleSwap = () => {
    setOrigin(destination);
    setDestination(origin);
    setOriginEntry(destEntry);
    setDestEntry(originEntry);
    setResult(null);
    setSearched(false);
  };

  const handleOriginSelect = (item) => {
    setOriginSug([]);
    if (!item) {
      setOriginEntry(null);
      return;
    }
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
    if (!item) {
      setDestEntry(null);
      return;
    }
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

  const handleRecentSearch = (s) => {
    setOrigin(s.origin);
    setDestination(s.destination);
    setTransportType(s.transportType || '');
    setOriginEntry(null);
    setDestEntry(null);
    setTimeout(() => doSearch({ origin: s.origin, destination: s.destination }), 0);
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentFareSearches');
  };

  const askAI = (prompt, context) => {
    useAIStore.getState().openWith(prompt, context);
  };

  const askAboutFare = (option) => {
    askAI(
      `Explain the transport fare from ${result.from.name} to ${result.to.name} by ${getTransportTypeLabel(option.transportType)}.`
        + (option.isOfficial
          ? ` The published fare is ${formatCurrency(option.finalFare)}.`
          : ` We estimate about ${formatCurrency(option.finalFare)}.`),
      {
        route: `${result.from.name} → ${result.to.name}`,
        transportType: option.transportType,
        distanceKm: result.distanceKm,
        isOfficial: option.isOfficial,
      }
    );
  };

  const availableOptions = result?.ok ? result.options.filter((x) => x.isAvailable) : [];
  const hasResult = result?.ok && availableOptions.length > 0;
  const isUnresolved = result?.ok === false || (result?.ok && availableOptions.length === 0);

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-[#0f172a]">
      {/* ─── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-navy-900">
        <div className="absolute inset-0">
          <img src={heroCity} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-navy-900/90 via-navy-900/85 to-navy-950/95" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-14 pb-24 sm:pt-20 sm:pb-28">
          <motion.div initial="hidden" animate="visible" className="max-w-3xl">
            <motion.div variants={fadeUp} custom={0} className="mb-5">
              <span className="inline-flex items-center gap-2 rounded-full border border-green-500/30 bg-green-500/10 px-4 py-1.5 text-xs sm:text-sm font-medium text-green-400">
                <ShieldCheck size={14} />
                Verified fares · Transparent pricing · Rwanda
              </span>
            </motion.div>
            <motion.h1 variants={fadeUp} custom={1} className="text-3xl sm:text-5xl font-bold text-white leading-tight mb-3">
              Find your transport fare
            </motion.h1>
            <motion.p variants={fadeUp} custom={2} className="text-neutral-300 text-base sm:text-lg max-w-xl leading-relaxed">
              Search any route in Rwanda — type a city, town, district, or bus station and compare fares by transport type.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* ─── Search card ─────────────────────────────────────────────────── */}
      <section className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 -mt-16">
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          onSubmit={handleSubmit}
          className="rounded-2xl border border-neutral-200 bg-white p-5 sm:p-6 shadow-xl dark:border-neutral-700 dark:bg-neutral-900"
        >
          <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] items-end gap-3">
            <LocationAutocomplete
              id="search-origin"
              label="From"
              name="origin"
              placeholder="e.g. Kigali, Muhanga, Kimironko, Nyabugogo…"
              value={origin}
              onChange={(v) => {
                setOrigin(v);
                setOriginEntry(null);
                setOriginSug([]);
              }}
              onSelect={handleOriginSelect}
              suggestions={originSug}
              excludeId={destEntry?.id}
              required
            />
            <div className="hidden sm:flex items-end justify-center pb-1">
              <button
                type="button"
                onClick={handleSwap}
                aria-label="Swap origin and destination"
                title="Swap"
                className="rounded-lg border border-neutral-200 p-2.5 text-neutral-500 transition hover:border-green-500 hover:text-green-600 dark:border-neutral-600 dark:text-neutral-400"
              >
                <ArrowLeftRight size={18} />
              </button>
            </div>
            <LocationAutocomplete
              id="search-destination"
              label="To"
              name="destination"
              placeholder="e.g. Huye, Musanze, Gisenyi, Airport…"
              value={destination}
              onChange={(v) => {
                setDestination(v);
                setDestEntry(null);
                setDestSug([]);
              }}
              onSelect={handleDestSelect}
              suggestions={destSug}
              excludeId={originEntry?.id}
              required
            />
          </div>

          {/* Transport filter chips */}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-neutral-600 dark:text-neutral-300">Transport:</span>
            {TRANSPORT_FILTERS.map((f) => {
              const active = transportType === f.value;
              return (
                <button
                  key={f.value || 'all'}
                  type="button"
                  onClick={() => setTransportType(f.value)}
                  aria-pressed={active}
                  className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
                    active
                      ? 'border-green-500 bg-green-500 text-white'
                      : 'border-neutral-200 bg-white text-neutral-600 hover:border-green-400 hover:text-green-600 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-300'
                  }`}
                >
                  {f.label}
                </button>
              );
            })}
            <span className="ml-auto inline-flex sm:hidden">
              <button
                type="button"
                onClick={handleSwap}
                aria-label="Swap origin and destination"
                className="rounded-lg border border-neutral-200 p-2 text-neutral-500 dark:border-neutral-600 dark:text-neutral-400"
              >
                <ArrowLeftRight size={16} />
              </button>
            </span>
          </div>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-4 text-sm text-neutral-500 dark:text-neutral-400">
              <label className="inline-flex items-center gap-2">
                <Calendar size={14} className="text-neutral-400" />
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="rounded-md border border-neutral-200 bg-neutral-50 px-2 py-1 text-sm focus:border-green-500 focus:outline-none dark:border-neutral-600 dark:bg-neutral-800"
                />
              </label>
              <label className="inline-flex items-center gap-2">
                <Users size={14} className="text-neutral-400" />
                <select
                  value={passengers}
                  onChange={(e) => setPassengers(Number(e.target.value))}
                  className="rounded-md border border-neutral-200 bg-neutral-50 px-2 py-1 text-sm focus:border-green-500 focus:outline-none dark:border-neutral-600 dark:bg-neutral-800"
                >
                  {[1, 2, 3, 4, 5, 6].map((n) => (
                    <option key={n} value={n}>
                      {n} {n === 1 ? 'passenger' : 'passengers'}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <Button type="submit" size="lg" loading={loading} leftIcon={Search} disabled={loading}>
              Search Fares
            </Button>
          </div>

          {error && (
            <p className="mt-3 flex items-center gap-2 text-sm text-red-500" role="alert">
              <AlertTriangle size={15} /> {error}
            </p>
          )}
        </motion.form>
      </section>

      {/* ─── Demo notice ─────────────────────────────────────────────────── */}
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 mt-4">
        <p className="flex items-start gap-2 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800 dark:bg-amber-900/20 dark:text-amber-300">
          <Info size={14} className="mt-0.5 shrink-0" />
          <span>
            This page runs on a local development dataset. Fares labeled <strong>Estimated</strong> are outputs of a demo pricing
            model — they are <strong>not</strong> official prices. Always confirm fares with the operator or terminal.
          </span>
        </p>
      </div>

      {/* ─── Content ─────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10">
        {loading ? (
          <div className="space-y-4" aria-busy="true">
            {[1, 2, 3].map((i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : error && !result ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-6 dark:border-red-900 dark:bg-red-900/10" role="alert">
            <div className="flex items-center gap-3">
              <AlertTriangle className="text-red-500" size={22} />
              <div>
                <h3 className="font-semibold text-red-700 dark:text-red-300">Something went wrong</h3>
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
              <Button variant="outline" size="sm" className="ml-auto" leftIcon={RefreshCw} onClick={() => doSearch()}>
                Retry
              </Button>
            </div>
          </div>
        ) : hasResult && result ? (
          <ResultsBlock
            result={result}
            expandedWhy={expandedWhy}
            setExpandedWhy={setExpandedWhy}
            passengers={passengers}
            askAboutFare={askAboutFare}
            askAI={askAI}
          />
        ) : searched && isUnresolved ? (
          <motion.div initial="hidden" animate="visible" variants={fadeUp}>
            <EmptyState
              icon={Search}
              title="No exact fare found."
              description={
                result?.ok === false
                  ? `We could not match those locations. Try a suggestion, or use one of these popular routes.`
                  : 'Try these popular routes, or remove the transport type filter.'
              }
            />
            <PopularRoutesGrid routes={popularRoutes} onSelect={handleOriginSelect} originEntry={originEntry} destEntry={destEntry} />
          </motion.div>
        ) : (
          <IdleContent
            recentSearches={recentSearches}
            handleRecentSearch={handleRecentSearch}
            clearRecentSearches={clearRecentSearches}
            popularRoutes={popularRoutes}
            popularDestinations={popularDestinations}
            onSelect={handleOriginSelect}
          />
        )}
      </section>

      {/* ─── Transport updates ───────────────────────────────────────────── */}
      <section className="bg-white py-14 dark:bg-[#0b1220]">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="mb-2 inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-600 dark:bg-green-900/20 dark:text-green-400">
                <Bell size={13} /> Transport updates
              </p>
              <h2 className="text-2xl font-bold text-navy-900 dark:text-white">Latest transport news</h2>
              <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                Route changes, fare advisories and service updates — sample data for development.
              </p>
            </div>
            <Link
              to="/updates"
              className="inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-green-600 hover:text-green-700 dark:text-green-400"
            >
              View all <ExternalLink size={14} />
            </Link>
          </div>

          {updatesLoading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="animate-pulse rounded-xl border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-700 dark:bg-neutral-800" />
              ))}
            </div>
          ) : updatesError ? (
            <p className="text-sm text-neutral-400">Could not load updates right now.</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {updates.map((u) => (
                <article key={u.id} className="flex flex-col rounded-xl border border-neutral-200 bg-white p-4 shadow-sm transition hover:shadow-md dark:border-neutral-700 dark:bg-neutral-900">
                  <div className="mb-2 flex items-center gap-2">
                    <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[11px] font-medium text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
                      {u.category?.replace(/_/g, ' ')}
                    </span>
                    <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
                      demo
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold leading-snug text-navy-900 dark:text-white">{u.title}</h3>
                  <p className="mt-2 line-clamp-3 flex-1 text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
                    {u.description}
                  </p>
                  <p className="mt-3 text-[11px] text-neutral-400">
                    {u.source} · {formatDate(u.publicationDate)}
                  </p>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ─── Routes imagery strip ────────────────────────────────────────── */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid items-center gap-8 lg:grid-cols-2">
          <div>
            <h2 className="text-2xl font-bold text-navy-900 dark:text-white">Explore routes across Rwanda</h2>
            <p className="mt-3 leading-relaxed text-neutral-500 dark:text-neutral-400">
              From Kigali city hops to long-distance journeys to Musanze, Huye, Rubavu and Rusizi — search any route, compare
              bus, minibus, moto and taxi prices, and understand why a fare is what it is.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/routes">
                <Button variant="outline" rightIcon={Route}>
                  View all routes
                </Button>
              </Link>
              <Button variant="ghost" leftIcon={Sparkles} onClick={() => askAI('Show me the most popular routes and typical fares in Rwanda.', { page: 'fare-search' })}>
                Ask TRANSPRICE AI
              </Button>
            </div>
          </div>
          <div className="overflow-hidden rounded-2xl border border-neutral-200 shadow-lg dark:border-neutral-700">
            <img src={transportNetwork} alt="Rwanda transport routes" className="h-56 w-full object-cover lg:h-72" />
          </div>
        </div>
      </section>
    </div>
  );
}

/* ─── Results block ─────────────────────────────────────────────────────────── */
function ResultsBlock({ result, expandedWhy, setExpandedWhy, passengers, askAboutFare }) {
  const availableOptions = result.options.filter((x) => x.isAvailable);
  const cheapest = availableOptions.filter((x) => x.finalFare != null);
  const best = cheapest.length ? cheapest.reduce((a, b) => (b.finalFare < a.finalFare ? b : a)) : null;

  return (
    <motion.div initial="hidden" animate="visible" variants={fadeUp} className="space-y-4">
      <div aria-live="polite" className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <span className="text-lg font-bold text-navy-900 dark:text-white">{result.from.name}</span>
          <ArrowLeftRight size={16} className="text-green-500" />
          <span className="text-lg font-bold text-navy-900 dark:text-white">{result.to.name}</span>
        </div>
        <span className="text-sm text-neutral-500 dark:text-neutral-400">
          {result.distanceKm ? `${result.distanceKm} km` : '—'} ·{' '}
          {result.estimatedTimeMin ? formatTime(result.estimatedTimeMin) : '—'} · {result.zone || 'Zone N/A'}
        </span>
      </div>

      <p className="flex items-center gap-2 rounded-lg bg-green-50 px-3 py-2 text-xs text-green-800 dark:bg-green-900/20 dark:text-green-300">
        <Info size={14} />
        {result.hasOfficial && result.hasEstimate
          ? `Official fares below, plus estimates for transport types without a published fare.`
          : result.hasOfficial
            ? `Showing verified fares. Prices are per person and may exclude baggage or terminal fees.`
            : `No published fare found — the fares below are ESTIMATES from a demo model. Confirm with the operator.`}
      </p>

      <div className="space-y-3">
        <AnimatePresence>
          {availableOptions.map((option, i) => {
            const Icon = transportIcons[option.transportType] || Bus;
            const expanded = expandedWhy === option.key;
            const units = passengers > 1 ? option.finalFare != null ? option.finalFare * passengers : null : option.finalFare;
            return (
              <motion.div
                key={option.key}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`overflow-hidden rounded-xl border bg-white transition-shadow dark:bg-neutral-900 ${
                  best && best.key === option.key ? 'border-green-400 ring-1 ring-green-400/40' : 'border-neutral-200 dark:border-neutral-700'
                }`}
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center p-4">
                  <div className="rounded-xl bg-green-50 p-3 dark:bg-green-900/20 shrink-0">
                    <Icon size={22} className="text-green-600 dark:text-green-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-navy-900 dark:text-white">{getTransportTypeLabel(option.transportType)}</span>
                      {option.isOfficial ? (
                        <span className="rounded-full bg-green-100 px-2 py-0.5 text-[11px] font-semibold text-green-700 dark:bg-green-900/30 dark:text-green-400">
                          Published fare
                        </span>
                      ) : option.isEstimate ? (
                        <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
                          Estimated
                        </span>
                      ) : null}
                      {best && best.key === option.key && (
                        <span className="rounded-full bg-green-500 px-2 py-0.5 text-[11px] font-semibold text-white">
                          Best match
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                      {option.isOfficial
                        ? `${option.source} · updated ${formatDateShort(option.effectiveDate)}`
                        : `From ${option.source} · not verified`}
                    </p>
                  </div>
                  <div className="sm:text-right">
                    {option.finalFare != null ? (
                      <>
                        <p className="text-2xl font-bold text-navy-900 dark:text-white">{formatCurrency(option.finalFare)}</p>
                        <p className="text-xs text-neutral-400">
                          per person
                          {passengers > 1 && ` · x${passengers} = ${formatCurrency(units)}`}
                        </p>
                      </>
                    ) : (
                      <p className="text-sm font-medium text-neutral-400">Not available — check with the operator</p>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 border-t border-neutral-100 px-4 py-2.5 dark:border-neutral-800">
                  <button
                    type="button"
                    onClick={() => setExpandedWhy(expanded ? null : option.key)}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-500 hover:text-green-600 dark:text-neutral-400"
                  >
                    {expanded ? <ChevronDown size={14} className="rotate-180" /> : <ChevronDown size={14} />}
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
                      {(buildWhyThisFare(result, option) || []).map((line, idx) => (
                        <div key={idx} className="mb-2 last:mb-0">
                          <p className="text-xs font-semibold text-navy-900 dark:text-white">{line.title}</p>
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
    </motion.div>
  );
}

/* ─── Idle content ──────────────────────────────────────────────────────────── */
function IdleContent({ recentSearches, handleRecentSearch, clearRecentSearches, popularRoutes, popularDestinations, onSelect }) {
  return (
    <motion.div initial="hidden" animate="visible" className="space-y-10">
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Recent searches */}
        {recentSearches.length > 0 && (
          <div>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="flex items-center gap-2 font-semibold text-navy-900 dark:text-white">
                <History size={16} className="text-green-500" /> Recent searches
              </h3>
              <button onClick={clearRecentSearches} className="text-xs text-neutral-400 hover:text-red-500">
                Clear
              </button>
            </div>
            <div className="space-y-2">
              {recentSearches.map((s, i) => (
                <button
                  key={i}
                  onClick={() => handleRecentSearch(s)}
                  className="w-full rounded-lg border border-neutral-200 bg-white p-3 text-left text-sm text-neutral-700 transition hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800"
                >
                  <span className="flex items-center gap-2">
                    <MapPin size={13} className="text-neutral-400" />
                    {s.origin} <ArrowLeftRight size={12} className="text-green-500" /> {s.destination}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Popular routes */}
        <div className={recentSearches.length > 0 ? 'lg:col-span-2' : 'lg:col-span-3'}>
          <h3 className="mb-3 flex items-center gap-2 font-semibold text-navy-900 dark:text-white">
            <TrendingUp size={16} className="text-green-500" /> Popular routes
          </h3>
          <PopularRoutesGrid routes={popularRoutes} onSelect={onSelect} highlight />
        </div>
      </div>

      {/* Popular destinations */}
      {popularDestinations.length > 0 && (
        <div>
          <h3 className="mb-3 flex items-center gap-2 font-semibold text-navy-900 dark:text-white">
            <Route size={16} className="text-green-500" /> Popular destinations
          </h3>
          <div className="flex flex-wrap gap-2">
            {popularDestinations.map((d) => (
              <button
                key={d.id}
                onClick={() => onSelect({ kind: 'place', entry: d, label: d.name, sublabel: d.district })}
                className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-white px-3.5 py-1.5 text-sm text-neutral-600 transition hover:border-green-400 hover:text-green-600 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300"
              >
                <MapPin size={13} className="text-green-500" />
                {d.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}

/* ─── Popular routes grid ───────────────────────────────────────────────────── */
function PopularRoutesGrid({ routes, onSelect, highlight }) {
  if (!routes.length) return null;
  return (
    <div className="grid gap-3 sm:grid-cols-2 mt-2">
      {routes.map((r) => {
        const Icon = r.fromId === 'kigali' || r.destination === 'Kimironko' ? Route : MapPin;
        return (
          <button
            key={`${r.from}-${r.to}`}
            onClick={() =>
              onSelect({
                kind: 'route',
                label: `${r.from} → ${r.to}`,
                sublabel: 'Popular route',
                fromEntry: { id: r.fromId, name: r.from },
                toEntry: { id: r.toId, name: r.to },
              })
            }
            className={`group flex items-center justify-between gap-3 rounded-xl border p-3.5 text-left transition-shadow ${
              highlight
                ? 'border-neutral-200 bg-white hover:shadow-md dark:border-neutral-700 dark:bg-neutral-900'
                : 'border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-900'
            }`}
          >
            <span className="flex items-center gap-2.5 min-w-0">
              <span className="rounded-lg bg-green-50 p-2 text-green-600 dark:bg-green-900/20 dark:text-green-400">
                <Icon size={16} />
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-medium text-navy-900 dark:text-white">
                  {r.from} → {r.to}
                </span>
                <span className="block text-xs text-neutral-400">
                  {r.distanceKm ? `~${r.distanceKm} km` : ''} · {getTransportTypeLabel(r.transportType)}
                  {r.isOfficial ? ' · Published' : r.isEstimate ? ' · Estimated' : ''}
                </span>
              </span>
            </span>
            <span className="shrink-0 text-right">
              {r.fare != null ? (
                <span className="text-sm font-bold text-navy-900 dark:text-white">{formatCurrency(r.fare)}</span>
              ) : null}
              <span className="block text-[11px] font-medium text-green-600 dark:text-green-400">View fare →</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}