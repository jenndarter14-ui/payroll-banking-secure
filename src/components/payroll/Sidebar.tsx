import React from 'react';
import { useAppContext, ViewKey } from '@/contexts/AppContext';
import {
  LayoutDashboard, Users, CalendarClock, Receipt, ShieldCheck, Settings, ShieldHalf, X
} from 'lucide-react';

const items: { key: ViewKey; label: string; icon: React.ElementType }[] = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { key: 'employees', label: 'Employees', icon: Users },
  { key: 'payments', label: 'Payments', icon: CalendarClock },
  { key: 'transactions', label: 'Transactions', icon: Receipt },
  { key: 'security', label: 'Security Center', icon: ShieldCheck },
  { key: 'settings', label: 'Settings', icon: Settings },
];

const Sidebar: React.FC = () => {
  const { view, setView, sidebarOpen, closeSidebar } = useAppContext();

  return (
    <>
      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-slate-900/40 lg:hidden" onClick={closeSidebar} />
      )}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-40 h-screen w-64 shrink-0 bg-white border-r border-slate-200 flex flex-col transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="h-16 flex items-center justify-between px-5 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-blue-600 to-emerald-500 flex items-center justify-center">
              <ShieldHalf className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-slate-800 text-lg tracking-tight">PayFlow</span>
          </div>
          <button className="lg:hidden text-slate-400" onClick={closeSidebar}>
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {items.map(({ key, label, icon: Icon }) => {
            const active = view === key;
            return (
              <button
                key={key}
                onClick={() => { setView(key); closeSidebar(); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  active
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon className={`h-5 w-5 ${active ? 'text-blue-600' : 'text-slate-400'}`} />
                {label}
              </button>
            );
          })}
        </nav>

        <div className="p-4 m-3 rounded-xl bg-gradient-to-br from-slate-900 to-slate-700 text-white">
          <div className="flex items-center gap-2 text-emerald-300 text-xs font-semibold">
            <ShieldCheck className="h-4 w-4" /> SOC 2 Type II
          </div>
          <p className="mt-2 text-xs text-slate-300 leading-relaxed">
            Bank-grade 256-bit encryption protects every transaction.
          </p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
