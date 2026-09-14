import { Link } from 'react-router-dom';
import { Facebook, Instagram, ShoppingBag, Twitter, Youtube, MapPin, Mail, Phone } from 'lucide-react';

const cols = [
  {
    title: 'Quick Links',
    links: [
      { label: 'Home', to: '/' },
      { label: 'Products', to: '/products' },
      { label: 'Categories', to: '/categories' },
      { label: 'About Us', to: '/about' },
      { label: 'Contact', to: '/contact' },
    ],
  },
  {
    title: 'Customer Support',
    links: [
      { label: 'Help Center', to: '/contact' },
      { label: 'Shipping Info', to: '/about' },
      { label: 'Returns & Refunds', to: '/about' },
      { label: 'Track Order', to: '/orders' },
      { label: 'FAQs', to: '/contact' },
    ],
  },
  {
    title: 'Account',
    links: [
      { label: 'Sign In', to: '/login' },
      { label: 'Create Account', to: '/register' },
      { label: 'My Cart', to: '/cart' },
      { label: 'My Orders', to: '/orders' },
      { label: 'Wishlist', to: '/products' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-[#E5E7EB] bg-[#F8FAFC]">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1.2fr]">
          <div>
            <Link to="/" className="flex items-center gap-2.5">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2563EB] shadow-md shadow-blue-600/25">
                <ShoppingBag className="h-5 w-5 text-white" />
              </span>
              <span className="font-display text-xl font-bold tracking-tight text-[#111827]">
                Shop<span className="text-[#2563EB]">Sphere</span>
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-[#6B7280]">
              Your trusted online shopping destination.
            </p>
            <div className="mt-4 space-y-2 text-sm text-[#6B7280]">
              <p className="flex items-center gap-2"><MapPin className="h-4 w-4 text-[#2563EB]" /> 548 Market Street, San Francisco, CA</p>
              <p className="flex items-center gap-2"><Mail className="h-4 w-4 text-[#2563EB]" /> support@shopsphere.com</p>
              <p className="flex items-center gap-2"><Phone className="h-4 w-4 text-[#2563EB]" /> +1 (800) 555-0199</p>
            </div>
          </div>

          {cols.map((c) => (
            <div key={c.title}>
              <h4 className="text-sm font-bold uppercase tracking-wider text-[#111827]">{c.title}</h4>
              <ul className="mt-4 space-y-2.5">
                {c.links.map((l) => (
                  <li key={l.label}>
                    <Link to={l.to} className="text-sm text-[#6B7280] transition hover:text-[#2563EB]">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-[#111827]">Follow Us</h4>
            <p className="mt-4 text-sm text-[#6B7280]">Get deals & new arrivals first.</p>
            <div className="mt-4 flex gap-2.5">
              {[
                { icon: Facebook, label: 'Facebook' },
                { icon: Twitter, label: 'Twitter' },
                { icon: Instagram, label: 'Instagram' },
                { icon: Youtube, label: 'YouTube' },
              ].map(({ icon: Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  onClick={(e) => e.preventDefault()}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E5E7EB] bg-white text-[#6B7280] transition hover:border-[#2563EB] hover:bg-[#2563EB] hover:text-white"
                >
                  <Icon className="h-4.5 w-4.5" size={18} />
                </a>
              ))}
            </div>
            <form onSubmit={(e) => e.preventDefault()} className="mt-5">
              <div className="flex overflow-hidden rounded-xl border border-[#E5E7EB] bg-white focus-within:border-[#2563EB]">
                <input
                  placeholder="Email address"
                  type="email"
                  className="h-11 w-full bg-transparent px-3.5 text-sm outline-none placeholder:text-[#9CA3AF]"
                />
                <button className="shrink-0 bg-[#2563EB] px-4 text-sm font-semibold text-white transition hover:bg-[#1D4ED8]">
                  Join
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-[#E5E7EB] pt-6 sm:flex-row">
          <p className="text-xs text-[#9CA3AF]">© 2026 ShopSphere. All rights reserved.</p>
          <div className="flex gap-5 text-xs text-[#9CA3AF]">
            <a href="#" onClick={(e) => e.preventDefault()} className="transition hover:text-[#2563EB]">Privacy Policy</a>
            <a href="#" onClick={(e) => e.preventDefault()} className="transition hover:text-[#2563EB]">Terms of Service</a>
            <a href="#" onClick={(e) => e.preventDefault()} className="transition hover:text-[#2563EB]">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
