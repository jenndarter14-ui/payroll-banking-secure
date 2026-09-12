import React, { useState, useMemo } from 'react';
import { TRANSACTIONS, fmt } from '@/data/payroll';
import { Search, Download, Filter } from 'lucide-react';

const statusStyle: Record<string, string> = {
  Completed: 'bg-emerald-50 text-emerald-700',
  Processing: 'bg-blue-50 text-blue-700',
  Pending: 'bg-amber-50 text-amber-700',
  Failed: 'bg-rose-50 text-rose-700',
};

const TransactionsView: React.FC = () => {
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('All');
  const [period, setPeriod] = useState('All');

  const periods = useMemo(() => ['All', ...Array.from(new Set(TRANSACTIONS.map((t) => t.period)))], []);

  const filtered = TRANSACTIONS.filter((t) =>
    (status === 'All' || t.status === status) &&
    (period === 'All' || t.period === period) &&
    t.employeeName.toLowerCase().includes(q.toLowerCase())
  );

  const exportCsv = () => {
    const header = 'ID,Employee,Amount,Date,Status,Period\n';
    const rows = filtered.map((t) => `${t.id},${t.employeeName},${t.amount},${t.date},${t.status},"${t.period}"`).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'transactions.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="flex items-center gap-2 bg-white rounded-lg px-3 py-2.5 border border-slate-200 w-full lg:w-72">
          <Search className="h-4 w-4 text-slate-400" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search employee…"
            className="bg-transparent text-sm outline-none w-full text-slate-700" />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Filter className="h-4 w-4 text-slate-400 hidden sm:block" />
          <select value={status} onChange={(e) => setStatus(e.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-200">
            {['All', 'Completed', 'Processing', 'Pending', 'Failed'].map((s) => <option key={s}>{s}</option>)}
          </select>
          <select value={period} onChange={(e) => setPeriod(e.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-200">
            {periods.map((p) => <option key={p}>{p}</option>)}
          </select>
          <button onClick={exportCsv}
            className="bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2">
            <Download className="h-4 w-4" /> Export
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-400 border-b border-slate-100 bg-slate-50/50">
                <th className="px-5 py-3 font-medium">Transaction ID</th>
                <th className="px-5 py-3 font-medium">Employee</th>
                <th className="px-5 py-3 font-medium">Amount</th>
                <th className="px-5 py-3 font-medium">Date</th>
                <th className="px-5 py-3 font-medium">Period</th>
                <th className="px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t) => (
                <tr key={t.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                  <td className="px-5 py-3 font-mono text-xs text-slate-500">{t.id}</td>
                  <td className="px-5 py-3 font-medium text-slate-800">{t.employeeName}</td>
                  <td className="px-5 py-3 font-semibold text-slate-800">{fmt(t.amount)}</td>
                  <td className="px-5 py-3 text-slate-500">{t.date}</td>
                  <td className="px-5 py-3 text-slate-500 whitespace-nowrap">{t.period}</td>
                  <td className="px-5 py-3">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusStyle[t.status]}`}>{t.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && <p className="text-center text-slate-400 py-12">No transactions match your filters.</p>}
      </div>
      <p className="text-xs text-slate-400">Showing {filtered.length} of {TRANSACTIONS.length} transactions</p>
    </div>
  );
};

export default TransactionsView;
