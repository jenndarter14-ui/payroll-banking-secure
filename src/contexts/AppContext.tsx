import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import {
  EMPLOYEES, TRANSACTIONS, Employee, Transaction,
  mapEmployeeRow, mapTxRow, employeeInsert,
  seedEmployeeRows, seedTransactionRows,
} from '@/data/payroll';

export type ViewKey = 'dashboard' | 'employees' | 'payments' | 'transactions' | 'security' | 'settings';

export interface BankConnection {
  id: string;
  bankName: string;
  accountLast4: string;
  accountType: string;
  status: 'pending_verification' | 'verified' | 'locked';
}

interface AppContextType {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  closeSidebar: () => void;
  view: ViewKey;
  setView: (v: ViewKey) => void;
  bank: BankConnection | null;
  setBank: (b: BankConnection | null) => void;
  removeBank: () => Promise<void>;
  wizardOpen: boolean;
  setWizardOpen: (o: boolean) => void;
  employees: Employee[];
  transactions: Transaction[];
  updateEmployee: (e: Employee) => void;
  dataLoading: boolean;
  isAuthed: boolean;
}

const AppContext = createContext<AppContextType>({} as AppContextType);
export const useAppContext = () => useContext(AppContext);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [view, setView] = useState<ViewKey>('dashboard');
  const [bank, setBankState] = useState<BankConnection | null>(null);
  const [wizardOpen, setWizardOpen] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>(EMPLOYEES);
  const [transactions, setTransactions] = useState<Transaction[]>(TRANSACTIONS);
  const [dataLoading, setDataLoading] = useState(false);

  const loadUserData = useCallback(async (uid: string) => {
    setDataLoading(true);
    try {
      // Bank
      const { data: bankRows } = await supabase
        .from('bank_connections').select('*').eq('user_id', uid)
        .order('created_at', { ascending: false }).limit(1);
      if (bankRows && bankRows.length) {
        const b = bankRows[0];
        setBankState({
          id: b.id, bankName: b.bank_name, accountLast4: b.account_last4,
          accountType: b.account_type, status: b.status,
        });
      } else {
        setBankState(null);
      }

      // Employees (seed if empty)
      let { data: empRows } = await supabase.from('employees').select('*').eq('user_id', uid);
      if (!empRows || empRows.length === 0) {
        await supabase.from('employees').insert(seedEmployeeRows(uid));
        const res = await supabase.from('employees').select('*').eq('user_id', uid);
        empRows = res.data || [];
      }
      setEmployees((empRows || []).map(mapEmployeeRow).sort((a, b) => a.name.localeCompare(b.name)));

      // Transactions (seed if empty)
      let { data: txRows } = await supabase.from('transactions').select('*').eq('user_id', uid);
      if (!txRows || txRows.length === 0) {
        await supabase.from('transactions').insert(seedTransactionRows(uid));
        const res = await supabase.from('transactions').select('*').eq('user_id', uid);
        txRows = res.data || [];
      }
      setTransactions((txRows || []).map(mapTxRow));
    } finally {
      setDataLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) {
      loadUserData(user.id);
    } else {
      // Logged out: show a read-only view without a bank connection.
      setBankState(null);
      setEmployees(EMPLOYEES);
      setTransactions(TRANSACTIONS);
    }
  }, [user, loadUserData]);

  const setBank = (b: BankConnection | null) => setBankState(b);

  const removeBank = async () => {
    if (user && bank) {
      await supabase.from('bank_connections').delete().eq('id', bank.id).eq('user_id', user.id);
    }
    setBankState(null);
  };

  const toggleSidebar = () => setSidebarOpen((p) => !p);
  const closeSidebar = () => setSidebarOpen(false);

  const updateEmployee = (e: Employee) => {
    setEmployees((list) => list.map((x) => (x.id === e.id ? e : x)));
    if (user) {
      supabase.from('employees').update({
        name: e.name, role: e.role, email: e.email, photo: e.photo,
        pay_type: e.payType, rate: e.rate, status: e.status,
        bank_last4: e.bankLast4, start_date: e.startDate,
      }).eq('id', e.id).eq('user_id', user.id).then(() => {});
    }
  };

  return (
    <AppContext.Provider
      value={{
        sidebarOpen, toggleSidebar, closeSidebar,
        view, setView, bank, setBank, removeBank, wizardOpen, setWizardOpen,
        employees, transactions, updateEmployee, dataLoading,
        isAuthed: !!user,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
