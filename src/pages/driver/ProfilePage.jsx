import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Mail,
  Phone,
  MapPin,
  IdCard,
  CalendarClock,
  Car,
  Star,
  Pencil,
  Save,
  X,
  CheckCircle2,
  BadgeCheck,
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import StatusBadge from '../../components/common/StatusBadge';
import ErrorState from '../../components/common/ErrorState';
import { CardSkeleton, TextSkeleton } from '../../components/common/LoadingSkeleton';
import { userService } from '../../services/api';
import { formatCurrency, formatDate } from '../../utils/helpers';

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
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
        setProfile(res.data);
        setVehicle(res.data.vehicle);
        setForm({
          name: res.data.name,
          email: res.data.email,
          phone: res.data.phone,
          address: 'KG 18 Ave, Kigali',
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
      const res = await userService.updateProfile(profile.id, form);
      setProfile((prev) => ({ ...prev, ...res.data }));
      setEditing(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (error) {
    return <ErrorState message="Failed to load profile" description={error} />;
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">My Profile</h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Manage your personal information and license details.
          </p>
        </div>
        <div className="flex gap-2">
          {saved && (
            <span className="flex items-center gap-1 text-sm font-medium text-green-600 dark:text-green-400">
              <CheckCircle2 size={16} /> Saved
            </span>
          )}
          {editing ? (
            <>
              <Button variant="outline" size="sm" leftIcon={X} onClick={() => setEditing(false)}>Cancel</Button>
              <Button size="sm" leftIcon={Save} loading={saving} onClick={handleSave}>Save Changes</Button>
            </>
          ) : (
            !loading && (
              <Button size="sm" leftIcon={Pencil} onClick={() => setEditing(true)}>Edit Profile</Button>
            )
          )}
        </div>
      </motion.div>

      {loading ? (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <CardSkeleton />
          <div className="lg:col-span-2">
            <CardSkeleton />
          </div>
        </div>
      ) : (
        profile && (
          <>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="overflow-hidden rounded-2xl bg-navy-900 p-6 text-white md:p-8"
            >
              <div className="flex flex-col items-center gap-6 md:flex-row">
                <div className="relative">
                  <div className="flex h-24 w-24 items-center justify-center rounded-full bg-green-600 text-3xl font-bold text-white">
                    {profile.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                  </div>
                  <span className="absolute bottom-0 right-0 flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 text-white ring-2 ring-navy-900">
                    <BadgeCheck size={14} />
                  </span>
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h2 className="text-2xl font-bold">{profile.name}</h2>
                  <p className="text-navy-300">{profile.email}</p>
                  <div className="mt-2 flex flex-col items-center gap-2 md:flex-row md:justify-start">
                    <StatusBadge status={profile.status} />
                    <div className="flex items-center gap-1 text-sm text-amber-300">
                      <Star size={16} fill="currentColor" />
                      <span className="font-semibold">{profile.rating}</span>
                      <span className="text-navy-300">({profile.totalTrips} trips)</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-center rounded-xl bg-white/10 px-6 py-4 text-center">
                  <p className="text-xs uppercase tracking-wider text-navy-300">Role</p>
                  <p className="mt-1 font-semibold">Driver</p>
                </div>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div className="space-y-6">
                <Card
                  header={
                    <div className="flex items-center gap-2">
                      <User size={18} className="text-navy-900 dark:text-navy-300" />
                      <span className="font-semibold text-neutral-900 dark:text-neutral-100">Personal Information</span>
                    </div>
                  }
                >
                  {editing ? (
                    <div className="space-y-4">
                      <Input label="Full name" value={form.name} onChange={handleChange('name')} icon={User} />
                      <Input label="Email" type="email" value={form.email} onChange={handleChange('email')} icon={Mail} />
                      <Input label="Phone" value={form.phone} onChange={handleChange('phone')} icon={Phone} />
                      <Input label="Address" value={form.address} onChange={handleChange('address')} icon={MapPin} />
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <ProfileRow icon={User} label="Full name" value={profile.name} />
                      <ProfileRow icon={Mail} label="Email" value={profile.email} />
                      <ProfileRow icon={Phone} label="Phone" value={profile.phone} />
                      <ProfileRow icon={MapPin} label="District" value={profile.district} />
                      <ProfileRow icon={IdCard} label="Role" value={profile.role.replace(/_/g, ' ')} />
                    </div>
                  )}
                </Card>

                <Card
                  header={
                    <div className="flex items-center gap-2">
                      <Star size={18} className="text-amber-500" />
                      <span className="font-semibold text-neutral-900 dark:text-neutral-100">Performance</span>
                    </div>
                  }
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-xl bg-neutral-50 p-4 text-center dark:bg-neutral-800">
                      <p className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">{profile.rating}</p>
                      <div className="mt-1 flex items-center justify-center gap-0.5 text-amber-500">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <Star key={i} size={12} fill={i <= Math.round(profile.rating) ? 'currentColor' : 'none'} />
                        ))}
                      </div>
                      <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">Average rating</p>
                    </div>
                    <div className="rounded-xl bg-neutral-50 p-4 text-center dark:bg-neutral-800">
                      <p className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">{profile.totalTrips}</p>
                      <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">Total trips</p>
                    </div>
                  </div>
                </Card>
              </div>

              <div className="space-y-6 lg:col-span-2">
                <Card
                  header={
                    <div className="flex items-center gap-2">
                      <IdCard size={18} className="text-green-600" />
                      <span className="font-semibold text-neutral-900 dark:text-neutral-100">Driver's License</span>
                    </div>
                  }
                >
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="rounded-xl border border-neutral-200 p-4 dark:border-neutral-700">
                      <p className="flex items-center gap-1 text-xs uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                        <IdCard size={12} /> License number
                      </p>
                      <p className="mt-1 font-semibold text-neutral-900 dark:text-neutral-100">{profile.licenseNumber}</p>
                    </div>
                    <div className="rounded-xl border border-neutral-200 p-4 dark:border-neutral-700">
                      <p className="flex items-center gap-1 text-xs uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                        <CalendarClock size={12} /> Expires
                      </p>
                      <p className="mt-1 font-semibold text-neutral-900 dark:text-neutral-100">{formatDate(profile.licenseExpiry)}</p>
                    </div>
                  </div>
                  <div className="mt-4 rounded-xl bg-green-50 p-4 text-sm text-green-700 dark:bg-green-900/20 dark:text-green-400">
                    <p className="flex items-center gap-2">
                      <CheckCircle2 size={16} />
                      License is valid and verified.
                    </p>
                  </div>
                </Card>

                <Card
                  header={
                    <div className="flex items-center gap-2">
                      <Car size={18} className="text-navy-900 dark:text-navy-300" />
                      <span className="font-semibold text-neutral-900 dark:text-neutral-100">Assigned Vehicle</span>
                    </div>
                  }
                >
                  {vehicle ? (
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div className="flex items-center gap-4">
                        <div className="rounded-xl bg-navy-50 p-4 dark:bg-navy-900/40">
                          <Car size={28} className="text-navy-900 dark:text-navy-300" />
                        </div>
                        <div>
                          <p className="font-semibold text-lg text-neutral-900 dark:text-neutral-100">{vehicle.make} {vehicle.model}</p>
                          <p className="text-sm text-neutral-500 dark:text-neutral-400">
                            Plate: <span className="font-medium tracking-wider text-neutral-700 dark:text-neutral-300">{vehicle.plateNumber}</span> &middot; {vehicle.year}
                          </p>
                          <div className="mt-2">
                            <StatusBadge status={vehicle.status} />
                          </div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">View Vehicle Details</Button>
                    </div>
                  ) : (
                    <TextSkeleton lines={3} />
                  )}
                </Card>

                <Card
                  header={
                    <div className="flex items-center gap-2">
                      <CalendarClock size={18} className="text-green-600" />
                      <span className="font-semibold text-neutral-900 dark:text-neutral-100">Account</span>
                    </div>
                  }
                >
                  <div className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
                    <div className="flex justify-between">
                      <span className="text-neutral-500 dark:text-neutral-400">Member since</span>
                      <span className="font-medium text-neutral-800 dark:text-neutral-200">{formatDate(profile.joinDate)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500 dark:text-neutral-400">Cooperative</span>
                      <span className="font-medium text-neutral-800 dark:text-neutral-200">Kigali Transport Cooperative</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500 dark:text-neutral-400">Lifetime earnings</span>
                      <span className="font-medium text-green-600 dark:text-green-400">{formatCurrency(profile?.earnings?.total || 0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500 dark:text-neutral-400">Account status</span>
                      <StatusBadge status={profile.status} />
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </>
        )
      )}
    </div>
  );
}

function ProfileRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <div className="rounded-lg bg-neutral-100 p-2 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400">
        <Icon size={16} />
      </div>
      <div>
        <p className="text-xs text-neutral-500 dark:text-neutral-400">{label}</p>
        <p className="text-sm font-medium capitalize text-neutral-800 dark:text-neutral-200">{value}</p>
      </div>
    </div>
  );
}