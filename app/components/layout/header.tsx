'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, User, LogIn, Settings, LogOut } from 'lucide-react';
import { siteConfig } from '../../lib/config/site';
import { Button } from '../../components/ui/button';

import Image from 'next/image';
import CartButton from '../cart/CartButton';

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Music', href: '/music' },
  { name: 'Shows', href: '/shows' },
  { name: 'Store', href: '/store' },
  { name: 'Gallery', href: '/gallery' },
  { name: 'Booking', href: '/booking' },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  // Mock user state - replace with actual auth logic
  const [user, setUser] = useState<{ name: string; avatar?: string; email: string } | null>(null);

  const handleLogin = () => {
    // Mock login - replace with actual auth logic
    setUser({
      name: 'John Doe',
      email: 'john@example.com',
      avatar: '/images/Bugle_1.png', // Using existing image as placeholder
    });
  };

  const handleLogout = () => {
    setUser(null);
    setProfileDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10  backdrop-blur-sm text-white">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center">
          {/* Mobile Layout */}
          <div className="flex md:hidden w-full items-center justify-between">
            {/* Mobile menu button */}
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>

            {/* Mobile logo */}
            <Link href="/" className="flex items-center space-x-2">
              <span className="font-bold text-xl text-black">{siteConfig.name}</span>
            </Link>

            {/* Mobile cart & auth */}
            <div className="flex items-center gap-2">
              <CartButton />
              <div className="relative">
                {user ? (
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="text-black relative w-8 h-8 rounded-full overflow-hidden ring-2 ring-orange-400/50 hover:ring-orange-400 transition-all"
                  >
                    {user.avatar ? (
                      <Image src={user.avatar} alt={user.name} fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full bg-orange-400 flex items-center justify-center">
                        <User className="h-4 w-4 text-white" />
                      </div>
                    )}
                  </button>
                ) : (
                  <Button onClick={handleLogin} size="sm" variant="ghost">
                    <LogIn className="h-4 w-4 bg-amber-400" />
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Desktop Layout - Centered */}
          <div className="hidden md:flex w-full items-center">
            {/* Left: Logo */}
            <div className="flex-1">
              <Link href="/" className="flex items-center space-x-2">
                <span className="font-bold text-xl text-black">{siteConfig.name}</span>
              </Link>
            </div>

            {/* Center: Navigation */}
            <nav className="flex items-center gap-8 text-sm">
              {navigation.map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="transition-colors hover:text-foreground/80 text-foreground/60 font-medium"
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Right: Cart & Auth */}
            <div className="flex-1 flex justify-end items-center gap-4 text-black">
              <CartButton />
              <div className="relative">
                {user ? (
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="text-black relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-orange-400/50 hover:ring-orange-400 transition-all"
                  >
                    {user.avatar ? (
                      <Image src={user.avatar} alt={user.name} fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full bg-orange-400 flex items-center justify-center">
                        <User className="h-5 w-5 text-white" />
                      </div>
                    )}
                  </button>
                ) : (
                  <Button onClick={handleLogin} variant="outline">
                    <LogIn className="h-4 w-4 mr-2" />
                    Login
                  </Button>
                )}

                {/* Profile Dropdown */}
                {user && profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 ring-1 ring-white/20 backdrop-blur-sm focus:outline-none z-50">
                    <div className="py-1">
                      <div className="px-4 py-3 border-b border-white/20">
                        <p className="text-sm font-medium text-white">{user.name}</p>
                        <p className="text-sm text-white/70">{user.email}</p>
                      </div>
                      <Link
                        href="/profile"
                        className="flex items-center px-4 py-2 text-sm text-white hover:bg-white/10 transition-colors"
                        onClick={() => setProfileDropdownOpen(false)}
                      >
                        <User className="h-4 w-4 mr-3" />
                        Profile
                      </Link>
                      <Link
                        href="/settings"
                        className="flex items-center px-4 py-2 text-sm text-white hover:bg-white/10 transition-colors"
                        onClick={() => setProfileDropdownOpen(false)}
                      >
                        <Settings className="h-4 w-4 mr-3" />
                        Settings
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-white hover:bg-white/10 transition-colors"
                      >
                        <LogOut className="h-4 w-4 mr-3" />
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Mobile navigation dropdown */}
          {mobileMenuOpen && (
            <div className="absolute top-16 left-0 right-0 z-50 md:hidden">
              <div className="bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 shadow-lg ring-1 ring-white/20 backdrop-blur-sm">
                <div className="px-2 pt-2 pb-3 space-y-1">
                  {navigation.map(item => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="block px-3 py-2 text-base font-medium text-white hover:bg-white/10 rounded-md transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}

                  {/* Mobile auth section */}
                  {user && (
                    <div className="border-t border-white/20 pt-3 mt-3">
                      <div className="px-3 py-2">
                        <p className="text-sm font-medium text-white">{user.name}</p>
                        <p className="text-sm text-white/70">{user.email}</p>
                      </div>
                      <Link
                        href="/profile"
                        className="flex items-center px-3 py-2 text-base font-medium text-white hover:bg-white/10 rounded-md transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <User className="h-5 w-5 mr-3" />
                        Profile
                      </Link>
                      <Link
                        href="/settings"
                        className="flex items-center px-3 py-2 text-base font-medium text-white hover:bg-white/10 rounded-md transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Settings className="h-5 w-5 mr-3" />
                        Settings
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-3 py-2 text-base font-medium text-white hover:bg-white/10 rounded-md transition-colors"
                      >
                        <LogOut className="h-5 w-5 mr-3" />
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Mobile profile dropdown */}
          {user && profileDropdownOpen && (
            <div className="absolute top-16 right-4 z-50 md:hidden">
              <div className="w-56 rounded-md shadow-lg bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 ring-1 ring-white/20 backdrop-blur-sm">
                <div className="py-1">
                  <div className="px-4 py-3 border-b border-white/20">
                    <p className="text-sm font-medium text-white">{user.name}</p>
                    <p className="text-sm text-white/70">{user.email}</p>
                  </div>
                  <Link
                    href="/profile"
                    className="flex items-center px-4 py-2 text-sm text-white hover:bg-white/10 transition-colors"
                    onClick={() => setProfileDropdownOpen(false)}
                  >
                    <User className="h-4 w-4 mr-3" />
                    Profile
                  </Link>
                  <Link
                    href="/settings"
                    className="flex items-center px-4 py-2 text-sm text-white hover:bg-white/10 transition-colors"
                    onClick={() => setProfileDropdownOpen(false)}
                  >
                    <Settings className="h-4 w-4 mr-3" />
                    Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-sm text-white hover:bg-white/10 transition-colors"
                  >
                    <LogOut className="h-4 w-4 mr-3" />
                    Sign out
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
