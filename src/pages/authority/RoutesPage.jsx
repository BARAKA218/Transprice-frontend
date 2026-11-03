import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Route, MapPin, Navigation, Clock, ChevronRight, DollarSign } from 'lucide-react';
import Card from '../../components/common/Card';
import StatusBadge from '../../components/common/StatusBadge';
import EmptyState from '../../components/common/EmptyState';
import ErrorState from '../../components/common/ErrorState';
import Modal from '../../components/common/Modal';
import Select from '../../components/common/Select';
import { CardSkeleton } from '../../components/common/LoadingSkeleton';
import { routeService, fareService } from '../../services/api';
import { DISTRICTS, mockRoutes, mockFares } from '../../data/mockData';
import { formatCurrency, formatDate, formatDistance, formatTime, getTransportTypeLabel } from '../../utils/helpers';

export default function AuthorityRoutesPage() {
  const [routes, setRoutes] = useState([]);
  const [fares, setFares] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [districtFilter, setDistrictFilter] = useState('');
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
        setRoutes(routeRes.status === 'fulfilled' ? routeRes.value.data : mockRoutes);
        setFares(fareRes.status === 'fulfilled' ? fareRes.value.data : mockFares);
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

  const filteredRoutes = districtFilter ? routes.filter((r) => r.district === districtFilter) : routes;

  if (error) {
    return <ErrorState message="Failed to load routes" description={error} />;
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Routes</h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            All routes registered in the national transport system.
          </p>
        </div>
        <div className="w-56">
          <Select
            label="Filter by district"
            placeholder="All districts"
            options={DISTRICTS.map((d) => ({ value: d.name, label: d.name }))}
            value={districtFilter}
            onChange={(e) => setDistrictFilter(e.target.value)}
          />
        </div>
      </motion.div>

      {loading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((i) => <CardSkeleton key={i} />)}
        </div>
      ) : filteredRoutes.length === 0 ? (
        <EmptyState title="No routes found" description="Try a different district filter." />
      ) : (
        <Card className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-neutral-200 text-left dark:border-neutral-700">
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Route</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">District</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Distance</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Time</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Fares</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Status</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400"></th>
                </tr>
              </thead>
              <tbody>
                {filteredRoutes.map((route) => {
                  const routeFares = fares.filter((f) => f.routeId === route.id);
                  return (
                    <tr key={route.id} className="border-b border-neutral-100 transition-colors hover:bg-neutral-50 dark:border-neutral-800 dark:hover:bg-neutral-800/50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="rounded-lg bg-navy-50 p-2 text-navy-900 dark:bg-navy-900/40 dark:text-navy-300">
                            <Route size={16} />
                          </div>
                          <span className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
                            {route.origin} - {route.destination}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-neutral-700 dark:text-neutral-300">{route.district}</td>
                      <td className="px-4 py-3 text-sm text-neutral-700 dark:text-neutral-300">{formatDistance(route.distance)}</td>
                      <td className="px-4 py-3 text-sm text-neutral-700 dark:text-neutral-300">{formatTime(route.estimatedTime)}</td>
                      <td className="px-4 py-3">
                        <span className="flex items-center gap-1 text-sm">
                          <DollarSign size={14} className="text-green-600" />
                          {routeFares.length} {routeFares.length === 1 ? 'fare' : 'fares'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={route.status} />
                      </td>
                      <td className="px-4 py-3">
                        <button onClick={() => setSelected(route)} className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 dark:hover:bg-neutral-800">
                          <ChevronRight size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <Modal isOpen={!!selected} onClose={() => setSelected(null)} title="Route Details" size="lg">
        {selected ? (
          <div className="space-y-5">
            <div className="flex items-start justify-between">
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
              </div>
              <StatusBadge status={selected.status} />
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
              <div className="rounded-xl bg-neutral-50 p-3 text-center dark:bg-neutral-800">
                <Navigation size={16} className="mx-auto text-navy-900 dark:text-navy-300" />
                <p className="mt-1 font-semibold text-neutral-900 dark:text-neutral-100">{formatDistance(selected.distance)}</p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">Distance</p>
              </div>
              <div className="rounded-xl bg-neutral-50 p-3 text-center dark:bg-neutral-800">
                <Clock size={16} className="mx-auto text-navy-900 dark:text-navy-300" />
                <p className="mt-1 font-semibold text-neutral-900 dark:text-neutral-100">{formatTime(selected.estimatedTime)}</p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">Travel time</p>
              </div>
              <div className="rounded-xl bg-neutral-50 p-3 text-center dark:bg-neutral-800">
                <Route size={16} className="mx-auto text-navy-900 dark:text-navy-300" />
                <p className="mt-1 font-semibold text-neutral-900 dark:text-neutral-100">{selected.transportTypes.length}</p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">Transport types</p>
              </div>
              <div className="rounded-xl bg-neutral-50 p-3 text-center dark:bg-neutral-800">
                <DollarSign size={16} className="mx-auto text-green-600" />
                <p className="mt-1 font-semibold text-green-600 dark:text-green-400">
                  {fares.filter((f) => f.routeId === selected.id).length}
                </p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">Fares</p>
              </div>
            </div>

            <div>
              <p className="mb-2 text-sm font-semibold text-neutral-800 dark:text-neutral-200">Fare information</p>
              <div className="divide-y divide-neutral-100 rounded-xl border border-neutral-200 dark:divide-neutral-800 dark:border-neutral-700">
                {fares.filter((f) => f.routeId === selected.id).length === 0 ? (
                  <p className="p-4 text-sm text-neutral-500">No fares recorded for this route.</p>
                ) : (
                  fares.filter((f) => f.routeId === selected.id).map((fare) => (
                    <div key={fare.id} className="flex items-center justify-between px-4 py-3">
                      <div className="flex items-center gap-3">
                        <span className="text-neutral-800 dark:text-neutral-200">{getTransportTypeLabel(fare.transportType)}</span>
                        <StatusBadge status={fare.status} />
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-green-600 dark:text-green-400">{formatCurrency(fare.fare)}</p>
                        <p className="text-xs text-neutral-400 dark:text-neutral-500">Effective {formatDate(fare.effectiveDate)}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            </div>
        ) : (
          <CardSkeleton />
        )}
      </Modal>
    </div>
  );
}