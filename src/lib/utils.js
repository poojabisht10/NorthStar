import { AV_COLORS } from './constants.js'

export const uid    = () => Math.random().toString(36).slice(2, 9)
export const nowTs  = () => new Date().toISOString()
export const fmtDate = ts => ts ? new Date(ts).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'
export const fmtTs   = ts => ts ? new Date(ts).toLocaleString('en-IN',  { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : '—'

export const avColor = name => AV_COLORS[(name || 'X').charCodeAt(0) % AV_COLORS.length]

export const calcPct = (goal, q) => {
  const a = goal.ach[q]
  if (a === null || a === undefined) return null
  switch (goal.uom) {
    case 'min':      return Math.min((a / goal.target) * 100, 150)
    case 'max':      return a === 0 ? 150 : Math.min((goal.target / a) * 100, 150)
    case 'timeline': return new Date(a) <= new Date(goal.target) ? 100 : 50
    case 'zero':     return a === 0 ? 100 : 0
    default:         return 0
  }
}

export const wtdScore = (goals, q) => {
  const approved = goals.filter(g => g.status === 'approved')
  if (!approved.length) return 0
  let tw = 0, ws = 0
  approved.forEach(g => {
    const p = calcPct(g, q)
    if (p !== null) { ws += p * g.wt; tw += g.wt }
  })
  return tw ? Math.round(ws / tw) : 0
}

export const fmtV = (v, uom, unit) => {
  if (v === null || v === undefined) return '—'
  if (uom === 'timeline') return v
  if (unit === '₹') return `₹${(v / 100000).toFixed(1)}L`
  if (unit === '%') return `${v}%`
  return `${v} ${unit}`
}

export const pctCol = p => p >= 100 ? 'var(--succ)' : p >= 70 ? 'var(--acc)' : 'var(--dang)'

export const sumWt = goals => goals.reduce((s, g) => s + (Number(g.wt) || 0), 0)

export const exportCSV = (goals, users) => {
  const emps = Object.values(users).filter(u => u.role === 'employee')
  const rows = [['Employee', 'Department', 'Goal', 'Thrust Area', 'UoM', 'Target', 'Weightage', 'Status', 'Q1', 'Q2', 'Q3', 'Q4']]
  emps.forEach(e => {
    goals.filter(g => g.eId === e.id).forEach(g => {
      rows.push([
        e.name, e.dept, g.title, g.thrust, g.uom, g.target, `${g.wt}%`, g.status,
        g.ach.Q1 ?? '-', g.ach.Q2 ?? '-', g.ach.Q3 ?? '-', g.ach.Q4 ?? '-',
      ])
    })
  })
  const csv = rows.map(r => r.map(c => `"${c}"`).join(',')).join('\n')
  const a = document.createElement('a')
  a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv)
  a.download = 'NorthStar_Performance_Export.csv'
  a.click()
}
