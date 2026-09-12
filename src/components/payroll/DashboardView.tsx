import React from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { EMPLOYEES, TRANSACTIONS, monthlyPay, fmt } from '@/data/payroll';
import {
  Users, DollarSign, CalendarClock, TrendingUp, Building2, ShieldCheck,
  AlertCircle, ArrowRight, CheckCircle2, Loader2
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const { setWizardOpen, bank, setView, employees } = useAppContext();

  const active = employees.filter((e) => e.status === 'Active');
  const nextRun = active.reduce((s, e) => s + monthlyPay(e), 0);
  const lastMonth = EMPLOYEES.slice(0, 10).reduce((s, e) => s + monthlyPay(e), 0);

  const stats = [
    { label: 'Total Employees', value: employees.length, icon: Users, color: 'blue', sub: `${active.length} active` },
    { label: 'Next Payroll', value: fmt(nextRun), icon: DollarSign, color: 'emerald', sub: 'Jun 30, 2026' },
    { label: 'Last Pay Run', value: fmt(lastMonth), icon: TrendingUp, color: 'violet', sub: 'Jun 15, 2026' },
    { label: 'Pay Schedule', value: 'Semi-monthly', icon: CalendarClock, color: 'amber', sub: '1st & 15th' },
  ];
  const colors: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-600', emerald: 'bg-emerald-50 text-emerald-600',
    violet: 'bg-violet-50 text-violet-600', amber: 'bg-amber-50 text-amber-600',
  };

  return (
    <div className="space-y-6">
      {/* Hero / bank connection */}
      {!bank || bank.status !== 'verified' ? (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-700 via-blue-600 to-emerald-600 text-white p-6 lg:p-8">
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/15 rounded-full px-3 py-1 text-xs font-medium mb-4">
              <ShieldCheck className="h-3.5 w-3.5" /> SOC 2 · AES-256 Encrypted · ACH Certified
            </div>
            <h2 className="text-2xl lg:text-3xl font-bold leading-tight">
              Connect Your Bank in 3 Minutes
            </h2>
            <p className="mt-2 text-white/85 text-sm lg:text-base">
              Link your business account with routing & account numbers. We verify with two
              micro-deposits so your direct deposits run flawlessly.
            </p>
            <div className="flex flex-wrap items-center gap-3 mt-5">
              <button
                onClick={() => setWizardOpen(true)}
                className="bg-white text-blue-700 font-semibold px-5 py-2.5 rounded-xl flex items-center gap-2 hover:bg-blue-50 transition-colors"
              >
                {bank ? 'Finish Verification' : 'Connect Bank Account'} <ArrowRight className="h-4 w-4" />
              </button>
              {bank && bank.status !== 'verified' && (
                <span className="flex items-center gap-1.5 text-sm text-amber-100">
                  <Loader2 className="h-4 w-4 animate-spin" /> Awaiting micro-deposit verification
                </span>
              )}
            </div>
          </div>
          <div className="absolute -right-10 -bottom-10 h-48 w-48 rounded-full bg-white/10" />
          <div className="absolute right-20 top-0 h-32 w-32 rounded-full bg-white/5" />
        </div>
      ) : (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-xl bg-white flex items-center justify-center shadow-sm">
              <Building2 className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="font-semibold text-slate-800 flex items-center gap-2">
                {bank.bankName} <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              </p>
              <p className="text-sm text-slate-500 capitalize">{bank.accountType} •••• {bank.accountLast4} · Verified & active</p>
            </div>
          </div>
          <button onClick={() => setView('payments')} className="text-sm font-semibold text-emerald-700 hover:underline flex items-center gap-1">
            Schedule Payroll <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
            <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${colors[s.color]}`}>
              <s.icon className="h-5 w-5" />
            </div>
            <p className="text-2xl font-bold text-slate-800 mt-3">{s.value}</p>
            <p className="text-sm text-slate-500">{s.label}</p>
            <p className="text-xs text-slate-400 mt-1">{s.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming payroll */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-800">Upcoming Payroll — Jun 30</h3>
            <button onClick={() => setView('transactions')} className="text-sm text-blue-600 font-medium hover:underline">View all</button>
          </div>
          <div className="space-y-3">
            {active.slice(0, 5).map((e) => (
              <div key={e.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src={e.photo} alt={e.name} className="h-9 w-9 rounded-full object-cover" />
                  <div>
                    <p className="text-sm font-medium text-slate-800">{e.name}</p>
                    <p className="text-xs text-slate-400">{e.role}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-slate-800">{fmt(monthlyPay(e))}</p>
                  <p className="text-xs text-emerald-600">Scheduled</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent activity */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {TRANSACTIONS.slice(0, 5).map((t) => (
              <div key={t.id} className="flex items-start gap-3">
                <div className={`h-2 w-2 rounded-full mt-1.5 ${
                  t.status === 'Completed' ? 'bg-emerald-500' :
                  t.status === 'Processing' ? 'bg-blue-500' :
                  t.status === 'Failed' ? 'bg-rose-500' : 'bg-amber-500'
                }`} />
                <div className="flex-1">
                  <p className="text-sm text-slate-700">{t.employeeName}</p>
                  <p className="text-xs text-slate-400">{fmt(t.amount)} · {t.status}</p>
                </div>
              </div>
            ))}
          </div>
          {(!bank || bank.status !== 'verified') && (
            <div className="mt-4 flex items-start gap-2 text-xs text-amber-700 bg-amber-50 rounded-lg p-3">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              Connect your bank to enable direct deposits.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
