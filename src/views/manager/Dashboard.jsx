import { StatCard, Av, Badge } from '../../components/ui.jsx'
import { wtdScore, calcPct, pctCol } from '../../lib/utils.js'
import { USERS, CURRENT_Q } from '../../lib/constants.js'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const CHART_TOOLTIP = { contentStyle: { background: 'var(--bgc)', border: '1px solid var(--br)', borderRadius: 8, color: 'var(--tp)', fontSize: 12 } }

export default function MgrDashboard({ user, goals, checkIns, onNav }) {
  const myEmps    = Object.values(USERS).filter(u => u.mgr === user.id)
  const pending   = goals.filter(g => myEmps.some(e => e.id === g.eId) && g.status === 'submitted')
  const teamScore = Math.round(
    myEmps.reduce((s, e) => {
      const eg = goals.filter(g => g.eId === e.id && g.status === 'approved')
      return s + wtdScore(eg, CURRENT_Q)
    }, 0) / Math.max(myEmps.length, 1)
  )

  const barData = myEmps.map(e => ({
    name: e.name.split(' ')[0],
    score: wtdScore(goals.filter(g => g.eId === e.id && g.status === 'approved'), CURRENT_Q),
  }))

  return (
    <div className="fu">
      <div className="ph">
        <div>
          <h1 className="ph-t">Team Dashboard</h1>
          <p className="ph-s">{user.dept} · {myEmps.length} direct reports · {CURRENT_Q} check-in period</p>
        </div>
        {pending.length > 0 && (
          <button className="btn btn-p btn-sm" onClick={() => onNav('approvals')}>
            Review {pending.length} Pending →
          </button>
        )}
      </div>

      <div className="sg s4 mb3">
        <StatCard val={myEmps.length}       lbl="Direct Reports"    icon="👥" />
        <StatCard val={pending.length}      lbl="Pending Approvals" sub={pending.length ? 'Action required' : 'All reviewed'} subCol={pending.length ? 'var(--dang)' : undefined} icon="⏳" />
        <StatCard val={`${teamScore}%`}     lbl="Team Avg Score"    sub={`${CURRENT_Q} performance`} subCol="var(--succ)" icon="🏆" />
        <StatCard val={checkIns.filter(ci => myEmps.some(e => e.id === ci.eId)).length} lbl="Check-ins Done" icon="✅" />
      </div>

      <div className="gr2">
        <div className="card">
          <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--ts)', marginBottom: 14, textTransform: 'uppercase', letterSpacing: '.5px' }}>
            Team Performance — {CURRENT_Q}
          </p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={barData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="2 2" stroke="var(--br)" />
              <XAxis dataKey="name" tick={{ fill: 'var(--ts)', fontSize: 11 }} />
              <YAxis tick={{ fill: 'var(--ts)', fontSize: 11 }} domain={[0, 130]} />
              <Tooltip {...CHART_TOOLTIP} />
              <Bar dataKey="score" fill="var(--acc)" radius={[4, 4, 0, 0]} maxBarSize={44} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--ts)', marginBottom: 14, textTransform: 'uppercase', letterSpacing: '.5px' }}>Member Status</p>
          {myEmps.map(e => {
            const eg     = goals.filter(g => g.eId === e.id)
            const isPend = eg.some(g => g.status === 'submitted')
            const score  = wtdScore(eg.filter(g => g.status === 'approved'), CURRENT_Q)
            const lbl    = isPend ? 'Pending Approval' : eg.some(g => g.status === 'approved') ? 'Active' : 'Draft'
            return (
              <div key={e.id}
                style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px', borderRadius: 8, border: `1px solid ${isPend ? 'var(--acc)' : 'var(--br)'}`, background: isPend ? 'var(--accD)' : 'var(--bgs)', marginBottom: 6, cursor: 'pointer' }}
                onClick={() => onNav(isPend ? 'approvals' : 'checkin')}>
                <Av name={e.name} av={e.av} size={34} />
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 13, fontWeight: 600 }}>{e.name}</p>
                  <p style={{ fontSize: 11, color: 'var(--tm)' }}>{eg.length} goals · <span style={{ color: isPend ? 'var(--acc)' : score > 80 ? 'var(--succ)' : 'var(--ts)' }}>{lbl}</span></p>
                </div>
                {score > 0 && <div style={{ fontFamily: 'var(--fd)', fontWeight: 700, fontSize: 14, color: pctCol(score) }}>{score}%</div>}
                {isPend && <Badge cls="b-w">Review</Badge>}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
