import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, ArrowRight, Bus, Car, Bike, Filter, Clock } from 'lucide-react';
import { useAuthStore } from '../../store';
import { tripService } from '../../services/api';
import { formatCurrency, formatDate, getTransportTypeLabel, getStatusColor, getStatusLabel } from '../../utils/helpers';
import Card from '../../components/common/Card';
import EmptyState from '../../components/common/EmptyState';
import StatusBadge from '../../components/common/StatusBadge';

const transportIcons = { bus: Bus, moto: Bike, taxi: Car, minibus: Bus, truck: Bus };

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const itemVariants = { hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } };

export default function TripsPage() {
  const { user } = useAuthStore();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const data = await tripService.getTrips({ userId: user?.id });
        setTrips(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user]);

  const filteredTrips = statusFilter
    ? trips.filter((t) => t.status === statusFilter)
    : trips;

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Trip History</h1>
        <p className="text-neutral-500 dark:text-neutral-400 text-sm mt-1">View all your past trips</p>
      </motion.div>

      {/* Filters */}
      <motion.div variants={itemVariants} className="flex flex-wrap gap-2">
        {['', 'COMPLETED', 'CANCELLED'].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              statusFilter === status
                ? 'bg-green-600 text-white'
                : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700'
            }`}
          >
            {status ? getStatusLabel(status) : 'All'}
          </button>
        ))}
      </motion.div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-700 p-4">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-lg bg-neutral-200 dark:bg-neutral-700" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-2/3" />
                  <div className="h-3 bg-neutral-200 dark:bg-neutral-700 rounded w-1/3" />
                </div>
                <div className="h-8 w-20 bg-neutral-200 dark:bg-neutral-700 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredTrips.length === 0 ? (
        <EmptyState
          icon={Bus}
          title={statusFilter ? `No ${getStatusLabel(statusFilter).toLowerCase()} trips` : 'No trips yet'}
          description={statusFilter ? 'Try a different filter.' : 'Your trip history will appear here once you start traveling.'}
          actionLabel={!statusFilter ? 'Check a Fare' : undefined}
          onAction={!statusFilter ? () => window.location.href = '/passenger/check-fare' : undefined}
        />
      ) : (
        <div className="space-y-3">
          {filteredTrips.map((trip, index) => {
            const Icon = transportIcons[trip.transportType] || Bus;
            return (
              <motion.div key={trip.id} variants={itemVariants}>
                <Card className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="rounded-xl bg-neutral-100 dark:bg-neutral-800 p-3 shrink-0">
                      <Icon size={20} className="text-neutral-600 dark:text-neutral-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-neutral-900 dark:text-white text-sm">{trip.routeName}</p>
                      <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                        <Calendar size={12} />
                        <span>{formatDate(trip.date)}</span>
                        <span>•</span>
                        <span>{getTransportTypeLabel(trip.transportType)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 sm:flex-shrink-0">
                    <StatusBadge status={trip.status} />
                    <span className="text-lg font-bold text-neutral-900 dark:text-white">
                      {formatCurrency(trip.fare)}
                    </span>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}
