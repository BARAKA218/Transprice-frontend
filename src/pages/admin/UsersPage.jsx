import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, MoreVertical, Edit, Eye, Trash2, UserPlus } from 'lucide-react'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import SearchBar from '../../components/common/SearchBar'
import FilterBar from '../../components/common/FilterBar'
import Modal from '../../components/common/Modal'
import Input from '../../components/common/Input'
import Select from '../../components/common/Select'
import Pagination from '../../components/common/Pagination'
import StatusBadge from '../../components/common/StatusBadge'
import LoadingSkeleton from '../../components/common/LoadingSkeleton'
import EmptyState from '../../components/common/EmptyState'
import ErrorState from '../../components/common/ErrorState'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import Breadcrumb from '../../components/common/Breadcrumb'
import { userService } from '../../services/api'
import { ROLES } from '../../types'
import { formatDate, getStatusColor, getStatusLabel } from '../../utils/helpers'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const userSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email'),
  role: z.string().min(1, 'Role is required'),
  phone: z.string().optional(),
  district: z.string().optional(),
  sector: z.string().optional(),
})

const roleOptions = [
  { value: ROLES.SUPER_ADMIN, label: 'Super Admin' },
  { value: ROLES.AUTHORITY, label: 'Authority' },
  { value: ROLES.COOPERATIVE_ADMIN, label: 'Cooperative Admin' },
  { value: ROLES.DRIVER, label: 'Driver' },
  { value: ROLES.PASSENGER, label: 'Passenger' },
]

const statusOptions = [
  { value: 'true', label: 'Active' },
  { value: 'false', label: 'Inactive' },
]

const fadeIn = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }

