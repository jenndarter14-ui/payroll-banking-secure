import React, { useState } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import {
  Building2, Receipt, Wallet, Bell, Mail, CheckCircle2, Loader2, Phone, CreditCard, Trash2
} from 'lucide-react';

const SettingsView: React.FC = () => {
  const { bank, setBank, setWizardOpen } = useAppContext();
  const [tab, setTab] = useState('business');
  const [notif, setNotif] = useState({ payroll: true, deposits: true, security: true, product: false });

  // Newsletter signup
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [sms, setSms] = useState(true);
  const [subState, setSubState] = useState<'idle' | 'loading' | 'done'>('idle');

  const subscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubState('loading');
    try {
      await fetch('https://famous.ai/api/crm/6a3a0032b0872afcb1d600c7/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          phone: phone || undefined,
          sms_opt_in: sms,
          source: 'settings-newsletter',
          tags: ['payroll', 'newsletter'],
        }),
      });
    } catch {}
    setSubState('done');
  };

  const tabs = [
    { key: 'business', label: 'Business Profile', icon: Building2 },
    { key: 'tax', label: 'Tax Information', icon: Receipt },
    { key: 'payment', label: 'Payment Preferences', icon: Wallet },
    { key: 'notifications', label: 'Notifications', icon: Bell },
  ];

  const Input = ({ label, value }: { label: string; value: string }) => (
    <div>
      <label className="text-xs font-medium text-slate-500">{label}</label>
      <input defaultValue={value}
        className="w-full mt-1 px-3 py-2.5 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-blue-200 text-slate-800 text-sm" />
    </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-1 space-y-1">
        {tabs.map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-left ${
              tab === t.key ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'
            }`}>
            <t.icon className={`h-4 w-4 ${tab === t.key ? 'text-blue-600' : 'text-slate-400'}`} /> {t.label}
          </button>
        ))}
      </div>

      <div className="lg:col-span-3 space-y-6">
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
          {tab === 'business' && (
            <div className="space-y-4">
              <h3 className="font-bold text-slate-800">Business Profile</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <Input label="Legal Business Name" value="Acme Corporation" />
                <Input label="DBA" value="Acme Corp" />
                <Input label="Business Email" value="payroll@acme.com" />
                <Input label="Phone" value="(415) 555-0192" />
                <Input label="Address" value="500 Market St, Suite 400" />
                <Input label="City / State / ZIP" value="San Francisco, CA 94105" />
              </div>
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-xl text-sm">Save Profile</button>
            </div>
          )}

          {tab === 'tax' && (
            <div className="space-y-4">
              <h3 className="font-bold text-slate-800">Tax Information</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <Input label="Federal EIN" value="84-1234567" />
                <Input label="State Tax ID" value="CA-998877" />
                <Input label="Filing Frequency" value="Quarterly" />
                <Input label="Tax Jurisdiction" value="California" />
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 rounded-lg p-3">
                <Receipt className="h-4 w-4 text-blue-600" /> Form 941 filings are automatically prepared each quarter.
              </div>
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-xl text-sm">Save Tax Info</button>
            </div>
          )}

          {tab === 'payment' && (
            <div className="space-y-4">
              <h3 className="font-bold text-slate-800">Payment Preferences</h3>
              {bank ? (
                <div className="flex items-center justify-between bg-slate-50 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-white flex items-center justify-center shadow-sm">
                      <CreditCard className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800 text-sm flex items-center gap-1">
                        {bank.bankName}
                        {bank.status === 'verified' && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />}
                      </p>
                      <p className="text-xs text-slate-500 capitalize">{bank.accountType} •••• {bank.accountLast4} · {bank.status.replace('_', ' ')}</p>
                    </div>
                  </div>
                  <button onClick={() => { setBank(null); }} className="text-slate-400 hover:text-rose-600 p-2 rounded-lg hover:bg-rose-50">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <button onClick={() => setWizardOpen(true)}
                  className="w-full border-2 border-dashed border-slate-200 rounded-xl p-6 text-slate-500 hover:border-blue-300 hover:text-blue-600 transition-colors text-sm font-medium">
                  + Connect a business bank account
                </button>
              )}
              <div className="grid sm:grid-cols-2 gap-4 pt-2">
                <Input label="Default Pay Schedule" value="Semi-monthly" />
                <Input label="Processing Lead Time" value="2 business days" />
              </div>
            </div>
          )}

          {tab === 'notifications' && (
            <div className="space-y-4">
              <h3 className="font-bold text-slate-800">Notification Controls</h3>
              {[
                { key: 'payroll', label: 'Payroll run reminders' },
                { key: 'deposits', label: 'Deposit confirmations' },
                { key: 'security', label: 'Security & login alerts' },
                { key: 'product', label: 'Product updates' },
              ].map((n) => (
                <div key={n.key} className="flex items-center justify-between py-1">
                  <span className="text-sm text-slate-600">{n.label}</span>
                  <button onClick={() => setNotif((p) => ({ ...p, [n.key]: !p[n.key as keyof typeof p] }))}
                    className={`w-11 h-6 rounded-full p-0.5 flex transition-all ${notif[n.key as keyof typeof notif] ? 'bg-emerald-500 justify-end' : 'bg-slate-200 justify-start'}`}>
                    <div className="h-5 w-5 rounded-full bg-white shadow" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Newsletter signup */}
        <div className="bg-gradient-to-br from-blue-700 to-emerald-600 rounded-2xl p-6 text-white shadow-sm">
          <h3 className="font-bold flex items-center gap-2"><Mail className="h-5 w-5" /> Payroll & Compliance Updates</h3>
          <p className="text-sm text-white/85 mt-1">Get tax-deadline reminders and product news delivered to your inbox.</p>
          {subState === 'done' ? (
            <div className="mt-4 flex items-center gap-2 bg-white/15 rounded-lg p-3 text-sm font-medium">
              <CheckCircle2 className="h-5 w-5" /> You're subscribed! Check your inbox to confirm.
            </div>
          ) : (
            <form onSubmit={subscribe} className="mt-4 space-y-3">
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-white/60" />
                  <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com"
                    className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-white/15 placeholder-white/60 text-white outline-none focus:ring-2 focus:ring-white/40 text-sm" />
                </div>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-white/60" />
                  <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone number (optional)"
                    className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-white/15 placeholder-white/60 text-white outline-none focus:ring-2 focus:ring-white/40 text-sm" />
                </div>
              </div>
              <label className="flex items-start gap-2 text-xs text-white/80">
                <input type="checkbox" checked={sms} onChange={(e) => setSms(e.target.checked)} className="mt-0.5" />
                Text me updates. Msg &amp; data rates may apply. Reply STOP to unsubscribe.
              </label>
              <button type="submit" disabled={subState === 'loading'}
                className="bg-white text-blue-700 font-semibold px-5 py-2.5 rounded-lg text-sm flex items-center gap-2 hover:bg-blue-50 disabled:opacity-60">
                {subState === 'loading' ? <Loader2 className="h-4 w-4 animate-spin" /> : null} Subscribe
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
