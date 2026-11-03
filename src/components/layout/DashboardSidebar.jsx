import { NavLink, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Search,
  Map,
  Navigation,
  Bookmark,
  Flag,
  Bell,
  User,
  Settings,
  DollarSign,
  Car,
  Wallet,
  MessageSquare,
  Users,
  UserCheck,
  Receipt,
  FileText,
  BarChart3,
  Building2,
  CheckCircle,
  Building,
  ScrollText,
  Shield,
  Database,
  Fuel,
  LogOut,
  X,
} from 'lucide-react';

const roleLabels = {
  PASSENGER: 'PASSENGER',
  DRIVER: 'DRIVER',
  COOPERATIVE_ADMIN: 'COOPERATIVE',
  AUTHORITY: 'AUTHORITY',
  SUPER_ADMIN: 'ADMIN',
};

const roleColors = {
  PASSENGER: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  DRIVER: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  COOPERATIVE_ADMIN: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
  AUTHORITY: 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300',
  SUPER_ADMIN: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
};

const iconMap = {
  LayoutDashboard,
  Search,
  Map,
  Navigation,
  Bookmark,
  Flag,
  Bell,
  User,
  Settings,
  DollarSign,
  Car,
  Wallet,
  MessageSquare,
  Users,
  UserCheck,
  Receipt,
  FileText,
  BarChart3,
  Building2,
  CheckCircle,
  Building,
  ScrollText,
  Shield,
  Database,
  Fuel,
};

const navItems = {
  PASSENGER: [
    { label: 'Dashboard', to: '/passenger', icon: 'LayoutDashboard' },
    { label: 'Check Fare', to: '/passenger/check-fare', icon: 'Search' },
    { label: 'Routes', to: '/passenger/routes', icon: 'Map' },
    { label: 'Trips', to: '/passenger/trips', icon: 'Navigation' },
    { label: 'Saved Routes', to: '/passenger/saved-routes', icon: 'Bookmark' },
    { label: 'Reports', to: '/passenger/reports', icon: 'Flag' },
    { label: 'Notifications', to: '/passenger/notifications', icon: 'Bell' },
    { label: 'Profile', to: '/passenger/profile', icon: 'User' },
    { label: 'Settings', to: '/passenger/settings', icon: 'Settings' },
  ],
  DRIVER: [
    { label: 'Dashboard', to: '/driver', icon: 'LayoutDashboard' },
    { label: 'Trips', to: '/driver/trips', icon: 'Navigation' },
    { label: 'Fares', to: '/driver/fares', icon: 'DollarSign' },
    { label: 'Routes', to: '/driver/routes', icon: 'Map' },
    { label: 'Vehicle', to: '/driver/vehicle', icon: 'Car' },
    { label: 'Earnings', to: '/driver/earnings', icon: 'Wallet' },
    { label: 'Complaints', to: '/driver/complaints', icon: 'MessageSquare' },
    { label: 'Notifications', to: '/driver/notifications', icon: 'Bell' },
    { label: 'Profile', to: '/driver/profile', icon: 'User' },
    { label: 'Settings', to: '/driver/settings', icon: 'Settings' },
  ],
  COOPERATIVE_ADMIN: [
    { label: 'Dashboard', to: '/cooperative', icon: 'LayoutDashboard' },
    { label: 'Members', to: '/cooperative/members', icon: 'Users' },
    { label: 'Drivers', to: '/cooperative/drivers', icon: 'UserCheck' },
    { label: 'Vehicles', to: '/cooperative/vehicles', icon: 'Car' },
    { label: 'Routes', to: '/cooperative/routes', icon: 'Map' },
    { label: 'Tariffs', to: '/cooperative/tariffs', icon: 'Receipt' },
    { label: 'Proposals', to: '/cooperative/proposals', icon: 'FileText' },
    { label: 'Complaints', to: '/cooperative/complaints', icon: 'MessageSquare' },
    { label: 'Reports', to: '/cooperative/reports', icon: 'BarChart3' },
    { label: 'Notifications', to: '/cooperative/notifications', icon: 'Bell' },
  ],
  AUTHORITY: [
    { label: 'Dashboard', to: '/authority', icon: 'LayoutDashboard' },
    { label: 'Districts', to: '/authority/districts', icon: 'Building2' },
    { label: 'Routes', to: '/authority/routes', icon: 'Map' },
    { label: 'Fares', to: '/authority/fares', icon: 'DollarSign' },
    { label: 'Approvals', to: '/authority/approvals', icon: 'CheckCircle' },
    { label: 'Complaints', to: '/authority/complaints', icon: 'MessageSquare' },
    { label: 'Cooperatives', to: '/authority/cooperatives', icon: 'Building' },
    { label: 'Analytics', to: '/authority/analytics', icon: 'BarChart3' },
    { label: 'Reports', to: '/authority/reports', icon: 'FileText' },
    { label: 'Audit Logs', to: '/authority/audit-logs', icon: 'ScrollText' },
  ],
  SUPER_ADMIN: [
    { label: 'Dashboard', to: '/admin', icon: 'LayoutDashboard' },
    { label: 'Users', to: '/admin/users', icon: 'Users' },
    { label: 'Roles', to: '/admin/roles', icon: 'Shield' },
    { label: 'Districts', to: '/admin/districts', icon: 'Building2' },
    { label: 'Routes', to: '/admin/routes', icon: 'Map' },
    { label: 'Fares', to: '/admin/fares', icon: 'DollarSign' },
    { label: 'Sources', to: '/admin/sources', icon: 'Database' },
    { label: 'Research', to: '/admin/research', icon: 'Search' },
    { label: 'Updates', to: '/admin/updates', icon: 'Bell' },
    { label: 'Fuel Prices', to: '/admin/fuel-prices', icon: 'Fuel' },
    { label: 'Complaints', to: '/admin/complaints', icon: 'MessageSquare' },
    { label: 'Analytics', to: '/admin/analytics', icon: 'BarChart3' },
    { label: 'Audit Logs', to: '/admin/audit-logs', icon: 'ScrollText' },
    { label: 'Settings', to: '/admin/settings', icon: 'Settings' },
  ],
};

