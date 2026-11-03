import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, ChevronRight, History, Filter } from 'lucide-react';
import Card from '../../components/common/Card';
import StatusBadge from '../../components/common/StatusBadge';
import EmptyState from '../../components/common/EmptyState';
import ErrorState from '../../components/common/ErrorState';
import Select from '../../components/common/Select';
import Modal from '../../components/common/Modal';
import { CardSkeleton, TableSkeleton } from '../../components/common/LoadingSkeleton';
import { fareService, routeService } from '../../services/api';
import { TRANSPORT_TYPES } from '../../data/mockData';
import { formatCurrency, formatDate, getTransportTypeLabel } from '../../utils/helpers';

const historyData = [
  { id: 'h1', route: 'Kigali - Huye', transportType: 'bus', previous: 3000, updated: 3500, changedAt: '2025-09-01', changedBy: 'Authority', reason: 'Annual review' },
  { id: 'h2', route: 'Kigali - Musanze', transportType: 'bus', previous: 2200, updated: 2500, changedAt: '2025-11-15', changedBy: 'Authority', reason: 'Fuel price adjustment' },
  { id: 'h3', route: 'Kigali - Rubavu', transportType: 'bus', previous: 4500, updated: 5000, changedAt: '2025-12-01', changedBy: 'Authority', reason: 'Cost review' },
  { id: 'h4', route: 'Kigali - Nyagatare', transportType: 'bus', previous: 2800, updated: 3000, changedAt: '2025-11-01', changedBy: 'Authority', reason: 'Inflation adjustment' },
  { id: 'h5', route: 'Huye - Nyanza', transportType: 'bus', previous: 1400, updated: 1500, changedAt: '2025-10-01', changedBy: 'Authority', reason: 'Sector review' },
];

export default function TariffsPage() {
  const [fares, setFares] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [view, setView] = useState('current');
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        setLoading(true);
        const [fareRes, routeRes] = await Promise.allSettled([
          fareService.getFares(),
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

  const filteredFares = fares.filter((f) => {
    if (statusFilter && f.status !== statusFilter) return false;
    if (typeFilter && f.transportType !== typeFilter) return false;
    return true;
  });

  const activeFares = filteredFares.filter((f) => f.status === 'PUBLISHED');

  if (error) {
    return <ErrorState message="Failed to load tariffs" description={error} />;
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Tariffs</h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            View applicable fares and their history.
          </p>
        </div>
        <div className="flex rounded-lg bg-neutral-100 p-1 dark:bg-neutral-800">
          {[
            { id: 'current', label: 'Current Tariffs' },
            { id: 'history', label: 'History' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setView(tab.id)}
              className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
                view === tab.id
                  ? 'bg-white text-neutral-900 shadow-sm dark:bg-neutral-900 dark:text-neutral-100'
                  : 'text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </motion.div>

      {view === 'current' ? (
        <>
          <Card className="p-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Select
                label="Status"
                placeholder="All statuses"
                options={['PUBLISHED', 'PENDING_REVIEW', 'DRAFT', 'EXPIRED']}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              />
              <Select
                label="Transport type"
                placeholder="All types"
                options={TRANSPORT_TYPES}
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              />
            </div>
          </Card>

          <Card>
            {loading ? (
              <TableSkeleton rows={6} columns={5} />
            ) : activeFares.length === 0 ? (
              <EmptyState title="No tariffs match your filters" />
            ) : (
              <div className="grid grid-cols-1 gap-4 p-5 md:grid-cols-2 xl:grid-cols-3">
                {activeFares.map((fare) => (
                  <div key={fare.id} className="rounded-xl border border-neutral-200 p-5 transition-colors hover:border-green-500/50 dark:border-neutral-700">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <DollarSign size={16} className="text-green-600" />
                          <p className="font-semibold text-neutral-900 dark:text-neutral-100">{fare.route}</p>
                        </div>
                        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                          {getTransportTypeLabel(fare.transportType)} &middot; {fare.district}
                        </p>
                      </div>
                      <StatusBadge status={fare.status} />
                    </div>
                    <div className="mt-4 flex items-end justify-between">
                      <div>
                        <p className="text-xs uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Current fare</p>
                        <p className="text-2xl font-bold text-green-600 dark:text-green-400">{formatCurrency(fare.fare)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Effective</p>
                        <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">{formatDate(fare.effectiveDate)}</p>
                      </div>
                    </div>
                    <div className="mt-4 flex justify-end">
                      <button onClick={() => setSelected(fare)} className="flex items-center gap-1 text-sm font-medium text-green-600 hover:text-green-700 dark:text-green-400">
                        View details <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </>
      ) : (
        <Card
          header={
            <div className="flex items-center gap-2">
              <History size={18} className="text-navy-900 dark:text-navy-300" />
              <span className="font-semibold text-neutral-900 dark:text-neutral-100">Tariff History</span>
            </div>
          }
        >
          {loading ? (
            <TableSkeleton rows={5} columns={5} />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-neutral-200 text-left dark:border-neutral-700">
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Date</th>
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Route</th>
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Type</th>
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Previous</th>
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Updated</th>
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Reason</th>
                  </tr>
                </thead>
                <tbody>
                  {historyData.map((h) => (
                    <tr key={h.id} className="border-b border-neutral-100 transition-colors hover:bg-neutral-50 dark:border-neutral-800 dark:hover:bg-neutral-800/50">
                      <td className="px-4 py-3 text-sm text-neutral-700 dark:text-neutral-300">{formatDate(h.changedAt)}</td>
                      <td className="px-4 py-3 text-sm text-neutral-700 dark:text-neutral-300">{h.route}</td>
                      <td className="px-4 py-3 text-sm text-neutral-700 dark:text-neutral-300">{getTransportTypeLabel(h.transportType)}</td>
                      <td className="px-4 py-3 text-sm text-neutral-500 line-through">{formatCurrency(h.previous)}</td>
                      <td className="px-4 py-3 text-sm font-semibold text-green-600 dark:text-green-400">{formatCurrency(h.updated)}</td>
                      <td className="px-4 py-3 text-sm text-neutral-500 dark:text-neutral-400">{h.reason}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      )}

      <Modal isOpen={!!selected} onClose={() => setSelected(null)} title="Tariff Details" size="md">
        {selected ? (
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">{selected.route}</h3>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  {getTransportTypeLabel(selected.transportType)} &middot; {selected.district}
                </p>
              </div>
              <StatusBadge status={selected.status} />
            </div>
            <div className="rounded-xl bg-green-50 p-4 dark:bg-green-900/20">
              <p className="text-xs uppercase tracking-wider text-green-700 dark:text-green-400">Fare per passenger</p>
              <p className="mt-1 text-3xl font-bold text-green-700 dark:text-green-400">{formatCurrency(selected.fare)}</p>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex justify-between">
                <span className="text-neutral-500 dark:text-neutral-400">Effective date</span>
                <span className="font-medium text-neutral-800 dark:text-neutral-200">{formatDate(selected.effectiveDate)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500 dark:text-neutral-400">Last updated</span>
                <span className="font-medium text-neutral-800 dark:text-neutral-200">{formatDate(selected.lastUpdated)}</span>
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