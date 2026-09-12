import React, { useState } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { Employee, monthlyPay, fmt } from '@/data/payroll';
import { Search, Mail, CreditCard, Pencil, X, UserPlus, Check } from 'lucide-react';

const statusColor: Record<string, string> = {
  Active: 'bg-emerald-50 text-emerald-700',
  Pending: 'bg-amber-50 text-amber-700',
  Paused: 'bg-slate-100 text-slate-500',
};

const EditModal: React.FC<{ emp: Employee; onClose: () => void }> = ({ emp, onClose }) => {
  const { updateEmployee } = useAppContext();
  const [draft, setDraft] = useState<Employee>(emp);

  const save = () => { updateEmployee(draft); onClose(); };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-slate-800">Edit Employee</h3>
          <button onClick={onClose}><X className="h-5 w-5 text-slate-400" /></button>
        </div>
        <div className="flex items-center gap-3 mb-4">
          <img src={draft.photo} alt={draft.name} className="h-12 w-12 rounded-full object-cover" />
          <input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })}
            className="flex-1 px-3 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-blue-200 text-slate-800" />
        </div>
        <div className="space-y-3">
          <div>
            <label className="text-xs font-medium text-slate-500">Role</label>
            <input value={draft.role} onChange={(e) => setDraft({ ...draft, role: e.target.value })}
              className="w-full mt-1 px-3 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-blue-200 text-slate-800" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-slate-500">Pay Type</label>
              <select value={draft.payType} onChange={(e) => setDraft({ ...draft, payType: e.target.value as Employee['payType'] })}
                className="w-full mt-1 px-3 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-blue-200 text-slate-800">
                <option>Salary</option><option>Hourly</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500">{draft.payType === 'Salary' ? 'Annual ($)' : 'Hourly ($)'}</label>
              <input type="number" value={draft.rate} onChange={(e) => setDraft({ ...draft, rate: Number(e.target.value) })}
                className="w-full mt-1 px-3 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-blue-200 text-slate-800" />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-slate-500">Status</label>
            <div className="flex gap-2 mt-1">
              {(['Active', 'Pending', 'Paused'] as const).map((s) => (
                <button key={s} onClick={() => setDraft({ ...draft, status: s })}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium ${draft.status === s ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
        <button onClick={save} className="w-full mt-5 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-xl flex items-center justify-center gap-2">
          <Check className="h-4 w-4" /> Save Changes
        </button>
      </div>
    </div>
  );
};

const EmployeesView: React.FC = () => {
  const { employees } = useAppContext();
  const [q, setQ] = useState('');
  const [filter, setFilter] = useState('All');
  const [editing, setEditing] = useState<Employee | null>(null);

  const filtered = employees.filter((e) =>
    (filter === 'All' || e.status === filter) &&
    (e.name.toLowerCase().includes(q.toLowerCase()) || e.role.toLowerCase().includes(q.toLowerCase()))
  );

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 bg-white rounded-lg px-3 py-2.5 border border-slate-200 w-full sm:w-80">
          <Search className="h-4 w-4 text-slate-400" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name or role…"
            className="bg-transparent text-sm outline-none w-full text-slate-700" />
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-white border border-slate-200 rounded-lg p-1">
            {['All', 'Active', 'Pending', 'Paused'].map((f) => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium ${filter === f ? 'bg-blue-600 text-white' : 'text-slate-500'}`}>
                {f}
              </button>
            ))}
          </div>
          <button className="bg-slate-800 hover:bg-slate-900 text-white px-4 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2">
            <UserPlus className="h-4 w-4" /> Add
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((e) => (
          <div key={e.id} className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-shadow group">
            <div className="flex items-start justify-between">
              <img src={e.photo} alt={e.name} className="h-14 w-14 rounded-full object-cover ring-2 ring-slate-100" />
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColor[e.status]}`}>{e.status}</span>
            </div>
            <p className="font-bold text-slate-800 mt-3">{e.name}</p>
            <p className="text-sm text-slate-500">{e.role}</p>
            <div className="mt-3 space-y-1.5 text-xs text-slate-500">
              <p className="flex items-center gap-1.5 truncate"><Mail className="h-3.5 w-3.5" />{e.email}</p>
              <p className="flex items-center gap-1.5"><CreditCard className="h-3.5 w-3.5" />Deposit •••• {e.bankLast4}</p>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-slate-800">{fmt(monthlyPay(e))}</p>
                <p className="text-xs text-slate-400">per pay period</p>
              </div>
              <button onClick={() => setEditing(e)}
                className="text-slate-400 hover:text-blue-600 p-2 rounded-lg hover:bg-blue-50 transition-colors">
                <Pencil className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
      {filtered.length === 0 && <p className="text-center text-slate-400 py-12">No employees match your search.</p>}

      {editing && <EditModal emp={editing} onClose={() => setEditing(null)} />}
    </div>
  );
};

export default EmployeesView;
