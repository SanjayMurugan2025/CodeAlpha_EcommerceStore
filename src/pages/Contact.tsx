import { useState } from 'react';
import { CheckCircle2, Clock, Loader2, Mail, MapPin, MessageSquare, Phone, Send } from 'lucide-react';
import { cx } from '../lib/utils';

const inputCls = 'h-12 w-full rounded-xl border border-[#E5E7EB] bg-white px-4 text-sm outline-none transition placeholder:text-[#9CA3AF] focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: 'Order Support', message: '' });
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr('');
    if (form.name.trim().length < 2) return setErr('Please enter your name.');
    if (!form.email.includes('@')) return setErr('Please enter a valid email address.');
    if (form.message.trim().length < 10) return setErr('Please describe your request (min 10 characters).');
    setBusy(true);
    await new Promise((r) => setTimeout(r, 900));
    setBusy(false);
    setSent(true);
  };

  return (
    <div className="bg-white">
      <div className="border-b border-[#E5E7EB] bg-[#F8FAFC]">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#2563EB]">Get in touch</p>
          <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-[#111827] sm:text-4xl">Contact Us</h1>
          <p className="mt-2 max-w-xl text-[15px] text-[#6B7280]">Questions about an order, a product, or returns? We reply within a few hours.</p>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-12 sm:px-6 lg:grid-cols-[380px_1fr]">
        <div className="space-y-4">
          {[
            { icon: MapPin, title: 'Visit our store', lines: ['548 Market Street', 'San Francisco, CA 94104'], bg: 'bg-blue-50', fg: 'text-[#2563EB]' },
            { icon: Mail, title: 'Email us', lines: ['support@shopsphere.com', 'Replies within ~4 hours'], bg: 'bg-purple-50', fg: 'text-[#7C3AED]' },
            { icon: Phone, title: 'Call us', lines: ['+1 (800) 555-0199', 'Mon–Sat, 8am–8pm PT'], bg: 'bg-amber-50', fg: 'text-[#F59E0B]' },
            { icon: Clock, title: 'Support hours', lines: ['Live chat 24/7', 'Average wait under 2 min'], bg: 'bg-emerald-50', fg: 'text-[#16A34A]' },
          ].map(({ icon: Icon, title, lines, bg, fg }) => (
            <div key={title} className="flex gap-4 rounded-2xl border border-[#E5E7EB] bg-white p-5">
              <span className={cx('flex h-11 w-11 shrink-0 items-center justify-center rounded-xl', bg, fg)}><Icon size={20} /></span>
              <div>
                <p className="font-display text-[15px] font-bold text-[#111827]">{title}</p>
                {lines.map((l) => (
                  <p key={l} className="text-sm text-[#6B7280]">{l}</p>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-3xl border border-[#E5E7EB] bg-white p-6 shadow-lg shadow-slate-900/5 sm:p-8">
          {sent ? (
            <div className="flex min-h-80 flex-col items-center justify-center py-10 text-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
                <CheckCircle2 size={32} className="text-[#16A34A]" />
              </span>
              <h2 className="mt-4 font-display text-xl font-bold text-[#111827]">Message sent!</h2>
              <p className="mt-1.5 max-w-sm text-sm text-[#6B7280]">Thanks {form.name.split(' ')[0] || 'there'} — our support team will get back to you at {form.email} shortly.</p>
              <button onClick={() => { setSent(false); setForm({ name: '', email: '', subject: 'Order Support', message: '' }); }} className="mt-5 h-11 rounded-xl border border-[#E5E7EB] px-6 text-sm font-semibold text-[#374151] hover:border-[#2563EB] hover:text-[#2563EB]">
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={submit}>
              <h2 className="flex items-center gap-2.5 font-display text-lg font-bold text-[#111827]">
                <MessageSquare size={19} className="text-[#2563EB]" /> Send us a message
              </h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-[#111827]">Full name</label>
                  <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Jane Cooper" className={inputCls} />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-[#111827]">Email</label>
                  <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" className={inputCls} />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-sm font-semibold text-[#111827]">Subject</label>
                  <select value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className={inputCls}>
                    <option>Order Support</option>
                    <option>Product Question</option>
                    <option>Returns & Refunds</option>
                    <option>Shipping & Delivery</option>
                    <option>Partnerships</option>
                    <option>Other</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-sm font-semibold text-[#111827]">Message</label>
                  <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} rows={5} placeholder="How can we help you today?" className="w-full rounded-xl border border-[#E5E7EB] px-4 py-3 text-sm outline-none transition placeholder:text-[#9CA3AF] focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100" />
                </div>
              </div>
              {err && <p className="mt-3 rounded-xl bg-red-50 px-4 py-2.5 text-[13px] font-medium text-red-700">{err}</p>}
              <button disabled={busy} className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#2563EB] text-[15px] font-semibold text-white shadow-lg shadow-blue-600/25 transition hover:bg-[#1D4ED8] disabled:opacity-60 sm:w-auto sm:px-10">
                {busy ? <Loader2 size={17} className="animate-spin" /> : <Send size={16} />}
                {busy ? 'Sending…' : 'Send Message'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
