import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { AuthLayout } from '../Components/AuthLayout';
import { AuthFormDivider } from '../Components/AuthFormDivider';
import { GuestModeButton } from '../Components/GuestModeButton';
import { useAuth } from '../context/AuthContext';
import { scaleIn } from '../lib/motionPresets';

const SignUp = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    try {
      const { error: authError } = await signUp(
        formData.email,
        formData.password,
        formData.username
      );
      if (authError) throw authError;
      setSuccess('Account created. Check your email to confirm, then log in.');
      setTimeout(() => navigate('/login'), 2500);
    } catch (err) {
      setError((err as Error).message || 'Sign-up failed. Please try again.');
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
        <h2 className="mb-2 text-center font-display text-2xl font-bold text-white">Create your account</h2>
        <p className="mb-8 text-center text-sm text-slate-500">Join MailX and take control of your inbox</p>

        {error && (
          <p className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-center text-sm text-red-300">
            {error}
          </p>
        )}
        {success && (
          <p className="mb-6 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-center text-sm text-emerald-300">
            {success}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {(['username', 'email', 'password', 'confirmPassword'] as const).map((field) => (
            <div key={field}>
              <label htmlFor={field} className="mb-1.5 block text-sm font-medium text-slate-300">
                {field === 'confirmPassword' ? 'Confirm Password' : field.charAt(0).toUpperCase() + field.slice(1)}
              </label>
              <input
                id={field}
                name={field}
                type={field.includes('password') ? 'password' : field === 'email' ? 'email' : 'text'}
                required
                minLength={field.includes('password') ? 6 : undefined}
                value={formData[field]}
                onChange={(e) => setFormData((p) => ({ ...p, [field]: e.target.value }))}
                className="input-field"
                disabled={loading}
              />
            </div>
          ))}

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
            className="btn-primary mt-2 flex w-full justify-center gap-2 py-3 disabled:opacity-60"
          >
            {loading && <Loader2 className="h-5 w-5 animate-spin" />}
            {loading ? 'Creating account...' : 'Sign Up'}
          </motion.button>
        </form>

        <AuthFormDivider label="or try demo" />
        <GuestModeButton label="Explore demo inbox" />

        <p className="mt-8 text-center text-sm text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="text-violet-400 hover:text-violet-300">Log in</Link>
        </p>
      </motion.div>
    </AuthLayout>
  );
};

export default SignUp;
