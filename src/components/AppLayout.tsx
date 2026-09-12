import React from 'react';
import { useAppContext } from '@/contexts/AppContext';
import Sidebar from '@/components/payroll/Sidebar';
import TopBar from '@/components/payroll/TopBar';
import BankWizard from '@/components/payroll/BankWizard';
import AuthModal from '@/components/payroll/AuthModal';
import DashboardView from '@/components/payroll/DashboardView';
import EmployeesView from '@/components/payroll/EmployeesView';
import PaymentsView from '@/components/payroll/PaymentsView';
import TransactionsView from '@/components/payroll/TransactionsView';
import SecurityView from '@/components/payroll/SecurityView';
import SettingsView from '@/components/payroll/SettingsView';

const AppLayout: React.FC = () => {
  const { view } = useAppContext();
  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar />
      <div className="flex-1 min-w-0 flex flex-col">
        <TopBar />
        <main className="flex-1 p-4 lg:p-8">
          {view === 'dashboard' && <DashboardView />}
          {view === 'employees' && <EmployeesView />}
          {view === 'payments' && <PaymentsView />}
          {view === 'transactions' && <TransactionsView />}
          {view === 'security' && <SecurityView />}
          {view === 'settings' && <SettingsView />}
        </main>
        <footer className="border-t border-slate-200 px-8 py-4 text-xs text-slate-400 flex flex-wrap items-center justify-between gap-2">
          <span>© 2026 PayFlow · Bank-grade payroll & direct deposit</span>
          <span>256-bit SSL · SOC 2 Type II · NACHA Certified</span>
        </footer>
      </div>
      <BankWizard />
      <AuthModal />
    </div>
  );
};

export default AppLayout;
