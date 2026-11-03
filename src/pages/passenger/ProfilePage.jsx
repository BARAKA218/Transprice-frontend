import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User, Mail, Phone, Lock, Save, MapPin, Shield } from 'lucide-react';
import { useAuthStore } from '../../store';
import { authService } from '../../services/api';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  district: z.string().optional(),
  sector: z.string().optional(),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(6, 'New password must be at least 6 characters'),
  confirmNewPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: 'Passwords do not match',
  path: ['confirmNewPassword'],
});

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const itemVariants = { hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } };

export default function ProfilePage() {
  const { user, updateUser } = useAuthStore();
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [profileError, setProfileError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);

  const profileForm = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      district: user?.district || '',
      sector: user?.sector || '',
    },
  });

  const passwordForm = useForm({
    resolver: zodResolver(passwordSchema),
  });

  const onProfileSubmit = async (data) => {
    setProfileLoading(true);
    setProfileError(null);
    setProfileSuccess(false);
    try {
      const updated = await authService.updateProfile(data);
      updateUser(updated);
      setProfileSuccess(true);
      setTimeout(() => setProfileSuccess(false), 3000);
    } catch (err) {
      setProfileError(err.message);
    } finally {
      setProfileLoading(false);
    }
  };

  const onPasswordSubmit = async (data) => {
    setPasswordLoading(true);
    setPasswordError(null);
    setPasswordSuccess(false);
    try {
      await authService.changePassword(data.currentPassword, data.newPassword);
      setPasswordSuccess(true);
      passwordForm.reset();
      setTimeout(() => setPasswordSuccess(false), 3000);
    } catch (err) {
      setPasswordError(err.message);
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6 max-w-2xl">
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Profile</h1>
        <p className="text-neutral-500 dark:text-neutral-400 text-sm mt-1">Manage your account information</p>
      </motion.div>

      {/* Profile Info */}
      <motion.div variants={itemVariants}>
        <Card header={<h2 className="text-base font-semibold text-neutral-900 dark:text-white flex items-center gap-2"><User size={18} /> Personal Information</h2>}>
          {profileSuccess && (
            <div className="mb-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-3 text-sm text-green-600 dark:text-green-400">
              Profile updated successfully!
            </div>
          )}
          {profileError && (
            <div className="mb-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-3 text-sm text-red-600 dark:text-red-400">
              {profileError}
            </div>
          )}
          <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
            <Input label="Full Name" icon={User} error={profileForm.formState.errors.name?.message} {...profileForm.register('name')} />
            <Input label="Email" type="email" icon={Mail} error={profileForm.formState.errors.email?.message} {...profileForm.register('email')} />
            <Input label="Phone" type="tel" icon={Phone} error={profileForm.formState.errors.phone?.message} {...profileForm.register('phone')} />
            <div className="grid grid-cols-2 gap-4">
              <Input label="District" icon={MapPin} {...profileForm.register('district')} />
              <Input label="Sector" icon={MapPin} {...profileForm.register('sector')} />
            </div>
            <div className="flex justify-end">
              <Button type="submit" loading={profileLoading} leftIcon={Save}>Save Changes</Button>
            </div>
          </form>
        </Card>
      </motion.div>

      {/* Change Password */}
      <motion.div variants={itemVariants}>
        <Card header={<h2 className="text-base font-semibold text-neutral-900 dark:text-white flex items-center gap-2"><Shield size={18} /> Change Password</h2>}>
          {passwordSuccess && (
            <div className="mb-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-3 text-sm text-green-600 dark:text-green-400">
              Password changed successfully!
            </div>
          )}
          {passwordError && (
            <div className="mb-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-3 text-sm text-red-600 dark:text-red-400">
              {passwordError}
            </div>
          )}
          <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
            <Input label="Current Password" type="password" icon={Lock} error={passwordForm.formState.errors.currentPassword?.message} {...passwordForm.register('currentPassword')} />
            <Input label="New Password" type="password" icon={Lock} error={passwordForm.formState.errors.newPassword?.message} {...passwordForm.register('newPassword')} />
            <Input label="Confirm New Password" type="password" icon={Lock} error={passwordForm.formState.errors.confirmNewPassword?.message} {...passwordForm.register('confirmNewPassword')} />
            <div className="flex justify-end">
              <Button type="submit" loading={passwordLoading} leftIcon={Lock}>Change Password</Button>
            </div>
          </form>
        </Card>
      </motion.div>

      {/* Account Info */}
      <motion.div variants={itemVariants}>
        <Card>
          <h2 className="text-base font-semibold text-neutral-900 dark:text-white mb-3">Account Details</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-neutral-500 dark:text-neutral-400">Role</span>
              <span className="font-medium text-neutral-900 dark:text-white">{user?.role?.replace(/_/g, ' ')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500 dark:text-neutral-400">Member since</span>
              <span className="font-medium text-neutral-900 dark:text-white">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500 dark:text-neutral-400">Status</span>
              <span className="inline-flex items-center rounded-full bg-green-100 dark:bg-green-900/30 px-2.5 py-0.5 text-xs font-medium text-green-700 dark:text-green-400">Active</span>
            </div>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
}
