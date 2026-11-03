import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, History, ChevronRight, Filter } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import StatusBadge from '../../components/common/StatusBadge';
import EmptyState from '../../components/common/EmptyState';
import ErrorState from '../../components/common/ErrorState';
import Modal from '../../components/common/Modal';
import Select from '../../components/common/Select';
import { TableSkeleton } from '../../components/common/LoadingSkeleton';
import { fareService, routeService } from '../../services/api';
import { DISTRICTS, TRANSPORT_TYPES, mockFares, mockRoutes } from '../../data/mockData';
import { formatCurrency, formatDate, getTransportTypeLabel } from '../../utils/helpers';

const statusOptions = ['DRAFT', 'PENDING_REVIEW', 'VERIFIED', 'PUBLISHED', 'EXPIRED', 'REJECTED'];

const historyExample = {
  oldFare: 3000,
  newFare: 3500,
  changedAt: '2025-09-01',
  changedBy: 'Paul Nshimiyimana',
  reason: 'Annual fare review per RURA guidelines.',
};

export default function AuthorityFaresPage() {
  const [fares, setFares] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [districtFilter, setDistrictFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selected, setSelected] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState([]);

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
        setFares(fareRes.status === 'fulfilled' ? fareRes.value.data : mockFares);
        setRoutes(routeRes.status === 'fulfilled' ? routeRes.value.data : mockRoutes);
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
    if (districtFilter && f.district !== districtFilter) return false;
    if (typeFilter && f.transportType !== typeFilter) return false;
    if (statusFilter && f.status !== statusFilter) return false;
    return true;
  });

  const handleOpenHistory = async () => {
    const { data } = await fareService.getFareHistory(selected.id);
    setHistory(data);
    setShowHistory(true);
  };

  if (error) {
    return <ErrorState message="Failed to load fares" description={error} />;
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Fares</h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          All fares in the system with change history.
        </p>
      </motion.div>

      <Card className="p-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <Select
            label="District"
            placeholder="All districts"
            options={DISTRICTS.map((d) => ({ value: d.name, label: d.name }))}
            value={districtFilter}
            onChange={(e) => setDistrictFilter(e.target.value)}
          />
          <Select
            label="Transport type"
            placeholder="All types"
            options={TRANSPORT_TYPES}
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          />
          <Select
            label="Status"
            placeholder="All statuses"
            options={statusOptions}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          />
          {(districtFilter || typeFilter || statusFilter) && (
            <div className="flex items-end">
              <button
                onClick={() => {
                  setDistrictFilter('');
                  setTypeFilter('');
                  setStatusFilter('');
                }}
                className="flex items-center gap-1 text-sm font-medium text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-300"
              >
                <Filter size={14} /> Clear filters
              </button>
            </div>
          )}
        </div>
      </Card>

      {loading ? (
        <TableSkeleton rows={8} columns={6} />
      ) : filteredFares.length === 0 ? (
        <EmptyState title="No fares found" description="Adjust your filters and try again." />
      ) : (
        <Card className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-neutral-200 text-left dark:border-neutral-700">
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Route</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Type</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">District</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Fare</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Effective</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Status</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400"></th>
                </tr>
              </thead>
              <tbody>
                {filteredFares.map((fare) => (
                  <tr key={fare.id} className="border-b border-neutral-100 transition-colors hover:bg-neutral-50 dark:border-neutral-800 dark:hover:bg-neutral-800/50">
                    <td className="px-4 py-3 text-sm font-medium text-neutral-800 dark:text-neutral-200">{fare.route}</td>
                    <td className="px-4 py-3 text-sm capitalize text-neutral-700 dark:text-neutral-300">{getTransportTypeLabel(fare.transportType)}</td>
                    <td className="px-4 py-3 text-sm text-neutral-700 dark:text-neutral-300">{fare.district}</td>
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-1 text-sm font-semibold text-green-600 dark:text-green-400">
                        <DollarSign size={14} /> {formatCurrency(fare.fare)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-neutral-700 dark:text-neutral-300">{formatDate(fare.effectiveDate)}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={fare.status} />
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setSelected(fare)}
                        className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 dark:hover:bg-neutral-800"
                      >
                        <ChevronRight size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <Modal isOpen={!!selected} onClose={() => setSelected(null)} title="Fare Details" size="lg">
        {selected ? (
          <div className="space-y-5">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">{selected.route}</h3>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  {getTransportTypeLabel(selected.transportType)} &middot; {selected.district}
                </p>
              </div>
              <StatusBadge status={selected.status} />
            </div>

            <div className="rounded-xl bg-green-50 p-5 dark:bg-green-900/20">
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
              <div className="flex justify-between">
                <span className="text-neutral-500 dark:text-neutral-400">Cooperating party</span>
                <span className="font-medium text-neutral-800 dark:text-neutral-200">
                  {selected.cooperativeId === 'coop1' ? 'Kigali Transport Cooperative' : selected.cooperativeId === 'coop2' ? 'Southern Transport SACCO' : '--'}
                </span>
              </div>
            </div>

            <div className="flex justify-between gap-3 border-t border-neutral-200 pt-4 dark:border-neutral-700">
              <Button variant="outline" leftIcon={History} onClick={handleOpenHistory}>
                View Change History
              </Button>
              <Button variant="ghost" onClick={() => setSelected(null)}>Close</Button>
            </div>
          </div>
        ) : (
          <TableSkeleton rows={3} columns={3} />
        )}
      </Modal>

      <Modal isOpen={showHistory} onClose={() => setShowHistory(false)} title="Fare Change History" size="lg">
        <div className="space-y-5">
          {history.length === 0 && (
            <p className="text-sm text-neutral-500">Loading history...</p>
          )}
          {history.map((entry) => (
            <div key={entry.id} className="rounded-xl border border-neutral-200 p-4 dark:border-neutral-700">
              <div className="flex items-center justify-between">
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  Changed by <span className="font-medium text-neutral-800 dark:text-neutral-200">{entry.changedBy}</span> on {formatDate(entry.changedAt)}
                </p>
                <StatusBadge status="APPROVED" />
              </div>
              <div className="mt-3 flex items-center gap-3">
                <div className="rounded-lg bg-red-50 px-3 py-2 text-red-500 line-through dark:bg-red-900/20">
                  {formatCurrency(entry.oldFare)}
                </div>
                <ChevronRight size={16} className="text-neutral-400" />
                <div className="rounded-lg bg-green-50 px-3 py-2 font-semibold text-green-700 dark:bg-green-900/20 dark:text-green-400">
                  {formatCurrency(entry.newFare)}
                </div>
              </div>
              <p className="mt-3 border-t border-neutral-100 pt-3 text-sm text-neutral-600 dark:border-neutral-800 dark:text-neutral-400">
                Reason: {entry.reason}
              </p>
            </div>
          ))}
          {/* Example history entry */}
          <div className="rounded-xl border border-neutral-200 p-4 dark:border-neutral-700">
            <div className="flex items-center justify-between">
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                Changed by <span className="font-medium text-neutral-800 dark:text-neutral-200">{historyExample.changedBy}</span> on {formatDate(historyExample.changedAt)}
              </p>
              <StatusBadge status="APPROVED" />
            </div>
            <div className="mt-3 flex items-center gap-3">
              <div className="rounded-lg bg-red-50 px-3 py-2 text-red-500 line-through dark:bg-red-900/20">
                {formatCurrency(historyExample.oldFare)}
              </div>
              <ChevronRight size={16} className="text-neutral-400" />
              <div className="rounded-lg bg-green-50 px-3 py-2 font-semibold text-green-700 dark:bg-green-900/20 dark:text-green-400">
                {formatCurrency(historyExample.newFare)}
              </div>
            </div>
            <p className="mt-3 border-t border-neutral-100 pt-3 text-sm text-neutral-600 dark:border-neutral-800 dark:text-neutral-400">
              Reason: {historyExample.reason}
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
}