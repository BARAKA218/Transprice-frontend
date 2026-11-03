import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Car,
  Route,
  MapPin,
  DollarSign,
  Play,
  Bell,
  ChevronRight,
  Users,
  TrendingUp,
  Navigation,
  AlertCircle,
  Newspaper,
  Zap,
} from 'lucide-react';
import Card from '../../components/common/Card';
import StatCard from '../../components/common/StatCard';
import Button from '../../components/common/Button';
import StatusBadge from '../../components/common/StatusBadge';
import EmptyState from '../../components/common/EmptyState';
import ErrorState from '../../components/common/ErrorState';
import { TableSkeleton, CardSkeleton } from '../../components/common/LoadingSkeleton';
import { userService, tripService, routeService, notificationService, fareService } from '../../services/api';
import { mockTrips, mockRoutes } from '../../data/mockData';
import { formatCurrency, formatDateTime, getStatusColor } from '../../utils/helpers';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export default function DashboardPage() {
  const [driver, setDriver] = useState(null);
  const [activeRoute, setActiveRoute] = useState(null);
  const [recentTrips, setRecentTrips] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    const loadDashboard = async () => {
      try {
        setLoading(true);
        const [driverRes, tripRes, routeRes, notifRes, fareRes] = await Promise.allSettled([
          userService.getCurrentDriver(),
          tripService.getTrips(),
          routeService.getRoutes(),
          notificationService.getNotifications(),
          fareService.getFares({ status: 'PUBLISHED' }),
        ]);

        if (!mounted) return;
        setDriver(driverRes.status === 'fulfilled' ? driverRes.value.data : null);
        setRecentTrips(tripRes.status === 'fulfilled' ? tripRes.value.data.slice(0, 5) : mockTrips.slice(0, 5));
        setActiveRoute(routeRes.status === 'fulfilled' ? routeRes.value.data.find((r) => r.id === driver?.vehicle?.id === undefined ? mockRoutes[0] : r) : mockRoutes[0]);
        setNotifications(notifRes.status === 'fulfilled' ? notifRes.value.data.slice(0, 5) : []);
        setError(null);
      } catch (err) {
        if (mounted) setError(err.message);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    loadDashboard();
    return () => {
      mounted = false;
    };
  }, []);

  const quickActions = [
    { label: 'Start Trip', icon: Play, to: '/driver/trips', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
    { label: 'View Fares', icon: DollarSign, to: '/driver/fares', color: 'bg-navy-50 text-navy-900 dark:bg-navy-900/30 dark:text-navy-300' },
    { label: 'View Routes', icon: Route, to: '/driver/routes', color: 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
    { label: 'Report Issue', icon: AlertCircle, to: '/driver/complaints', color: 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
  ];

  if (error) {
    return <ErrorState message="Failed to load dashboard" description={error} onRetry={() => window.location.reload()} />;
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="overflow-hidden rounded-2xl bg-navy-900 p-6 text-white shadow-lg md:p-8"
      >
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm font-medium text-navy-200">
              <MapPin size={16} />
              Kigali, Rwanda
            </div>
            <h1 className="mt-2 text-2xl font-bold md:text-3xl">
              Welcome back, {loading || !driver ? 'Driver' : driver.name.split(' ')[0]}!
            </h1>
            <p className="mt-1 text-sm text-navy-300">
              You have a trip scheduled today. All systems are operational.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link to="/driver/trips">
                <Button variant="primary" className="bg-green-600 hover:bg-green-500 dark:bg-green-600 dark:hover:bg-green-500" leftIcon={Play}>
                  Start Trip
                </Button>
              </Link>
              <Link to="/driver/routes">
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 dark:border-white/20">
                  View Routes
                </Button>
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-600 text-xl font-bold text-white">
              {loading || !driver ? 'D' : driver.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
            </div>
            <div>
              <p className="font-semibold">{loading || !driver ? 'Loading...' : driver.name}</p>
              <p className="text-sm text-navy-300">{loading || !driver ? '--' : driver.licenseNumber}</p>
              <div className="mt-1 flex items-center gap-1 text-sm text-amber-300">
                <TrendingUp size={14} />
                {loading || !driver ? '4.0' : driver.rating} rating
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          <motion.div variants={itemVariants}>
            <StatCard
              icon={Navigation}
              label="Today's Trips"
              value={1}
              trend="up"
              trendValue="1 scheduled"
              color="green"
            />
          </motion.div>
          <motion.div variants={itemVariants}>
            <StatCard
              icon={Users}
              label="Passengers Today"
              value={driver ? '12' : '0'}
              color="navy"
            />
          </motion.div>
          <motion.div variants={itemVariants}>
            <StatCard
              icon={DollarSign}
              label="Today's Earnings"
              value={formatCurrency(driver?.earnings?.today || 0)}
              trend="up"
              trendValue="+8% vs last trip"
              color="green"
            />
          </motion.div>
          <motion.div variants={itemVariants}>
            <StatCard
              icon={Car}
              label="Vehicle Status"
              value="Operational"
              color="blue"
            />
          </motion.div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {loading ? (
            <CardSkeleton />
          ) : (
            activeRoute && (
              <motion.div variants={itemVariants}>
                <Card
                  header={
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <MapPin size={18} className="text-green-600" />
                        <span className="font-semibold text-neutral-900 dark:text-neutral-100">Active Route</span>
                      </div>
                      <StatusBadge status={activeRoute.status} />
                    </div>
                  }
                >
                  <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-4">
                      <div className="rounded-xl bg-navy-50 p-4 dark:bg-navy-900/30">
                        <Route size={24} className="text-navy-900 dark:text-navy-300" />
                      </div>
                      <div>
                        <p className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                          {activeRoute.origin} &rarr; {activeRoute.destination}
                        </p>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">
                          {activeRoute.distance} km &middot; ~{activeRoute.estimatedTime} min &middot; {activeRoute.transportTypes.join(', ')}
                        </p>
                      </div>
                    </div>
                    <Link to="/driver/trips">
                      <Button variant="primary" size="sm" leftIcon={Play}>
                        Start Trip
                      </Button>
                    </Link>
                  </div>
                </Card>
              </motion.div>
            )
          )}

          {loading ? (
            <>
              <TableSkeleton rows={5} columns={5} />
            </>
          ) : (
            <Card
              header={
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Newspaper size={18} className="text-navy-900 dark:text-navy-300" />
                    <span className="font-semibold text-neutral-900 dark:text-neutral-100">Recent Trips</span>
                  </div>
                  <Link to="/driver/trips" className="flex items-center gap-1 text-sm font-medium text-green-600 hover:text-green-700 dark:text-green-400">
                    View all <ChevronRight size={16} />
                  </Link>
                </div>
              }
            >
              {recentTrips.length === 0 ? (
                <EmptyState title="No trips yet" description="Your recorded trips will appear here." />
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-neutral-200 text-left dark:border-neutral-700">
                        <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Route</th>
                        <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Passengers</th>
                        <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Earnings</th>
                        <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentTrips.map((trip) => (
                        <tr key={trip.id} className="border-b border-neutral-100 transition-colors hover:bg-neutral-50 dark:border-neutral-800 dark:hover:bg-neutral-800/50">
                          <td className="px-4 py-3 text-sm text-neutral-700 dark:text-neutral-300">{trip.route}</td>
                          <td className="px-4 py-3 text-sm text-neutral-700 dark:text-neutral-300">{trip.passengers}</td>
                          <td className="px-4 py-3 text-sm font-medium text-green-600 dark:text-green-400">{formatCurrency(trip.earnings)}</td>
                          <td className="px-4 py-3">
                            <StatusBadge status={trip.status} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          )}
        </div>

        <div className="space-y-6">
          {loading ? (
            <CardSkeleton />
          ) : (
            <motion.div variants={itemVariants}>
              <Card
                header={
                  <div className="flex items-center gap-2">
                    <Zap className="text-green-600" size={18} />
                    <span className="font-semibold text-neutral-900 dark:text-neutral-100">Quick Actions</span>
                  </div>
                }
              >
                <div className="grid grid-cols-2 gap-3">
                  {quickActions.map((action) => (
                    <Link key={action.label} to={action.to}>
                      <div className="flex flex-col items-start gap-3 rounded-xl border border-neutral-200 p-4 transition-all hover:border-green-500/50 hover:shadow-sm dark:border-neutral-700">
                        <div className={`rounded-lg p-2 ${action.color}`}>
                          <action.icon size={20} />
                        </div>
                        <span className="text-sm font-medium text-neutral-800 dark:text-neutral-200">{action.label}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </Card>
            </motion.div>
          )}

          {loading ? (
            <CardSkeleton />
          ) : (
            <motion.div variants={itemVariants}>
              <Card
                header={
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bell size={18} className="text-amber-500" />
                      <span className="font-semibold text-neutral-900 dark:text-neutral-100">Notifications</span>
                    </div>
                    <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                      {notifications.filter((n) => !n.read).length} new
                    </span>
                  </div>
                }
              >
                <div className="space-y-1">
                  {notifications.length === 0 ? (
                    <EmptyState title="No notifications" />
                  ) : (
                    notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className={`flex items-start gap-3 rounded-lg px-3 py-2.5 ${!notif.read ? 'bg-green-50 dark:bg-green-900/20' : ''}`}
                      >
                        <div className={`mt-0.5 rounded-full p-1.5 ${!notif.read ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400' : 'bg-neutral-100 text-neutral-500 dark:bg-neutral-800'}`}>
                          {notif.type === 'FARE' ? <DollarSign size={14} /> : notif.type === 'TRIP' ? <Navigation size={14} /> : notif.type === 'VEHICLE' ? <Car size={14} /> : <Bell size={14} />}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-neutral-800 dark:text-neutral-200">{notif.message}</p>
                          <p className="mt-0.5 text-xs text-neutral-400 dark:text-neutral-500">{formatDateTime(notif.date)}</p>
                        </div>
                        {!notif.read && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-green-500" />}
                      </div>
                    ))
                  )}
                </div>
              </Card>
            </motion.div>
          )}

          {loading ? (
            <CardSkeleton />
          ) : (
            <motion.div variants={itemVariants}>
              <Card
                header={
                  <div className="flex items-center gap-2">
                    <DollarSign size={18} className="text-green-600" />
                    <span className="font-semibold text-neutral-900 dark:text-neutral-100">Week Earnings</span>
                  </div>
                }
              >
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                      {loading ? 'RWF 0' : formatCurrency(driver?.earnings?.week || 0)}
                    </p>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">This week</p>
                  </div>
                  <div className="flex items-end gap-1">
                    {[40, 65, 50, 80, 70, 90, 60].map((h, i) => (
                      <div key={i} className="w-4 rounded-t bg-green-500/30" style={{ height: `${h * 0.5}px` }} />
                    ))}
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}