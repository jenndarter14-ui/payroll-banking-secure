import React, { useState } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import {
  X, Lock, ShieldCheck, Building2, Loader2, CheckCircle2, AlertCircle,
  CreditCard, ArrowRight, Banknote
} from 'lucide-react';

type Step = 'intro' | 'details' | 'verify' | 'done';

const BankWizard: React.FC = () => {
  const { wizardOpen, setWizardOpen, bank, setBank } = useAppContext();
  const { user } = useAuth();
  const [step, setStep] = useState<Step>(bank ? 'verify' : 'intro');
  const [routing, setRouting] = useState('');
  const [account, setAccount] = useState('');
  const [confirmAccount, setConfirmAccount] = useState('');
  const [accountType, setAccountType] = useState('checking');
  const [bankName, setBankName] = useState<string | null>(null);
  const [routingValid, setRoutingValid] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [depA, setDepA] = useState('');
  const [depB, setDepB] = useState('');

  if (!wizardOpen) return null;

  const call = async (action: string, payload: Record<string, unknown>) => {
    if (!user?.id) throw new Error('User not authenticated');
    const { data, error } = await supabase.functions.invoke('bank-connect', {
      body: { action, user_id: user.id, ...payload },
    });
    if (error) throw new Error(error.message || 'Unable to reach the bank verification service.');
    if (data?.error) throw new Error(data.error);
    return data;
  };

  const onRoutingChange = async (v: string) => {
    const clean = v.replace(/\D/g, '').slice(0, 9);
    setRouting(clean);
    setRoutingValid(clean.length === 9 ? true : null);
    setBankName(null);
  };

  const canSubmitDetails =
    routing.length === 9 && account.length >= 4 && account === confirmAccount;

  const connect = async () => {
    setError(''); setLoading(true);
    try {
      const r = await call('connect', {
        routing_number: routing,
        account_number: account,
        account_type: accountType,
        business_name: '',
      });
      setBank({
        id: r.id,
        bankName: r.bank_name,
        accountLast4: r.account_last4,
        accountType,
        status: 'pending_verification',
      });
      setStep('verify');
    } catch (e: any) {
      setError(e.message);
    } finally { setLoading(false); }
  };

  const verify = async () => {
    setError(''); setLoading(true);
    try {
      const r = await call('verify', {
        id: bank?.id,
        amount_a: parseFloat(depA),
        amount_b: parseFloat(depB),
      });
      if (r.status === 'verified') {
        setBank(bank ? { ...bank, status: 'verified' } : null);
        setStep('done');
      } else {
        setError(r.error || 'Verification failed.');
      }
    } catch (e: any) {
      setError(e.message);
    } finally { setLoading(false); }
  };

  const close = () => {
    setWizardOpen(false);
    setTimeout(() => {
      setStep(bank?.status === 'verified' ? 'done' : bank ? 'verify' : 'intro');
      setError('');
    }, 200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-blue-700 to-emerald-600 px-6 py-5 text-white">
          <button onClick={close} className="absolute top-4 right-4 text-white/80 hover:text-white">
            <X className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2 text-sm font-medium text-white/90">
            <Lock className="h-4 w-4" /> Secured connection
          </div>
          <h2 className="text-xl font-bold mt-1">Connect Your Business Bank</h2>
          <div className="flex gap-1.5 mt-4">
            {['intro', 'details', 'verify', 'done'].map((s, i) => {
              const order = ['intro', 'details', 'verify', 'done'];
              const reached = order.indexOf(step) >= i;
              return <div key={s} className={`h-1.5 flex-1 rounded-full ${reached ? 'bg-white' : 'bg-white/30'}`} />;
            })}
          </div>
        </div>

        <div className="p-6">
          {step === 'intro' && (
            <div className="space-y-5">
              <div className="space-y-4">
                {[
                  { icon: Building2, t: 'Enter your account details', d: 'Provide your routing and account numbers — encrypted instantly.' },
                  { icon: Banknote, t: 'We send two micro-deposits', d: 'Two small amounts (under $1) arrive in 1–2 business days.' },
                  { icon: ShieldCheck, t: 'Verify to activate payroll', d: 'Confirm the amounts and start sending direct deposits.' },
                ].map(({ icon: Icon, t, d }, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                      <Icon className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800 text-sm">{t}</p>
                      <p className="text-sm text-slate-500">{d}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 rounded-lg p-3">
                <Lock className="h-4 w-4 text-emerald-600 shrink-0" />
                Your credentials are encrypted with AES-256 and never stored in plain text.
              </div>
              <button
                onClick={() => setStep('details')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors"
              >
                Get Started <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}

          {step === 'details' && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700">Routing Number</label>
                <div className="relative mt-1">
                  <input
                    value={routing}
                    onChange={(e) => onRoutingChange(e.target.value)}
                    placeholder="9 digits"
                    className={`w-full px-3 py-2.5 rounded-lg border text-slate-800 outline-none focus:ring-2 ${
                      routingValid === false ? 'border-rose-300 focus:ring-rose-200'
                        : routingValid ? 'border-emerald-300 focus:ring-emerald-200'
                        : 'border-slate-200 focus:ring-blue-200'
                    }`}
                  />
                  {routingValid && <CheckCircle2 className="absolute right-3 top-3 h-5 w-5 text-emerald-500" />}
                  {routingValid === false && <AlertCircle className="absolute right-3 top-3 h-5 w-5 text-rose-500" />}
                </div>
                {bankName && <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1"><Building2 className="h-3 w-3" />{bankName}</p>}
                <p className="text-[11px] text-slate-400 mt-1">Enter your business bank’s 9-digit routing number. A standard 9-digit entry will be accepted here.</p>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">Account Number</label>
                <input
                  value={account}
                  onChange={(e) => setAccount(e.target.value.replace(/\D/g, '').slice(0, 17))}
                  placeholder="Account number"
                  className="w-full mt-1 px-3 py-2.5 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-blue-200 text-slate-800"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">Confirm Account Number</label>
                <input
                  value={confirmAccount}
                  onChange={(e) => setConfirmAccount(e.target.value.replace(/\D/g, '').slice(0, 17))}
                  placeholder="Re-enter account number"
                  className="w-full mt-1 px-3 py-2.5 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-blue-200 text-slate-800"
                />
                {confirmAccount && account !== confirmAccount && (
                  <p className="text-xs text-rose-500 mt-1">Account numbers don't match.</p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">Account Type</label>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  {['checking', 'savings'].map((t) => (
                    <button
                      key={t}
                      onClick={() => setAccountType(t)}
                      className={`py-2.5 rounded-lg border text-sm font-medium capitalize flex items-center justify-center gap-2 ${
                        accountType === t ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 text-slate-600'
                      }`}
                    >
                      <CreditCard className="h-4 w-4" /> {t}
                    </button>
                  ))}
                </div>
              </div>

              {error && <p className="text-sm text-rose-600 flex items-center gap-1"><AlertCircle className="h-4 w-4" />{error}</p>}

              <button
                disabled={!canSubmitDetails || loading}
                onClick={connect}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
                {loading ? 'Connecting…' : 'Connect Securely'}
              </button>
            </div>
          )}

          {step === 'verify' && (
            <div className="space-y-4">
              <div className="bg-blue-50 rounded-xl p-4 flex gap-3">
                <Banknote className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                <div className="text-sm text-slate-700">
                  We sent two micro-deposits to your <strong>{bank?.bankName}</strong> account ending in <strong>•••• {bank?.accountLast4}</strong>. Enter the two amounts below to verify.
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[{ v: depA, set: setDepA, l: 'Deposit 1' }, { v: depB, set: setDepB, l: 'Deposit 2' }].map((f, i) => (
                  <div key={i}>
                    <label className="text-sm font-medium text-slate-700">{f.l}</label>
                    <div className="relative mt-1">
                      <span className="absolute left-3 top-2.5 text-slate-400">$</span>
                      <input
                        value={f.v}
                        onChange={(e) => f.set(e.target.value.replace(/[^0-9.]/g, ''))}
                        placeholder="0.00"
                        className="w-full pl-7 pr-3 py-2.5 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-blue-200 text-slate-800"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {error && <p className="text-sm text-rose-600 flex items-center gap-1"><AlertCircle className="h-4 w-4" />{error}</p>}

              <button
                disabled={!depA || !depB || loading}
                onClick={verify}
                className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
                {loading ? 'Verifying…' : 'Verify Account'}
              </button>
            </div>
          )}

          {step === 'done' && (
            <div className="text-center py-4 space-y-4">
              <div className="h-16 w-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto animate-in zoom-in duration-300">
                <CheckCircle2 className="h-9 w-9 text-emerald-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800">Bank Account Verified</h3>
                <p className="text-sm text-slate-500 mt-1">
                  {bank?.bankName} •••• {bank?.accountLast4} is now active. You're ready to run payroll.
                </p>
              </div>
              <button
                onClick={close}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl"
              >
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BankWizard;
