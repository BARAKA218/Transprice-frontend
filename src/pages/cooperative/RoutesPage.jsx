import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Route,
  MapPin,
  Navigation,
  Clock,
  ChevronRight,
  Lightbulb,
  DollarSign,
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import StatusBadge from '../../components/common/StatusBadge';
import EmptyState from '../../components/common/EmptyState';
import ErrorState from '../../components/common/ErrorState';
import Modal from '../../components/common/Modal';
import { CardSkeleton } from '../../components/common/LoadingSkeleton';
import { routeService, fareService } from '../../services/api';
import { formatCurrency, formatDistance, formatTime, getTransportTypeLabel } from '../../utils/helpers';

const suggestions = [
  {
    id: 's1',
    routeId: 'r1',
    title: 'Add express service on Kigali-Huye',
    description: 'Passenger demand has increased significantly along this corridor. Consider an express bus service with a small premium.',
    status: 'NEW',
    votes: 12,
  },
  {
    id: 's2',
    routeId: 'r5',
    title: 'Extend Musanze route to key sectors',
    description: 'Several sectors in Musanze district are underserved. Suggest extending the route to the new commercial hub.',
    status: 'NEW',
    votes: 8,
  },
  {
    id: 's3',
    routeId: 'r8',
    title: 'Review fare structure for short hops',
    description: 'Passengers taking short hops on the Kigali-Muhanga corridor are currently paying full fare. Consider distance-based tiers.',
    status: 'UNDER_REVIEW',
    votes: 5,
  },
];

