import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, Lock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Register() {
  const navigate = useNavigate();
  const { user, register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  if (user) {
    navigate('/orders', { replace: true });
    return null;
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr('');
    if (name.trim().length < 2) return setErr('Please enter your full name.');
    if (!email.includes('@')) return setErr('Please enter a valid email address.');
    if (password.length < 6) return setErr('Password must be at least 6 characters.');
    setBusy(true);

    const res = await register(name.trim(), email.trim(), password);
    setBusy(false);

    if (res.success) {
      navigate('/orders');
    } else {
      setErr(res.error || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="bg-[#F8FAFC]">
      <div className="mx-auto flex min-h-[78vh] max-w-7xl items-center justify-center px-4 py-12 sm:px-6">
        <div className="w-full max-w-md animate-fadeUp rounded-3xl border border-[#E5E7EB] bg-white p-8 shadow-xl shadow-slate-900/5 sm:p-10">
          <Link to="/" className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#6B7280] hover:text-[#2563EB]">
            <ArrowLeft size={14} /> Back to home
          </Link>
          <h1 className="mt-4 font-display text-2xl font-extrabold tracking-tight text-[#111827] sm:text-3xl">Create your account</h1>
          <p className="mt-1.5 text-sm text-[#6B7280]">Join CodeAlpha Store for faster checkout and order tracking.</p>

          <form onSubmit={submit} className="mt-6 space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-[#111827]">Full name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Cooper"
                className="h-12 w-full rounded-xl border border-[#E5E7EB] px-4 text-sm outline-none transition focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-[#111827]">Email address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="h-12 w-full rounded-xl border border-[#E5E7EB] px-4 text-sm outline-none transition focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-[#111827]">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                className="h-12 w-full rounded-xl border border-[#E5E7EB] px-4 text-sm outline-none transition focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100"
              />
            </div>
            {err && <p className="rounded-xl bg-red-50 px-4 py-3 text-[13px] font-medium text-red-700">{err}</p>}
            <button
              disabled={busy}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#2563EB] text-[15px] font-semibold text-white shadow-lg shadow-blue-600/25 transition hover:bg-[#1D4ED8] disabled:opacity-60"
            >
              {busy && <Loader2 size={17} className="animate-spin" />} Create Account
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[#6B7280]">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-[#2563EB] hover:underline">Sign in</Link>
          </p>
          <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-[#9CA3AF]">
            <Lock size={12} /> Protected with 256-bit JWT Encryption
          </p>
        </div>
      </div>
    </div>
  );
}
