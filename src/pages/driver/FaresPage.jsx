import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { DollarSign, Filter, X, Lock, MapPin, Bus, Car, Bike } from 'lucide-react';
import Card from '../../components/common/Card';
import StatusBadge from '../../components/common/StatusBadge';
import EmptyState from '../../components/common/EmptyState';
import ErrorState from '../../components/common/ErrorState';
import { TableSkeleton } from '../../components/common/LoadingSkeleton';
import Select from '../../components/common/Select';
import Button from '../../components/common/Button';
import { fareService, routeService } from '../../services/api';
import { TRANSPORT_TYPES } from '../../data/mockData';
import { formatCurrency, formatDate, getTransportTypeLabel } from '../../utils/helpers';

const transportIcons = {
  bus: Bus,
  minibus: Bus,
  taxi: Car,
  moto: Bike,
};

export default function FaresPage() {
  const [fares, setFares] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [routeFilter, setRouteFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        setLoading(true);
        const [fareRes, routeRes] = await Promise.allSettled([
          fareService.getFares({ status: 'PUBLISHED' }),
          routeService.getRoutes(),
        ]);
        if (!mounted) return;
        setFares(fareRes.status === 'fulfilled' ? fareRes.value.data : []);
        setRoutes(routeRes.status === 'fulfilled' ? routeRes.value.data : []);
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

  const routeOptions = routes.map((r) => `${r.origin} - ${r.destination}`);
  const uniqueRoutes = [...new Set(routeOptions)];

  const filteredFares = fares.filter((f) => {
    if (routeFilter && f.route !== routeFilter) return false;
    if (typeFilter && f.transportType !== typeFilter) return false;
    return true;
  });

  const clearFilters = () => {
    setRouteFilter('');
    setTypeFilter('');
  };

  if (error) {
    return <ErrorState message="Failed to load fares" description={error} />;
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Published Fares</h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            View applicable fares for your routes. Fares are set by the authority.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-green-50 px-4 py-2 text-sm font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
          <Lock size={16} />
          View only
        </div>
      </motion.div>

      <Card className="p-5">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Select
            label="Route"
            placeholder="All routes"
            options={uniqueRoutes.map((r) => ({ value: r, label: r }))}
            value={routeFilter}
            onChange={(e) => setRouteFilter(e.target.value)}
          />
          <Select
            label="Transport Type"
            placeholder="All types"
            options={TRANSPORT_TYPES}
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          />
          {(routeFilter || typeFilter) && (
            <div className="flex items-end pb-2">
              <Button variant="ghost" size="sm" leftIcon={X} onClick={clearFilters}>
                Clear filters
              </Button>
            </div>
          )}
        </div>
      </Card>

      <Card>
        {loading ? (
          <TableSkeleton rows={6} columns={5} />
        ) : filteredFares.length === 0 ? (
          <EmptyState title="No fares found" description="Try adjusting your filters." />
        ) : (
          <div className="grid grid-cols-1 gap-4 p-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredFares.map((fare) => {
              const Icon = transportIcons[fare.transportType] || Bus;
              return (
                <div
                  key={fare.id}
                  className="group rounded-xl border border-neutral-200 p-5 transition-all hover:border-green-500/50 hover:shadow-md dark:border-neutral-700"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-navy-50 p-2.5 text-navy-900 dark:bg-navy-900/40 dark:text-navy-300">
                        <Icon size={20} />
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-neutral-900 dark:text-neutral-100">{fare.route}</p>
                        <p className="flex items-center gap-1 text-xs text-neutral-500 dark:text-neutral-400">
                          <MapPin size={12} /> {fare.district}
                        </p>
                      </div>
                    </div>
                    <StatusBadge status={fare.status} />
                  </div>
                  <div className="mt-4 flex items-end justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Fare</p>
                      <p className="text-2xl font-bold text-green-600 dark:text-green-400">{formatCurrency(fare.fare)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Transport</p>
                      <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">{getTransportTypeLabel(fare.transportType)}</p>
                    </div>
                  </div>
                  <div className="mt-3 border-t border-neutral-100 pt-3 text-xs text-neutral-500 dark:border-neutral-800 dark:text-neutral-400">
                    Effective {formatDate(fare.effectiveDate)}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      <p className="flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400">
        <DollarSign size={16} className="text-green-500" />
        Published fares apply from their effective date. To propose changes, contact your cooperative.
      </p>
    </div>
  );
}