import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ChevronDown, Heart, LogOut, Menu, Package, Search, ShoppingBag, ShoppingCart, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useStore } from '../contexts/StoreContext';
import { cx } from '../lib/utils';

const links = [
  { to: '/', label: 'Home' },
  { to: '/products', label: 'Products' },
  { to: '/categories', label: 'Categories' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const { user, signOut } = useAuth();
  const { cartCount, wishlist } = useStore();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [mobileSearch, setMobileSearch] = useState(false);

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setMobileOpen(false);
    navigate(query.trim() ? `/products?search=${encodeURIComponent(query.trim())}` : '/products');
  };

  const initial = (user?.email?.[0] || 'U').toUpperCase();

  return (
    <header className="sticky top-0 z-50">
      <div className="bg-[#111827] text-white text-xs sm:text-[13px]">
        <div className="mx-auto flex max-w-7xl items-center justify-center gap-2 px-4 py-2 text-center">
          <span className="inline-flex items-center gap-1.5 font-medium tracking-wide">
            <ShoppingBag className="h-3.5 w-3.5 text-amber-400" />
            Free shipping on orders over $50
            <span className="mx-1 hidden text-white/30 sm:inline">|</span>
            <span className="hidden sm:inline">
              Use code <span className="font-bold text-amber-400">SAVE10</span> for 10% off
            </span>
          </span>
        </div>
      </div>

      <div className="border-b border-[#E5E7EB] bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:gap-5 sm:px-6">
          <Link to="/" className="flex shrink-0 items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2563EB] shadow-md shadow-blue-600/25">
              <ShoppingBag className="h-5 w-5 text-white" />
            </span>
            <span className="font-display text-xl font-bold tracking-tight text-[#111827]">
              Shop<span className="text-[#2563EB]">Sphere</span>
            </span>
          </Link>

          <nav className="ml-2 hidden items-center gap-1 lg:flex">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  cx(
                    'rounded-lg px-3.5 py-2 text-sm font-medium transition-colors',
                    isActive ? 'bg-blue-50 text-[#2563EB]' : 'text-[#4B5563] hover:bg-slate-100 hover:text-[#111827]',
                  )
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>

          <form onSubmit={submitSearch} className="ml-auto hidden min-w-0 flex-1 max-w-xs items-center md:flex">
            <div className="relative w-full">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products…"
                className="h-10 w-full rounded-full border border-[#E5E7EB] bg-[#F8FAFC] pl-9 pr-4 text-sm text-[#111827] outline-none transition placeholder:text-[#9CA3AF] focus:border-[#2563EB] focus:bg-white focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </form>

          <div className="ml-auto flex items-center gap-1 sm:gap-2 md:ml-0">
            <button
              onClick={() => setMobileSearch((v) => !v)}
              className="flex h-10 w-10 items-center justify-center rounded-full text-[#4B5563] transition hover:bg-slate-100 md:hidden"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>

            <Link
              to="/products"
              className="relative hidden h-10 w-10 items-center justify-center rounded-full text-[#4B5563] transition hover:bg-slate-100 sm:flex"
              aria-label="Wishlist"
              title="Wishlist"
            >
              <Heart className="h-5 w-5" />
              {wishlist.length > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#7C3AED] px-1 text-[10px] font-bold text-white">
                  {wishlist.length}
                </span>
              )}
            </Link>

            <Link
              to="/cart"
              className="relative flex h-10 w-10 items-center justify-center rounded-full text-[#4B5563] transition hover:bg-slate-100"
              aria-label="Cart"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span
                  key={cartCount}
                  className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 animate-[pop_0.3s_ease] items-center justify-center rounded-full bg-[#2563EB] px-1 text-[10px] font-bold text-white"
                >
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </Link>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setMenuOpen((v) => !v)}
                  className="flex items-center gap-1.5 rounded-full border border-[#E5E7EB] py-1 pl-1 pr-2 transition hover:border-[#2563EB] hover:shadow-sm"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#7C3AED] text-sm font-bold text-white">
                    {initial}
                  </span>
                  <ChevronDown className="h-4 w-4 text-[#6B7280]" />
                </button>
                {menuOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                    <div className="absolute right-0 z-20 mt-2 w-56 overflow-hidden rounded-xl border border-[#E5E7EB] bg-white shadow-xl shadow-slate-900/5">
                      <div className="border-b border-[#E5E7EB] px-4 py-3">
                        <p className="truncate text-sm font-semibold text-[#111827]">{user.email}</p>
                        <p className="text-xs text-[#6B7280]">Welcome back</p>
                      </div>
                      <Link
                        to="/orders"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#374151] transition hover:bg-slate-50"
                      >
                        <Package className="h-4 w-4 text-[#2563EB]" /> My Orders
                      </Link>
                      <button
                        onClick={() => {
                          setMenuOpen(false);
                          signOut();
                          navigate('/');
                        }}
                        className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-[#DC2626] transition hover:bg-red-50"
                      >
                        <LogOut className="h-4 w-4" /> Sign Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden h-10 items-center gap-2 rounded-full bg-[#2563EB] px-5 text-sm font-semibold text-white shadow-md shadow-blue-600/20 transition hover:bg-[#1D4ED8] sm:inline-flex"
              >
                Login
              </Link>
            )}

            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="flex h-10 w-10 items-center justify-center rounded-full text-[#111827] transition hover:bg-slate-100 lg:hidden"
              aria-label="Menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {mobileSearch && (
          <div className="border-t border-[#E5E7EB] px-4 py-3 md:hidden">
            <form onSubmit={submitSearch} className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products…"
                className="h-11 w-full rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] pl-9 pr-4 text-sm outline-none focus:border-[#2563EB] focus:bg-white"
              />
            </form>
          </div>
        )}

        {mobileOpen && (
          <nav className="border-t border-[#E5E7EB] bg-white px-4 py-3 lg:hidden">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  cx(
                    'block rounded-lg px-3 py-2.5 text-[15px] font-medium',
                    isActive ? 'bg-blue-50 text-[#2563EB]' : 'text-[#374151] hover:bg-slate-50',
                  )
                }
              >
                {l.label}
              </NavLink>
            ))}
            {!user && (
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="mt-2 flex h-11 items-center justify-center rounded-xl bg-[#2563EB] text-sm font-semibold text-white"
              >
                Login / Sign Up
              </Link>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}
