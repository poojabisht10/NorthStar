import { useState } from 'react'
import { Av, Badge, Prog } from '../../components/ui.jsx'
import { AICheckinGen } from '../../components/ai.jsx'
import { USERS, QS, CURRENT_Q, Q_STATUS_BADGE } from '../../lib/constants.js'
import { calcPct, fmtV, wtdScore, pctCol, uid, nowTs, fmtDate } from '../../lib/utils.js'

export default function MgrCheckin({ user, goals, setGoals, checkIns, setCheckIns, setAuditLog }) {
  const myEmps = Object.values(USERS).filter(u => u.mgr === user.id)
  const [selEmpId, setSelEmpId] = useState(myEmps[0]?.id || null)
  const [q, setQ]               = useState(CURRENT_Q)
  const [comment, setComment]   = useState('')
  const [saved, setSaved]       = useState(false)

  const selUser  = USERS[selEmpId]
  const empGoals = goals.filter(g => g.eId === selEmpId && g.status === 'approved')
  const prevCi   = checkIns.filter(ci => ci.eId === selEmpId && ci.q === q && ci.mgr === user.id).slice(-1)[0]

  const save = () => {
    if (!comment.trim()) return
    setCheckIns(p => [...p, { id: 'ci' + uid(), eId: selEmpId, q, mgr: user.id, comment, ts: nowTs() }])
    setAuditLog(p => [{
      id: 'a' + uid(), ts: nowTs(), uid: user.id,
      action: `${q} Check-in`, entity: selUser?.name,
      detail: comment.slice(0, 70) + (comment.length > 70 ? '…' : ''),
    }, ...p])
    setSaved(true)
    setComment('')
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="fu">
      <div className="ph" style={{ flexWrap: 'wrap' }}>
        <div>
          <h1 className="ph-t">Team Check-ins</h1>
          <p className="ph-s">Review achievements and document structured feedback</p>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <select className="sel" style={{ width: 'auto' }} value={selEmpId || ''} onChange={e => { setSelEmpId(e.target.value); setComment('') }}>
            {myEmps.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
          </select>
          <div className="tg" style={{ marginBottom: 0 }}>
            {QS.map(qq => <button key={qq} className={`tb${q === qq ? ' act' : ''}`} onClick={() => { setQ(qq); setComment('') }}>{qq}</button>)}
          </div>
        </div>
      </div>

      {saved && <div className="alert-ok mb3">✓ Check-in saved successfully!</div>}

      {/* Employee summary */}
      {selUser && (
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '12px', borderRadius: 10, background: 'var(--bgs)', border: '1px solid var(--br)', marginBottom: 14 }}>
          <Av name={selUser.name} av={selUser.av} size={44} />
          <div style={{ flex: 1 }}>
            <p style={{ fontWeight: 700, fontSize: 14 }}>{selUser.name}</p>
            <p style={{ fontSize: 12, color: 'var(--tm)' }}>
              {selUser.dept} · {q} Weighted Score:{' '}
              <span style={{ color: 'var(--acc)', fontWeight: 600 }}>{wtdScore(empGoals, q)}%</span>
            </p>
          </div>
          {prevCi && <Badge cls="b-ok">✓ Already checked in</Badge>}
        </div>
      )}

      {!empGoals.length && (
        <div style={{ textAlign: 'center', padding: '36px 0' }}>
          <p style={{ fontSize: 13, color: 'var(--tm)' }}>No approved goals for this employee</p>
        </div>
      )}

      {/* Goals performance grid */}
      <div style={{ display: 'grid', gap: 8, marginBottom: 16 }}>
        {empGoals.map(g => {
          const p = calcPct(g, q)
          return (
            <div key={g.id} style={{ background: 'var(--bgs)', border: '1px solid var(--br)', borderRadius: 10, padding: 12 }}>
              <div className="fl-b mb1">
                <p style={{ fontWeight: 600, fontSize: 13 }}>{g.title}</p>
                <div style={{ display: 'flex', gap: 7, alignItems: 'center' }}>
                  <Badge cls={Q_STATUS_BADGE[g.st[q]] || 'b-m'}>{g.st[q] || 'Not Started'}</Badge>
                  <span className="wt">{g.wt}%</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 18, fontSize: 12.5, color: 'var(--ts)', marginBottom: 6 }}>
                <span>Target: <strong style={{ color: 'var(--tp)' }}>{fmtV(g.target, g.uom, g.unit)}</strong></span>
                <span>Actual: <strong style={{ color: p !== null ? pctCol(p) : 'var(--tm)' }}>{fmtV(g.ach[q], g.uom, g.unit)}</strong></span>
                {p !== null && <span>Score: <strong style={{ color: pctCol(p) }}>{Math.round(p)}%</strong></span>}
              </div>
              {p !== null && <Prog pct={p} />}
            </div>
          )
        })}
      </div>

      {/* Comment section */}
      {empGoals.length > 0 && (
        <div className="card">
          <p style={{ fontWeight: 600, fontSize: 13.5, marginBottom: 12 }}>
            Check-in Comment — {selUser?.name.split(' ')[0]} · {q}
          </p>

          {selUser && (
            <AICheckinGen
              employee={selUser}
              goals={goals}
              quarter={q}
              onInsert={txt => setComment(txt)}
            />
          )}

          <div className="fg">
            <label className="fl">Your Comment</label>
            <textarea className="txta" style={{ minHeight: 90 }}
              placeholder="Document your check-in discussion, key observations, achievements and guidance for the next quarter…"
              value={comment}
              onChange={e => setComment(e.target.value)} />
          </div>

          {prevCi && (
            <div style={{ background: 'var(--bgs)', borderRadius: 8, padding: 10, marginBottom: 10 }}>
              <p style={{ fontSize: 11, color: 'var(--tm)', marginBottom: 4 }}>Previous comment · {fmtDate(prevCi.ts)}</p>
              <p style={{ fontSize: 12.5, color: 'var(--ts)', lineHeight: 1.5 }}>{prevCi.comment}</p>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button className="btn btn-p" onClick={save} disabled={!comment.trim()}>Save Check-in →</button>
          </div>
        </div>
      )}
    </div>
  )
}
