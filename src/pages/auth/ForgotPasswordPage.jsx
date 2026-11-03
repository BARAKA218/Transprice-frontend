import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, ArrowLeft, Send, CheckCircle } from 'lucide-react';
import { authService } from '../../services/api';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

const schema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(null);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    setError(null);
    try {
      await authService.forgotPassword(data.email);
      setSent(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f2645] via-[#0f2645] to-[#1a3a5c] flex items-center justify-center px-4">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl p-8 text-center max-w-md w-full">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={32} className="text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">Check Your Email</h2>
          <p className="text-neutral-500 dark:text-neutral-400 text-sm mb-6">
            We&apos;ve sent password reset instructions to your email address.
          </p>
          <Link to="/login" className="inline-flex items-center gap-2 text-sm font-medium text-green-600 hover:text-green-700 dark:text-green-400">
            <ArrowLeft size={16} /> Back to Login
          </Link>
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
          <p className="text-neutral-300 text-sm">Enter your email to reset your password</p>
        </div>

        <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl p-6 sm:p-8">
          {error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-3 mb-4 text-sm text-red-600 dark:text-red-400">
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Input label="Email" type="email" placeholder="you@example.com" icon={Mail} error={errors.email?.message} {...register('email')} />
            <Button type="submit" fullWidth size="lg" loading={loading} leftIcon={Send}>Send Reset Link</Button>
          </form>

          <div className="mt-6 text-center">
            <Link to="/login" className="inline-flex items-center gap-1.5 text-sm font-medium text-neutral-600 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200">
              <ArrowLeft size={16} /> Back to Login
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
