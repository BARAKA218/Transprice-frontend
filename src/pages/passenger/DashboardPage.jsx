import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Search, MapPin, Navigation, Bus, Car, Bike, ChevronRight,
  Route, AlertTriangle, Star, Clock, TrendingUp, Bookmark,
} from 'lucide-react';
import { useAuthStore } from '../../store';
import { fareService, routeService, tripService } from '../../services/api';
import { formatCurrency, formatDate, getTransportTypeLabel } from '../../utils/helpers';
import Card from '../../components/common/Card';
import StatCard from '../../components/common/StatCard';
import Button from '../../components/common/Button';

const transportIcons = { bus: Bus, moto: Bike, taxi: Car, minibus: Bus, truck: Bus };

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const itemVariants = { hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } };

export default function PassengerDashboard() {
  const { user } = useAuthStore();
  const [recentFares, setRecentFares] = useState([]);
  const [recentTrips, setRecentTrips] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [fares, trips, tripStats] = await Promise.all([
          fareService.getRecentFares(5),
          tripService.getTrips({ userId: user?.id }),
          tripService.getTripStats(user?.id),
        ]);
        setRecentFares(fares);
        setRecentTrips(trips.slice(0, 5));
        setStats(tripStats);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user]);

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      {/* Welcome */}
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
          Welcome back, {user?.name?.split(' ')[0] || 'Passenger'}
        </h1>
        <p className="text-neutral-500 dark:text-neutral-400 text-sm mt-1">
          What would you like to do today?
        </p>
      </motion.div>

      {/* Quick Search */}
      <motion.div variants={itemVariants}>
        <Link to="/passenger/check-fare">
          <Card hover className="bg-gradient-to-r from-[#0f2645] to-[#1a3a5c] text-white">
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-green-500/20 p-3">
                <Search size={24} className="text-green-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">Check a Fare</h3>
                <p className="text-sm text-neutral-300">Search fares between any two locations in Rwanda</p>
              </div>
              <ChevronRight size={20} className="text-neutral-300" />
            </div>
          </Card>
        </Link>
      </motion.div>

      {/* Stats */}
      {stats && (
        <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={Navigation} label="Trips Taken" value={stats.totalTrips} color="navy" />
          <StatCard icon={TrendingUp} label="Completed" value={stats.completedTrips} color="green" />
          <StatCard icon={Bookmark} label="Total Spent" value={formatCurrency(stats.totalSpent)} color="blue" />
          <StatCard icon={Clock} label="Cancelled" value={stats.cancelledTrips} color="amber" />
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Fares */}
        <motion.div variants={itemVariants}>
          <Card header={<h2 className="text-base font-semibold text-neutral-900 dark:text-white">Recent Fares</h2>}>
            {loading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse flex items-center gap-3 p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800">
                    <div className="h-10 w-10 rounded-lg bg-neutral-200 dark:bg-neutral-700" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-2/3" />
                      <div className="h-3 bg-neutral-200 dark:bg-neutral-700 rounded w-1/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : recentFares.length === 0 ? (
              <p className="text-sm text-neutral-500 dark:text-neutral-400 text-center py-8">No recent fares</p>
            ) : (
              <div className="space-y-2">
                {recentFares.map((fare) => {
                  const Icon = transportIcons[fare.transportType] || Bus;
                  return (
                    <div key={fare.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">
                      <div className="rounded-lg bg-neutral-100 dark:bg-neutral-800 p-2">
                        <Icon size={18} className="text-neutral-600 dark:text-neutral-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-neutral-900 dark:text-white truncate">
                          {fare.origin} → {fare.destination}
                        </p>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400">
                          {getTransportTypeLabel(fare.transportType)} • Updated {formatDate(fare.updatedAt)}
                        </p>
                      </div>
                      <span className="text-sm font-bold text-green-600 dark:text-green-400">{formatCurrency(fare.fare)}</span>
                    </div>
                  );
                })}
              </div>
            )}
            <div className="mt-3 pt-3 border-t border-neutral-100 dark:border-neutral-800">
              <Link to="/passenger/check-fare" className="text-sm font-medium text-green-600 hover:text-green-700 dark:text-green-400">
                View all fares →
              </Link>
            </div>
          </Card>
        </motion.div>

        {/* Recent Trips */}
        <motion.div variants={itemVariants}>
          <Card header={<h2 className="text-base font-semibold text-neutral-900 dark:text-white">Recent Trips</h2>}>
            {loading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse flex items-center gap-3 p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800">
                    <div className="h-10 w-10 rounded-lg bg-neutral-200 dark:bg-neutral-700" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-2/3" />
                      <div className="h-3 bg-neutral-200 dark:bg-neutral-700 rounded w-1/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : recentTrips.length === 0 ? (
              <p className="text-sm text-neutral-500 dark:text-neutral-400 text-center py-8">No trips yet. Start by checking a fare!</p>
            ) : (
              <div className="space-y-2">
                {recentTrips.map((trip) => {
                  const Icon = transportIcons[trip.transportType] || Bus;
                  return (
                    <div key={trip.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">
                      <div className="rounded-lg bg-neutral-100 dark:bg-neutral-800 p-2">
                        <Icon size={18} className="text-neutral-600 dark:text-neutral-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-neutral-900 dark:text-white truncate">{trip.routeName}</p>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400">
                          {formatDate(trip.date)} • {trip.status}
                        </p>
                      </div>
                      <span className="text-sm font-bold text-neutral-900 dark:text-white">{formatCurrency(trip.fare)}</span>
                    </div>
                  );
                })}
              </div>
            )}
            <div className="mt-3 pt-3 border-t border-neutral-100 dark:border-neutral-800">
              <Link to="/passenger/trips" className="text-sm font-medium text-green-600 hover:text-green-700 dark:text-green-400">
                View all trips →
              </Link>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div variants={itemVariants}>
        <h2 className="text-base font-semibold text-neutral-900 dark:text-white mb-3">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { to: '/passenger/check-fare', icon: Search, label: 'Check Fare', desc: 'Search transport fares' },
            { to: '/passenger/routes', icon: Route, label: 'View Routes', desc: 'Browse available routes' },
            { to: '/passenger/reports', icon: AlertTriangle, label: 'Report Issue', desc: 'Submit a complaint' },
          ].map((action) => (
            <Link key={action.to} to={action.to}>
              <Card hover className="h-full">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-green-50 dark:bg-green-900/20 p-2.5">
                    <action.icon size={20} className="text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-neutral-900 dark:text-white">{action.label}</p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">{action.desc}</p>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
