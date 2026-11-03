import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Clock,
  ArrowRight,
  Filter,
  X,
  TrendingUp,
  TrendingDown,
  Minus,
  Calendar,
} from 'lucide-react';
import { formatCurrency, formatDate, getTransportTypeLabel } from '../../utils/helpers';
import StatusBadge from '../../components/common/StatusBadge';
import Pagination from '../../components/common/Pagination';
import EmptyState from '../../components/common/EmptyState';
import { CardSkeleton } from '../../components/common/LoadingSkeleton';
import usePagination from '../../hooks/usePagination';
import useDebounce from '../../hooks/useDebounce';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const fareHistory = [
  { id: 'fh1', routeName: 'Kigali - Huye', transportType: 'bus', previousFare: 3000, currentFare: 3500, effectiveDate: '2026-01-01', source: 'Rwanda Utilities Board', status: 'PUBLISHED', previousDate: '2025-07-01' },
  { id: 'fh2', routeName: 'Kigali - Huye', transportType: 'minibus', previousFare: 2500, currentFare: 3000, effectiveDate: '2026-01-01', source: 'Rwanda Utilities Board', status: 'PUBLISHED', previousDate: '2025-07-01' },
  { id: 'fh3', routeName: 'Kigali - Musanze', transportType: 'bus', previousFare: 2200, currentFare: 2500, effectiveDate: '2026-01-01', source: 'Rwanda Utilities Board', status: 'PUBLISHED', previousDate: '2025-07-01' },
  { id: 'fh4', routeName: 'Kimironko - Downtown', transportType: 'bus', previousFare: 350, currentFare: 400, effectiveDate: '2026-02-01', source: 'Kigali Bus Operators', status: 'PUBLISHED', previousDate: '2025-10-01' },
  { id: 'fh5', routeName: 'Kimironko - Downtown', transportType: 'moto', previousFare: 450, currentFare: 500, effectiveDate: '2026-02-01', source: 'Moto Cooperative', status: 'PUBLISHED', previousDate: '2025-10-01' },
  { id: 'fh6', routeName: 'Kigali - Rubavu', transportType: 'bus', previousFare: 4500, currentFare: 5000, effectiveDate: '2026-01-01', source: 'Rwanda Utilities Board', status: 'PUBLISHED', previousDate: '2025-06-01' },
  { id: 'fh7', routeName: 'Kigali - Nyagatare', transportType: 'bus', previousFare: 4000, currentFare: 4500, effectiveDate: '2026-01-15', source: 'Rwanda Utilities Board', status: 'PUBLISHED', previousDate: '2025-08-01' },
  { id: 'fh8', routeName: 'Kigali - Muhanga', transportType: 'bus', previousFare: 1200, currentFare: 1500, effectiveDate: '2026-02-01', source: 'Rwanda Utilities Board', status: 'PUBLISHED', previousDate: '2025-09-01' },
  { id: 'fh9', routeName: 'Remera - Kanombe', transportType: 'moto', previousFare: 250, currentFare: 300, effectiveDate: '2026-03-01', source: 'Moto Cooperative', status: 'PUBLISHED', previousDate: '2025-11-01' },
  { id: 'fh10', routeName: 'Kigali - Kayonza', transportType: 'bus', previousFare: 2800, currentFare: 3000, effectiveDate: '2026-01-01', source: 'Rwanda Utilities Board', status: 'PUBLISHED', previousDate: '2025-07-01' },
];

