import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Car,
  Shield,
  FileText,
  CalendarClock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Pencil,
  Save,
  X,
  RefreshCw,
  BadgeCheck,
  Wrench,
  Palette,
  Hash,
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import StatusBadge from '../../components/common/StatusBadge';
import ErrorState from '../../components/common/ErrorState';
import { CardSkeleton, TextSkeleton } from '../../components/common/LoadingSkeleton';
import { userService, vehicleService } from '../../services/api';
import { TRANSPORT_TYPES } from '../../data/mockData';
import { formatDate, formatCurrency } from '../../utils/helpers';

const documentStatusStyle = (status) => {
  if (status === 'VERIFIED') return 'text-green-600 dark:text-green-400';
  if (status === 'EXPIRED' || status === 'REJECTED') return 'text-red-500 dark:text-red-400';
  return 'text-amber-600 dark:text-amber-400';
};

export default function VehiclePage() {
  const [driver, setDriver] = useState(null);
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({});

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        setLoading(true);
        const res = await userService.getCurrentDriver();
        if (!mounted) return;
        setDriver(res.data);
        setVehicle(res.data.vehicle);
        setForm({
          make: res.data.vehicle.make,
          model: res.data.vehicle.model,
          year: res.data.vehicle.year,
          plateNumber: res.data.vehicle.plateNumber,
          type: res.data.vehicle.type,
        });
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

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await vehicleService.updateVehicle(vehicle.id, form);
      setVehicle((prev) => ({ ...prev, ...res.data }));
      setEditing(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const isInsuranceExpiringSoon = vehicle && vehicle.insuranceExpiry &&
    new Date(vehicle.insuranceExpiry) - new Date() < 1000 * 60 * 60 * 24 * 60;

  const isInsuranceExpired = vehicle && vehicle.insuranceExpiry &&
    new Date(vehicle.insuranceExpiry) < new Date();

  const documents = vehicle ? [
    {
      name: 'Insurance certificate',
      status: isInsuranceExpired ? 'EXPIRED' : isInsuranceExpiringSoon ? 'EXPIRING SOON' : 'VERIFIED',
      issueDate: vehicle.lastInspection,
      expiry: vehicle.insuranceExpiry,
      verified: !isInsuranceExpired,
    },
    {
      name: 'Vehicle registration',
      status: vehicle.registrationStatus === 'VERIFIED' ? 'VERIFIED' : 'UNVERIFIED',
      issueDate: vehicle.lastInspection,
      expiry: 'Renewable',
      verified: vehicle.registrationStatus === 'VERIFIED',
    },
    {
      name: 'Roadworthiness inspection',
      status: 'VALID',
      issueDate: vehicle.lastInspection,
      expiry: '2026-03-15',
      verified: true,
    },
  ] : [];

  if (error) {
    return <ErrorState message="Failed to load vehicle" description={error} />;
  }

  const summaryItems = [
    { icon: Wrench, label: 'Make', value: vehicle?.make, color: 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
    { icon: Car, label: 'Model', value: vehicle?.model, color: 'bg-navy-50 text-navy-900 dark:bg-navy-900/30 dark:text-navy-300' },
    { icon: Hash, label: 'Year', value: vehicle?.year, color: 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
    { icon: Shield, label: 'Type', value: vehicle?.type ? vehicle.type.charAt(0).toUpperCase() + vehicle.type.slice(1) : '--', color: 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
  ];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">My Vehicle</h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Manage your vehicle information and documents.
          </p>
        </div>
        {!loading && vehicle && (
          <div className="flex gap-2">
            {saved && (
              <span className="flex items-center gap-1 text-sm font-medium text-green-600 dark:text-green-400">
                <CheckCircle2 size={16} /> Saved
              </span>
            )}
            {editing ? (
              <>
                <Button variant="outline" size="sm" leftIcon={X} onClick={() => { setEditing(false); setForm({ make: vehicle.make, model: vehicle.model, year: vehicle.year, plateNumber: vehicle.plateNumber, type: vehicle.type }); }}>
                  Cancel
                </Button>
                <Button size="sm" leftIcon={Save} loading={saving} onClick={handleSave}>
                  Save Changes
                </Button>
              </>
            ) : (
              <Button size="sm" leftIcon={Pencil} onClick={() => setEditing(true)}>
                Edit Vehicle
              </Button>
            )}
          </div>
        )}
      </motion.div>

      {loading ? (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <CardSkeleton />
          </div>
          <CardSkeleton />
        </div>
      ) : (
        vehicle && (
          <>
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="overflow-hidden rounded-2xl bg-navy-900 p-6 text-white md:p-8">
              <div className="flex flex-col items-center gap-6 md:flex-row">
                <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-white/10">
                  <Car size={44} className="text-white" />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <div className="flex flex-col items-center gap-2 md:flex-row">
                    <p className="text-2xl font-bold tracking-widest">{vehicle.plateNumber}</p>
                    <StatusBadge status={vehicle.registrationStatus} />
                  </div>
                  <p className="mt-1 text-navy-200">{vehicle.make} {vehicle.model} &middot; {vehicle.year}</p>
                  <p className="text-sm text-navy-300">Assigned to {vehicle.driverName || driver?.name}</p>
                </div>
                <div className="flex flex-col items-center rounded-xl bg-white/10 px-6 py-4">
                  <p className="text-xs uppercase tracking-wider text-navy-300">Status</p>
                  <StatusBadge status={vehicle.status} />
                </div>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2 space-y-6">
                <Card
                  header={
                    <div className="flex items-center gap-2">
                      <Wrench size={18} className="text-navy-900 dark:text-navy-300" />
                      <span className="font-semibold text-neutral-900 dark:text-neutral-100">Vehicle Information</span>
                    </div>
                  }
                >
                  {editing ? (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <Input label="Make" value={form.make} onChange={handleChange('make')} icon={Wrench} />
                      <Input label="Model" value={form.model} onChange={handleChange('model')} icon={Car} />
                      <Input label="Year" type="number" value={form.year} onChange={handleChange('year')} icon={CalendarClock} />
                      <Input label="Plate Number" value={form.plateNumber} onChange={handleChange('plateNumber')} icon={Hash} />
                      <div className="sm:col-span-2">
                        <Select
                          label="Vehicle Type"
                          options={TRANSPORT_TYPES}
                          value={form.type}
                          onChange={handleChange('type')}
                        />
                      </div>
                      <div className="rounded-lg bg-neutral-50 p-3 text-sm text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400 sm:col-span-2">
                        <p className="flex items-center gap-1.5 font-medium text-amber-600 dark:text-amber-400">
                          <AlertTriangle size={14} /> Note
                        </p>
                        Changing vehicle type may affect applicable fares. This change requires authority verification.
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                      {summaryItems.map((item) => (
                        <div key={item.label} className="flex flex-col items-center rounded-xl border border-neutral-100 p-4 text-center dark:border-neutral-800">
                          <div className={`rounded-lg p-2 ${item.color}`}>
                            <item.icon size={18} />
                          </div>
                          <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-400">{item.label}</p>
                          <p className="mt-0.5 text-sm font-semibold text-neutral-900 dark:text-neutral-100">{item.value || '--'}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>

                <Card
                  header={
                    <div className="flex items-center gap-2">
                      <FileText size={18} className="text-green-600" />
                      <span className="font-semibold text-neutral-900 dark:text-neutral-100">Documents</span>
                    </div>
                  }
                >
                  <div className="space-y-3">
                    {documents.map((doc) => (
                      <div key={doc.name} className="flex items-center justify-between gap-4 rounded-xl border border-neutral-200 p-4 dark:border-neutral-700">
                        <div className="flex items-center gap-3">
                          {doc.verified ? (
                            <CheckCircle2 size={22} className="text-green-500" />
                          ) : (
                            <AlertTriangle size={22} className="text-red-500" />
                          )}
                          <div>
                            <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">{doc.name}</p>
                            <p className="text-xs text-neutral-500 dark:text-neutral-400">
                              Last verified {formatDate(doc.issueDate)} &middot; Expires {formatDate(doc.expiry === 'Renewable' ? null : doc.expiry) === 'N/A' ? doc.expiry : formatDate(doc.expiry === 'Renewable' ? null : doc.expiry)}
                            </p>
                          </div>
                        </div>
                        <span className={`text-sm font-medium ${documentStatusStyle(doc.status)}`}>
                          {doc.status === 'EXPIRED' || doc.status === 'EXPIRING SOON' ? 'Expired' : doc.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>

              <div className="space-y-6">
                <Card
                  header={
                    <div className="flex items-center gap-2">
                      <Shield size={18} className="text-green-600" />
                      <span className="font-semibold text-neutral-900 dark:text-neutral-100">Insurance</span>
                    </div>
                  }
                >
                  {vehicle ? (
                    <div className={`rounded-xl p-4 ${isInsuranceExpired ? 'bg-red-50 dark:bg-red-900/20' : isInsuranceExpiringSoon ? 'bg-amber-50 dark:bg-amber-900/20' : 'bg-green-50 dark:bg-green-900/20'}`}>
                      <div className="flex items-center gap-2">
                        {isInsuranceExpired ? <XCircle className="text-red-500" size={20} /> : <Shield className={isInsuranceExpiringSoon ? 'text-amber-500' : 'text-green-600'} size={20} />}
                        <p className="font-semibold text-neutral-900 dark:text-neutral-100">
                          {isInsuranceExpired ? 'Insurance expired' : isInsuranceExpiringSoon ? 'Expiring soon' : 'Insurance active'}
                        </p>
                      </div>
                      <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
                        Expires on <span className="font-medium">{formatDate(vehicle.insuranceExpiry)}</span>
                      </p>
                      <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                        {isInsuranceExpired
                          ? 'Renew your insurance policy to continue operating.' 
                          : isInsuranceExpiringSoon
                            ? 'Renew within the next 60 days to avoid service interruption.'
                            : 'Fully covered under your current policy.'}
                      </p>
                      {!isInsuranceExpired && (
                        <div className="mt-4 flex items-center justify-between border-t border-neutral-200 pt-3 text-sm dark:border-neutral-700">
                          <span className="text-neutral-500 dark:text-neutral-400">Policy status</span>
                          <span className="font-medium text-green-600 dark:text-green-400">Valid</span>
                        </div>
                      )}
                      {isInsuranceExpired && (
                        <Button variant="primary" size="sm" className="mt-3 w-full bg-green-600 hover:bg-green-500 dark:bg-green-600 dark:hover:bg-green-500" leftIcon={RefreshCw}>
                          Renew Insurance
                        </Button>
                      )}
                    </div>
                  ) : (
                    <TextSkeleton lines={3} />
                  )}
                </Card>

                <Card
                  header={
                    <div className="flex items-center gap-2">
                      <BadgeCheck size={18} className="text-navy-900 dark:text-navy-300" />
                      <span className="font-semibold text-neutral-900 dark:text-neutral-100">Registration</span>
                    </div>
                  }
                >
                  {vehicle ? (
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-neutral-500 dark:text-neutral-400">Registration no.</span>
                        <span className="font-medium text-neutral-800 dark:text-neutral-200">{vehicle.plateNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-500 dark:text-neutral-400">Status</span>
                        <StatusBadge status={vehicle.registrationStatus} />
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-500 dark:text-neutral-400">Last inspection</span>
                        <span className="font-medium text-neutral-800 dark:text-neutral-200">{formatDate(vehicle.lastInspection)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-500 dark:text-neutral-400">Owning cooperative</span>
                        <span className="font-medium text-neutral-800 dark:text-neutral-200">{vehicle.cooperativeId === 'coop1' ? 'Kigali Transport Cooperative' : '--'}</span>
                      </div>
                    </div>
                  ) : (
                    <TextSkeleton lines={4} />
                  )}
                </Card>
              </div>
            </div>
          </>
        )
      )}
    </div>
  );
}