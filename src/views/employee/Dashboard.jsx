import { StatCard, ProgressRing, Badge } from '../../components/ui.jsx'
import { calcPct, wtdScore, pctCol } from '../../lib/utils.js'
import { CURRENT_Q } from '../../lib/constants.js'

export default function EmpDashboard({ user, goals, onNav }) {
  const myGoals = goals.filter(g => g.eId === user.id)
  const approved = myGoals.filter(g => g.status === 'approved')
  const score    = wtdScore(approved, CURRENT_Q)
  const prevScore = wtdScore(approved, 'Q2')
  const returned = myGoals.some(g => g.status === 'returned')

  return (
    <div className="fu">
      <div className="ph">
        <div>
          <h1 className="ph-t">Good day, {user.name.split(' ')[0]} 👋</h1>
          <p className="ph-s">FY 2024–25 · {CURRENT_Q} check-in window is open · {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
        </div>
        <button className="btn btn-p btn-sm" onClick={() => onNav('goals')}>View My Goals →</button>
      </div>

      <div className="sg s4 mb3">
        <StatCard val={myGoals.length}  lbl="Total Goals"     sub={`${approved.length} approved`}                           icon="🎯" />
        <StatCard val={`${score}%`}     lbl={`${CURRENT_Q} Score`} sub={prevScore ? `${score >= prevScore ? '↑' : '↓'} vs ${prevScore}% in Q2` : undefined} subCol={score >= prevScore ? 'var(--succ)' : 'var(--dang)'} icon="📈" />
        <StatCard val={approved.filter(g => g.st[CURRENT_Q] === 'Completed').length} lbl="Goals Completed" sub={`${approved.filter(g => g.st[CURRENT_Q] === 'On Track').length} on track`} subCol="var(--succ)" icon="✅" />
        <StatCard val={myGoals.filter(g => g.status === 'draft').length} lbl="Drafts Pending" sub={myGoals.filter(g => g.status === 'draft').length ? 'Submit for approval' : 'All submitted'} subCol={myGoals.filter(g => g.status === 'draft').length ? 'var(--acc)' : undefined} icon="📝" />
      </div>

      <div className="gr-main">
        {/* Progress rings */}
        <div className="card">
          <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--ts)', marginBottom: 14, textTransform: 'uppercase', letterSpacing: '.5px' }}>Progress Rings — {CURRENT_Q}</p>
          {approved.length === 0 && <p style={{ fontSize: 13, color: 'var(--tm)', textAlign: 'center', padding: '20px 0' }}>No approved goals yet</p>}
          <div className="progress-ring-grid">
            {approved.slice(0, 4).map(g => {
              const p = calcPct(g, CURRENT_Q)
              return (
                <div key={g.id} className="ring-tile">
                  <p className="ring-tile-title">
                    {g.title.length > 26 ? g.title.slice(0, 26) + '…' : g.title}
                  </p>
                  <ProgressRing pct={p || 0} size={140} stroke={10}>
                    <div style={{ fontSize: 22, fontWeight: 700, color: pctCol(p || 0), fontFamily: 'var(--fd)' }}>
                      {p !== null ? `${Math.round(p)}%` : '—'}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--ts)', marginTop: 2 }}>
                      {g.st[CURRENT_Q]}
                    </div>
                  </ProgressRing>
                  <div style={{ marginTop: 10, width: '100%' }}>
                    <div className="pb" style={{ height: 10 }}>
                      <div className="pf" style={{ width: `${Math.min(p || 0, 100)}%`, background: pctCol(p || 0) }} />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Quarterly timeline */}
        <div className="card">
          <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--ts)', marginBottom: 14, textTransform: 'uppercase', letterSpacing: '.5px' }}>Check-in Schedule</p>
          {[
            { q: 'Q1', label: 'Apr–Jun 2024', sts: 'Completed' },
            { q: 'Q2', label: 'Jul–Sep 2024', sts: 'Completed' },
            { q: 'Q3', label: 'Oct–Dec 2024', sts: 'Open' },
            { q: 'Q4', label: 'Jan–Mar 2025', sts: 'Upcoming' },
          ].map(({ q, label, sts }) => (
            <div key={q} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', borderRadius: 8, background: q === CURRENT_Q ? 'var(--accD)' : 'var(--bgs)', border: `1px solid ${q === CURRENT_Q ? 'var(--acc)' : 'var(--br)'}`, marginBottom: 6 }}>
              <div style={{ width: 30, textAlign: 'center', fontFamily: 'var(--fd)', fontWeight: 700, fontSize: 13, color: q === CURRENT_Q ? 'var(--acc)' : 'var(--ts)' }}>{q}</div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 12.5, fontWeight: 500 }}>{label}</p>
                <p style={{ fontSize: 11, color: 'var(--tm)' }}>{sts}</p>
              </div>
              {q === CURRENT_Q && <button className="btn btn-p btn-xs" onClick={() => onNav('checkin')}>Log →</button>}
              {sts === 'Completed' && <Badge cls="b-ok">Done</Badge>}
            </div>
          ))}
        </div>
      </div>

      {returned && (
        <div className="alert-d mt3">
          <strong>⚠ Goals Returned for Rework</strong>
          <p style={{ fontSize: 12.5, marginTop: 4 }}>Your manager returned your goal sheet. Please review the feedback and resubmit.</p>
          <button className="btn btn-d btn-sm mt2" onClick={() => onNav('goals')}>Review Goals</button>
        </div>
      )}
    </div>
  )
}
