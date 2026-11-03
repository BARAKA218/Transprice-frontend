import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Navigation, Clock, Route, Play, ChevronRight, Bus, Car, Bike, Truck } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import StatusBadge from '../../components/common/StatusBadge';
import EmptyState from '../../components/common/EmptyState';
import ErrorState from '../../components/common/ErrorState';
import { CardSkeleton } from '../../components/common/LoadingSkeleton';
import { routeService, fareService } from '../../services/api';
import { mockRoutes } from '../../data/mockData';
import { formatCurrency, formatDistance, formatTime, getTransportTypeLabel } from '../../utils/helpers';

const typeIcons = {
  bus: Bus,
  minibus: Bus,
  taxi: Car,
  moto: Bike,
  truck: Truck,
};

export default function RoutesPage() {
  const [routes, setRoutes] = useState([]);
  const [fares, setFares] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        setLoading(true);
        const [routeRes, fareRes] = await Promise.allSettled([
          routeService.getRoutes(),
          fareService.getFares({ status: 'PUBLISHED' }),
        ]);
        if (!mounted) return;
        setRoutes(routeRes.status === 'fulfilled' ? routeRes.value.data : mockRoutes);
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

  if (error) {
    return <ErrorState message="Failed to load routes" description={error} />;
  }

  const handleStartTrip = (routeId) => {
    navigate(`/driver/trips?route=${routeId}`);
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Routes</h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Explore available routes and their applicable fares.
        </p>
      </motion.div>

      {loading ? (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 md:grid-cols-2">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 md:grid-cols-2">
          {routes.map((route) => {
            const routeFares = fares.filter((f) => f.routeId === route.id);
            const lowestFare = routeFares.length ? Math.min(...routeFares.map((f) => f.fare)) : null;
            return (
              <motion.div
                key={route.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3 }}
                whileHover={{ y: -4 }}
              >
                <Card
                  hover
                  className="h-full"
                  onClick={() => setSelected(route)}
                >
                  <div className="flex flex-col gap-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="rounded-xl bg-green-50 p-3 dark:bg-green-900/25">
                          <MapPin size={22} className="text-green-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-neutral-900 dark:text-neutral-100">{route.origin} &rarr; {route.destination}</p>
                          <p className="text-sm text-neutral-500 dark:text-neutral-400">{route.district} district</p>
                        </div>
                      </div>
                      <StatusBadge status={route.status} />
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-neutral-500 dark:text-neutral-400">
                      <span className="flex items-center gap-1">
                        <Navigation size={14} /> {formatDistance(route.distance)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={14} /> {formatTime(route.estimatedTime)}
                      </span>
                      {lowestFare && (
                        <span className="flex items-center gap-1 font-medium text-green-600 dark:text-green-400">
                          from {formatCurrency(lowestFare)}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {route.transportTypes.map((type) => {
                        const Icon = typeIcons[type] || Bus;
                        return (
                          <span key={type} className="flex items-center gap-1 rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
                            <Icon size={12} /> {getTransportTypeLabel(type)}
                          </span>
                        );
                      })}
                    </div>

                    {routeFares.length > 0 && (
                      <div className="border-t border-neutral-100 pt-3 dark:border-neutral-800">
                        {routeFares.slice(0, 3).map((fare) => (
                          <div key={fare.id} className="flex items-center justify-between py-1 text-sm">
                            <span className="text-neutral-600 dark:text-neutral-400">{getTransportTypeLabel(fare.transportType)}</span>
                            <span className="font-medium text-neutral-800 dark:text-neutral-200">{formatCurrency(fare.fare)}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between border-t border-neutral-100 pt-3 dark:border-neutral-800">
                      <button
                        onClick={() => setSelected(route)}
                        className="flex items-center gap-1 text-sm font-medium text-green-600 hover:text-green-700 dark:text-green-400"
                      >
                        View details <ChevronRight size={14} />
                      </button>
                      <Button size="sm" variant="outline" leftIcon={Play} onClick={() => handleStartTrip(route.id)}>
                        Start Trip
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 p-4" onClick={() => setSelected(null)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl dark:bg-neutral-900"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-navy-50 p-3 dark:bg-navy-900/40">
                  <Route size={24} className="text-navy-900 dark:text-navy-300" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                    {selected.origin} &rarr; {selected.destination}
                  </h2>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">{selected.district} district</p>
                </div>
              </div>
              <StatusBadge status={selected.status} />
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="rounded-xl bg-neutral-50 p-3 text-center dark:bg-neutral-800">
                <p className="text-xs text-neutral-500 dark:text-neutral-400">Distance</p>
                <p className="mt-1 font-semibold text-neutral-900 dark:text-neutral-100">{formatDistance(selected.distance)}</p>
              </div>
              <div className="rounded-xl bg-neutral-50 p-3 text-center dark:bg-neutral-800">
                <p className="text-xs text-neutral-500 dark:text-neutral-400">Time</p>
                <p className="mt-1 font-semibold text-neutral-900 dark:text-neutral-100">{formatTime(selected.estimatedTime)}</p>
              </div>
              <div className="rounded-xl bg-neutral-50 p-3 text-center dark:bg-neutral-800">
                <p className="text-xs text-neutral-500 dark:text-neutral-400">Transport types</p>
                <p className="mt-1 font-semibold text-neutral-900 dark:text-neutral-100">{selected.transportTypes.length}</p>
              </div>
              <div className="rounded-xl bg-neutral-50 p-3 text-center dark:bg-neutral-800">
                <p className="text-xs text-neutral-500 dark:text-neutral-400">Fares</p>
                <p className="mt-1 font-semibold text-neutral-900 dark:text-neutral-100">{fares.filter((f) => f.routeId === selected.id).length}</p>
              </div>
            </div>

            <div className="mt-5 rounded-xl border border-neutral-200 dark:border-neutral-700">
              <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-200 dark:border-neutral-700">
                <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">Published Fares</p>
                <Link to="/driver/fares" className="text-xs font-medium text-green-600 hover:underline dark:text-green-400">
                  View all fares
                </Link>
              </div>
              <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
                {fares.filter((f) => f.routeId === selected.id).length === 0 ? (
                  <p className="p-4 text-sm text-neutral-500">No published fares for this route yet.</p>
                ) : (
                  fares.filter((f) => f.routeId === selected.id).map((fare) => (
                    <div key={fare.id} className="flex items-center justify-between px-4 py-3 text-sm">
                      <div className="flex items-center gap-2">
                        {getTransportTypeLabel(fare.transportType)}
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-neutral-500 dark:text-neutral-400">per passenger</span>
                        <span className="font-semibold text-green-600 dark:text-green-400">{formatCurrency(fare.fare)}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setSelected(null)}>Close</Button>
              <Button leftIcon={Play} onClick={() => {
                setSelected(null);
                handleStartTrip(selected.id);
              }}>
                Start Trip on This Route
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}