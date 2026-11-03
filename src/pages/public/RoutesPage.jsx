import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  MapPin,
  Route,
  Clock,
  ArrowRight,
  Filter,
  X,
  Bus,
  Eye,
} from 'lucide-react';
import { routeService } from '../../services/api';
import { mockDistricts } from '../../data/mockData';
import { TRANSPORT_TYPES } from '../../types';
import { getTransportTypeLabel, formatDistance, formatTime } from '../../utils/helpers';
import SearchBar from '../../components/common/SearchBar';
import Pagination from '../../components/common/Pagination';
import EmptyState from '../../components/common/EmptyState';
import StatusBadge from '../../components/common/StatusBadge';
import Modal from '../../components/common/Modal';
import { CardSkeleton } from '../../components/common/LoadingSkeleton';
import RouteMap from '../../components/maps/RouteMap';
import usePagination from '../../hooks/usePagination';
import useDebounce from '../../hooks/useDebounce';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const PAGE_SIZE = 9;

export default function RoutesPage() {
  const [allRoutes, setAllRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterDistrict, setFilterDistrict] = useState('');
  const [filterTransport, setFilterTransport] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const debouncedSearch = useDebounce(search, 300);

  const [selectedRoute, setSelectedRoute] = useState(null);
  const [routeFares, setRouteFares] = useState([]);
  const [showDetail, setShowDetail] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const { data } = await routeService.getRoutes();
        setAllRoutes(data);
      } catch {
        setAllRoutes([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered = useMemo(() => {
    return allRoutes.filter((r) => {
      const matchSearch = !debouncedSearch ||
        r.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        r.origin.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        r.destination.toLowerCase().includes(debouncedSearch.toLowerCase());
      const matchDistrict = !filterDistrict ||
        r.originDistrict === filterDistrict || r.destinationDistrict === filterDistrict;
      const matchTransport = !filterTransport || r.transportTypes.includes(filterTransport);
      const matchStatus = !filterStatus || r.status === filterStatus;
      return matchSearch && matchDistrict && matchTransport && matchStatus;
    });
  }, [debouncedSearch, filterDistrict, filterTransport, filterStatus, allRoutes]);

  const { currentPage, totalPages, startIndex, endIndex, goToPage } = usePagination({
    totalItems: filtered.length,
    pageSize: PAGE_SIZE,
  });

  const paginatedRoutes = filtered.slice(startIndex, endIndex);

  const handleViewRoute = async (route) => {
    setSelectedRoute(route);
    setShowDetail(true);
    setDetailLoading(true);
    try {
      const fares = await routeService.getRouteFares(route.id);
      setRouteFares(fares);
    } catch {
      setRouteFares([]);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleDistrictChange = (value) => {
    setFilterDistrict(value);
    goToPage(1);
  };

  const handleTransportChange = (value) => {
    setFilterTransport(value);
    goToPage(1);
  };

  const handleStatusChange = (value) => {
    setFilterStatus(value);
    goToPage(1);
  };

  const clearFilters = () => {
    setSearch('');
    setFilterDistrict('');
    setFilterTransport('');
    setFilterStatus('');
    goToPage(1);
  };

  const hasFilters = search || filterDistrict || filterTransport || filterStatus;

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <section className="bg-navy-900 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" animate="visible">
            <motion.h1 variants={fadeUp} className="text-3xl sm:text-4xl font-bold text-white mb-3">
              Route Explorer
            </motion.h1>
            <motion.p variants={fadeUp} custom={1} className="text-neutral-300 text-lg">
              Discover all available transport routes across Rwanda
            </motion.p>
          </motion.div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Search & Filters */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 space-y-4">
          <SearchBar
            placeholder="Search routes by name, origin, or destination..."
            value={search}
            onChange={(v) => { setSearch(v); goToPage(1); }}
          />
          <div className="flex flex-wrap items-end gap-3 rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-2 text-sm font-medium text-neutral-600">
              <Filter size={16} />
              Filters
            </div>
            <div className="flex flex-1 flex-wrap items-end gap-3">
              <div className="min-w-[160px]">
                <label className="block text-xs font-medium text-neutral-500 mb-1">District</label>
                <select
                  value={filterDistrict}
                  onChange={(e) => handleDistrictChange(e.target.value)}
                  className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20 appearance-none"
                >
                  <option value="">All Districts</option>
                  {mockDistricts.map((d) => (
                    <option key={d.id} value={d.name}>{d.name}</option>
                  ))}
                </select>
              </div>
              <div className="min-w-[160px]">
                <label className="block text-xs font-medium text-neutral-500 mb-1">Transport Type</label>
                <select
                  value={filterTransport}
                  onChange={(e) => handleTransportChange(e.target.value)}
                  className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20 appearance-none"
                >
                  <option value="">All Types</option>
                  {TRANSPORT_TYPES.map((t) => (
                    <option key={t.id} value={t.id}>{t.label}</option>
                  ))}
                </select>
              </div>
              <div className="min-w-[160px]">
                <label className="block text-xs font-medium text-neutral-500 mb-1">Status</label>
                <select
                  value={filterStatus}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20 appearance-none"
                >
                  <option value="">All Statuses</option>
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
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

        {/* Routes Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : paginatedRoutes.length === 0 ? (
          <EmptyState
            icon={Route}
            title="No routes found"
            description="Try adjusting your search or filters."
          />
        ) : (
          <>
            <p className="text-sm text-neutral-500 mb-4">{filtered.length} route{filtered.length !== 1 ? 's' : ''} found</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedRoutes.map((route, i) => (
                <motion.div
                  key={route.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="rounded-xl border border-neutral-200 bg-white p-5 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-base font-semibold text-navy-900">{route.name}</h3>
                    <StatusBadge status={route.status} />
                  </div>
                  <div className="space-y-2 text-sm text-neutral-500 mb-4">
                    <div className="flex items-center gap-2">
                      <MapPin size={14} className="text-green-500 shrink-0" />
                      <span>{route.origin} → {route.destination}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Route size={14} className="text-blue-500 shrink-0" />
                      <span>{formatDistance(route.distance)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={14} className="text-amber-500 shrink-0" />
                      <span>{formatTime(route.estimatedTime)}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {route.transportTypes.map((t) => (
                      <span
                        key={t}
                        className="inline-flex items-center gap-1 rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-medium text-neutral-700"
                      >
                        <Bus size={12} /> {getTransportTypeLabel(t)}
                      </span>
                    ))}
                  </div>
                  <button
                    onClick={() => handleViewRoute(route)}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-2 text-sm font-medium text-navy-900 hover:bg-green-50 hover:border-green-200 hover:text-green-700 transition-colors"
                  >
                    <Eye size={14} /> View Details
                  </button>
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

      {/* Route Detail Modal */}
      <Modal
        isOpen={showDetail}
        onClose={() => { setShowDetail(false); setSelectedRoute(null); setRouteFares([]); }}
        title={selectedRoute?.name || 'Route Details'}
        size="xl"
      >
        {selectedRoute && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-medium text-neutral-500 mb-1">Origin</p>
                <p className="text-sm font-semibold text-navy-900">{selectedRoute.origin}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-neutral-500 mb-1">Destination</p>
                <p className="text-sm font-semibold text-navy-900">{selectedRoute.destination}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-neutral-500 mb-1">Distance</p>
                <p className="text-sm font-semibold text-navy-900">{formatDistance(selectedRoute.distance)}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-neutral-500 mb-1">Estimated Time</p>
                <p className="text-sm font-semibold text-navy-900">{formatTime(selectedRoute.estimatedTime)}</p>
              </div>
            </div>

            <div>
              <p className="text-xs font-medium text-neutral-500 mb-2">Transport Types</p>
              <div className="flex flex-wrap gap-2">
                {selectedRoute.transportTypes.map((t) => (
                  <span key={t} className="inline-flex items-center gap-1 rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
                    <Bus size={12} /> {getTransportTypeLabel(t)}
                  </span>
                ))}
              </div>
            </div>

            {/* Map */}
            <div>
              <p className="text-xs font-medium text-neutral-500 mb-2">Route Map</p>
              <div className="rounded-lg overflow-hidden border border-neutral-200">
                <RouteMap
                  origin={selectedRoute.origin}
                  destination={selectedRoute.destination}
                  originCoords={selectedRoute.coordinates?.origin}
                  destinationCoords={selectedRoute.coordinates?.destination}
                />
              </div>
            </div>

            {/* Applicable Fares */}
            <div>
              <p className="text-xs font-medium text-neutral-500 mb-2">Applicable Fares</p>
              {detailLoading ? (
                <div className="space-y-2">
                  {[1, 2].map((i) => (
                    <div key={i} className="h-12 bg-neutral-100 rounded-lg animate-pulse" />
                  ))}
                </div>
              ) : routeFares.length > 0 ? (
                <div className="space-y-2">
                  {routeFares.map((fare) => (
                    <div key={fare.id} className="flex items-center justify-between rounded-lg border border-neutral-200 bg-neutral-50 p-3">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-navy-900">{getTransportTypeLabel(fare.transportType)}</span>
                        <StatusBadge status={fare.status} />
                      </div>
                      <span className="text-sm font-bold text-navy-900">RWF {fare.fare.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-neutral-400 italic">No published fares for this route yet.</p>
              )}
            </div>

            <Link
              to={`/check-fare?origin=${encodeURIComponent(selectedRoute.origin)}&destination=${encodeURIComponent(selectedRoute.destination)}`}
              className="inline-flex items-center gap-2 text-sm font-medium text-green-600 hover:text-green-700 transition-colors"
            >
              Search fares for this route <ArrowRight size={14} />
            </Link>
          </div>
        )}
      </Modal>
    </div>
  );
}