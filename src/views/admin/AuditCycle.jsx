import { useState } from 'react'
import { Av, Badge } from '../../components/ui.jsx'
import { USERS, STATUS_BADGE } from '../../lib/constants.js'
import { fmtTs } from '../../lib/utils.js'

export function AdminAudit({ auditLog }) {
  const [filter, setFilter] = useState('')
  const filtered = auditLog.filter(l =>
    !filter ||
    l.action?.toLowerCase().includes(filter.toLowerCase()) ||
    l.entity?.toLowerCase().includes(filter.toLowerCase()) ||
    USERS[l.uid]?.name?.toLowerCase().includes(filter.toLowerCase())
  )

  const actionBadge = action => {
    if (action?.includes('Approved')) return 'b-ok'
    if (action?.includes('Return'))   return 'b-d'
    if (action?.includes('Submit'))   return 'b-b'
    if (action?.includes('Push'))     return 'b-p'
    return 'b-m'
  }

  return (
    <div className="fu">
      <div className="ph">
        <div><h1 className="ph-t">Audit Trail</h1><p className="ph-s">Complete immutable log of all system changes</p></div>
        <input className="inp" style={{ width: 220 }} placeholder="Filter by action, entity or user…" value={filter} onChange={e => setFilter(e.target.value)} />
      </div>

      <div className="card">
        {!filtered.length && <p style={{ fontSize: 13, color: 'var(--tm)', textAlign: 'center', padding: 24 }}>No entries match your filter</p>}
        <div style={{ overflowX: 'auto' }}>
          <table className="tbl">
            <thead>
              <tr><th>Timestamp</th><th>User</th><th>Action</th><th>Entity</th><th>Detail</th></tr>
            </thead>
            <tbody>
              {filtered.map(l => {
                const u = USERS[l.uid]
                return (
                  <tr key={l.id}>
                    <td style={{ fontSize: 11.5, color: 'var(--tm)', whiteSpace: 'nowrap' }}>{fmtTs(l.ts)}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                        {u && <Av name={u.name} av={u.av} size={22} />}
                        <span style={{ fontSize: 12.5 }}>{u?.name || l.uid}</span>
                      </div>
                    </td>
                    <td><Badge cls={actionBadge(l.action)}>{l.action}</Badge></td>
                    <td style={{ fontSize: 12.5, fontWeight: 500 }}>{l.entity}</td>
                    <td style={{ fontSize: 12, color: 'var(--ts)', maxWidth: 280 }}>{l.detail}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export function AdminCycle() {
  const phases = [
    { phase: 'Goal Setting',  opens: '1 May 2024',    closes: '31 May 2024',    status: 'Completed', desc: 'Goal creation, submission & L1 approval' },
    { phase: 'Q1 Check-in',   opens: '1 July 2024',   closes: '31 July 2024',   status: 'Completed', desc: 'Progress update — planned vs actual' },
    { phase: 'Q2 Check-in',   opens: '1 Oct 2024',    closes: '31 Oct 2024',    status: 'Completed', desc: 'Progress update — planned vs actual' },
    { phase: 'Q3 Check-in',   opens: '1 Jan 2025',    closes: '31 Jan 2025',    status: 'Open',      desc: 'Progress update — planned vs actual' },
    { phase: 'Q4 / Annual',   opens: '1 Mar 2025',    closes: '30 Apr 2025',    status: 'Upcoming',  desc: 'Final achievement capture & appraisal' },
  ]

  const statusBadge = { Open: 'b-ok', Completed: 'b-b', Upcoming: 'b-m' }
  const statusBorder = { Open: 'var(--succ)', Completed: 'var(--blue)', Upcoming: 'var(--br)' }

  return (
    <div className="fu">
      <div className="ph">
        <div><h1 className="ph-t">Cycle Configuration</h1><p className="ph-s">FY 2024–25 goal-setting and check-in windows</p></div>
      </div>

      <div className="sg s3 mb3">
        {phases.map(c => (
          <div key={c.phase} className="card" style={{ borderLeft: `3px solid ${statusBorder[c.status]}` }}>
            <div className="fl-b mb2">
              <p style={{ fontWeight: 700, fontSize: 13.5 }}>{c.phase}</p>
              <Badge cls={statusBadge[c.status] || 'b-m'}>{c.status}</Badge>
            </div>
            <p style={{ fontSize: 12, color: 'var(--ts)', marginBottom: 8, lineHeight: 1.5 }}>{c.desc}</p>
            <p style={{ fontSize: 11.5, color: 'var(--tm)' }}>Opens: {c.opens}</p>
            <p style={{ fontSize: 11.5, color: 'var(--tm)' }}>Closes: {c.closes}</p>
            {c.status === 'Open' && (
              <div style={{ marginTop: 10, padding: '6px 10px', background: 'var(--succD)', borderRadius: 6, fontSize: 12, color: 'var(--succ)', fontWeight: 600 }}>
                ● Currently Active Window
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="card">
        <p style={{ fontWeight: 600, fontSize: 13.5, marginBottom: 14 }}>Cycle Rules (FY 2024–25)</p>
        <div className="gr2">
          {[
            ['Max goals per employee', '8'],
            ['Min weightage per goal', '10%'],
            ['Total weightage required', '100%'],
            ['Shared goals', 'Pushed by Admin/HR'],
            ['Check-in quarters', 'Q1, Q2, Q3, Q4'],
            ['UoM types supported', 'Min, Max, Timeline, Zero'],
            ['Approval levels', 'L1 Manager only'],
            ['Goal lock trigger', 'On manager approval'],
          ].map(([k, v]) => (
            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 10px', background: 'var(--bgs)', borderRadius: 8 }}>
              <span style={{ fontSize: 12.5, color: 'var(--ts)' }}>{k}</span>
              <span style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--tp)' }}>{v}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
