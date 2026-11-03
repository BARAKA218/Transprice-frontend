import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Lock, User, Phone, UserPlus } from 'lucide-react';
import { useAuthStore } from '../../store';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

const registerSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
    phone: z.string().optional(),
    role: z.enum(['PASSENGER', 'DRIVER'], { required_error: 'Please select a role' }),
    acceptTerms: z.literal(true, { errorMap: () => ({ message: 'You must accept the terms' }) }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register: registerUser, loading, error, clearError } = useAuthStore();
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: 'PASSENGER' },
  });

  const selectedRole = watch('role');

  const onSubmit = async (data) => {
    clearError();
    try {
      await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
        phone: data.phone,
        role: data.role,
      });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      // error set in store
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f2645] via-[#0f2645] to-[#1a3a5c] flex items-center justify-center px-4">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl p-8 text-center max-w-md w-full">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserPlus size={32} className="text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">Registration Successful!</h2>
          <p className="text-neutral-500 dark:text-neutral-400 text-sm">Redirecting you to login...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f2645] via-[#0f2645] to-[#1a3a5c] flex items-center justify-center px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-500 text-white text-xl font-bold shadow-lg">T</div>
            <span className="text-2xl font-bold text-white">Trans<span className="text-green-400">Price</span></span>
          </Link>
          <p className="text-neutral-300 text-sm">Create your account</p>
        </div>

        <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl p-6 sm:p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-3 text-sm text-red-600 dark:text-red-400">
                {error}
              </motion.div>
            )}

            <Input label="Full Name" placeholder="Jean Mugabo" icon={User} error={errors.name?.message} {...register('name')} />
            <Input label="Email" type="email" placeholder="you@example.com" icon={Mail} error={errors.email?.message} {...register('email')} />
            <Input label="Phone (optional)" type="tel" placeholder="+250 788 123 456" icon={Phone} error={errors.phone?.message} {...register('phone')} />
            <Input label="Password" type="password" placeholder="Min 6 characters" icon={Lock} error={errors.password?.message} {...register('password')} />
            <Input label="Confirm Password" type="password" placeholder="Re-enter password" icon={Lock} error={errors.confirmPassword?.message} {...register('confirmPassword')} />

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">I am a <span className="text-red-500">*</span></label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: 'PASSENGER', label: 'Passenger', desc: 'Check fares & routes' },
                  { value: 'DRIVER', label: 'Driver', desc: 'Provide transport services' },
                ].map((opt) => (
                  <label
                    key={opt.value}
                    className={`flex flex-col items-center p-3 rounded-xl border-2 cursor-pointer transition-all ${
                      selectedRole === opt.value
                        ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                        : 'border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600'
                    }`}
                  >
                    <input type="radio" value={opt.value} className="sr-only" {...register('role')} />
                    <span className="text-sm font-medium text-neutral-900 dark:text-white">{opt.label}</span>
                    <span className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">{opt.desc}</span>
                  </label>
                ))}
              </div>
              {errors.role && <p className="text-xs text-red-500">{errors.role.message}</p>}
            </div>

            <label className="flex items-start gap-2 cursor-pointer">
              <input type="checkbox" className="mt-0.5 h-4 w-4 rounded border-neutral-300 text-green-600 focus:ring-green-500" {...register('acceptTerms')} />
              <span className="text-sm text-neutral-600 dark:text-neutral-400">
                I agree to the <a href="#" className="text-green-600 hover:underline">Terms of Service</a> and <a href="#" className="text-green-600 hover:underline">Privacy Policy</a>
              </span>
            </label>
            {errors.acceptTerms && <p className="text-xs text-red-500">{errors.acceptTerms.message}</p>}

            <Button type="submit" fullWidth size="lg" loading={loading} leftIcon={UserPlus}>Create Account</Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-green-600 hover:text-green-700 dark:text-green-400">Sign in</Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