const sidebarVariants = {
  hidden: { x: '-100%' },
  visible: { x: 0 },
};

const navLinkClass = ({ isActive }) =>
  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
    isActive
      ? 'bg-green-500/10 text-green-600 dark:text-green-400 dark:bg-green-500/15'
      : 'text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-700/50'
  }`;

const navLinkMobileClass = ({ isActive }) =>
  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
    isActive
      ? 'bg-green-500/10 text-green-600 dark:text-green-400 dark:bg-green-500/15'
      : 'text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-700/50'
  }`;

function SidebarContent({ role, onClose, isMobile }) {
  const items = navItems[role] || [];
  const label = roleLabels[role] || role;
  const color = roleColors[role] || 'bg-neutral-100 text-neutral-700';

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-neutral-200 dark:border-neutral-700">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-500 text-white text-sm font-bold">
            T
          </div>
          <span className="text-lg font-bold text-navy-900 dark:text-white">
            Trans<span className="text-green-500">Price</span>
          </span>
        </Link>
        {isMobile && (
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Role badge */}
      <div className="px-4 py-3">
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${color}`}>
          {label}
        </span>
      </div>

      {/* Nav items */}
      <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-0.5">
        {items.map((item) => {
          const Icon = iconMap[item.icon] || LayoutDashboard;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={isMobile ? navLinkMobileClass : navLinkClass}
              end={item.to.split('/').length <= 2}
              onClick={isMobile ? onClose : undefined}
            >
              <Icon className="h-4.5 w-4.5 shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-neutral-200 dark:border-neutral-700">
        <button
          onClick={() => {/* handled by parent */}}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
        >
          <LogOut className="h-4.5 w-4.5 shrink-0" />
          Logout
        </button>
      </div>
    </div>
  );
}

export default function DashboardSidebar({ role, isOpen, onClose }) {
  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:fixed lg:inset-y-0 lg:left-0 lg:z-30 lg:w-64 lg:flex-col bg-white dark:bg-[#1e293b] border-r border-neutral-200 dark:border-neutral-700">
        <SidebarContent role={role} isMobile={false} onClose={onClose} />
      </aside>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/40 lg:hidden"
              onClick={onClose}
            />
            <motion.aside
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={sidebarVariants}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-[#1e293b] shadow-2xl lg:hidden"
            >
              <SidebarContent role={role} isMobile={onClose ? true : false} onClose={onClose} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
