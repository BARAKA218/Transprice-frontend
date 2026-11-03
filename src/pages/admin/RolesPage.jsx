import { motion } from 'framer-motion'
import { Shield, Users, Lock, Eye } from 'lucide-react'
import Card from '../../components/common/Card'
import Breadcrumb from '../../components/common/Breadcrumb'
import { ROLES_LIST } from '../../data/mockData'
import { useState } from 'react'

const fadeIn = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }

export default function RolesPage() {
  const [selectedRole, setSelectedRole] = useState(null)

  return (
    <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.05 } } }} className="space-y-6">
      <motion.div variants={fadeIn}>
        <Breadcrumb items={[{ label: 'Admin', href: '/admin' }, { label: 'Roles' }]} />
        <div className="mt-4">
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Role Management</h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">View system roles and their permissions</p>
        </div>
      </motion.div>

      <motion.div variants={fadeIn} className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {ROLES_LIST.map((role) => (
          <Card
            key={role.id}
            hover
            onClick={() => setSelectedRole(selectedRole?.id === role.id ? null : role)}
            className={selectedRole?.id === role.id ? 'ring-2 ring-navy-900 dark:ring-green-500' : ''}
          >
            <div className="flex items-start gap-4">
              <div className="rounded-lg bg-navy-50 p-2.5 dark:bg-green-900/30">
                <Shield size={20} className="text-navy-900 dark:text-green-500" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">{role.name}</h3>
                  {role.isBuiltIn && (
                    <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs text-neutral-500 dark:bg-neutral-700 dark:text-neutral-400">Built-in</span>
                  )}
                </div>
                <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">{role.description}</p>
                <div className="mt-3 flex items-center gap-2">
                  <span className="flex items-center gap-1 text-xs text-neutral-500">
                    <Users size={12} /> {role.userCount} users
                  </span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </motion.div>

      {selectedRole && (
        <motion.div variants={fadeIn}>
          <Card
            header={
              <div className="flex items-center gap-2">
                <Lock size={16} className="text-navy-900 dark:text-green-500" />
                <span className="font-semibold text-neutral-900 dark:text-neutral-100">Permissions: {selectedRole.name}</span>
              </div>
            }
          >
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {selectedRole.permissions.map((perm, idx) => (
                <div key={idx} className="flex items-center gap-2 rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 dark:border-neutral-700 dark:bg-neutral-800">
                  <Eye size={14} className="text-green-600" />
                  <span className="text-sm text-neutral-700 dark:text-neutral-300">{perm}</span>
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs text-neutral-400 italic">Built-in roles cannot be modified. Custom roles can be created from this interface in the future.</p>
          </Card>
        </motion.div>
      )}
    </motion.div>
  )
}
