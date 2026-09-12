export interface Employee {
  id: string;
  name: string;
  role: string;
  email: string;
  photo: string;
  payType: 'Salary' | 'Hourly';
  rate: number; // annual salary or hourly rate
  status: 'Active' | 'Pending' | 'Paused';
  bankLast4: string;
  startDate: string;
}

export interface Transaction {
  id: string;
  employeeId: string;
  employeeName: string;
  amount: number;
  date: string;
  status: 'Completed' | 'Processing' | 'Pending' | 'Failed';
  method: 'Direct Deposit';
  period: string;
}

const photos = [
  'https://d64gsuwffb70l.cloudfront.net/6a3a0032b0872afcb1d600c7_1782186111344_e819780b.jpg',
  'https://d64gsuwffb70l.cloudfront.net/6a3a0032b0872afcb1d600c7_1782186124311_380add91.png',
  'https://d64gsuwffb70l.cloudfront.net/6a3a0032b0872afcb1d600c7_1782186128431_c48ac56c.png',
  'https://d64gsuwffb70l.cloudfront.net/6a3a0032b0872afcb1d600c7_1782186118783_eb745b55.jpg',
  'https://d64gsuwffb70l.cloudfront.net/6a3a0032b0872afcb1d600c7_1782186118335_d462ad53.jpg',
  'https://d64gsuwffb70l.cloudfront.net/6a3a0032b0872afcb1d600c7_1782186124545_e969a511.png',
  'https://d64gsuwffb70l.cloudfront.net/6a3a0032b0872afcb1d600c7_1782186121175_228e7c8a.jpg',
  'https://d64gsuwffb70l.cloudfront.net/6a3a0032b0872afcb1d600c7_1782186126127_ae91f0c1.png',
  'https://d64gsuwffb70l.cloudfront.net/6a3a0032b0872afcb1d600c7_1782186133593_417fe9d3.png',
];

export const EMPLOYEES: Employee[] = [
  { id: 'e1', name: 'Sarah Mitchell', role: 'Engineering Lead', email: 'sarah.m@company.com', photo: photos[0], payType: 'Salary', rate: 145000, status: 'Active', bankLast4: '4821', startDate: '2021-03-15' },
  { id: 'e2', name: 'David Chen', role: 'Product Designer', email: 'david.c@company.com', photo: photos[1], payType: 'Salary', rate: 118000, status: 'Active', bankLast4: '9032', startDate: '2022-01-10' },
  { id: 'e3', name: 'Amara Okafor', role: 'Marketing Manager', email: 'amara.o@company.com', photo: photos[2], payType: 'Salary', rate: 102000, status: 'Active', bankLast4: '1145', startDate: '2020-07-22' },
  { id: 'e4', name: 'James Rodriguez', role: 'Sales Director', email: 'james.r@company.com', photo: photos[3], payType: 'Salary', rate: 135000, status: 'Active', bankLast4: '7788', startDate: '2019-11-05' },
  { id: 'e5', name: 'Priya Sharma', role: 'Data Analyst', email: 'priya.s@company.com', photo: photos[4], payType: 'Salary', rate: 96000, status: 'Active', bankLast4: '2390', startDate: '2023-02-14' },
  { id: 'e6', name: 'Michael Thompson', role: 'Support Specialist', email: 'michael.t@company.com', photo: photos[5], payType: 'Hourly', rate: 32, status: 'Active', bankLast4: '5567', startDate: '2022-09-01' },
  { id: 'e7', name: 'Elena Volkova', role: 'HR Coordinator', email: 'elena.v@company.com', photo: photos[6], payType: 'Salary', rate: 84000, status: 'Active', bankLast4: '6612', startDate: '2021-06-30' },
  { id: 'e8', name: 'Marcus Johnson', role: 'Backend Engineer', email: 'marcus.j@company.com', photo: photos[7], payType: 'Salary', rate: 128000, status: 'Active', bankLast4: '8843', startDate: '2022-04-18' },
  { id: 'e9', name: 'Lily Nguyen', role: 'Content Strategist', email: 'lily.n@company.com', photo: photos[8], payType: 'Hourly', rate: 41, status: 'Pending', bankLast4: '0000', startDate: '2024-01-08' },
  { id: 'e10', name: 'Robert Kim', role: 'Finance Manager', email: 'robert.k@company.com', photo: photos[0], payType: 'Salary', rate: 112000, status: 'Active', bankLast4: '3321', startDate: '2020-10-12' },
  { id: 'e11', name: 'Grace Adeyemi', role: 'QA Engineer', email: 'grace.a@company.com', photo: photos[2], payType: 'Hourly', rate: 38, status: 'Paused', bankLast4: '4490', startDate: '2023-08-25' },
  { id: 'e12', name: 'Tom Baker', role: 'Operations Lead', email: 'tom.b@company.com', photo: photos[3], payType: 'Salary', rate: 99000, status: 'Active', bankLast4: '7012', startDate: '2021-12-01' },
];

