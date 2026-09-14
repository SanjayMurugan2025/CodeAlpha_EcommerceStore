import { Link } from 'react-router-dom';
import { ArrowRight, Award, Headset, Lock, ShoppingBag, Truck, Users, Target, HeartHandshake } from 'lucide-react';

export default function About() {
  return (
    <div className="bg-white">
      <div className="relative overflow-hidden bg-[#F8FAFC]">
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-blue-100/70 blur-3xl" />
        <div className="pointer-events-none absolute -left-16 bottom-0 h-56 w-56 rounded-full bg-purple-100/70 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:py-20">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#2563EB]">About ShopSphere</p>
          <h1 className="mt-2 max-w-2xl font-display text-3xl font-extrabold tracking-tight text-[#111827] sm:text-5xl">
            Shopping that puts <span className="text-[#2563EB]">you</span> first.
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-[#6B7280] sm:text-lg">
            Since 2021, ShopSphere has helped over 50,000 customers discover quality products at honest prices — backed by fast delivery and human support.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link to="/products" className="inline-flex h-12 items-center gap-2 rounded-xl bg-[#2563EB] px-7 text-[15px] font-semibold text-white shadow-lg shadow-blue-600/25 hover:bg-[#1D4ED8]">
              Shop Now <ArrowRight size={17} />
            </Link>
            <Link to="/contact" className="inline-flex h-12 items-center rounded-xl border border-[#E5E7EB] bg-white px-7 text-[15px] font-semibold text-[#111827] hover:border-[#2563EB] hover:text-[#2563EB]">
              Contact Us
            </Link>
          </div>
          <div className="mt-10 grid grid-cols-3 gap-4 max-w-lg">
            {[
              { v: '50K+', l: 'Happy customers' },
              { v: '1.2K+', l: 'Curated products' },
              { v: '4.9/5', l: 'Average rating' },
            ].map((s) => (
              <div key={s.l} className="rounded-2xl border border-[#E5E7EB] bg-white p-4 text-center">
                <p className="font-display text-2xl font-extrabold text-[#111827]">{s.v}</p>
                <p className="mt-0.5 text-xs text-[#6B7280]">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <h2 className="text-center font-display text-2xl font-bold text-[#111827] sm:text-3xl">What we stand for</h2>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Award, title: 'Curated Quality', desc: 'Every product is tested and reviewed by our team before it earns a listing.', bg: 'bg-blue-50', fg: 'text-[#2563EB]' },
            { icon: Users, title: 'Customer First', desc: 'Real humans, 24/7 support, and a 30-day no-questions return policy.', bg: 'bg-purple-50', fg: 'text-[#7C3AED]' },
            { icon: Truck, title: 'Fast & Free', desc: 'Free shipping over $50 with tracked 3–5 day delivery, nationwide.', bg: 'bg-amber-50', fg: 'text-[#F59E0B]' },
            { icon: Lock, title: 'Secure & Honest', desc: 'Encrypted checkout, transparent pricing, no hidden fees — ever.', bg: 'bg-emerald-50', fg: 'text-[#16A34A]' },
          ].map(({ icon: Icon, title, desc, bg, fg }) => (
            <div key={title} className="rounded-2xl border border-[#E5E7EB] bg-white p-6 transition hover:shadow-lg hover:shadow-slate-900/5">
              <span className={`flex h-12 w-12 items-center justify-center rounded-xl ${bg} ${fg}`}><Icon size={22} /></span>
              <h3 className="mt-4 font-display text-base font-bold text-[#111827]">{title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-[#6B7280]">{desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-14 grid gap-5 lg:grid-cols-2">
          <div className="rounded-3xl bg-[#111827] p-8 text-white sm:p-10">
            <Target size={26} className="text-amber-400" />
            <h3 className="mt-3 font-display text-xl font-bold">Our Mission</h3>
            <p className="mt-2 text-[15px] leading-relaxed text-white/75">
              To make online shopping feel effortless — one trusted destination with honest prices, dependable delivery and support that actually supports you.
            </p>
          </div>
          <div className="rounded-3xl bg-[#2563EB] p-8 text-white sm:p-10">
            <HeartHandshake size={26} className="text-white" />
            <h3 className="mt-3 font-display text-xl font-bold">Our Promise</h3>
            <p className="mt-2 text-[15px] leading-relaxed text-white/85">
              If anything arrives damaged or not as described, we'll replace it or refund you — no forms, no phone trees, no fine print.
            </p>
          </div>
        </div>

        <div className="mt-14 rounded-3xl border border-blue-100 bg-[#F8FAFC] p-8 text-center sm:p-12">
          <ShoppingBag size={30} className="mx-auto text-[#2563EB]" />
          <h2 className="mt-3 font-display text-2xl font-bold text-[#111827]">Ready to shop smarter?</h2>
          <p className="mx-auto mt-2 max-w-md text-[15px] text-[#6B7280]">Join 50,000+ happy customers and discover your next favorite product today.</p>
          <Link to="/products" className="mt-6 inline-flex h-12 items-center gap-2 rounded-xl bg-[#2563EB] px-8 text-[15px] font-semibold text-white shadow-lg shadow-blue-600/25 hover:bg-[#1D4ED8]">
            Explore Products <ArrowRight size={17} />
          </Link>
          <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-[#9CA3AF]"><Headset size={13} /> Questions? Our team replies within hours.</p>
        </div>
      </div>
    </div>
  );
}
