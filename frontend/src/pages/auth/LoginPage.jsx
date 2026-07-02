import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const LoginPage = () => {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ fullName: '', email: '', password: '', phone: '', address: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (isRegister) {
        await register(form);
      } else {
        await login(form.email, form.password);
      }
      navigate('/');
    } catch (err) {
      setError(err?.response?.data?.message || 'Authentication failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-civic-teal/10 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl grid md:grid-cols-2 rounded-3xl shadow-2xl overflow-hidden bg-white">
        <div className="bg-brand-700 text-white p-8 flex flex-col justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-blue-200">CivicFix</p>
            <h1 className="text-3xl font-semibold mt-3">Make civic issues visible and solvable.</h1>
            <p className="mt-4 text-blue-100">Report local problems, track resolution, and support public services through a transparent workflow.</p>
          </div>
          <div className="mt-8 rounded-2xl border border-white/20 p-4 text-sm text-blue-100">
            Shared login for citizens, department officers, and admins.
          </div>
        </div>
        <div className="p-8">
          <div className="flex justify-end mb-6">
            <button className="text-sm font-medium text-brand-600" onClick={() => setIsRegister(!isRegister)}>
              {isRegister ? 'Already have an account?' : 'Create citizen account'}
            </button>
          </div>
          <h2 className="text-2xl font-semibold text-slate-800">{isRegister ? 'Create your citizen account' : 'Welcome back'}</h2>
          <p className="text-sm text-slate-500 mt-2">{isRegister ? 'Join CivicFix to report and track local concerns.' : 'Sign in to continue to your dashboard.'}</p>
          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            {isRegister && (
              <input className="w-full border rounded-xl px-3 py-2" placeholder="Full name" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} required />
            )}
            <input className="w-full border rounded-xl px-3 py-2" type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            <input className="w-full border rounded-xl px-3 py-2" type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
            {isRegister && (
              <>
                <input className="w-full border rounded-xl px-3 py-2" placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                <input className="w-full border rounded-xl px-3 py-2" placeholder="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
              </>
            )}
            {error && <p className="text-sm text-rose-600">{error}</p>}
            <button className="w-full bg-brand-600 text-white py-2.5 rounded-xl font-medium" type="submit">{isRegister ? 'Create account' : 'Login'}</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