export default function CooperativeRoutesPage() {
  const [routes, setRoutes] = useState([]);
  const [fares, setFares] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        setLoading(true);
        const [routeRes, fareRes] = await Promise.allSettled([
          routeService.getRoutes(),
          fareService.getFares(),
        ]);
        if (!mounted) return;
        setRoutes(routeRes.status === 'fulfilled' ? routeRes.value.data : []);
        setFares(fareRes.status === 'fulfilled' ? fareRes.value.data : []);
      } catch (err) {
        if (mounted) setError(err.message);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const operatedRouteIds = new Set(['r1', 'r2', 'r4', 'r6', 'r7', 'r8']);
  const operatedRoutes = routes.filter((r) => operatedRouteIds.has(r.id));

  if (error) {
    return <ErrorState message="Failed to load routes" description={error} />;
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Routes</h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Routes operated by your cooperative and published fares.
        </p>
      </motion.div>

      {loading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2, 3, 4, 5].map((i) => <CardSkeleton key={i} />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {operatedRoutes.map((route) => {
            const routeFares = fares.filter((f) => f.routeId === route.id);
            return (
              <motion.div key={route.id} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} whileHover={{ y: -4 }}>
                <Card hover className="h-full" onClick={() => setSelected(route)}>
                  <div className="flex flex-col gap-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="rounded-xl bg-navy-50 p-3 dark:bg-navy-900/40">
                          <Route size={22} className="text-navy-900 dark:text-navy-300" />
                        </div>
                        <div>
                          <p className="font-semibold text-neutral-900 dark:text-neutral-100">{route.origin} &rarr; {route.destination}</p>
                          <p className="text-sm text-neutral-500 dark:text-neutral-400">{route.district} district</p>
                        </div>
                      </div>
                      <StatusBadge status={route.status} />
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-neutral-500 dark:text-neutral-400">
                      <span className="flex items-center gap-1"><Navigation size={14} /> {formatDistance(route.distance)}</span>
                      <span className="flex items-center gap-1"><Clock size={14} /> {formatTime(route.estimatedTime)}</span>
                      <span className="flex items-center gap-1"><DollarSign size={14} /> {routeFares.length} fares</span>
                    </div>
                    <div className="border-t border-neutral-100 pt-3 dark:border-neutral-800">
                      {routeFares.slice(0, 2).map((fare) => (
                        <div key={fare.id} className="flex items-center justify-between py-1 text-sm">
                          <span className="text-neutral-600 dark:text-neutral-400">{getTransportTypeLabel(fare.transportType)}</span>
                          <span className="font-medium text-neutral-800 dark:text-neutral-200">{formatCurrency(fare.fare)}</span>
                        </div>
                      ))}
                      {routeFares.length === 0 && (
                        <p className="text-sm text-neutral-400">No fares published for this route.</p>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <button onClick={() => setSelected(route)} className="flex items-center gap-1 text-sm font-medium text-green-600 hover:text-green-700 dark:text-green-400">
                        View details <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}

      {loading ? (
        <CardSkeleton />
      ) : (
        <Card
          header={
            <div className="flex items-center gap-2">
              <Lightbulb size={18} className="text-amber-500" />
              <span className="font-semibold text-neutral-900 dark:text-neutral-100">Suggested Route Changes</span>
            </div>
          }
        >
          <div className="space-y-3">
            {suggestions.map((suggestion) => (
              <div key={suggestion.id} className="rounded-xl border border-neutral-200 p-4 dark:border-neutral-700">
                <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="font-medium text-neutral-800 dark:text-neutral-200">{suggestion.title}</p>
                    <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">{suggestion.description}</p>
                  </div>
                  <StatusBadge status={suggestion.status} />
                </div>
                <div className="mt-2 text-xs text-neutral-400 dark:text-neutral-500">
                  {suggestion.votes} votes
                </div>
              </div>
            ))}
            {suggestions.length === 0 && <EmptyState title="No suggestions" />}
          </div>
        </Card>
      )}

      <Modal isOpen={!!selected} onClose={() => setSelected(null)} title="Route Details" size="lg">
        {selected ? (
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-navy-50 p-3 dark:bg-navy-900/40">
                <MapPin size={24} className="text-navy-900 dark:text-navy-300" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                  {selected.origin} &rarr; {selected.destination}
                </h3>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">{selected.district} district</p>
              </div>
              <div className="ml-auto">
                <StatusBadge status={selected.status} />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-xl bg-neutral-50 p-4 text-center dark:bg-neutral-800">
                <p className="text-xs text-neutral-500 dark:text-neutral-400">Distance</p>
                <p className="mt-1 font-semibold text-neutral-900 dark:text-neutral-100">{formatDistance(selected.distance)}</p>
              </div>
              <div className="rounded-xl bg-neutral-50 p-4 text-center dark:bg-neutral-800">
                <p className="text-xs text-neutral-500 dark:text-neutral-400">Time</p>
                <p className="mt-1 font-semibold text-neutral-900 dark:text-neutral-100">{formatTime(selected.estimatedTime)}</p>
              </div>
              <div className="rounded-xl bg-neutral-50 p-4 text-center dark:bg-neutral-800">
                <p className="text-xs text-neutral-500 dark:text-neutral-400">Transport</p>
                <p className="mt-1 font-semibold text-neutral-900 dark:text-neutral-100">{selected.transportTypes.length}</p>
              </div>
            </div>

            <div>
              <p className="mb-2 text-sm font-semibold text-neutral-800 dark:text-neutral-200">Published Fares</p>
              <div className="divide-y divide-neutral-100 rounded-xl border border-neutral-200 dark:divide-neutral-800 dark:border-neutral-700">
                {fares.filter((f) => f.routeId === selected.id).length === 0 ? (
                  <p className="p-4 text-sm text-neutral-500">No fares published for this route.</p>
                ) : (
                  fares.filter((f) => f.routeId === selected.id).map((fare) => (
                    <div key={fare.id} className="flex items-center justify-between px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-neutral-800 dark:text-neutral-200">{getTransportTypeLabel(fare.transportType)}</span>
                        <StatusBadge status={fare.status} />
                      </div>
                      <span className="font-semibold text-green-600 dark:text-green-400">{formatCurrency(fare.fare)}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="flex justify-end">
              <Button variant="outline" onClick={() => setSelected(null)}>Close</Button>
            </div>
          </div>
        ) : (
          <CardSkeleton />
        )}
      </Modal>
    </div>
  );
}