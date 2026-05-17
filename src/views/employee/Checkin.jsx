import { useState } from 'react'
import { Prog } from '../../components/ui.jsx'
import { calcPct, fmtV, uid, nowTs, pctCol } from '../../lib/utils.js'
import { QS, CURRENT_Q, UOM } from '../../lib/constants.js'

export default function EmpCheckin({ user, goals, setGoals, setAuditLog }) {
  const [q, setQ]           = useState(CURRENT_Q)
  const [inputs, setInputs]   = useState({})
  const [statuses, setStatuses] = useState({})
  const [saved, setSaved]     = useState(false)

  const approved = goals.filter(g => g.eId === user.id && g.status === 'approved')

  const save = () => {
    const updated = goals.map(g => {
      if (g.eId !== user.id || g.status !== 'approved') return g
      const raw = inputs[g.id]
      if (raw === undefined || raw === '') return g
      const v = g.uom === 'timeline' ? raw : Number(raw)
      const s = statuses[g.id] || g.st[q]
      return { ...g, ach: { ...g.ach, [q]: v }, st: { ...g.st, [q]: s } }
    })
    setGoals(updated)
    setAuditLog(p => [{
      id: 'a' + uid(), ts: nowTs(), uid: user.id,
      action: 'Achievement Logged', entity: `${q} Check-in`,
      detail: `Logged actuals for ${Object.keys(inputs).length} goal(s)`,
    }, ...p])
    setSaved(true)
    setInputs({})
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="fu">
      <div className="ph">
        <div>
          <h1 className="ph-t">Quarterly Check-in</h1>
          <p className="ph-s">Log your actual achievements against planned targets</p>
        </div>
        <div className="tg" style={{ width: 280, marginBottom: 0 }}>
          {QS.map(qq => <button key={qq} className={`tb${q === qq ? ' act' : ''}`} onClick={() => { setQ(qq); setInputs({}); setStatuses({}) }}>{qq}</button>)}
        </div>
      </div>

      {saved && <div className="alert-ok mb3">✓ {q} achievements saved successfully!</div>}

      {!approved.length && (
        <div style={{ textAlign: 'center', padding: '48px 20px' }}>
          <div style={{ fontSize: 40, marginBottom: 12, opacity: .35 }}>📋</div>
          <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--ts)' }}>No approved goals</p>
          <p style={{ fontSize: 12.5, color: 'var(--tm)', marginTop: 5 }}>Goals must be approved by your manager before you can log achievements</p>
        </div>
      )}

      {approved.map(g => {
        const curRaw = inputs[g.id]
        const curAch = curRaw !== undefined
          ? (g.uom === 'timeline' ? curRaw : Number(curRaw))
          : g.ach[q]
        const p = calcPct({ ...g, ach: { ...g.ach, [q]: curAch } }, q)
        const hasExisting = g.ach[q] !== null && g.ach[q] !== undefined

        return (
          <div key={g.id} className="card mb2">
            <div className="fl-b mb2">
              <div>
                <p style={{ fontWeight: 600, fontSize: 13.5 }}>{g.title}</p>
                <p style={{ fontSize: 11.5, color: 'var(--tm)', marginTop: 2 }}>
                  {g.thrust} · Target: <strong style={{ color: 'var(--tp)' }}>{fmtV(g.target, g.uom, g.unit)}</strong>
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                {p !== null && (
                  <div style={{ fontSize: 18, fontWeight: 700, color: pctCol(p), fontFamily: 'var(--fd)' }}>
                    {Math.round(p)}%
                  </div>
                )}
                <span className="wt">{g.wt}%</span>
              </div>
            </div>

            <div className="gr2">
              <div className="fg">
                <label className="fl">Actual Achievement — {q}</label>
                {g.uom === 'zero' ? (
                  <select className="sel"
                    value={inputs[g.id] ?? String(g.ach[q] ?? '')}
                    onChange={e => setInputs(p => ({ ...p, [g.id]: e.target.value }))}>
                    <option value="">Select result…</option>
                    <option value="0">0 — Success ✓</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3+</option>
                  </select>
                ) : g.uom === 'timeline' ? (
                  <input type="date" className="inp"
                    value={inputs[g.id] || g.ach[q] || ''}
                    onChange={e => setInputs(p => ({ ...p, [g.id]: e.target.value }))} />
                ) : (
                  <input type="number" className="inp"
                    placeholder={`Target: ${fmtV(g.target, g.uom, g.unit)}`}
                    value={inputs[g.id] ?? String(g.ach[q] ?? '')}
                    onChange={e => setInputs(p => ({ ...p, [g.id]: e.target.value }))} />
                )}
                {hasExisting && inputs[g.id] === undefined && (
                  <p className="fh t-ok">Current: {fmtV(g.ach[q], g.uom, g.unit)}</p>
                )}
              </div>

              <div className="fg">
                <label className="fl">Status</label>
                <select className="sel"
                  value={statuses[g.id] || g.st[q] || 'Not Started'}
                  onChange={e => setStatuses(p => ({ ...p, [g.id]: e.target.value }))}>
                  <option>Not Started</option>
                  <option>On Track</option>
                  <option>Completed</option>
                </select>
              </div>
            </div>

            {p !== null && <Prog pct={p} />}
          </div>
        )
      })}

      {approved.length > 0 && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
          <button className="btn btn-p" onClick={save}
            disabled={Object.keys(inputs).length === 0}>
            Save {q} Achievements →
          </button>
        </div>
      )}
    </div>
  )
}
