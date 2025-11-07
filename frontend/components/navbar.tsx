'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/Context/auth-context';
import { Button } from '@/components/ui/button';
import { Dumbbell, User, LogOut, Search, X, ShoppingCart, Menu, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useRouter } from 'next/navigation';
import { Input } from './ui/input';
import { useProduct } from '@/lib/Context/product.context';
import { useState } from 'react';

export function Navbar() {
  const { userToken, loading, signOut } = useAuth();
  const { search, setSearch, fetchData, cart } = useProduct();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    router.push('/login');
  };
  const handleSearch = async () => {
    if (search.trim() === '') return;
    fetchData();
  };

  return (
    <nav className="border-b bg-white sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
          <Dumbbell className="h-6 w-6 text-emerald-600" />
          <span className="font-bold text-xl text-slate-900">FITZDO</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-4">
          {userToken != null && (
            <>
              <div className="relative w-64">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 cursor-pointer"
                  onClick={handleSearch}
                />
                <Input
                  type="text"
                  placeholder="Search for Booking, Enquires..."
                  className="pl-10 w-full"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <X
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 text-slate-400 cursor-pointer"
                  onClick={() => {
                    setSearch('');
                    fetchData();
                  }}
                />
              </div>

              <div className="relative cursor-pointer" onClick={() => router.push('/cart')}>
                <ShoppingCart className="h-6 w-6 text-slate-600" />
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-emerald-600 text-white text-xs font-semibold rounded-full px-1.5">
                    {cart.length}
                  </span>
                )}
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-slate-600">Profile</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="text-red-600 cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}

          {!loading && userToken === null && (
            <>
              <Link href="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link href="/register">
                <Button className="bg-emerald-600 hover:bg-emerald-700">Register</Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-white px-4 py-4 space-y-4">
          {userToken != null && (
            <>
              <Input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <div className="flex items-center space-x-4">
                <div className="relative cursor-pointer" onClick={() => router.push('/cart')}>
                  <ShoppingCart className="h-6 w-6 text-slate-600" />
                  {cart.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-emerald-600 text-white text-xs font-semibold rounded-full px-1.5">
                      {cart.length}
                    </span>
                  )}
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full">
                      <User className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Profile</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut} className="text-red-600 cursor-pointer">
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </>
          )}

          {!loading && userToken === null && (
            <div className="flex flex-col space-y-2">
              <Link href="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link href="/register">
                <Button className="bg-emerald-600 hover:bg-emerald-700">Register</Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
