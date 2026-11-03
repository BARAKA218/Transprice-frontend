import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Search,
  Route,
  MapPin,
  Fuel,
  Bell,
  ArrowRight,
  Bus,
  ChevronRight,
  TrendingUp,
  Shield,
  CheckCircle,
  Navigation,
} from 'lucide-react';
import { mockRoutes, mockFares, mockDistricts } from '../../data/mockData';
import { TRANSPORT_TYPES } from '../../types';
import { TRANSPORT_FILTERS } from '../../services/searchService';
import { transportUpdateService, fareService } from '../../services/api';
import { formatDate } from '../../utils/helpers';
import LocationAutocomplete from '../../components/search/LocationAutocomplete';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' },
  }),
};

const features = [
  {
    icon: Search,
    title: 'Fare Search',
    description: 'Find verified fares for any route across Rwanda. Compare prices by transport type.',
    to: '/check-fare',
    color: 'bg-green-50 text-green-600',
  },
  {
    icon: Route,
    title: 'Route Explorer',
    description: 'Discover all available routes with distances, travel times, and transport options.',
    to: '/routes',
    color: 'bg-blue-50 text-blue-600',
  },
  {
    icon: Bell,
    title: 'Transport Updates',
    description: 'Stay informed about fare changes, new routes, and service announcements.',
    to: '/updates',
    color: 'bg-amber-50 text-amber-600',
  },
  {
    icon: Fuel,
    title: 'Fuel Prices',
    description: 'Track current and historical fuel prices that affect transport costs.',
    to: '/fuel-prices',
    color: 'bg-purple-50 text-purple-600',
  },
];

const steps = [
  { num: '01', title: 'Search', description: 'Enter your origin, destination, and preferred transport type.' },
  { num: '02', title: 'Find', description: 'View verified fares, routes, and real-time transport information.' },
  { num: '03', title: 'Travel', description: 'Plan your journey with confidence using transparent pricing data.' },
];

