import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, MapPin, Navigation, Clock, Bus, Car, Bike, Bookmark, ArrowRight, Filter } from 'lucide-react';
import { routeService, fareService } from '../../services/api';
import { formatCurrency, formatTime, formatDistance, getTransportTypeLabel } from '../../utils/helpers';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import EmptyState from '../../components/common/EmptyState';
import useDebounce from '../../hooks/useDebounce';

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const itemVariants = { hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } };

export default function RoutesPage() {
  const [routes, setRoutes] = useState([]);
  const [filteredRoutes, setFilteredRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [savedRoutes, setSavedRoutes] = useState(() => {
    try { return JSON.parse(localStorage.getItem('tp_saved_routes') || '[]'); } catch { return []; }
  });

  const debouncedSearch = useDebounce(searchQuery, 300);

  useEffect(() => {
    async function load() {
      try {
        const data = await routeService.getRoutes();
        setRoutes(data);
        setFilteredRoutes(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  useEffect(() => {
    if (!debouncedSearch) {
      setFilteredRoutes(routes);
    } else {
      const q = debouncedSearch.toLowerCase();
      setFilteredRoutes(
        routes.filter(
          (r) =>
            r.name.toLowerCase().includes(q) ||
            r.origin.toLowerCase().includes(q) ||
            r.destination.toLowerCase().includes(q)
        )
      );
    }
  }, [debouncedSearch, routes]);

  const toggleSave = (routeId) => {
    const updated = savedRoutes.includes(routeId)
      ? savedRoutes.filter((id) => id !== routeId)
      : [...savedRoutes, routeId];
    setSavedRoutes(updated);
    localStorage.setItem('tp_saved_routes', JSON.stringify(updated));
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Routes</h1>
        <p className="text-neutral-500 dark:text-neutral-400 text-sm mt-1">Browse available transport routes in Rwanda</p>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Input
          placeholder="Search routes by name, origin, or destination..."
          icon={Search}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </motion.div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-700 p-5">
              <div className="h-5 bg-neutral-200 dark:bg-neutral-700 rounded w-2/3 mb-3" />
              <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-1/2 mb-2" />
              <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-1/3" />
            </div>
          ))}
        </div>
      ) : filteredRoutes.length === 0 ? (
        <EmptyState
          icon={Search}
          title="No routes found"
          description={searchQuery ? 'Try a different search term.' : 'No routes available at the moment.'}
          actionLabel={searchQuery ? 'Clear search' : undefined}
          onAction={searchQuery ? () => setSearchQuery('') : undefined}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredRoutes.map((route, index) => (
            <motion.div key={route.id} variants={itemVariants}>
              <Card hover className="h-full">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-neutral-900 dark:text-white">{route.name}</h3>
                  <button
                    onClick={() => toggleSave(route.id)}
                    className={`p-1.5 rounded-lg transition-colors ${
                      savedRoutes.includes(route.id)
                        ? 'bg-green-50 dark:bg-green-900/20 text-green-600'
                        : 'text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                    }`}
                  >
                    <Bookmark size={16} fill={savedRoutes.includes(route.id) ? 'currentColor' : 'none'} />
                  </button>
                </div>

                <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400 mb-2">
                  <MapPin size={14} className="text-green-600 dark:text-green-400 shrink-0" />
                  <span>{route.origin}</span>
                  <ArrowRight size={12} className="text-neutral-400 shrink-0" />
                  <Navigation size={14} className="text-blue-600 dark:text-blue-400 shrink-0" />
                  <span>{route.destination}</span>
                </div>

                <div className="flex items-center gap-4 text-xs text-neutral-500 dark:text-neutral-400 mb-3">
                  <span className="flex items-center gap-1"><Clock size={12} /> {formatTime(route.estimatedTime)}</span>
                  <span className="flex items-center gap-1"><MapPin size={12} /> {formatDistance(route.distance)}</span>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {route.transportTypes.map((type) => (
                    <span key={type} className="inline-flex items-center gap-1 rounded-full bg-neutral-100 dark:bg-neutral-800 px-2.5 py-1 text-xs font-medium text-neutral-700 dark:text-neutral-300">
                      {getTransportTypeLabel(type)}
                    </span>
                  ))}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
