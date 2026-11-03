import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Lock, LogIn, Eye, EyeOff, Users } from 'lucide-react';
import { useAuthStore } from '../../store';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const DEMO_ACCOUNTS = [
  { label: 'Passenger', email: 'passenger@example.com', password: 'password123', color: 'bg-green-500 hover:bg-green-600' },
  { label: 'Driver', email: 'driver@example.com', password: 'password123', color: 'bg-blue-500 hover:bg-blue-600' },
  { label: 'Coop Admin', email: 'cooperative@example.com', password: 'password123', color: 'bg-purple-500 hover:bg-purple-600' },
  { label: 'Authority', email: 'authority@example.com', password: 'password123', color: 'bg-amber-500 hover:bg-amber-600' },
  { label: 'Super Admin', email: 'admin@example.com', password: 'password123', color: 'bg-red-500 hover:bg-red-600' },
];

const ROLE_REDIRECT = {
  PASSENGER: '/passenger',
  DRIVER: '/driver',
  COOPERATIVE_ADMIN: '/cooperative',
  AUTHORITY: '/authority',
  SUPER_ADMIN: '/admin',
};

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, loading, error, clearError } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: localStorage.getItem('tp_remember_email') || '',
      password: localStorage.getItem('tp_remember_password') || '',
    },
  });

  const onSubmit = async (data) => {
    clearError();
    try {
      if (rememberMe) {
        localStorage.setItem('tp_remember_email', data.email);
        localStorage.setItem('tp_remember_password', data.password);
      } else {
        localStorage.removeItem('tp_remember_email');
        localStorage.removeItem('tp_remember_password');
      }
      const result = await login(data.email, data.password);
      const role = result?.user?.role;
      navigate(ROLE_REDIRECT[role] || ROLE_REDIRECT.PASSENGER);
    } catch (err) {
      // error is set in store
    }
  };

  const handleDemoLogin = (account) => {
    setValue('email', account.email);
    setValue('password', account.password);
    clearError();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f2645] via-[#0f2645] to-[#1a3a5c] flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-500 text-white text-xl font-bold shadow-lg">
              T
            </div>
            <span className="text-2xl font-bold text-white">
              Trans<span className="text-green-400">Price</span>
            </span>
          </Link>
          <p className="text-neutral-300 text-sm">Sign in to your account</p>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl p-6 sm:p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-3 text-sm text-red-600 dark:text-red-400"
              >
                {error}
              </motion.div>
            )}

            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              icon={Mail}
              error={errors.email?.message}
              {...register('email')}
            />

            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                icon={Lock}
                error={errors.password?.message}
                {...register('password')}
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-neutral-300 text-green-600 focus:ring-green-500"
                />
                <span className="text-sm text-neutral-600 dark:text-neutral-400">Remember me</span>
              </label>
              <Link
                to="/forgot-password"
                className="text-sm font-medium text-green-600 hover:text-green-700 dark:text-green-400"
              >
                Forgot password?
              </Link>
            </div>

            <Button type="submit" fullWidth size="lg" loading={loading} leftIcon={LogIn}>
              Sign In
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Don&apos;t have an account?{' '}
              <Link to="/register" className="font-medium text-green-600 hover:text-green-700 dark:text-green-400">
                Register
              </Link>
            </p>
          </div>
        </div>

        {/* Demo accounts */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6 bg-white/10 backdrop-blur-sm rounded-xl p-4"
        >
          <div className="flex items-center gap-2 mb-3">
            <Users size={16} className="text-green-400" />
            <span className="text-sm font-medium text-white">Demo Accounts</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {DEMO_ACCOUNTS.map((account) => (
              <button
                key={account.email}
                onClick={() => handleDemoLogin(account)}
                className={`${account.color} text-white text-xs font-medium py-2 px-3 rounded-lg transition-colors shadow-sm`}
              >
                {account.label}
              </button>
            ))}
          </div>
          <p className="mt-2 text-xs text-neutral-400 text-center">Click to auto-fill credentials</p>
        </motion.div>
      </motion.div>
    </div>
  );
}
