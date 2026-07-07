import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Mail, Lock, Eye, EyeOff, Activity, ArrowLeft, Loader2 } from 'lucide-react';

const LoginPage = () => {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // If already logged in, redirect directly to dashboard
  useEffect(() => {
    if (user) {
      if (user.role === 'citizen') navigate('/citizen');
      else if (user.role === 'department') navigate('/department');
      else if (user.role === 'admin') navigate('/admin');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError('Please fill in all fields');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const data = await login(form.email, form.password);
      const role = data.user?.role;
      if (role === 'citizen') navigate('/citizen');
      else if (role === 'department') navigate('/department');
      else navigate('/admin');
    } catch (err) {
      setError(err?.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-stretch transition-colors duration-200">
      {/* Back to Home Button (top left floating) */}
      <div className="absolute top-4 left-4 z-50">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 hover:bg-slate-100 dark:hover:bg-slate-850 text-sm font-medium text-slate-600 dark:text-slate-350 transition duration-150"
        >
          <ArrowLeft size={16} />
          <span>Back to Home</span>
        </Link>
      </div>

      {/* Left Pane - Branding & Features (Desktop Only) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-brand-900 via-indigo-950 to-slate-950 p-12 flex-col justify-between relative overflow-hidden">
        {/* Background grids */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.15),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(13,148,136,0.1),transparent_40%)]"></div>

        {/* Top brand */}
        <div className="flex items-center gap-2 relative z-10">
          <div className="h-9 w-9 rounded-xl bg-brand-500 flex items-center justify-center shadow-lg">
            <Activity className="text-white" size={20} />
          </div>
          <span className="font-heading font-extrabold text-xl tracking-tight text-white">CivicFix</span>
        </div>

        {/* Text/Benefit statements */}
        <div className="my-auto max-w-md relative z-10">
          <span className="text-xs uppercase tracking-[0.2em] text-brand-300 font-semibold mb-3 block">MUNICIPAL HUB</span>
          <h1 className="text-4xl font-extrabold font-heading text-white leading-tight mb-4">
            Connecting citizens with department resolution workflows.
          </h1>
          <p className="text-slate-300 text-sm leading-relaxed mb-6">
            CivicFix leverages artificial intelligence to categorize local concerns, route tickets, and support staff workflow monitoring.
          </p>

          <div className="space-y-4">
            {[
              "Real-time status transparency updates.",
              "Deep-learning category classifier routing.",
              "Priority assessment indicators."
            ].map((text, i) => (
              <div key={i} className="flex items-center gap-3 text-slate-300 text-xs">
                <span className="h-5 w-5 rounded-full bg-brand-500/20 border border-brand-500/30 flex items-center justify-center text-brand-400 font-bold">✓</span>
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom system stats tag */}
        <div className="text-xs text-slate-400 relative z-10">
          Secured access for Citizens, Officers, and Platform Administrators.
        </div>
      </div>

      {/* Right Pane - Form Card */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 md:p-16 relative">
        {/* Background flares for mobile view */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-80 h-80 bg-brand-500/5 blur-3xl rounded-full pointer-events-none lg:hidden"></div>

        <div className="w-full max-w-md relative z-10">
          <div className="mb-8">
            <h2 className="text-3xl font-extrabold font-heading text-slate-900 dark:text-white">Welcome back</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              Sign in to manage your tickets and track municipal tasks.
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Email Field */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5" htmlFor="email-input">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 text-slate-400" size={18} />
                <input 
                  id="email-input"
                  className="w-full border border-slate-200 dark:border-slate-800 rounded-2xl pl-11 pr-4 py-3 bg-white dark:bg-slate-900 text-slate-950 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 dark:focus:border-brand-500 text-sm transition"
                  type="email" 
                  placeholder="name@example.com" 
                  value={form.email} 
                  onChange={(e) => setForm({ ...form, email: e.target.value })} 
                  required 
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400" htmlFor="password-input">
                  Password
                </label>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 text-slate-400" size={18} />
                <input 
                  id="password-input"
                  className="w-full border border-slate-200 dark:border-slate-800 rounded-2xl pl-11 pr-11 py-3 bg-white dark:bg-slate-900 text-slate-950 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 dark:focus:border-brand-500 text-sm transition"
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••" 
                  value={form.password} 
                  onChange={(e) => setForm({ ...form, password: e.target.value })} 
                  required 
                  disabled={loading}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 px-4 py-3 text-xs text-red-600 dark:text-red-400 animate-pulse">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button 
              className="w-full bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-700 hover:to-brand-800 text-white py-3.5 rounded-2xl font-semibold shadow-lg shadow-brand-500/10 hover:shadow-brand-500/20 transition duration-150 flex items-center justify-center gap-2 disabled:opacity-55 disabled:cursor-not-allowed text-sm"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  <span>Signing In...</span>
                </>
              ) : (
                <span>Sign In</span>
              )}
            </button>
          </form>

          {/* Form Footer */}
          <div className="mt-8 text-center text-xs text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-slate-800 pt-6">
            New citizen reporter?{' '}
            <Link to="/register" className="text-brand-600 dark:text-brand-400 font-semibold hover:underline">
              Create citizen account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
