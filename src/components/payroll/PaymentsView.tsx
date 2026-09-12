import React, { useState } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { monthlyPay, fmt } from '@/data/payroll';
import {
  ChevronLeft, ChevronRight, Calendar, Repeat, Play, CheckCircle2,
  Loader2, AlertCircle, DollarSign, Users
} from 'lucide-react';

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAYS = ['Su','Mo','Tu','We','Th','Fr','Sa'];

const PaymentsView: React.FC = () => {
  const { employees, bank } = useAppContext();
  const [month, setMonth] = useState(5); // June (0-indexed)
  const year = 2026;
  const [frequency, setFrequency] = useState('Semi-monthly');
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);

  const active = employees.filter((e) => e.status === 'Active');
  const total = active.reduce((s, e) => s + monthlyPay(e), 0);

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const payDays = [1, 15, 30];

  const runPayroll = () => {
    if (!bank || bank.status !== 'verified') return;
    setRunning(true); setDone(false);
    setTimeout(() => { setRunning(false); setDone(true); }, 2200);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Calendar */}
      <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-600" /> Payroll Calendar
          </h3>
          <div className="flex items-center gap-2">
            <button onClick={() => setMonth((m) => (m + 11) % 12)} className="p-1.5 rounded-lg hover:bg-slate-100"><ChevronLeft className="h-4 w-4 text-slate-500" /></button>
            <span className="text-sm font-semibold text-slate-700 w-28 text-center">{MONTHS[month]} {year}</span>
            <button onClick={() => setMonth((m) => (m + 1) % 12)} className="p-1.5 rounded-lg hover:bg-slate-100"><ChevronRight className="h-4 w-4 text-slate-500" /></button>
          </div>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center">
          {DAYS.map((d) => <div key={d} className="text-xs font-semibold text-slate-400 py-2">{d}</div>)}
          {Array.from({ length: firstDay }).map((_, i) => <div key={`e${i}`} />)}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const isPay = payDays.includes(day);
            return (
              <div key={day} className={`aspect-square rounded-lg flex flex-col items-center justify-center text-sm relative ${
                isPay ? 'bg-blue-50 text-blue-700 font-bold ring-1 ring-blue-200' : 'text-slate-600 hover:bg-slate-50'
              }`}>
                {day}
                {isPay && <span className="absolute bottom-1 h-1.5 w-1.5 rounded-full bg-blue-500" />}
              </div>
            );
          })}
        </div>
        <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
          <span className="h-2.5 w-2.5 rounded-full bg-blue-500" /> Scheduled pay date
        </div>
      </div>

      {/* Run payroll panel */}
      <div className="space-y-5">
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Repeat className="h-5 w-5 text-emerald-600" /> Recurring Setup</h3>
          <label className="text-xs font-medium text-slate-500">Frequency</label>
          <select value={frequency} onChange={(e) => setFrequency(e.target.value)}
            className="w-full mt-1 px-3 py-2.5 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-blue-200 text-slate-800 text-sm">
            <option>Weekly</option><option>Bi-weekly</option><option>Semi-monthly</option><option>Monthly</option>
          </select>
          <div className="mt-4 flex items-center justify-between text-sm">
            <span className="text-slate-500">Next run</span>
            <span className="font-semibold text-slate-800">Jun 30, 2026</span>
          </div>
          <div className="flex items-center justify-between text-sm mt-2">
            <span className="text-slate-500">Auto-process</span>
            <span className="font-semibold text-emerald-600">Enabled</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-slate-900 to-slate-700 rounded-2xl p-6 text-white shadow-sm">
          <p className="text-sm text-slate-300">Batch payment total</p>
          <p className="text-3xl font-bold mt-1">{fmt(total)}</p>
          <div className="flex items-center gap-4 mt-3 text-sm text-slate-300">
            <span className="flex items-center gap-1.5"><Users className="h-4 w-4" />{active.length} employees</span>
            <span className="flex items-center gap-1.5"><DollarSign className="h-4 w-4" />Direct deposit</span>
          </div>

          {!bank || bank.status !== 'verified' ? (
            <div className="mt-4 flex items-start gap-2 text-xs text-amber-200 bg-amber-500/20 rounded-lg p-3">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" /> Verify your bank account before running payroll.
            </div>
          ) : done ? (
            <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-emerald-300 bg-emerald-500/20 rounded-lg p-3">
              <CheckCircle2 className="h-5 w-5" /> Payroll submitted! {active.length} deposits processing.
            </div>
          ) : (
            <button onClick={runPayroll} disabled={running}
              className="mt-4 w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-60 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2">
              {running ? <><Loader2 className="h-4 w-4 animate-spin" /> Processing batch…</> : <><Play className="h-4 w-4" /> Run Payroll Now</>}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentsView;
