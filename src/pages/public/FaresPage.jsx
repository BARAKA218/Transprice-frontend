import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Table2,
  LayoutGrid,
  Bus,
  Calendar,
  ExternalLink,
  Filter,
  X,
} from 'lucide-react';
import { fareService } from '../../services/api';
import { TRANSPORT_TYPES } from '../../types';
import { formatCurrency, formatDate, getTransportTypeLabel } from '../../utils/helpers';
import SearchBar from '../../components/common/SearchBar';
import Pagination from '../../components/common/Pagination';
import EmptyState from '../../components/common/EmptyState';
import StatusBadge from '../../components/common/StatusBadge';
import SourceBadge from '../../components/common/SourceBadge';
import { CardSkeleton, TableSkeleton } from '../../components/common/LoadingSkeleton';
import usePagination from '../../hooks/usePagination';
import useDebounce from '../../hooks/useDebounce';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const PAGE_SIZE = 10;

export default function FaresPage() {
  const [allFares, setAllFares] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterTransport, setFilterTransport] = useState('');
  const [viewMode, setViewMode] = useState('table');
  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const { data } = await fareService.getFares({ status: 'PUBLISHED' });
        setAllFares(data);
      } catch {
        setAllFares([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered = useMemo(() => {
    return allFares.filter((f) => {
      const matchSearch = !debouncedSearch ||
        f.routeName.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        f.origin.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        f.destination.toLowerCase().includes(debouncedSearch.toLowerCase());
      const matchTransport = !filterTransport || f.transportType === filterTransport;
      return matchSearch && matchTransport;
    });
  }, [debouncedSearch, filterTransport, allFares]);

  const { currentPage, totalPages, startIndex, endIndex, goToPage } = usePagination({
    totalItems: filtered.length,
    pageSize: PAGE_SIZE,
  });

  const paginatedFares = filtered.slice(startIndex, endIndex);
  const clearFilters = () => {
    setSearch('');
    setFilterTransport('');
    goToPage(1);
  };
  const hasFilters = search || filterTransport;

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <section className="bg-navy-900 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" animate="visible" className="flex items-center justify-between">
            <div>
              <motion.h1 variants={fadeUp} className="text-3xl sm:text-4xl font-bold text-white mb-3">
                Public Fares
              </motion.h1>
              <motion.p variants={fadeUp} custom={1} className="text-neutral-300 text-lg">
                Browse all published and verified transport fares
              </motion.p>
            </div>
            <motion.div variants={fadeUp} custom={2} className="hidden sm:flex items-center gap-2 bg-white/10 rounded-lg p-1">
              <button
                onClick={() => setViewMode('table')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'table' ? 'bg-white text-navy-900' : 'text-neutral-300 hover:text-white'
                }`}
              >
                <Table2 size={14} /> Table
              </button>
              <button
                onClick={() => setViewMode('card')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'card' ? 'bg-white text-navy-900' : 'text-neutral-300 hover:text-white'
                }`}
              >
                <LayoutGrid size={14} /> Cards
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Search & Filters */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 space-y-4">
          <SearchBar
            placeholder="Search fares by route, origin, or destination..."
            value={search}
            onChange={(v) => { setSearch(v); goToPage(1); }}
          />
          <div className="flex flex-wrap items-end gap-3 rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-2 text-sm font-medium text-neutral-600">
              <Filter size={16} /> Filters
            </div>
            <div className="flex flex-1 flex-wrap items-end gap-3">
              <div className="min-w-[160px]">
                <label className="block text-xs font-medium text-neutral-500 mb-1">Transport Type</label>
                <select
                  value={filterTransport}
                  onChange={(e) => { setFilterTransport(e.target.value); goToPage(1); }}
                  className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20 appearance-none"
                >
                  <option value="">All Types</option>
                  {TRANSPORT_TYPES.map((t) => (
                    <option key={t.id} value={t.id}>{t.label}</option>
                  ))}
                </select>
              </div>
            </div>
            {hasFilters && (
              <button onClick={clearFilters} className="inline-flex items-center gap-1 text-sm text-neutral-500 hover:text-red-500 transition-colors">
                <X size={14} /> Clear
              </button>
            )}
          </div>
        </motion.div>

        {/* Mobile view toggle */}
        <div className="sm:hidden mb-4 flex items-center gap-2 bg-white rounded-lg p-1 border border-neutral-200">
          <button
            onClick={() => setViewMode('table')}
            className={`flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'table' ? 'bg-navy-900 text-white' : 'text-neutral-600'
            }`}
          >
            <Table2 size={14} /> Table
          </button>
          <button
            onClick={() => setViewMode('card')}
            className={`flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'card' ? 'bg-navy-900 text-white' : 'text-neutral-600'
            }`}
          >
            <LayoutGrid size={14} /> Cards
          </button>
        </div>

        {/* Content */}
        {loading ? (
          viewMode === 'table' ? <TableSkeleton rows={8} columns={6} /> : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
            </div>
          )
        ) : paginatedFares.length === 0 ? (
          <EmptyState
            icon={Search}
            title="No fares found"
            description="Try adjusting your search or filters."
          />
        ) : viewMode === 'table' ? (
          <div className="rounded-xl border border-neutral-200 bg-white shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-neutral-200 bg-neutral-50">
                    <th className="px-4 py-3 text-left font-medium text-neutral-600">Route</th>
                    <th className="px-4 py-3 text-left font-medium text-neutral-600">Transport</th>
                    <th className="px-4 py-3 text-left font-medium text-neutral-600">Fare</th>
                    <th className="px-4 py-3 text-left font-medium text-neutral-600">Status</th>
                    <th className="px-4 py-3 text-left font-medium text-neutral-600">Effective Date</th>
                    <th className="px-4 py-3 text-left font-medium text-neutral-600">Source</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedFares.map((fare) => (
                    <tr key={fare.id} className="border-b border-neutral-100 hover:bg-neutral-50 transition-colors">
                      <td className="px-4 py-3">
                        <span className="font-medium text-navy-900">{fare.routeName}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1 text-neutral-600">
                          <Bus size={14} /> {getTransportTypeLabel(fare.transportType)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-semibold text-navy-900">{formatCurrency(fare.fare)}</span>
                      </td>
                      <td className="px-4 py-3"><StatusBadge status={fare.status} /></td>
                      <td className="px-4 py-3 text-neutral-500">
                        <span className="inline-flex items-center gap-1">
                          <Calendar size={12} /> {formatDate(fare.effectiveDate)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <SourceBadge sourceName={fare.source} sourceCategory="DEFAULT" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginatedFares.map((fare, i) => (
              <motion.div
                key={fare.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="rounded-xl border border-neutral-200 bg-white p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-base font-semibold text-navy-900">{fare.routeName}</h3>
                  <StatusBadge status={fare.status} />
                </div>
                <div className="space-y-2 text-sm text-neutral-500 mb-3">
                  <div className="flex items-center gap-2">
                    <Bus size={14} className="text-green-500" />
                    {getTransportTypeLabel(fare.transportType)}
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-blue-500" />
                    {formatDate(fare.effectiveDate)}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-navy-900">{formatCurrency(fare.fare)}</span>
                  <SourceBadge sourceName={fare.source} sourceCategory="DEFAULT" />
                </div>
                {fare.sourceUrl && (
                  <a
                    href={fare.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center gap-1 text-xs text-green-600 hover:text-green-700 transition-colors"
                  >
                    View source <ExternalLink size={12} />
                  </a>
                )}
              </motion.div>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-8">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filtered.length}
              perPage={PAGE_SIZE}
              onPageChange={goToPage}
            />
          </div>
        )}
      </div>
    </div>
  );
}