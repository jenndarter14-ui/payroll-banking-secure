import React from 'react';
import {
  ShieldCheck, Lock, FileCheck, KeyRound, Activity, Download, CheckCircle2, Server
} from 'lucide-react';

const audit = [
  { action: 'Bank account verified via micro-deposits', user: 'admin@acme.com', time: 'Jun 23, 2026 · 09:14', ip: '192.0.2.44' },
  { action: 'Payroll batch processed (10 deposits)', user: 'system', time: 'Jun 15, 2026 · 06:00', ip: 'internal' },
  { action: 'Employee record updated — David Chen', user: 'admin@acme.com', time: 'Jun 12, 2026 · 14:22', ip: '192.0.2.44' },
  { action: 'Two-factor authentication enabled', user: 'admin@acme.com', time: 'Jun 02, 2026 · 11:08', ip: '192.0.2.44' },
  { action: 'New device login authorized', user: 'admin@acme.com', time: 'May 28, 2026 · 08:51', ip: '198.51.100.7' },
  { action: 'Tax document W-2 generated', user: 'system', time: 'May 20, 2026 · 03:00', ip: 'internal' },
];

const certs = [
  { name: 'SOC 2 Type II', desc: 'Audited security controls', icon: ShieldCheck },
  { name: 'AES-256 Encryption', desc: 'Data at rest & in transit', icon: Lock },
  { name: 'PCI DSS Level 1', desc: 'Payment data compliance', icon: FileCheck },
  { name: 'NACHA Certified', desc: 'ACH network standards', icon: Server },
];

const SecurityView: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {certs.map((c) => (
          <div key={c.name} className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
            <div className="h-10 w-10 rounded-xl bg-emerald-50 flex items-center justify-center">
              <c.icon className="h-5 w-5 text-emerald-600" />
            </div>
            <p className="font-semibold text-slate-800 mt-3 text-sm flex items-center gap-1">
              {c.name} <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
            </p>
            <p className="text-xs text-slate-400 mt-0.5">{c.desc}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-800 flex items-center gap-2"><KeyRound className="h-5 w-5 text-blue-600" /> Security Settings</h3>
          {[
            { label: 'Two-factor authentication', on: true },
            { label: 'Encryption at rest', on: true },
            { label: 'Login alerts', on: true },
            { label: 'IP allow-listing', on: false },
          ].map((s) => (
            <div key={s.label} className="flex items-center justify-between">
              <span className="text-sm text-slate-600">{s.label}</span>
              <div className={`w-11 h-6 rounded-full p-0.5 flex items-center transition-all ${s.on ? 'bg-emerald-500 justify-end' : 'bg-slate-200 justify-start'}`}>
                <div className="h-5 w-5 rounded-full bg-white shadow" />
              </div>
            </div>

          ))}
          <div className="pt-2 flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 rounded-lg p-3">
            <Lock className="h-4 w-4" /> All data encrypted end-to-end.
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-800 flex items-center gap-2"><Activity className="h-5 w-5 text-violet-600" /> Audit Log</h3>
            <button className="text-sm text-blue-600 font-medium flex items-center gap-1 hover:underline">
              <Download className="h-4 w-4" /> Export
            </button>
          </div>
          <div className="space-y-3">
            {audit.map((a, i) => (
              <div key={i} className="flex items-start gap-3 pb-3 border-b border-slate-50 last:border-0">
                <div className="h-2 w-2 rounded-full bg-violet-400 mt-2" />
                <div className="flex-1">
                  <p className="text-sm text-slate-700 font-medium">{a.action}</p>
                  <p className="text-xs text-slate-400">{a.user} · {a.time} · IP {a.ip}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityView;
