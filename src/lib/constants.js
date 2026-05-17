export const THRUST = [
  'Customer Excellence',
  'Revenue Growth',
  'Operational Efficiency',
  'Innovation & Digital',
  'People & Culture',
  'Risk & Compliance',
  'Quality & Safety',
]

export const UOM = [
  { v: 'min',      l: 'Min – Higher is Better',   eg: 'Sales Revenue, Calls, Units' },
  { v: 'max',      l: 'Max – Lower is Better',    eg: 'TAT, Cost, Error Rate' },
  { v: 'timeline', l: 'Timeline – Date Completion', eg: 'Project delivery date' },
  { v: 'zero',     l: 'Zero-based – Zero = Success', eg: 'Incidents, Defects, Violations' },
]

export const QS = ['Q1', 'Q2', 'Q3', 'Q4']
export const Q_LABELS = { Q1: 'Q1 (Apr–Jun)', Q2: 'Q2 (Jul–Sep)', Q3: 'Q3 (Oct–Dec)', Q4: 'Q4 (Jan–Mar)' }
export const CURRENT_Q = 'Q3'
export const CURRENT_FY = '2024–25'

export const USERS = {
  emp1:  { id: 'emp1',  name: 'Alice Johnson',  role: 'employee', dept: 'Sales',       mgr: 'mgr1',   av: 'AJ', email: 'alice@company.com'  },
  emp2:  { id: 'emp2',  name: 'Bob Kumar',       role: 'employee', dept: 'Sales',       mgr: 'mgr1',   av: 'BK', email: 'bob@company.com'    },
  emp3:  { id: 'emp3',  name: 'Carol Singh',     role: 'employee', dept: 'Engineering', mgr: 'mgr2',   av: 'CS', email: 'carol@company.com'  },
  emp4:  { id: 'emp4',  name: 'David Patel',     role: 'employee', dept: 'Engineering', mgr: 'mgr2',   av: 'DP', email: 'david@company.com'  },
  mgr1:  { id: 'mgr1',  name: 'Sarah Manager',   role: 'manager',  dept: 'Sales',       mgr: 'admin1', av: 'SM', email: 'sarah@company.com'  },
  mgr2:  { id: 'mgr2',  name: 'James Lead',      role: 'manager',  dept: 'Engineering', mgr: 'admin1', av: 'JL', email: 'james@company.com'  },
  admin1:{ id: 'admin1',name: 'HR Admin',         role: 'admin',    dept: 'HR',          mgr: null,     av: 'HA', email: 'hr@company.com'     },
}

export const NAV = {
  employee: [
    { k: 'dashboard', i: '🏠', l: 'Dashboard' },
    { k: 'goals',     i: '🎯', l: 'My Goals'   },
    { k: 'checkin',   i: '📊', l: 'Check-in'   },
  ],
  manager: [
    { k: 'dashboard',  i: '🏠', l: 'Dashboard'       },
    { k: 'approvals',  i: '✅', l: 'Approvals'        },
    { k: 'checkin',    i: '💬', l: 'Team Check-in'    },
    { k: 'analytics',  i: '📈', l: 'Analytics'        },
  ],
  admin: [
    { k: 'dashboard', i: '🏠', l: 'Org Overview'    },
    { k: 'cycle',     i: '🗓', l: 'Cycle Config'    },
    { k: 'analytics', i: '📈', l: 'Analytics'       },
    { k: 'audit',     i: '📋', l: 'Audit Trail'     },
  ],
}

export const PAGE_TITLES = {
  dashboard: 'Overview', goals: 'My Goals', checkin: 'Check-in',
  approvals: 'Pending Approvals', analytics: 'Analytics',
  audit: 'Audit Trail', cycle: 'Cycle Management',
}

export const AV_COLORS = ['#f59e0b','#3b82f6','#10b981','#a855f7','#ef4444','#06b6d4','#f97316']
export const CHART_COLORS = ['#f59e0b','#3b82f6','#10b981','#a855f7','#ef4444','#06b6d4','#f97316']

export const STATUS_BADGE = { approved: 'b-ok', submitted: 'b-b', draft: 'b-m', returned: 'b-d' }
export const Q_STATUS_BADGE = { Completed: 'b-ok', 'On Track': 'b-w', 'Not Started': 'b-m' }