export default function FareHistoryPage() {
  const [history] = useState(fareHistory);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterRoute, setFilterRoute] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [pageSize] = useState(10);
  const debouncedSearch = useDebounce(search, 300);

  const filtered = useMemo(() => {
    return history.filter((h) => {
      const matchSearch = !debouncedSearch ||
        h.routeName.toLowerCase().includes(debouncedSearch.toLowerCase());
      const matchRoute = !filterRoute || h.routeName === filterRoute;
      const matchDateFrom = !dateFrom || h.effectiveDate >= dateFrom;
      const matchDateTo = !dateTo || h.effectiveDate <= dateTo;
      return matchSearch && matchRoute && matchDateFrom && matchDateTo;
    });
  }, [debouncedSearch, filterRoute, dateFrom, dateTo, history]);

  const { currentPage, totalPages, startIndex, endIndex, goToPage } = usePagination({
    totalItems: filtered.length,
    pageSize,
  });

  const paginated = filtered.slice(startIndex, endIndex);
  const uniqueRoutes = [...new Set(fareHistory.map((h) => h.routeName))];

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  const clearFilters = () => {
    setSearch('');
    setFilterRoute('');
    setDateFrom('');
    setDateTo('');
  };

  const hasFilters = search || filterRoute || dateFrom || dateTo;

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <section className="bg-navy-900 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" animate="visible">
            <motion.h1 variants={fadeUp} className="text-3xl sm:text-4xl font-bold text-white mb-3">
              Fare History
            </motion.h1>
            <motion.p variants={fadeUp} custom={1} className="text-neutral-300 text-lg">
              Track fare changes and historical pricing data
            </motion.p>
          </motion.div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 space-y-4">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by route name..."
              className="w-full rounded-lg border border-neutral-200 bg-white py-2.5 pl-10 pr-10 text-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20"
            />
          </div>
          <div className="flex flex-wrap items-end gap-3 rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-2 text-sm font-medium text-neutral-600">
              <Filter size={16} /> Filters
            </div>
            <div className="flex flex-1 flex-wrap items-end gap-3">
              <div className="min-w-[200px]">
                <label className="block text-xs font-medium text-neutral-500 mb-1">Route</label>
                <select
                  value={filterRoute}
                  onChange={(e) => setFilterRoute(e.target.value)}
                  className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20 appearance-none"
                >
                  <option value="">All Routes</option>
                  {uniqueRoutes.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>
              <div className="min-w-[160px]">
                <label className="block text-xs font-medium text-neutral-500 mb-1">From Date</label>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20"
                />
              </div>
              <div className="min-w-[160px]">
                <label className="block text-xs font-medium text-neutral-500 mb-1">To Date</label>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20"
                />
              </div>
            </div>
            {hasFilters && (
              <button onClick={clearFilters} className="inline-flex items-center gap-1 text-sm text-neutral-500 hover:text-red-500 transition-colors">
                <X size={14} /> Clear
              </button>
            )}
          </div>
        </motion.div>

        {/* History List */}
        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => <CardSkeleton key={i} />)}
          </div>
        ) : paginated.length === 0 ? (
          <EmptyState
            icon={Clock}
            title="No fare history found"
            description="Try adjusting your filters."
          />
        ) : (
          <>
            <p className="text-sm text-neutral-500 mb-4">{filtered.length} change{filtered.length !== 1 ? 's' : ''} found</p>
            <div className="space-y-3">
              {paginated.map((entry, i) => {
                const change = entry.currentFare - entry.previousFare;
                const pct = Math.round((change / entry.previousFare) * 100);
                const isUp = change > 0;
                const isDown = change < 0;

                return (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="rounded-xl border border-neutral-200 bg-white p-5 hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-base font-semibold text-navy-900">{entry.routeName}</h3>
                          <span className="inline-flex items-center rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-medium text-neutral-700">
                            {getTransportTypeLabel(entry.transportType)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-neutral-500">
                          <Calendar size={14} className="text-neutral-400" />
                          Effective: {formatDate(entry.effectiveDate)}
                          <span className="text-neutral-300">|</span>
                          Previous: {formatDate(entry.previousDate)}
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-center">
                          <p className="text-xs text-neutral-400 mb-0.5">Previous</p>
                          <p className="text-sm font-medium text-neutral-500 line-through">{formatCurrency(entry.previousFare)}</p>
                        </div>
                        <ArrowRight size={16} className="text-neutral-300 shrink-0" />
                        <div className="text-center">
                          <p className="text-xs text-neutral-400 mb-0.5">Current</p>
                          <p className="text-lg font-bold text-navy-900">{formatCurrency(entry.currentFare)}</p>
                        </div>
                        <div className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${
                          isUp ? 'bg-red-50 text-red-600' : isDown ? 'bg-green-50 text-green-600' : 'bg-neutral-100 text-neutral-500'
                        }`}>
                          {isUp ? <TrendingUp size={12} /> : isDown ? <TrendingDown size={12} /> : <Minus size={12} />}
                          {isUp ? '+' : ''}{pct}%
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center gap-2 text-xs text-neutral-400">
                      <span>Source: {entry.source}</span>
                      <StatusBadge status={entry.status} />
                    </div>
                  </motion.div>
                );
              })}
            </div>
            {totalPages > 1 && (
              <div className="mt-8">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={filtered.length}
                  perPage={pageSize}
                  onPageChange={goToPage}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