export default function UsersPage() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState({ role: '', status: '' })
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [showModal, setShowModal] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [deletingUser, setDeletingUser] = useState(null)
  const [showDetail, setShowDetail] = useState(null)
  const pageSize = 10

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(userSchema),
  })

  useEffect(() => {
    loadUsers()
  }, [page, search, filters])

  const loadUsers = async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await userService.getAll({ page, pageSize, search, ...filters })
      setUsers(result.data)
      setTotalPages(Math.ceil(result.total / pageSize))
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (data) => {
    try {
      if (editingUser) {
        await userService.update(editingUser.id, data)
      } else {
        await userService.create(data)
      }
      setShowModal(false)
      setEditingUser(null)
      reset()
      loadUsers()
    } catch (err) {
      console.error(err)
    }
  }

  const handleDelete = async () => {
    if (!deletingUser) return
    try {
      await userService.delete(deletingUser.id)
      setShowDeleteDialog(false)
      setDeletingUser(null)
      loadUsers()
    } catch (err) {
      console.error(err)
    }
  }

  const openEdit = (user) => {
    setEditingUser(user)
    reset({ name: user.name, email: user.email, role: user.role, phone: user.phone || '', district: user.district || '', sector: user.sector || '' })
    setShowModal(true)
  }

  const openCreate = () => {
    setEditingUser(null)
    reset({ name: '', email: '', role: '', phone: '', district: '', sector: '' })
    setShowModal(true)
  }

  const roleBadgeColor = (role) => {
    const colors = {
      SUPER_ADMIN: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
      AUTHORITY: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      COOPERATIVE_ADMIN: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      DRIVER: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
      PASSENGER: 'bg-neutral-100 text-neutral-700 dark:bg-neutral-700 dark:text-neutral-300',
    }
    return colors[role] || colors.PASSENGER
  }

  return (
    <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.05 } } }} className="space-y-6">
      <motion.div variants={fadeIn}>
        <Breadcrumb items={[{ label: 'Admin', href: '/admin' }, { label: 'Users' }]} />
        <div className="mt-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Users</h1>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">Manage platform users and their roles</p>
          </div>
          <Button leftIcon={UserPlus} onClick={openCreate}>Add User</Button>
        </div>
      </motion.div>

      <motion.div variants={fadeIn} className="space-y-4">
        <div className="flex flex-wrap items-end gap-4">
          <SearchBar placeholder="Search users..." value={search} onChange={setSearch} className="w-80" />
          <Select
            placeholder="All Roles"
            options={roleOptions}
            value={filters.role}
            onChange={(e) => { setFilters((f) => ({ ...f, role: e.target.value })); setPage(1) }}
            containerClassName="w-48"
          />
          <Select
            placeholder="All Status"
            options={statusOptions}
            value={filters.status}
            onChange={(e) => { setFilters((f) => ({ ...f, status: e.target.value })); setPage(1) }}
            containerClassName="w-48"
          />
        </div>

        {loading ? (
          <LoadingSkeleton rows={5} columns={6} className="rounded-xl" />
        ) : error ? (
          <ErrorState message="Failed to load users" onRetry={loadUsers} />
        ) : users.length === 0 ? (
          <EmptyState title="No users found" description="Try adjusting your search or filters" actionLabel="Add User" onAction={openCreate} />
        ) : (
          <div className="overflow-x-auto rounded-xl border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-900">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-neutral-200 dark:border-neutral-700">
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Role</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Joined</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Last Active</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-neutral-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-neutral-100 transition-colors hover:bg-neutral-50 dark:border-neutral-800 dark:hover:bg-neutral-800/50">
                    <td className="px-4 py-3">
                      <button onClick={() => setShowDetail(user)} className="font-medium text-neutral-900 hover:underline dark:text-neutral-100">{user.name}</button>
                    </td>
                    <td className="px-4 py-3 text-sm text-neutral-600 dark:text-neutral-400">{user.email}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${roleBadgeColor(user.role)}`}>
                        {user.role.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-3"><StatusBadge status={user.isActive ? 'ACTIVE' : 'INACTIVE'} /></td>
                    <td className="px-4 py-3 text-sm text-neutral-500">{formatDate(user.createdAt)}</td>
                    <td className="px-4 py-3 text-sm text-neutral-500">{formatDate(user.lastLoginAt)}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => setShowDetail(user)} className="rounded p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 dark:hover:bg-neutral-800"><Eye size={16} /></button>
                        <button onClick={() => openEdit(user)} className="rounded p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-blue-600 dark:hover:bg-neutral-800"><Edit size={16} /></button>
                        <button onClick={() => { setDeletingUser(user); setShowDeleteDialog(true) }} className="rounded p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-red-600 dark:hover:bg-neutral-800"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && users.length > 0 && (
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        )}
      </motion.div>

      <Modal isOpen={showModal} onClose={() => { setShowModal(false); setEditingUser(null); reset() }} title={editingUser ? 'Edit User' : 'Add User'} size="md">
        <form onSubmit={handleSubmit(handleSave)} className="space-y-4">
          <Input label="Full Name" {...register('name')} error={errors.name?.message} required />
          <Input label="Email" type="email" {...register('email')} error={errors.email?.message} required />
          <Select label="Role" options={roleOptions} {...register('role')} error={errors.role?.message} required />
          <Input label="Phone" {...register('phone')} placeholder="+250..." />
          <div className="grid grid-cols-2 gap-4">
            <Input label="District" {...register('district')} />
            <Input label="Sector" {...register('sector')} />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" type="button" onClick={() => { setShowModal(false); setEditingUser(null); reset() }}>Cancel</Button>
            <Button type="submit">{editingUser ? 'Update' : 'Create'} User</Button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={!!showDetail} onClose={() => setShowDetail(null)} title="User Details" size="md">
        {showDetail && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-navy-100 text-xl font-bold text-navy-900 dark:bg-green-900/30 dark:text-green-400">
                {showDetail.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">{showDetail.name}</h3>
                <p className="text-sm text-neutral-500">{showDetail.email}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><p className="text-xs text-neutral-500">Role</p><p className="text-sm font-medium">{showDetail.role.replace(/_/g, ' ')}</p></div>
              <div><p className="text-xs text-neutral-500">Status</p><StatusBadge status={showDetail.isActive ? 'ACTIVE' : 'INACTIVE'} /></div>
              <div><p className="text-xs text-neutral-500">Phone</p><p className="text-sm">{showDetail.phone || 'N/A'}</p></div>
              <div><p className="text-xs text-neutral-500">District</p><p className="text-sm">{showDetail.district || 'N/A'}</p></div>
              <div><p className="text-xs text-neutral-500">Joined</p><p className="text-sm">{formatDate(showDetail.createdAt)}</p></div>
              <div><p className="text-xs text-neutral-500">Last Active</p><p className="text-sm">{formatDate(showDetail.lastLoginAt)}</p></div>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        title="Delete User"
        message={`Are you sure you want to delete ${deletingUser?.name}? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
      />
    </motion.div>
  )
}
