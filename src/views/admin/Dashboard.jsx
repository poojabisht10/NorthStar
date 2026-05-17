import { useState } from 'react'
import { StatCard, Av, Badge, Modal } from '../../components/ui.jsx'
import { USERS, THRUST, UOM, QS, CURRENT_Q, STATUS_BADGE, CHART_COLORS } from '../../lib/constants.js'
import { wtdScore, pctCol, uid, nowTs, exportCSV } from '../../lib/utils.js'
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const CHART_TOOLTIP = { contentStyle: { background: 'var(--bgc)', border: '1px solid var(--br)', borderRadius: 8, color: 'var(--tp)', fontSize: 12 } }

export default function AdminDashboard({ goals, checkIns, onNav, setGoals, setAuditLog, addNotif }) {
  const emps    = Object.values(USERS).filter(u => u.role === 'employee')
  const pending = goals.filter(g => g.status === 'submitted')
  const orgScore = Math.round(
    emps.reduce((s, e) => {
      const eg = goals.filter(g => g.eId === e.id && g.status === 'approved')
      return s + wtdScore(eg, CURRENT_Q)
    }, 0) / Math.max(emps.length, 1)
  )
  const sharedGoals = goals.filter(g => g.shared && emps.some(e => e.id === g.eId))
  const thrustData = THRUST
    .map(t => ({ name: t.split(' ')[0], count: goals.filter(g => g.thrust === t && emps.some(e => e.id === g.eId)).length }))
    .filter(d => d.count > 0)

  // Push shared goal state
  const [showPush, setShowPush] = useState(false)
  const [pushDone, setPushDone] = useState(false)
  const [pf, setPf] = useState({ thrust: 'Risk & Compliance', title: '', desc: '', uom: 'zero', unit: 'incidents', scope: 'all', dept: '' })

  const F = (k, v) => setPf(p => ({ ...p, [k]: v }))

  const pushGoal = () => {
    if (!pf.title.trim()) return
    const targets = pf.scope === 'all' ? emps : emps.filter(e => e.dept === pf.dept)
    const newGoals = targets.map(e => ({
      id: 'sg' + uid(), eId: e.id, thrust: pf.thrust, title: pf.title,
      desc: pf.desc || `Organisation shared goal: ${pf.title}`,
      uom: pf.uom, target: pf.uom === 'zero' ? 0 : 100, unit: pf.unit, wt: 10,
      status: 'draft',
      ach: { Q1: null, Q2: null, Q3: null, Q4: null },
      st:  { Q1: 'Not Started', Q2: 'Not Started', Q3: 'Not Started', Q4: 'Not Started' },
      shared: true, sharedFrom: 'admin1',
    }))
    setGoals(p => [...p, ...newGoals])
    setAuditLog(p => [{ id: 'a' + uid(), ts: nowTs(), uid: 'admin1', action: 'Shared Goal Pushed', entity: pf.title, detail: `Pushed to ${targets.length} employee(s) — ${pf.thrust}` }, ...p])
    addNotif?.(`Shared goal "${pf.title}" pushed to ${targets.length} employees`, 'info')
    setPushDone(true)
    setTimeout(() => { setPushDone(false); setShowPush(false); setPf({ thrust: 'Risk & Compliance', title: '', desc: '', uom: 'zero', unit: 'incidents', scope: 'all', dept: '' }) }, 2000)
  }

  return (
    <div className="fu">
      {/* Push Shared Goal Modal */}
      {showPush && (
        <Modal onClose={() => setShowPush(false)} cls="m-md">
          <div className="fl-b mb3">
            <h3 style={{ fontFamily: 'var(--fd)', fontWeight: 700, fontSize: 16 }}>🔗 Push Shared Goal</h3>
            <button className="btn btn-g btn-xs" onClick={() => setShowPush(false)}>✕</button>
          </div>
          {pushDone ? (
            <div style={{ textAlign: 'center', padding: '28px 0' }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>✅</div>
              <p style={{ fontWeight: 600, color: 'var(--succ)', fontSize: 15 }}>Shared goal pushed successfully!</p>
            </div>
          ) : (
            <>
              <div className="alert-b mb3">
                ℹ Shared goals appear on employees' goal sheets with a 🔗 badge. The title and target are locked — employees can only adjust the weightage.
              </div>
              <div className="gr2">
                <div className="fg">
                  <label className="fl">Thrust Area</label>
                  <select className="sel" value={pf.thrust} onChange={e => F('thrust', e.target.value)}>
                    {THRUST.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div className="fg">
                  <label className="fl">Push To</label>
                  <select className="sel" value={pf.scope} onChange={e => F('scope', e.target.value)}>
                    <option value="all">All Employees</option>
                    <option value="dept">By Department</option>
                  </select>
                </div>
              </div>
              {pf.scope === 'dept' && (
                <div className="fg">
                  <label className="fl">Department</label>
                  <select className="sel" value={pf.dept} onChange={e => F('dept', e.target.value)}>
                    <option value="">Select…</option>
                    {['Sales', 'Engineering'].map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              )}
              <div className="fg">
                <label className="fl">Goal Title *</label>
                <input className="inp" placeholder="e.g. Zero Compliance Violations" value={pf.title} onChange={e => F('title', e.target.value)} />
              </div>
              <div className="fg">
                <label className="fl">Description</label>
                <textarea className="txta" style={{ minHeight: 60 }} placeholder="Describe this shared goal…" value={pf.desc} onChange={e => F('desc', e.target.value)} />
              </div>
              <div className="gr2">
                <div className="fg">
                  <label className="fl">UoM</label>
                  <select className="sel" value={pf.uom} onChange={e => F('uom', e.target.value)}>
                    {UOM.map(u => <option key={u.v} value={u.v}>{u.l.split('–')[0].trim()}</option>)}
                  </select>
                </div>
                <div className="fg">
                  <label className="fl">Unit</label>
                  <input className="inp" value={pf.unit} onChange={e => F('unit', e.target.value)} placeholder="incidents, %, count…" />
                </div>
              </div>
              <div className="alert-w mb3">
                Pushing to <strong>{pf.scope === 'all' ? emps.length : emps.filter(e => e.dept === pf.dept).length}</strong> employee(s) — they will receive this as a draft goal on their sheet
              </div>
              <div className="fl-e gap2">
                <button className="btn btn-g btn-sm" onClick={() => setShowPush(false)}>Cancel</button>
                <button className="btn btn-p btn-sm" onClick={pushGoal} disabled={!pf.title.trim()}>🔗 Push to Employees</button>
              </div>
            </>
          )}
        </Modal>
      )}

      <div className="ph">
        <div>
          <h1 className="ph-t">Organisation Dashboard</h1>
          <p className="ph-s">FY 2024–25 · All departments · Real-time overview</p>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button className="btn btn-g btn-sm" onClick={() => exportCSV(goals, USERS)}>⬇ Export CSV</button>
          <button className="btn btn-s btn-sm" onClick={() => setShowPush(true)}>🔗 Push Shared Goal</button>
          <button className="btn btn-s btn-sm" onClick={() => onNav('analytics')}>📊 Analytics</button>
          <button className="btn btn-p btn-sm" onClick={() => onNav('audit')}>📋 Audit Log</button>
        </div>
      </div>

      <div className="sg s4 mb3">
        <StatCard val={emps.length}     lbl="Total Employees"    icon="👥" />
        <StatCard val={`${orgScore}%`}  lbl="Org Avg Score"      sub={`${CURRENT_Q} performance`} subCol="var(--succ)" icon="🏢" />
        <StatCard val={pending.length}  lbl="Pending Approvals"  sub={pending.length ? 'Requires attention' : 'All reviewed'} subCol={pending.length ? 'var(--acc)' : undefined} icon="⏳" />
        <StatCard val={checkIns.length} lbl="Check-ins Logged"   icon="✅" />
      </div>

      <div className="gr2 mb3">
        {/* Heatmap */}
        <div className="card">
          <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--ts)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '.5px' }}>Completion Heatmap</p>
          <div style={{ display: 'flex', gap: 6, marginBottom: 6 }}>
            {['Employee', ...QS].map((h, i) => (
              <div key={h} style={{ width: i === 0 ? 90 : 36, fontSize: 10, color: 'var(--tm)', fontWeight: 600, textAlign: 'center' }}>{h}</div>
            ))}
          </div>
          {emps.map(e => {
            const eg = goals.filter(g => g.eId === e.id && g.status === 'approved')
            return (
              <div key={e.id} style={{ display: 'flex', gap: 6, marginBottom: 4, alignItems: 'center' }}>
                <div style={{ width: 90, fontSize: 11, color: 'var(--ts)', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {e.name.split(' ')[0]}
                </div>
                {QS.map(q => {
                  const sc = wtdScore(eg, q)
                  const bg = sc === 0 ? 'var(--br)' : sc >= 100 ? 'rgba(16,185,129,.35)' : sc >= 70 ? 'rgba(245,158,11,.35)' : 'rgba(239,68,68,.28)'
                  const tc = sc === 0 ? 'var(--tm)' : sc >= 100 ? 'var(--succ)' : sc >= 70 ? 'var(--acc)' : 'var(--dang)'
                  return (
                    <div key={q} className="hm-cell" style={{ width: 36, height: 36, background: bg, color: tc }}>{sc || ''}</div>
                  )
                })}
              </div>
            )
          })}
          <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
            {[['≥100', 'rgba(16,185,129,.35)', 'var(--succ)'], ['70–99', 'rgba(245,158,11,.35)', 'var(--acc)'], ['<70', 'rgba(239,68,68,.28)', 'var(--dang)'], ['—', 'var(--br)', 'var(--tm)']].map(([l, bg, tc]) => (
              <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: 'var(--tm)' }}>
                <div style={{ width: 10, height: 10, borderRadius: 2, background: bg }} />{l}
              </div>
            ))}
          </div>
        </div>

        {/* Pie chart */}
        <div className="card">
          <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--ts)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '.5px' }}>Goals by Thrust Area</p>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={thrustData} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={78} innerRadius={38}>
                {thrustData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
              </Pie>
              <Tooltip {...CHART_TOOLTIP} />
              <Legend iconSize={9} formatter={v => <span style={{ fontSize: 10.5, color: 'var(--ts)' }}>{v}</span>} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Employee table */}
      <div className="card">
        <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--ts)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '.5px' }}>All Employees Overview</p>
        <div style={{ overflowX: 'auto' }}>
          <table className="tbl">
            <thead><tr><th>Employee</th><th>Dept</th><th>Goals</th><th>Status</th><th>Q1</th><th>Q2</th><th>Q3</th><th>Q4</th></tr></thead>
            <tbody>
              {emps.map(e => {
                const eg = goals.filter(g => g.eId === e.id)
                const status = eg.some(g => g.status === 'approved') ? 'Approved' : eg.some(g => g.status === 'submitted') ? 'Submitted' : eg.some(g => g.status === 'draft') ? 'Draft' : 'None'
                return (
                  <tr key={e.id}>
                    <td><div style={{ display: 'flex', gap: 8, alignItems: 'center' }}><Av name={e.name} av={e.av} size={26} /><span style={{ fontWeight: 500 }}>{e.name}</span></div></td>
                    <td><Badge cls="b-m">{e.dept}</Badge></td>
                    <td style={{ textAlign: 'center' }}>{eg.length}</td>
                    <td><Badge cls={STATUS_BADGE[status.toLowerCase()] || 'b-m'}>{status}</Badge></td>
                    {QS.map(q => {
                      const s = wtdScore(eg.filter(g => g.status === 'approved'), q)
                      return <td key={q} style={{ fontWeight: 600, color: s === 0 ? 'var(--tm)' : pctCol(s), textAlign: 'center' }}>{s || '—'}</td>
                    })}
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
