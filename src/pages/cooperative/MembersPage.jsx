import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  UserPlus,
  Search,
  ChevronRight,
  Mail,
  Phone,
  CalendarClock,
  Car,
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Modal from '../../components/common/Modal';
import SearchBar from '../../components/common/SearchBar';
import FilterBar from '../../components/common/FilterBar';
import Pagination from '../../components/common/Pagination';
import StatusBadge from '../../components/common/StatusBadge';
import EmptyState from '../../components/common/EmptyState';
import ErrorState from '../../components/common/ErrorState';
import { TableSkeleton, TextSkeleton } from '../../components/common/LoadingSkeleton';
import { memberService } from '../../services/api';
import { formatDate } from '../../utils/helpers';

const PER_PAGE = 8;

export default function MembersPage() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    status: 'ACTIVE',
  });

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        setLoading(true);
        const res = await memberService.getMembers();
        if (!mounted) return;
        setMembers(res.data);
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

  const filteredMembers = members.filter((m) => {
    const q = search.toLowerCase();
    if (q && !m.name.toLowerCase().includes(q) && !m.email.toLowerCase().includes(q)) return false;
    if (roleFilter && m.role.toLowerCase() !== roleFilter.toLowerCase()) return false;
    if (statusFilter && m.status !== statusFilter) return false;
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filteredMembers.length / PER_PAGE));
  const pagedMembers = filteredMembers.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone || !form.role) {
      setFormError('Please fill in all required fields.');
      return;
    }
    setSubmitting(true);
    setFormError('');
    try {
      const res = await memberService.createMember(form);
      setMembers((prev) => [...prev, res.data]);
      setShowAdd(false);
      setForm({ name: '', email: '', phone: '', role: '', status: 'ACTIVE' });
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (error) {
    return <ErrorState message="Failed to load members" description={error} />;
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Members</h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Manage the cooperative's membership.
          </p>
        </div>
        <Button leftIcon={UserPlus} onClick={() => setShowAdd(true)}>
          Add Member
        </Button>
      </motion.div>

      <div className="flex flex-col gap-4">
        <SearchBar
          placeholder="Search members by name or email..."
          onChange={(val) => {
            setSearch(val);
            setPage(1);
          }}
        />
        <FilterBar
          filters={[
            { name: 'role', label: 'Role', value: roleFilter, options: ['Admin', 'Driver'] },
            { name: 'status', label: 'Status', value: statusFilter, options: ['ACTIVE', 'INACTIVE', 'PENDING_VERIFICATION'] },
          ]}
          onChange={(name, value) => {
            if (name === 'role') setRoleFilter(value);
            if (name === 'status') setStatusFilter(value);
            setPage(1);
          }}
          onClear={() => {
            setRoleFilter('');
            setStatusFilter('');
            setPage(1);
          }}
        />
      </div>

      {loading ? (
        <TableSkeleton rows={8} columns={6} />
      ) : filteredMembers.length === 0 ? (
        <EmptyState title="No members found" description="Try adjusting your search or filters, or add a new member." />
      ) : (
        <Card className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-neutral-200 text-left dark:border-neutral-700">
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Member</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Role</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Join Date</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Status</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Trips</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400"></th>
                </tr>
              </thead>
              <tbody>
                {pagedMembers.map((member) => (
                  <tr key={member.id} className="border-b border-neutral-100 transition-colors hover:bg-neutral-50 dark:border-neutral-800 dark:hover:bg-neutral-800/50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-navy-50 text-sm font-semibold text-navy-900 dark:bg-navy-900/40 dark:text-navy-300">
                          {member.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">{member.name}</p>
                          <p className="text-xs text-neutral-500 dark:text-neutral-400">{member.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-neutral-700 dark:text-neutral-300">{member.role}</td>
                    <td className="px-4 py-3 text-sm text-neutral-700 dark:text-neutral-300">{formatDate(member.joinDate)}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={member.status} />
                    </td>
                    <td className="px-4 py-3 text-sm text-neutral-700 dark:text-neutral-300">{member.trips}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => setSelected(member)} className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 dark:hover:bg-neutral-800">
                        <ChevronRight size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="border-t border-neutral-200 px-4 py-3 dark:border-neutral-700">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              totalItems={filteredMembers.length}
              perPage={PER_PAGE}
              onPageChange={setPage}
            />
          </div>
        </Card>
      )}

      <Modal isOpen={showAdd} onClose={() => setShowAdd(false)} title="Add Member" size="md">
        <form onSubmit={handleAddMember} className="space-y-4">
          <Input label="Full name" required icon={Users} value={form.name} onChange={handleChange('name')} />
          <Input label="Email" type="email" required icon={Mail} value={form.email} onChange={handleChange('email')} />
          <Input label="Phone" required icon={Phone} value={form.phone} onChange={handleChange('phone')} />
          <Select
            label="Role"
            required
            options={[{ value: 'Driver', label: 'Driver' }, { value: 'Admin', label: 'Admin' }]}
            value={form.role}
            onChange={handleChange('role')}
          />
          {formError && <p className="text-sm text-red-500">{formError}</p>}
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={() => setShowAdd(false)}>Cancel</Button>
            <Button type="submit" loading={submitting} leftIcon={UserPlus}>Add Member</Button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={!!selected} onClose={() => setSelected(null)} title="Member Details" size="lg">
        {selected ? (
          <div className="space-y-6">
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-navy-50 text-2xl font-bold text-navy-900 dark:bg-navy-900/40 dark:text-navy-300">
                {selected.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">{selected.name}</h3>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">{selected.email}</p>
                <div className="mt-2 flex justify-center">
                  <StatusBadge status={selected.status} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex items-center gap-3 rounded-xl border border-neutral-200 p-4 dark:border-neutral-700">
                <Mail size={18} className="text-neutral-400" />
                <div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">Email</p>
                  <p className="text-sm text-neutral-800 dark:text-neutral-200">{selected.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-xl border border-neutral-200 p-4 dark:border-neutral-700">
                <Phone size={18} className="text-neutral-400" />
                <div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">Phone</p>
                  <p className="text-sm text-neutral-800 dark:text-neutral-200">{selected.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-xl border border-neutral-200 p-4 dark:border-neutral-700">
                <CalendarClock size={18} className="text-neutral-400" />
                <div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">Join date</p>
                  <p className="text-sm text-neutral-800 dark:text-neutral-200">{formatDate(selected.joinDate)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-xl border border-neutral-200 p-4 dark:border-neutral-700">
                <Car size={18} className="text-neutral-400" />
                <div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">Trips</p>
                  <p className="text-sm text-neutral-800 dark:text-neutral-200">{selected.trips} recorded</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <TextSkeleton lines={5} />
        )}
      </Modal>
    </div>
  );
}