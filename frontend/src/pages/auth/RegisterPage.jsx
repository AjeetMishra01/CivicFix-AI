import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Mail, Lock, User, Phone, MapPin, Eye, EyeOff, Activity, ArrowLeft, Loader2 } from 'lucide-react';

const RegisterPage = () => {
  const { register, user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: '', email: '', password: '', phone: '', address: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, label: 'Weak', color: 'bg-red-500' });

  // Redirect if user is already logged in
  useEffect(() => {
    if (user) {
      if (user.role === 'citizen') navigate('/citizen');
      else if (user.role === 'department') navigate('/department');
      else if (user.role === 'admin') navigate('/admin');
    }
  }, [user, navigate]);

  // Compute password strength purely on frontend
  const checkPasswordStrength = (pass) => {
    if (!pass) return { score: 0, label: 'Weak', color: 'bg-slate-200' };
    let score = 0;
    if (pass.length >= 6) score += 1;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass) || /[^A-Za-z0-9]/.test(pass)) score += 1;

    let label = 'Weak';
    let color = 'bg-rose-500';
    if (score === 2) {
      label = 'Fair';
      color = 'bg-amber-500';
    } else if (score === 3) {
      label = 'Good';
      color = 'bg-brand-500';
    } else if (score === 4) {
      label = 'Strong';
      color = 'bg-emerald-500';
    }

    return { score, label, color };
  };

  const handlePasswordChange = (e) => {
    const pass = e.target.value;
    setForm({ ...form, password: pass });
    setPasswordStrength(checkPasswordStrength(pass));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.fullName || !form.email || !form.password) {
      setError('Please fill in all required fields (Name, Email, and Password)');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await register(form);
      navigate('/citizen');
    } catch (err) {
      setError(err?.response?.data?.message || 'Registration failed. Please try again.');
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
          <span className="text-xs uppercase tracking-[0.2em] text-brand-300 font-semibold mb-3 block">Citizen Registration</span>
          <h1 className="text-4xl font-extrabold font-heading text-white leading-tight mb-4">
            Become a part of your local solution.
          </h1>
          <p className="text-slate-300 text-sm leading-relaxed mb-6">
            Create an account in seconds to file localized tickets, pin problems on the live map, receive status remarks, and verify resolution details.
          </p>

          <div className="space-y-4">
            {[
              "Mark addresses directly on OpenStreetMap.",
              "Get notified when departments pick up your ticket.",
              "Provide direct feedback ratings to civic authorities."
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
          CivicFix Citizen Accounts are free and secure.
        </div>
      </div>

      {/* Right Pane - Form Card */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 md:p-16 relative">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-80 h-80 bg-brand-500/5 blur-3xl rounded-full pointer-events-none lg:hidden"></div>

        <div className="w-full max-w-md relative z-10">
          <div className="mb-6">
            <h2 className="text-3xl font-extrabold font-heading text-slate-900 dark:text-white">Join CivicFix</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              Create your citizen reporter account to submit concerns.
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1" htmlFor="name-input">
                Full Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-3 text-slate-400" size={16} />
                <input 
                  id="name-input"
                  className="w-full border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 text-slate-955 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-sm transition"
                  type="text" 
                  placeholder="John Doe" 
                  value={form.fullName} 
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })} 
                  required 
                  disabled={loading}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1" htmlFor="email-input">
                Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 text-slate-400" size={16} />
                <input 
                  id="email-input"
                  className="w-full border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 text-slate-955 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-sm transition"
                  type="email" 
                  placeholder="john@example.com" 
                  value={form.email} 
                  onChange={(e) => setForm({ ...form, email: e.target.value })} 
                  required 
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1" htmlFor="password-input">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 text-slate-400" size={16} />
                <input 
                  id="password-input"
                  className="w-full border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-10 py-2.5 bg-white dark:bg-slate-900 text-slate-955 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-sm transition"
                  type={showPassword ? "text" : "password"} 
                  placeholder="At least 6 characters" 
                  value={form.password} 
                  onChange={handlePasswordChange} 
                  required 
                  disabled={loading}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-650 transition"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {/* Password strength feedback */}
              {form.password && (
                <div className="mt-2 flex items-center justify-between">
                  <div className="flex gap-1 flex-1 max-w-[120px] items-center">
                    <div className={`h-1 flex-1 rounded-full ${passwordStrength.score >= 1 ? passwordStrength.color : 'bg-slate-200 dark:bg-slate-800'}`}></div>
                    <div className={`h-1 flex-1 rounded-full ${passwordStrength.score >= 2 ? passwordStrength.color : 'bg-slate-200 dark:bg-slate-800'}`}></div>
                    <div className={`h-1 flex-1 rounded-full ${passwordStrength.score >= 3 ? passwordStrength.color : 'bg-slate-200 dark:bg-slate-800'}`}></div>
                    <div className={`h-1 flex-1 rounded-full ${passwordStrength.score >= 4 ? passwordStrength.color : 'bg-slate-200 dark:bg-slate-800'}`}></div>
                  </div>
                  <span className="text-[10px] font-semibold text-slate-500">
                    Strength: <span className="font-bold">{passwordStrength.label}</span>
                  </span>
                </div>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1" htmlFor="phone-input">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-3 text-slate-400" size={16} />
                <input 
                  id="phone-input"
                  className="w-full border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 text-slate-955 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-sm transition"
                  type="tel" 
                  placeholder="+1 (555) 000-0000" 
                  value={form.phone} 
                  onChange={(e) => setForm({ ...form, phone: e.target.value })} 
                  disabled={loading}
                />
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1" htmlFor="address-input">
                Resident Address
              </label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-3 text-slate-400" size={16} />
                <input 
                  id="address-input"
                  className="w-full border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 text-slate-955 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-sm transition"
                  type="text" 
                  placeholder="Street, City, Zip" 
                  value={form.address} 
                  onChange={(e) => setForm({ ...form, address: e.target.value })} 
                  disabled={loading}
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 px-4 py-2.5 text-xs text-red-600 dark:text-red-400">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button 
              className="w-full bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-700 hover:to-brand-800 text-white py-3 rounded-xl font-semibold shadow-lg shadow-brand-500/10 hover:shadow-brand-500/20 transition duration-150 flex items-center justify-center gap-2 disabled:opacity-55 disabled:cursor-not-allowed text-sm mt-2"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={16} />
                  <span>Creating Account...</span>
                </>
              ) : (
                <span>Create Citizen Account</span>
              )}
            </button>
          </form>

          {/* Form Footer */}
          <div className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-slate-800 pt-4">
            Already registered?{' '}
            <Link to="/login" className="text-brand-600 dark:text-brand-400 font-semibold hover:underline">
              Sign in to account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
