import React from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { useAuth } from '@/contexts/AuthContext';
import { Menu, Bell, Search, CheckCircle2, AlertCircle, LogIn, LogOut } from 'lucide-react';

const titles: Record<string, string> = {
  dashboard: 'Dashboard', employees: 'Employees', payments: 'Payments',
  transactions: 'Transactions', security: 'Security Center', settings: 'Settings',
};

const TopBar: React.FC = () => {
  const { toggleSidebar, view, bank } = useAppContext();
  const { user, openAuthModal, signOut } = useAuth();
  const initials = user?.email ? user.email.slice(0, 2).toUpperCase() : 'AC';

  return (
    <header className="sticky top-0 z-20 h-16 bg-white/80 backdrop-blur border-b border-slate-200 flex items-center justify-between px-4 lg:px-8">
      <div className="flex items-center gap-3">
        <button className="lg:hidden text-slate-500" onClick={toggleSidebar}><Menu className="h-6 w-6" /></button>
        <h1 className="text-lg lg:text-xl font-bold text-slate-800">{titles[view]}</h1>
      </div>

      <div className="flex items-center gap-3 lg:gap-5">
        <div className="hidden md:flex items-center gap-2 bg-slate-100 rounded-lg px-3 py-2 w-56">
          <Search className="h-4 w-4 text-slate-400" />
          <input placeholder="Search…" className="bg-transparent text-sm outline-none w-full text-slate-700" />
        </div>

        {user && (bank?.status === 'verified' ? (
          <span className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1.5 rounded-full">
            <CheckCircle2 className="h-3.5 w-3.5" /> Bank Verified
          </span>
        ) : (
          <span className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-1.5 rounded-full">
            <AlertCircle className="h-3.5 w-3.5" /> Bank Pending
          </span>
        ))}

        {!user ? (
          <button onClick={openAuthModal}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg flex items-center gap-2">
            <LogIn className="h-4 w-4" /> Sign In
          </button>
        ) : (
          <>
            <button className="relative text-slate-500 hover:text-slate-800">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-2.5 w-2.5 bg-rose-500 rounded-full ring-2 ring-white" />
            </button>
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-600 to-emerald-500 text-white text-sm font-bold flex items-center justify-center">{initials}</div>
              <div className="hidden lg:block">
                <p className="text-sm font-semibold text-slate-800 leading-none truncate max-w-[140px]">{user.email}</p>
                <button onClick={() => signOut()} className="text-xs text-slate-400 hover:text-rose-600 mt-0.5 flex items-center gap-1">
                  <LogOut className="h-3 w-3" /> Sign out
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </header>
  );
};

export default TopBar;
