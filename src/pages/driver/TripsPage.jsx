import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Play,
  MapPin,
  Users,
  DollarSign,
  ChevronRight,
  Clock,
  Flag,
  X,
  Calendar,
  CarFront,
} from 'lucide-react';
import Card from '../../components/common/Card';
import StatCard from '../../components/common/StatCard';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Modal from '../../components/common/Modal';
import StatusBadge from '../../components/common/StatusBadge';
import EmptyState from '../../components/common/EmptyState';
import ErrorState from '../../components/common/ErrorState';
import { CardSkeleton, TableSkeleton, TextSkeleton } from '../../components/common/LoadingSkeleton';
import { tripService, routeService, fareService } from '../../services/api';
import { mockRoutes, TRANSPORT_TYPES } from '../../data/mockData';
import { formatCurrency, formatDate, formatDateTime, formatTime } from '../../utils/helpers';

export default function TripsPage() {
  const [trips, setTrips] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [fares, setFares] = useState([]);
  const [activeTrip, setActiveTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showStartForm, setShowStartForm] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [dateRange, setDateRange] = useState({ from: '', to: '' });

  const [form, setForm] = useState({
    routeId: '',
    passengers: 10,
    startTime: '',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        setLoading(true);
        const [tripRes, routeRes, fareRes, activeRes] = await Promise.allSettled([
          tripService.getTrips(),
          routeService.getRoutes(),
          fareService.getFares(),
          tripService.getActiveTrip(),
        ]);
        if (!mounted) return;
        setTrips(tripRes.status === 'fulfilled' ? tripRes.value.data : []);
        setRoutes(routeRes.status === 'fulfilled' ? routeRes.value.data : mockRoutes);
        setFares(fareRes.status === 'fulfilled' ? fareRes.value.data : []);
        setActiveTrip(activeRes.status === 'fulfilled' ? activeRes.value.data : null);
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

  const getFareForRoute = (routeId, transportType = 'bus') => {
    const fare = fares.find((f) => f.routeId === routeId && f.transportType === transportType);
    return fare ? fare.fare : 3500;
  };

  const filteredTrips = trips.filter((t) => {
    if (dateRange.from && t.date < dateRange.from) return false;
    if (dateRange.to && t.date > dateRange.to) return false;
    return true;
  });

  const handleStartTrip = async (e) => {
    e.preventDefault();
    if (!form.routeId) return;
    const route = routes.find((r) => r.id === form.routeId);
    const fare = getFareForRoute(form.routeId);
    setSubmitting(true);
    try {
      const res = await tripService.startTrip({
        routeId: form.routeId,
        route: `${route.origin} - ${route.destination}`,
        passengers: Number(form.passengers),
        fare,
        startTime: form.startTime || new Date().toISOString(),
      });
      setActiveTrip(res.data);
      setShowStartForm(false);
      setForm({ routeId: '', passengers: 10, startTime: '' });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const totalEarnings = filteredTrips.reduce((sum, t) => sum + t.earnings, 0);
  const totalPassengers = filteredTrips.reduce((sum, t) => sum + t.passengers, 0);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  if (error) {
    return <ErrorState message="Failed to load trips" description={error} onRetry={() => window.location.reload()} />;
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Trips</h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Manage your trips and track progress.</p>
        </div>
        <Button variant="primary" color="green" leftIcon={Play} onClick={() => setShowStartForm(true)}>
          Start New Trip
        </Button>
      </motion.div>

      {activeTrip && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-2xl border border-green-500/40 bg-green-50 p-5 dark:bg-green-900/20"
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-4">
              <div className="relative">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-600 text-white">
                  <CarFront size={24} />
                </div>
                <span className="absolute -right-1 -top-1 flex h-3 w-3">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75" />
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-green-600" />
                </span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">{activeTrip.route}</h3>
                  <StatusBadge status={activeTrip.status} />
                </div>
                <div className="mt-1 flex flex-wrap gap-4 text-sm text-neutral-600 dark:text-neutral-400">
                  <span className="flex items-center gap-1">
                    <Users size={14} /> {activeTrip.passengers} passengers
                  </span>
                  <span className="flex items-center gap-1">
                    <DollarSign size={14} /> {formatCurrency(activeTrip.fare)}/passenger
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={14} /> Started {formatDateTime(activeTrip.startTime)}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" leftIcon={Flag}>
                Complete
              </Button>
              <Button variant="outline" size="sm" leftIcon={X}>
                Cancel
              </Button>
            </div>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard icon={Calendar} label="Trips in range" value={filteredTrips.length} color="navy" />
        <StatCard icon={Users} label="Passengers" value={totalPassengers} color="blue" />
        <StatCard icon={DollarSign} label="Earnings" value={formatCurrency(totalEarnings)} trend="up" color="green" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card
            header={
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock size={18} className="text-navy-900 dark:text-navy-300" />
                  <span className="font-semibold text-neutral-900 dark:text-neutral-100">Trip History</span>
                </div>
                <div className="flex items-center gap-2">
                  <Input type="date" value={dateRange.from} onChange={(e) => setDateRange((prev) => ({ ...prev, from: e.target.value }))} className="w-40" />
                  <span className="text-neutral-400">to</span>
                  <Input type="date" value={dateRange.to} onChange={(e) => setDateRange((prev) => ({ ...prev, to: e.target.value }))} className="w-40" />
                </div>
              </div>
            }
          >
            {loading ? (
              <TableSkeleton rows={6} columns={6} />
            ) : filteredTrips.length === 0 ? (
              <EmptyState title="No trips found" description="Try adjusting your date range." />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-neutral-200 text-left dark:border-neutral-700">
                      <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Date</th>
                      <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Route</th>
                      <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Passengers</th>
                      <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Fare</th>
                      <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Earnings</th>
                      <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Status</th>
                      <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTrips.map((trip) => (
                      <tr key={trip.id} className="border-b border-neutral-100 transition-colors hover:bg-neutral-50 dark:border-neutral-800 dark:hover:bg-neutral-800/50">
                        <td className="px-4 py-3 text-sm text-neutral-700 dark:text-neutral-300">{formatDate(trip.date)}</td>
                        <td className="px-4 py-3 text-sm text-neutral-700 dark:text-neutral-300">{trip.route}</td>
                        <td className="px-4 py-3 text-sm text-neutral-700 dark:text-neutral-300">{trip.passengers}</td>
                        <td className="px-4 py-3 text-sm text-neutral-700 dark:text-neutral-300">{formatCurrency(trip.fare)}</td>
                        <td className="px-4 py-3 text-sm font-medium text-green-600 dark:text-green-400">{formatCurrency(trip.earnings)}</td>
                        <td className="px-4 py-3">
                          <StatusBadge status={trip.status} />
                        </td>
                        <td className="px-4 py-3">
                          <button onClick={() => setSelectedTrip(trip)} className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 dark:hover:bg-neutral-800">
                            <ChevronRight size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>

        <div className="space-y-6">
          {loading ? (
            <CardSkeleton />
          ) : (
            <Card
              header={
                <div className="flex items-center gap-2">
                  <MapPin size={18} className="text-green-600" />
                  <span className="font-semibold text-neutral-900 dark:text-neutral-100">Common Routes</span>
                </div>
              }
            >
              <div className="space-y-2">
                {routes.slice(0, 5).map((route) => (
                  <div key={route.id} className="flex items-center justify-between rounded-lg border border-neutral-100 px-3 py-2.5 dark:border-neutral-800">
                    <div className="flex items-center gap-2">
                      <MapPin size={16} className="text-neutral-400" />
                      <span className="text-sm text-neutral-700 dark:text-neutral-300">{route.origin} - {route.destination}</span>
                    </div>
                    <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">{route.distance} km</span>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {loading ? (
            <CardSkeleton />
          ) : (
            <Card
              header={
                <div className="flex items-center gap-2">
                  <DollarSign size={18} className="text-green-600" />
                  <span className="font-semibold text-neutral-900 dark:text-neutral-100">Tips</span>
                </div>
              }
            >
              <ul className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
                <li className="flex gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-green-500" />
                  Record trips immediately after completing them.
                </li>
                <li className="flex gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-green-500" />
                  Verify fare before starting each route.
                </li>
                <li className="flex gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-green-500" />
                  Report issues promptly for quicker resolution.
                </li>
              </ul>
            </Card>
          )}
        </div>
      </div>

      <Modal isOpen={showStartForm} onClose={() => setShowStartForm(false)} title="Start New Trip" size="md">
        <form onSubmit={handleStartTrip} className="space-y-4">
          <Select
            label="Route"
            required
            placeholder="Select a route"
            options={routes.map((r) => ({ value: r.id, label: `${r.origin} - ${r.destination}` }))}
            value={form.routeId}
            onChange={handleChange('routeId')}
          />
          <Input
            label="Passengers"
            type="number"
            min={1}
            max={60}
            icon={Users}
            value={form.passengers}
            onChange={handleChange('passengers')}
          />
          <Input
            label="Start Time"
            type="datetime-local"
            icon={Clock}
            value={form.startTime}
            onChange={handleChange('startTime')}
          />
          {form.routeId && (
            <div className="rounded-lg bg-green-50 p-3 text-sm dark:bg-green-900/20">
              <div className="flex justify-between">
                <span className="text-neutral-600 dark:text-neutral-400">Applicable fare:</span>
                <span className="font-semibold text-green-700 dark:text-green-400">
                  {formatCurrency(getFareForRoute(form.routeId))}
                </span>
              </div>
            </div>
          )}
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={() => setShowStartForm(false)}>Cancel</Button>
            <Button type="submit" loading={submitting} leftIcon={Play}>
              Start Trip
            </Button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={!!selectedTrip} onClose={() => setSelectedTrip(null)} title="Trip Details" size="md">
        {selectedTrip ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <MapPin size={20} className="text-navy-900 dark:text-navy-300" />
                <div>
                  <p className="font-semibold text-neutral-900 dark:text-neutral-100">{selectedTrip.route}</p>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">{formatDateTime(selectedTrip.startTime)}</p>
                </div>
              </div>
              <StatusBadge status={selectedTrip.status} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-neutral-200 p-4 dark:border-neutral-700">
                <p className="text-xs uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Passengers</p>
                <p className="mt-1 text-lg font-semibold text-neutral-900 dark:text-neutral-100">{selectedTrip.passengers}</p>
              </div>
              <div className="rounded-xl border border-neutral-200 p-4 dark:border-neutral-700">
                <p className="text-xs uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Fare per passenger</p>
                <p className="mt-1 text-lg font-semibold text-neutral-900 dark:text-neutral-100">{formatCurrency(selectedTrip.fare)}</p>
              </div>
              <div className="rounded-xl border border-neutral-200 p-4 dark:border-neutral-700">
                <p className="text-xs uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Total earnings</p>
                <p className="mt-1 text-lg font-semibold text-green-600 dark:text-green-400">{formatCurrency(selectedTrip.earnings)}</p>
              </div>
              <div className="rounded-xl border border-neutral-200 p-4 dark:border-neutral-700">
                <p className="text-xs uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Duration</p>
                <p className="mt-1 text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                  {selectedTrip.endTime ? Math.round((new Date(selectedTrip.endTime) - new Date(selectedTrip.startTime)) / 60000) : '--'} min
                </p>
              </div>
            </div>
          </div>
        ) : (
          <TextSkeleton lines={4} />
        )}
      </Modal>
    </div>
  );
}