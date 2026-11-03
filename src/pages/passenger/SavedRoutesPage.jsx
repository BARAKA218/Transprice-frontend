import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bookmark, MapPin, ArrowRight, Clock, Bus, Trash2, Search } from 'lucide-react';
import { routeService } from '../../services/api';
import { formatCurrency, formatTime, formatDistance, getTransportTypeLabel } from '../../utils/helpers';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import EmptyState from '../../components/common/EmptyState';
import ConfirmDialog from '../../components/common/ConfirmDialog';

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const itemVariants = { hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } };

export default function SavedRoutesPage() {
  const [savedIds, setSavedIds] = useState(() => {
    try { return JSON.parse(localStorage.getItem('tp_saved_routes') || '[]'); } catch { return []; }
  });
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmRemove, setConfirmRemove] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const allRoutes = await routeService.getRoutes();
        setRoutes(allRoutes.filter((r) => savedIds.includes(r.id)));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [savedIds]);

  const removeRoute = (routeId) => {
    const updated = savedIds.filter((id) => id !== routeId);
    setSavedIds(updated);
    setRoutes((prev) => prev.filter((r) => r.id !== routeId));
    localStorage.setItem('tp_saved_routes', JSON.stringify(updated));
    setConfirmRemove(null);
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Saved Routes</h1>
        <p className="text-neutral-500 dark:text-neutral-400 text-sm mt-1">Your bookmarked routes for quick access</p>
      </motion.div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-700 p-5">
              <div className="h-5 bg-neutral-200 dark:bg-neutral-700 rounded w-2/3 mb-3" />
              <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-1/2 mb-2" />
              <div className="h-8 bg-neutral-200 dark:bg-neutral-700 rounded w-1/3 mt-4" />
            </div>
          ))}
        </div>
      ) : routes.length === 0 ? (
        <EmptyState
          icon={Bookmark}
          title="No saved routes"
          description="Save routes from the Routes page for quick access."
          actionLabel="Browse Routes"
          onAction={() => window.location.href = '/passenger/routes'}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {routes.map((route) => (
            <motion.div key={route.id} variants={itemVariants}>
              <Card className="h-full flex flex-col">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-neutral-900 dark:text-white text-sm">{route.name}</h3>
                  <button
                    onClick={() => setConfirmRemove(route)}
                    className="p-1.5 rounded-lg text-neutral-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400 mb-2">
                  <MapPin size={14} className="text-green-600 dark:text-green-400" />
                  <span className="truncate">{route.origin}</span>
                  <ArrowRight size={12} className="text-neutral-400 shrink-0" />
                  <span className="truncate">{route.destination}</span>
                </div>

                <div className="flex items-center gap-3 text-xs text-neutral-500 dark:text-neutral-400 mb-3">
                  <span className="flex items-center gap-1"><Clock size={12} /> {formatTime(route.estimatedTime)}</span>
                  <span>{formatDistance(route.distance)}</span>
                </div>

                <div className="mt-auto">
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {route.transportTypes.map((type) => (
                      <span key={type} className="inline-flex items-center rounded-full bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 text-xs font-medium text-neutral-700 dark:text-neutral-300">
                        {getTransportTypeLabel(type)}
                      </span>
                    ))}
                  </div>
                  <Link to="/passenger/check-fare">
                    <Button fullWidth size="sm" variant="outline">Check Fare</Button>
                  </Link>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      <ConfirmDialog
        isOpen={!!confirmRemove}
        onClose={() => setConfirmRemove(null)}
        onConfirm={() => confirmRemove && removeRoute(confirmRemove.id)}
        title="Remove Saved Route"
        message={`Remove "${confirmRemove?.name}" from your saved routes?`}
        confirmText="Remove"
        variant="danger"
      />
    </motion.div>
  );
}
