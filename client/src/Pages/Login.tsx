import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { AuthLayout } from '../Components/AuthLayout';
import { AuthFormDivider } from '../Components/AuthFormDivider';
import { GuestModeButton } from '../Components/GuestModeButton';
import { useAuth } from '../context/AuthContext';
import { scaleIn } from '../lib/motionPresets';

export function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { error: authError } = await signIn(formData.email, formData.password);
      if (authError) throw authError;
      navigate('/content');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <motion.div
        variants={scaleIn}
        initial="hidden"
        animate="visible"
        className="glass-card p-8 md:p-10"
      >
        <h2 className="mb-2 text-center font-display text-2xl font-bold text-white">Welcome back</h2>
        <p className="mb-8 text-center text-sm text-slate-500">Sign in to your MailX account</p>

        {error && (
          <motion.p
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-center text-sm text-red-300"
            role="alert"
          >
            {error}
          </motion.p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-slate-300">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
              className="input-field"
              placeholder="you@example.com"
              disabled={loading}
              autoComplete="email"
            />
          </div>
          <div>
            <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-slate-300">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData((p) => ({ ...p, password: e.target.value }))}
              className="input-field"
              disabled={loading}
              autoComplete="current-password"
            />
          </div>
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
            className="btn-primary flex w-full justify-center gap-2 py-3 disabled:opacity-60"
          >
            {loading && <Loader2 className="h-5 w-5 animate-spin" />}
            {loading ? 'Signing in...' : 'Log In'}
          </motion.button>
        </form>

        <AuthFormDivider />
        <GuestModeButton />

        <p className="mt-8 text-center text-sm text-slate-500">
          Don&apos;t have an account?{' '}
          <Link to="/signup" className="font-medium text-violet-400 hover:text-violet-300">Sign up</Link>
        </p>
      </motion.div>
    </AuthLayout>
  );
}

export default Login;