export function monthlyPay(e: Employee): number {
  if (e.payType === 'Salary') return Math.round(e.rate / 24); // semi-monthly
  return Math.round(e.rate * 80); // 80 hrs per semi-monthly period
}

function pad(n: number) { return n < 10 ? `0${n}` : `${n}`; }

const statuses: Transaction['status'][] = ['Completed', 'Completed', 'Completed', 'Completed', 'Processing', 'Pending', 'Failed'];

export const TRANSACTIONS: Transaction[] = (() => {
  const txs: Transaction[] = [];
  const periods = ['Jun 1-15, 2026', 'May 16-31, 2026', 'May 1-15, 2026'];
  let counter = 1000;
  periods.forEach((period, pi) => {
    const day = pi === 0 ? 16 : pi === 1 ? 1 : 16;
    const month = pi === 0 ? 6 : 5;
    EMPLOYEES.slice(0, 10).forEach((e, i) => {
      const st = pi === 0 ? statuses[i % statuses.length] : 'Completed';
      txs.push({
        id: `TX-${counter++}`,
        employeeId: e.id,
        employeeName: e.name,
        amount: monthlyPay(e),
        date: `2026-${pad(month)}-${pad(day)}`,
        status: st,
        method: 'Direct Deposit',
        period,
      });
    });
  });
  return txs;
})();

export function fmt(n: number): string {
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
}

/* ---- Supabase row <-> model mapping ---- */

export interface EmployeeRow {
  id: string;
  user_id: string;
  name: string;
  role: string | null;
  email: string | null;
  photo: string | null;
  pay_type: string | null;
  rate: number | null;
  status: string | null;
  bank_last4: string | null;
  start_date: string | null;
}

export function mapEmployeeRow(r: EmployeeRow): Employee {
  return {
    id: r.id,
    name: r.name,
    role: r.role || '',
    email: r.email || '',
    photo: r.photo || '',
    payType: (r.pay_type === 'Hourly' ? 'Hourly' : 'Salary'),
    rate: Number(r.rate || 0),
    status: (['Active', 'Pending', 'Paused'].includes(r.status || '') ? r.status : 'Active') as Employee['status'],
    bankLast4: r.bank_last4 || '0000',
    startDate: r.start_date || '',
  };
}

export function employeeInsert(e: Employee, userId: string) {
  return {
    user_id: userId,
    name: e.name,
    role: e.role,
    email: e.email,
    photo: e.photo,
    pay_type: e.payType,
    rate: e.rate,
    status: e.status,
    bank_last4: e.bankLast4,
    start_date: e.startDate,
  };
}

export interface TxRow {
  id: string;
  tx_ref: string | null;
  employee_name: string | null;
  amount: number | null;
  date: string | null;
  status: string | null;
  method: string | null;
  period: string | null;
}

export function mapTxRow(r: TxRow): Transaction {
  return {
    id: r.tx_ref || r.id,
    employeeId: '',
    employeeName: r.employee_name || '',
    amount: Number(r.amount || 0),
    date: r.date || '',
    status: (['Completed', 'Processing', 'Pending', 'Failed'].includes(r.status || '') ? r.status : 'Completed') as Transaction['status'],
    method: 'Direct Deposit',
    period: r.period || '',
  };
}

// Seed payloads for a brand-new business account.
export function seedEmployeeRows(userId: string) {
  return EMPLOYEES.map((e) => employeeInsert(e, userId));
}

export function seedTransactionRows(userId: string) {
  return TRANSACTIONS.map((t) => ({
    user_id: userId,
    tx_ref: t.id,
    employee_name: t.employeeName,
    amount: t.amount,
    date: t.date,
    status: t.status,
    method: t.method,
    period: t.period,
  }));
}