export default function HomePage() {
  const navigate = useNavigate();
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [originEntry, setOriginEntry] = useState(null);
  const [destEntry, setDestEntry] = useState(null);
  const [originSug, setOriginSug] = useState([]);
  const [destSug, setDestSug] = useState([]);
  const [transportType, setTransportType] = useState('');
  const [recentUpdates, setRecentUpdates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await transportUpdateService.getUpdates();
        setRecentUpdates(data.slice(0, 3));
      } catch {
        setRecentUpdates([]);
      } finally {
        setLoading(false);
      }
    };
    load();
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

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (origin) params.set('origin', origin);
    if (destination) params.set('destination', destination);
    if (transportType) params.set('transportType', transportType);
    navigate(`/check-fare?${params.toString()}`);
  };

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative bg-navy-900 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900" />
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-24 lg:pt-32 lg:pb-36">
          <motion.div initial="hidden" animate="visible" className="text-center max-w-3xl mx-auto">
            <motion.div variants={fadeUp} custom={0} className="mb-6">
              <span className="inline-flex items-center gap-2 rounded-full bg-green-500/10 border border-green-500/20 px-4 py-1.5 text-sm font-medium text-green-400">
                <CheckCircle size={14} />
                Transparent Transport Data for Rwanda
              </span>
            </motion.div>
            <motion.h1 variants={fadeUp} custom={1} className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Fair journeys.{' '}
              <span className="text-green-400">Clear prices.</span>
            </motion.h1>
            <motion.p variants={fadeUp} custom={2} className="text-lg text-neutral-300 mb-10 max-w-2xl mx-auto leading-relaxed">
              Your trusted source for verified transport fares, routes, and updates across Rwanda. All data is sourced, verified, and clearly labeled.
            </motion.p>
          </motion.div>

          {/* Search */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            onSubmit={handleSearch}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-2xl">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_auto] gap-4">
              <LocationAutocomplete
                id="home-search-origin"
                name="origin"
                placeholder="From (e.g. Kigali, Kimironko…)"
                value={origin}
                onChange={(v) => { setOrigin(v); setOriginEntry(null); }}
                onSelect={(item) => {
                  setOriginSug([]);
                  if (!item) return;
                  if (item.kind === 'route') {
                    setOrigin(item.fromEntry.name);
                    setOriginEntry(item.fromEntry);
                    setDestination(item.toEntry.name);
                    setDestEntry(item.toEntry);
                    return;
                  }
                  setOrigin(item.entry.name);
                  setOriginEntry(item.entry);
                }}
                suggestions={originSug}
                className="bg-neutral-50"
              />
              <LocationAutocomplete
                id="home-search-destination"
                name="destination"
                placeholder="To (e.g. Huye, Musanze, Gisenyi…)"
                value={destination}
                onChange={(v) => { setDestination(v); setDestEntry(null); }}
                onSelect={(item) => {
                  setDestSug([]);
                  if (!item) return;
                  if (item.kind === 'route') {
                    setDestination(item.toEntry.name);
                    setDestEntry(item.toEntry);
                    setOrigin(item.fromEntry.name);
                    setOriginEntry(item.fromEntry);
                    return;
                  }
                  setDestination(item.entry.name);
                  setDestEntry(item.entry);
                }}
                suggestions={destSug}
                icon={Navigation}
                className="bg-neutral-50"
              />
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  {TRANSPORT_FILTERS.map((f) => {
                    const active = transportType === f.value;
                    return (
                      <button
                        key={f.value || 'all'}
                        type="button"
                        onClick={() => setTransportType(f.value)}
                        aria-pressed={active}
                        className={`rounded-full border px-3.5 py-2 text-sm font-medium transition-colors ${
                          active
                            ? 'border-green-500 bg-green-500 text-white'
                            : 'border-neutral-200 bg-neutral-50 text-neutral-600 hover:border-green-400 hover:text-green-600'
                        }`}
                      >
                        {f.label}
                      </button>
                    );
                  })}
                </div>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-green-600 transition-colors shadow-sm"
                >
                  <Search size={18} />
                  Search Fares
                </button>
              </div>
            </div>
            </div>
          </motion.form>

          {/* Quick links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-6 flex items-center justify-center gap-4 text-sm"
          >
            <span className="text-neutral-400">Popular:</span>
            {['Kigali - Huye', 'Kigali - Musanze', 'Kimironko - Downtown'].map((route) => {
              const [o, d] = route.split(' - ');
              return (
                <button
                  key={route}
                  onClick={() => { setOrigin(o); setDestination(d); }}
                  className="text-neutral-300 hover:text-green-400 transition-colors underline underline-offset-2 decoration-neutral-600"
                >
                  {route}
                </button>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="text-center mb-14"
          >
            <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl font-bold text-navy-900 mb-4">
              Everything you need to travel smart
            </motion.h2>
            <motion.p variants={fadeUp} custom={1} className="text-neutral-500 max-w-2xl mx-auto text-lg">
              Comprehensive transport information at your fingertips
            </motion.p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-50px' }}
                variants={fadeUp}
                custom={i}
              >
                <Link
                  to={f.to}
                  className="block rounded-xl border border-neutral-200 p-6 hover:shadow-lg transition-all duration-300 group h-full"
                >
                  <div className={`inline-flex rounded-lg p-3 mb-4 ${f.color}`}>
                    <f.icon size={24} />
                  </div>
                  <h3 className="text-lg font-semibold text-navy-900 mb-2 group-hover:text-green-600 transition-colors">
                    {f.title}
                  </h3>
                  <p className="text-sm text-neutral-500 leading-relaxed mb-4">{f.description}</p>
                  <span className="inline-flex items-center gap-1 text-sm font-medium text-green-600 group-hover:gap-2 transition-all">
                    Learn more <ArrowRight size={14} />
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-neutral-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="text-center mb-14"
          >
            <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl font-bold text-navy-900 mb-4">
              How it works
            </motion.h2>
            <motion.p variants={fadeUp} custom={1} className="text-neutral-500 max-w-2xl mx-auto text-lg">
              Simple steps to find the information you need
            </motion.p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-50px' }}
                variants={fadeUp}
                custom={i}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-navy-900 text-white text-xl font-bold mb-6">
                  {step.num}
                </div>
                <h3 className="text-xl font-semibold text-navy-900 mb-2">{step.title}</h3>
                <p className="text-neutral-500 leading-relaxed">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Updates */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="flex items-center justify-between mb-10"
          >
            <div>
              <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl font-bold text-navy-900 mb-2">
                Recent Updates
              </motion.h2>
              <motion.p variants={fadeUp} custom={1} className="text-neutral-500">
                Latest transport news and changes
              </motion.p>
            </div>
            <motion.div variants={fadeUp} custom={2}>
              <Link
                to="/updates"
                className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-green-600 hover:text-green-700 transition-colors"
              >
                View all <ChevronRight size={16} />
              </Link>
            </motion.div>
          </motion.div>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-xl border border-neutral-200 p-6 animate-pulse">
                  <div className="h-6 bg-neutral-200 rounded w-3/4 mb-3" />
                  <div className="h-4 bg-neutral-200 rounded w-1/2 mb-4" />
                  <div className="space-y-2">
                    <div className="h-3 bg-neutral-200 rounded w-full" />
                    <div className="h-3 bg-neutral-200 rounded w-5/6" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recentUpdates.map((update, i) => (
                <motion.div
                  key={update.id}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-50px' }}
                  variants={fadeUp}
                  custom={i}
                >
                  <Link
                    to={`/updates?id=${update.id}`}
                    className="block rounded-xl border border-neutral-200 p-6 hover:shadow-lg transition-all duration-300 group h-full"
                  >
                    <span className="inline-flex rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700 mb-3">
                      {update.category}
                    </span>
                    <h3 className="text-base font-semibold text-navy-900 mb-2 group-hover:text-green-600 transition-colors line-clamp-2">
                      {update.title}
                    </h3>
                    <p className="text-sm text-neutral-500 line-clamp-2 mb-3">{update.description}</p>
                    <div className="flex items-center justify-between text-xs text-neutral-400">
                      <span>{formatDate(update.publicationDate)}</span>
                      <span>{update.source}</span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
          <div className="mt-6 text-center sm:hidden">
            <Link
              to="/updates"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-green-600 hover:text-green-700"
            >
              View all updates <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-navy-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { label: 'Routes', value: mockRoutes.length, icon: Route },
              { label: 'Verified Fares', value: mockFares.length, icon: TrendingUp },
              { label: 'Districts Covered', value: mockDistricts.length, icon: MapPin },
              { label: 'Transport Types', value: TRANSPORT_TYPES.length, icon: Bus },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
                className="text-center"
              >
                <stat.icon size={28} className="text-green-400 mx-auto mb-3" />
                <div className="text-3xl sm:text-4xl font-bold text-white mb-1">{stat.value}+</div>
                <div className="text-sm text-neutral-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-green-500">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="max-w-2xl mx-auto">
            <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Join TransPrice
            </motion.h2>
            <motion.p variants={fadeUp} custom={1} className="text-green-100 text-lg mb-8">
              Access verified transport information. Search fares, explore routes, and stay updated on Rwanda transport.
            </motion.p>
            <motion.div variants={fadeUp} custom={2} className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/check-fare"
                className="inline-flex items-center gap-2 rounded-lg bg-white px-8 py-3 text-sm font-semibold text-navy-900 hover:bg-green-50 transition-colors shadow-sm"
              >
                Check a Fare
                <ArrowRight size={16} />
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center gap-2 rounded-lg border border-white/30 px-8 py-3 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
              >
                Learn More
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Trust */}
      <section className="py-12 bg-neutral-50 border-t border-neutral-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-center">
            <Shield size={20} className="text-green-600" />
            <p className="text-sm text-neutral-500">
              All data is sourced, verified, and clearly labeled. Demo data is marked as sample. TransPrice is an independent platform, not government-owned.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
