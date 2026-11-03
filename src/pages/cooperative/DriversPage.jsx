import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  UserPlus,
  Star,
  Car,
  Search,
  ChevronRight,
  KeyRound,
  Phone,
  CalendarClock,
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Modal from '../../components/common/Modal';
import StatusBadge from '../../components/common/StatusBadge';
import EmptyState from '../../components/common/EmptyState';
import ErrorState from '../../components/common/ErrorState';
import { TableSkeleton } from '../../components/common/LoadingSkeleton';
import { driverService, vehicleService } from '../../services/api';
import { TRANSPORT_TYPES, mockVehicles } from '../../data/mockData';
import { formatDate } from '../../utils/helpers';

export default function DriversPage() {
  const [drivers, setDrivers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selected, setSelected] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [assigning, setAssigning] = useState({ driver: null, open: false });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const [form, setForm] = useState({
    name: '',
    phone: '',
    licenseNumber: '',
    vehicleId: '',
  });

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        setLoading(true);
        const [driverRes, vehicleRes] = await Promise.allSettled([
          driverService.getDrivers(),
          vehicleService.getVehicles(),
        ]);
        if (!mounted) return;
        setDrivers(driverRes.status === 'fulfilled' ? driverRes.value.data : []);
        setVehicles(vehicleRes.status === 'fulfilled' ? vehicleRes.value.data : mockVehicles);
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

  const availableVehicles = vehicles.filter((v) => !v.driverId || v.driverId === null);

  const filteredDrivers = drivers.filter((d) => {
    const q = search.toLowerCase();
    if (q && !d.name.toLowerCase().includes(q) && !d.vehicle?.toLowerCase().includes(q)) return false;
    if (statusFilter && d.status !== statusFilter) return false;
    return true;
  });

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleAddDriver = async (e) => {
    e.preventDefault();
    if (!form.name || !form.phone) {
      setFormError('Name and phone are required.');
      return;
    }
    setSubmitting(true);
    setFormError('');
    try {
      const newDriver = {
        id: `u${Date.now()}`,
        name: form.name,
        phone: form.phone,
        vehicle: form.vehicleId ? vehicles.find((v) => v.id === form.vehicleId)?.plateNumber || 'Unassigned' : 'Unassigned',
        status: 'PENDING_VERIFICATION',
        rating: 0,
        trips: 0,
        joinDate: new Date().toISOString().slice(0, 10),
      };
      setDrivers((prev) => [...prev, newDriver]);
      setShowAdd(false);
      setForm({ name: '', phone: '', licenseNumber: '', vehicleId: '' });
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleAssignVehicle = async () => {
    if (!assigning.driver || !assigning.vehicleId) return;
    setSubmitting(true);
    try {
      await driverService.assignVehicle(assigning.driver.id, assigning.vehicleId);
      setDrivers((prev) =>
        prev.map((d) =>
          d.id === assigning.driver.id
            ? { ...d, vehicle: vehicles.find((v) => v.id === assigning.vehicleId)?.plateNumber || 'Assigned' }
            : d
        )
      );
      setVehicles((prev) =>
        prev.map((v) =>
          v.id === assigning.vehicleId ? { ...v, driverId: assigning.driver.id, driverName: assigning.driver.name } : v
        )
      );
      setAssigning({ driver: null, open: false });
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (error) {
    return <ErrorState message="Failed to load drivers" description={error} />;
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Drivers</h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Manage drivers and vehicle assignments.
          </p>
        </div>
        <Button leftIcon={UserPlus} onClick={() => setShowAdd(true)}>
          Add Driver
        </Button>
      </motion.div>

      <Card className="p-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="relative md:col-span-2">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search drivers by name or vehicle..."
              className="w-full rounded-lg border border-neutral-300 bg-white py-2 pl-10 pr-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-navy-900 focus:outline-none focus:ring-2 focus:ring-navy-900/20 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100 dark:focus:border-green-500 dark:focus:ring-green-500/20"
            />
          </div>
          <Select
            placeholder="All statuses"
            options={['ACTIVE', 'INACTIVE', 'PENDING_VERIFICATION', 'BLOCKED']}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          />
        </div>
      </Card>

      {loading ? (
        <TableSkeleton rows={6} columns={6} />
      ) : filteredDrivers.length === 0 ? (
        <EmptyState title="No drivers found" description="Adjust your search or add a new driver." />
      ) : (
        <Card className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-neutral-200 text-left dark:border-neutral-700">
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Driver</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Vehicle</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Rating</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Trips</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Status</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400"></th>
                </tr>
              </thead>
              <tbody>
                {filteredDrivers.map((driver) => (
                  <tr key={driver.id} className="border-b border-neutral-100 transition-colors hover:bg-neutral-50 dark:border-neutral-800 dark:hover:bg-neutral-800/50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-50 text-sm font-semibold text-green-700 dark:bg-green-900/30 dark:text-green-400">
                          {driver.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">{driver.name}</p>
                          <p className="text-xs text-neutral-500 dark:text-neutral-400">{driver.phone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`flex items-center gap-1.5 text-sm ${driver.vehicle === 'Unassigned' ? 'text-amber-600 dark:text-amber-400' : 'text-neutral-700 dark:text-neutral-300'}`}>
                        <Car size={14} />
                        {driver.vehicle}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-1 text-sm text-amber-500">
                        <Star size={14} fill="currentColor" />
                        {driver.rating || '--'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-neutral-700 dark:text-neutral-300">{driver.trips}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={driver.status} />
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => setSelected(driver)} className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 dark:hover:bg-neutral-800">
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

      <Modal isOpen={showAdd} onClose={() => setShowAdd(false)} title="Add Driver" size="md">
        <form onSubmit={handleAddDriver} className="space-y-4">
          <Input label="Full name" required value={form.name} onChange={handleChange('name')} />
          <Input label="Phone" required value={form.phone} onChange={handleChange('phone')} />
          <Input label="License number" value={form.licenseNumber} onChange={handleChange('licenseNumber')} />
          <Select
            label="Assign vehicle (optional)"
            placeholder="Unassigned"
            options={availableVehicles.map((v) => ({ value: v.id, label: `${v.plateNumber} - ${v.make} ${v.model}` }))}
            value={form.vehicleId}
            onChange={handleChange('vehicleId')}
          />
          <div className="rounded-lg bg-amber-50 p-3 text-sm text-amber-700 dark:bg-amber-900/20 dark:text-amber-400">
            New drivers are marked as pending verification until their license is confirmed.
          </div>
          {formError && <p className="text-sm text-red-500">{formError}</p>}
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={() => setShowAdd(false)}>Cancel</Button>
            <Button type="submit" loading={submitting} leftIcon={UserPlus}>Add Driver</Button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={!!selected} onClose={() => setSelected(null)} title="Driver Details" size="lg">
        {selected ? (
          <div className="space-y-6">
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-50 text-2xl font-bold text-green-700 dark:bg-green-900/30 dark:text-green-400">
                {selected.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">{selected.name}</h3>
                <div className="mt-1 flex justify-center">
                  <StatusBadge status={selected.status} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-xl border border-neutral-200 p-4 text-center dark:border-neutral-700">
                <Star size={18} className="mx-auto text-amber-500" />
                <p className="mt-2 text-xl font-bold text-neutral-900 dark:text-neutral-100">{selected.rating || '--'}</p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">Rating</p>
              </div>
              <div className="rounded-xl border border-neutral-200 p-4 text-center dark:border-neutral-700">
                <Car size={18} className="mx-auto text-navy-900 dark:text-navy-300" />
                <p className="mt-2 text-sm font-bold text-neutral-900 dark:text-neutral-100">{selected.vehicle}</p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">Vehicle</p>
              </div>
              <div className="rounded-xl border border-neutral-200 p-4 text-center dark:border-neutral-700">
                <CalendarClock size={18} className="mx-auto text-green-600" />
                <p className="mt-2 text-lg font-bold text-neutral-900 dark:text-neutral-100">{selected.trips}</p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">Trips</p>
              </div>
            </div>

            <div className="rounded-xl border border-neutral-200 p-4 dark:border-neutral-700">
              <p className="mb-2 text-sm font-semibold text-neutral-800 dark:text-neutral-200">Contact</p>
              <div className="space-y-2 text-sm">
                <p className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
                  <Phone size={14} /> {selected.phone}
                </p>
                <p className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
                  <CalendarClock size={14} /> Joined {formatDate(selected.joinDate)}
                </p>
              </div>
            </div>

            {selected.vehicle === 'Unassigned' && availableVehicles.length > 0 && (
              <div className="flex justify-end">
                <Button leftIcon={KeyRound} onClick={() => setAssigning({ driver: selected, open: true, vehicleId: '' })}>
                  Assign Vehicle
                </Button>
              </div>
            )}
          </div>
        ) : (
          <TableSkeleton rows={3} columns={2} />
        )}
      </Modal>

      <Modal
        isOpen={assigning.open}
        onClose={() => setAssigning({ driver: null, open: false })}
        title="Assign Vehicle"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Assign a vehicle to <span className="font-semibold text-neutral-900 dark:text-neutral-100">{assigning.driver?.name}</span>.
          </p>
          <Select
            label="Vehicle"
            required
            options={availableVehicles.map((v) => ({ value: v.id, label: `${v.plateNumber} - ${v.make} ${v.model}` }))}
            value={assigning.vehicleId}
            onChange={(e) => setAssigning((prev) => ({ ...prev, vehicleId: e.target.value }))}
          />
          {formError && <p className="text-sm text-red-500">{formError}</p>}
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={() => setAssigning({ driver: null, open: false })}>Cancel</Button>
            <Button loading={submitting} leftIcon={KeyRound} onClick={handleAssignVehicle}>Assign</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}