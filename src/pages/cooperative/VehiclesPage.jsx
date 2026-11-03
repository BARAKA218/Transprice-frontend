import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Car,
  Plus,
  Pencil,
  Save,
  X,
  ShieldCheck,
  AlertTriangle,
  Hash,
  Wrench,
  CalendarClock,
  ChevronRight,
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
import { vehicleService } from '../../services/api';
import { TRANSPORT_TYPES, mockVehicles } from '../../data/mockData';
import { formatDate } from '../../utils/helpers';

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [selected, setSelected] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const [form, setForm] = useState({
    plateNumber: '',
    make: '',
    model: '',
    year: '',
    type: '',
    status: 'ACTIVE',
  });

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        setLoading(true);
        const res = await vehicleService.getVehicles();
        if (!mounted) return;
        setVehicles(res.data);
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

  const filteredVehicles = statusFilter ? vehicles.filter((v) => v.status === statusFilter) : vehicles;

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const openEdit = (vehicle) => {
    setEditingVehicle(vehicle);
    setForm({
      plateNumber: vehicle.plateNumber,
      make: vehicle.make,
      model: vehicle.model,
      year: vehicle.year,
      type: vehicle.type,
      status: vehicle.status,
    });
    setSelected(null);
  };

  const handleSaveEdit = async () => {
    setSaving(true);
    setFormError('');
    try {
      await vehicleService.updateVehicle(editingVehicle.id, form);
      setVehicles((prev) => prev.map((v) => (v.id === editingVehicle.id ? { ...v, ...form } : v)));
      setEditingVehicle(null);
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleAddVehicle = async (e) => {
    e.preventDefault();
    if (!form.plateNumber || !form.make || !form.model || !form.type) {
      setFormError('Please fill in all required fields.');
      return;
    }
    setSubmitting(true);
    setFormError('');
    try {
      const res = await vehicleService.createVehicle(form);
      setVehicles((prev) => [...prev, res.data]);
      setShowAdd(false);
      setForm({ plateNumber: '', make: '', model: '', year: '', type: '', status: 'ACTIVE' });
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (error) {
    return <ErrorState message="Failed to load vehicles" description={error} />;
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Vehicles</h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Manage the cooperative's vehicle fleet.
          </p>
        </div>
        <Button leftIcon={Plus} onClick={() => setShowAdd(true)}>
          Add Vehicle
        </Button>
      </motion.div>

      <Card className="p-4">
        <Select
          label="Filter by status"
          placeholder="All statuses"
          options={['ACTIVE', 'INACTIVE']}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          containerClassName="max-w-xs"
        />
      </Card>

      {loading ? (
        <TableSkeleton rows={6} columns={7} />
      ) : filteredVehicles.length === 0 ? (
        <EmptyState title="No vehicles found" description="Add your first vehicle to get started." />
      ) : (
        <Card className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-neutral-200 text-left dark:border-neutral-700">
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Vehicle</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Type</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Driver</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Insurance</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Registration</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Status</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400"></th>
                </tr>
              </thead>
              <tbody>
                {filteredVehicles.map((vehicle) => {
                  const insuranceExpired = vehicle.insuranceExpiry && new Date(vehicle.insuranceExpiry) < new Date();
                  return (
                    <tr key={vehicle.id} className="border-b border-neutral-100 transition-colors hover:bg-neutral-50 dark:border-neutral-800 dark:hover:bg-neutral-800/50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="rounded-lg bg-navy-50 p-2 text-navy-900 dark:bg-navy-900/40 dark:text-navy-300">
                            <Car size={16} />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">{vehicle.plateNumber}</p>
                            <p className="text-xs text-neutral-500 dark:text-neutral-400">{vehicle.make} {vehicle.model} &middot; {vehicle.year}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm capitalize text-neutral-700 dark:text-neutral-300">{vehicle.type}</td>
                      <td className="px-4 py-3 text-sm text-neutral-700 dark:text-neutral-300">{vehicle.driverName}</td>
                      <td className="px-4 py-3">
                        <span className={`flex items-center gap-1 text-sm ${insuranceExpired ? 'text-red-500' : 'text-green-600 dark:text-green-400'}`}>
                          {insuranceExpired ? <AlertTriangle size={14} /> : <ShieldCheck size={14} />}
                          {formatDate(vehicle.insuranceExpiry)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={vehicle.registrationStatus} />
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={vehicle.status} />
                      </td>
                      <td className="px-4 py-3">
                        <button onClick={() => setSelected(vehicle)} className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 dark:hover:bg-neutral-800">
                          <ChevronRight size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <Modal isOpen={showAdd} onClose={() => setShowAdd(false)} title="Add Vehicle" size="md">
        <form onSubmit={handleAddVehicle} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input label="Plate number" required icon={Hash} value={form.plateNumber} onChange={handleChange('plateNumber')} placeholder="RAB 000A" />
            <Input label="Make" required icon={Wrench} value={form.make} onChange={handleChange('make')} placeholder="Toyota" />
            <Input label="Model" required icon={Car} value={form.model} onChange={handleChange('model')} placeholder="Hiace" />
            <Input label="Year" type="number" icon={CalendarClock} value={form.year} onChange={handleChange('year')} placeholder="2024" />
          </div>
          <Select
            label="Vehicle type"
            required
            options={TRANSPORT_TYPES}
            value={form.type}
            onChange={handleChange('type')}
          />
          {formError && <p className="text-sm text-red-500">{formError}</p>}
          <div className="rounded-lg bg-neutral-50 p-3 text-sm text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400">
            New vehicles require insurance and registration verification before they can operate.
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={() => setShowAdd(false)}>Cancel</Button>
            <Button type="submit" loading={submitting} leftIcon={Plus}>Add Vehicle</Button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={!!selected} onClose={() => setSelected(null)} title="Vehicle Details" size="lg">
        {selected ? (
          <div className="space-y-5">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-navy-50 p-3 dark:bg-navy-900/40">
                  <Car size={24} className="text-navy-900 dark:text-navy-300" />
                </div>
                <div>
                  <p className="text-lg font-semibold tracking-widest text-neutral-900 dark:text-neutral-100">{selected.plateNumber}</p>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">{selected.make} {selected.model} &middot; {selected.year}</p>
                </div>
              </div>
              <StatusBadge status={selected.status} />
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <InfoBox label="Type" value={selected.type} color="text-navy-900 dark:text-navy-300" />
              <InfoBox label="Driver" value={selected.driverName} color="text-neutral-800 dark:text-neutral-200" />
              <InfoBox label="Insurance" value={formatDate(selected.insuranceExpiry)} color={formatInsuranceColor(selected.insuranceExpiry)} />
              <InfoBox label="Inspection" value={formatDate(selected.lastInspection)} color="text-neutral-800 dark:text-neutral-200" />
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-neutral-200 p-4 dark:border-neutral-700">
                <p className="text-xs uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Registration</p>
                <div className="mt-2">
                  <StatusBadge status={selected.registrationStatus} />
                </div>
              </div>
              <div className="rounded-xl border border-neutral-200 p-4 dark:border-neutral-700">
                <p className="text-xs uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Insurance status</p>
                <p className={`mt-2 text-sm font-medium ${new Date(selected.insuranceExpiry) < new Date() ? 'text-red-500' : 'text-green-600 dark:text-green-400'}`}>
                  {new Date(selected.insuranceExpiry) < new Date() ? 'Expired' : 'Valid'}
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-neutral-200 pt-4 dark:border-neutral-700">
              <Button variant="outline" leftIcon={X} onClick={() => setSelected(null)}>Close</Button>
              <Button leftIcon={Pencil} onClick={() => openEdit(selected)}>Edit Vehicle</Button>
            </div>
          </div>
        ) : (
          <TableSkeleton rows={3} columns={3} />
        )}
      </Modal>

      <Modal isOpen={!!editingVehicle} onClose={() => setEditingVehicle(null)} title="Edit Vehicle" size="md">
        {editingVehicle && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input label="Plate number" required icon={Hash} value={form.plateNumber} onChange={handleChange('plateNumber')} />
              <Input label="Make" required icon={Wrench} value={form.make} onChange={handleChange('make')} />
              <Input label="Model" required icon={Car} value={form.model} onChange={handleChange('model')} />
              <Input label="Year" type="number" icon={CalendarClock} value={form.year} onChange={handleChange('year')} />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Select
                label="Vehicle type"
                options={TRANSPORT_TYPES}
                value={form.type}
                onChange={handleChange('type')}
              />
              <Select
                label="Status"
                options={['ACTIVE', 'INACTIVE']}
                value={form.status}
                onChange={handleChange('status')}
              />
            </div>
            {formError && <p className="text-sm text-red-500">{formError}</p>}
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="ghost" onClick={() => setEditingVehicle(null)}>Cancel</Button>
              <Button loading={saving} leftIcon={Save} onClick={handleSaveEdit}>Save Changes</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

function formatInsuranceColor(date) {
  return new Date(date) < new Date() ? 'text-red-500' : 'text-green-600 dark:text-green-400';
}

function InfoBox({ label, value, color }) {
  return (
    <div className="rounded-xl border border-neutral-200 p-3 text-center dark:border-neutral-700">
      <p className="text-xs uppercase tracking-wider text-neutral-500 dark:text-neutral-400">{label}</p>
      <p className={`mt-1 truncate text-sm font-semibold capitalize ${color}`}>{value}</p>
    </div>
  );
}