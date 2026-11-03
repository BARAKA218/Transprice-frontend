import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Bell,
  Tag,
  Calendar,
  ExternalLink,
  Filter,
  X,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { transportUpdateService } from '../../services/api';
import { formatDate } from '../../utils/helpers';
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

const PAGE_SIZE = 8;

const categories = [
  { value: 'All', label: 'All Updates' },
  { value: 'FARE', label: 'Fares' },
  { value: 'ROUTE', label: 'Routes' },
  { value: 'FUEL', label: 'Fuel' },
  { value: 'ANNOUNCEMENT', label: 'Announcements' },
  { value: 'SERVICE_UPDATE', label: 'Service Updates' },
];

const categoryColors = {
  FARE: 'bg-blue-100 text-blue-700',
  ROUTE: 'bg-green-100 text-green-700',
  FUEL: 'bg-purple-100 text-purple-700',
  ANNOUNCEMENT: 'bg-amber-100 text-amber-700',
  SERVICE_UPDATE: 'bg-cyan-100 text-cyan-700',
  GENERAL: 'bg-neutral-100 text-neutral-700',
};

export default function UpdatesPage() {
  const [allUpdates, setAllUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const { data } = await transportUpdateService.getUpdates();
        setAllUpdates(data);
      } catch {
        setAllUpdates([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered = useMemo(() => {
    return allUpdates.filter((u) => {
      const matchSearch = !debouncedSearch ||
        u.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        u.description.toLowerCase().includes(debouncedSearch.toLowerCase());
      const matchCategory = category === 'All' || u.category === category;
      const matchFrom = !dateFrom || u.publicationDate >= dateFrom;
      const matchTo = !dateTo || u.publicationDate <= dateTo;
      return matchSearch && matchCategory && matchFrom && matchTo;
    });
  }, [debouncedSearch, category, dateFrom, dateTo, allUpdates]);

  const { currentPage, totalPages, startIndex, endIndex, goToPage } = usePagination({
    totalItems: filtered.length,
    pageSize: PAGE_SIZE,
  });

  const paginated = filtered.slice(startIndex, endIndex);
  const clearFilters = () => {
    setSearch('');
    setCategory('All');
    setDateFrom('');
    setDateTo('');
    goToPage(1);
  };
  const hasFilters = search || category !== 'All' || dateFrom || dateTo;

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <section className="bg-navy-900 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" animate="visible">
            <motion.h1 variants={fadeUp} className="text-3xl sm:text-4xl font-bold text-white mb-3">
              Transport Updates
            </motion.h1>
            <motion.p variants={fadeUp} custom={1} className="text-neutral-300 text-lg">
              Stay informed about fare changes, new routes, and service announcements
            </motion.p>
          </motion.div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Search & Filters */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 space-y-4">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); goToPage(1); }}
              placeholder="Search updates..."
              className="w-full rounded-lg border border-neutral-200 bg-white py-2.5 pl-10 pr-10 text-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20"
            />
            {search && (
              <button onClick={() => { setSearch(''); goToPage(1); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600">
                <X size={16} />
              </button>
            )}
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <button
                key={c.value}
                onClick={() => { setCategory(c.value); goToPage(1); }}
                className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  category === c.value
                    ? 'bg-navy-900 text-white'
                    : 'bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* Date Filters */}
          <div className="flex flex-wrap items-end gap-3 rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-2 text-sm font-medium text-neutral-600">
              <Filter size={16} /> Date Range
            </div>
            <div className="flex flex-1 flex-wrap items-end gap-3">
              <div className="min-w-[160px]">
                <label className="block text-xs font-medium text-neutral-500 mb-1">From</label>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => { setDateFrom(e.target.value); goToPage(1); }}
                  className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20"
                />
              </div>
              <div className="min-w-[160px]">
                <label className="block text-xs font-medium text-neutral-500 mb-1">To</label>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => { setDateTo(e.target.value); goToPage(1); }}
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

        {/* Updates List */}
        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => <CardSkeleton key={i} />)}
          </div>
        ) : paginated.length === 0 ? (
          <EmptyState
            icon={Bell}
            title="No updates found"
            description="Try adjusting your search or filters."
          />
        ) : (
          <>
            <p className="text-sm text-neutral-500 mb-4">{filtered.length} update{filtered.length !== 1 ? 's' : ''} found</p>
            <div className="space-y-4">
              {paginated.map((update, i) => (
                <motion.div
                  key={update.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="rounded-xl border border-neutral-200 bg-white hover:shadow-md transition-shadow overflow-hidden"
                >
                  <button
                    onClick={() => setExpandedId(expandedId === update.id ? null : update.id)}
                    className="w-full text-left p-5"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${categoryColors[update.category] || 'bg-neutral-100 text-neutral-700'}`}>
                            <Tag size={12} className="mr-1" />
                            {update.category.replace(/_/g, ' ')}
                          </span>
                          <StatusBadge status={update.status} />
                        </div>
                        <h3 className="text-base font-semibold text-navy-900 mb-1">{update.title}</h3>
                        <p className={`text-sm text-neutral-500 ${expandedId === update.id ? '' : 'line-clamp-2'}`}>
                          {update.description}
                        </p>
                        <div className="flex items-center gap-4 mt-3 text-xs text-neutral-400">
                          <span className="inline-flex items-center gap-1">
                            <Calendar size={12} /> {formatDate(update.publicationDate)}
                          </span>
                          <span>{update.source}</span>
                          {update.effectiveDate && (
                            <span className="text-green-600">Effective: {formatDate(update.effectiveDate)}</span>
                          )}
                        </div>
                      </div>
                      <div className="shrink-0 text-neutral-400">
                        {expandedId === update.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                      </div>
                    </div>
                  </button>
                  <AnimatePresence>
                    {expandedId === update.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-5 border-t border-neutral-100 pt-4">
                          <p className="text-sm text-neutral-600 leading-relaxed mb-4">{update.description}</p>
                          <div className="flex items-center gap-4 text-xs text-neutral-400">
                            {update.expiryDate && <span>Expires: {formatDate(update.expiryDate)}</span>}
                            {update.sourceUrl && (
                              <a href={update.sourceUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-green-600 hover:text-green-700">
                                View source <ExternalLink size={12} />
                              </a>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
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
          </>
        )}
      </div>
    </div>
  );
}