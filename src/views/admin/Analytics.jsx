import { useState } from 'react'
import { AIInsights } from '../../components/ai.jsx'
import { Av, Badge } from '../../components/ui.jsx'
import { USERS, THRUST, QS, CURRENT_Q, CHART_COLORS, STATUS_BADGE } from '../../lib/constants.js'
import { wtdScore, pctCol } from '../../lib/utils.js'
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts'

const CHART_TOOLTIP = { contentStyle: { background: 'var(--bgc)', border: '1px solid var(--br)', borderRadius: 8, color: 'var(--tp)', fontSize: 12 } }

export default function AdminAnalytics({ goals, checkIns }) {
  const [tab, setTab] = useState('trends')
  const emps = Object.values(USERS).filter(u => u.role === 'employee')

  // QoQ individual trend
  const trendData = QS.map(q => {
    const d = { q }
    emps.forEach(e => { d[e.name.split(' ')[0]] = wtdScore(goals.filter(g => g.eId === e.id && g.status === 'approved'), q) })
    return d
  })

  // Dept comparison
  const deptData = ['Sales', 'Engineering'].map(dept => {
    const de = emps.filter(e => e.dept === dept)
    const row = { dept }
    QS.forEach(q => {
      row[q] = Math.round(de.reduce((s, e) => s + wtdScore(goals.filter(g => g.eId === e.id && g.status === 'approved'), q), 0) / Math.max(de.length, 1))
    })
    return row
  })

  // Radar
  const radarData = THRUST.map(t => ({ thrust: t.split(' ')[0], count: goals.filter(g => g.thrust === t && g.status === 'approved' && emps.some(e => e.id === g.eId)).length }))

  // Escalations
  const escalations = emps.map(e => {
    const eg = goals.filter(g => g.eId === e.id)
    const issues = []
    if (!eg.some(g => ['approved', 'submitted'].includes(g.status))) issues.push('Goals not submitted')
    if (eg.some(g => g.status === 'submitted')) issues.push('Awaiting manager approval')
    if (eg.some(g => g.status === 'approved') && !checkIns.some(ci => ci.eId === e.id)) issues.push('No check-ins recorded')
    return { emp: e, issues }
  }).filter(r => r.issues.length)

  const tabs = [
    { k: 'trends', l: 'QoQ Trends' },
    { k: 'dept',   l: 'By Department' },
    { k: 'radar',  l: 'Thrust Coverage' },
    { k: 'ai',     l: '🔮 AI Insights' },
  ]

  return (
    <div className="fu">
      <div className="ph">
        <div><h1 className="ph-t">Analytics & Insights</h1><p className="ph-s">Quarter-on-Quarter performance · AI-powered observations</p></div>
      </div>

      <div className="tg">
        {tabs.map(t => <button key={t.k} className={`tb${tab === t.k ? ' act' : ''}`} onClick={() => setTab(t.k)}>{t.l}</button>)}
      </div>

      {tab === 'trends' && (
        <div className="card fu">
          <p style={{ fontWeight: 600, fontSize: 14, marginBottom: 16 }}>Individual Performance — All Quarters</p>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trendData} margin={{ top: 0, right: 10, left: -15, bottom: 0 }}>
              <CartesianGrid strokeDasharray="2 2" stroke="var(--br)" />
              <XAxis dataKey="q" tick={{ fill: 'var(--ts)', fontSize: 11 }} />
              <YAxis tick={{ fill: 'var(--ts)', fontSize: 11 }} domain={[0, 130]} />
              <Tooltip {...CHART_TOOLTIP} />
              <Legend formatter={v => <span style={{ fontSize: 11, color: 'var(--ts)' }}>{v}</span>} />
              {emps.slice(0, 4).map((e, i) => (
                <Line key={e.id} type="monotone" dataKey={e.name.split(' ')[0]}
                  stroke={CHART_COLORS[i]} strokeWidth={2.5}
                  dot={{ fill: CHART_COLORS[i], r: 4 }} activeDot={{ r: 6 }} />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {tab === 'dept' && (
        <div className="card fu">
          <p style={{ fontWeight: 600, fontSize: 14, marginBottom: 16 }}>Department QoQ Comparison</p>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={deptData} margin={{ top: 0, right: 10, left: -15, bottom: 0 }}>
              <CartesianGrid strokeDasharray="2 2" stroke="var(--br)" />
              <XAxis dataKey="dept" tick={{ fill: 'var(--ts)', fontSize: 11 }} />
              <YAxis tick={{ fill: 'var(--ts)', fontSize: 11 }} domain={[0, 130]} />
              <Tooltip {...CHART_TOOLTIP} />
              <Legend formatter={v => <span style={{ fontSize: 11, color: 'var(--ts)' }}>{v}</span>} />
              {QS.map((q, i) => <Bar key={q} dataKey={q} fill={CHART_COLORS[i]} radius={[4, 4, 0, 0]} maxBarSize={40} />)}
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {tab === 'radar' && (
        <div className="card fu">
          <p style={{ fontWeight: 600, fontSize: 14, marginBottom: 16 }}>Goal Coverage by Thrust Area</p>
          <ResponsiveContainer width="100%" height={320}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="var(--br)" />
              <PolarAngleAxis dataKey="thrust" tick={{ fill: 'var(--ts)', fontSize: 10 }} />
              <Radar name="Approved Goals" dataKey="count" stroke="var(--acc)" fill="var(--acc)" fillOpacity={0.18} />
              <Tooltip {...CHART_TOOLTIP} />
            </RadarChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
            {THRUST.map((t, i) => {
              const c = goals.filter(g => g.thrust === t && g.status === 'approved' && emps.some(e => e.id === g.eId)).length
              return (
                <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 20, background: 'var(--bgs)', border: '1px solid var(--br)' }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: CHART_COLORS[i % CHART_COLORS.length] }} />
                  <span style={{ fontSize: 11.5, color: 'var(--ts)' }}>{t}</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--acc)' }}>{c}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {tab === 'ai' && (
        <div className="fu">
          <AIInsights goals={goals} users={USERS} quarter={CURRENT_Q} />

          <div className="gr2 mt3">
            {/* Escalation alerts */}
            <div className="card">
              <p style={{ fontWeight: 600, fontSize: 13, marginBottom: 12 }}>⚠ Escalation Alerts</p>
              {escalations.length === 0 && <p style={{ fontSize: 12.5, color: 'var(--tm)' }}>No escalation issues — all employees are on track.</p>}
              {escalations.map(({ emp, issues }) => (
                <div key={emp.id} style={{ display: 'flex', gap: 8, padding: '8px 10px', borderRadius: 8, background: 'var(--dangD)', border: '1px solid var(--dang)', marginBottom: 6 }}>
                  <Av name={emp.name} av={emp.av} size={28} />
                  <div>
                    <p style={{ fontSize: 12.5, fontWeight: 600 }}>{emp.name}</p>
                    {issues.map(iss => <p key={iss} style={{ fontSize: 11.5, color: 'var(--dang)' }}>• {iss}</p>)}
                  </div>
                </div>
              ))}
            </div>

            {/* Status summary */}
            <div className="card">
              <p style={{ fontWeight: 600, fontSize: 13, marginBottom: 12 }}>📊 Goal Sheet Status</p>
              {['approved', 'submitted', 'draft', 'returned'].map(s => {
                const cnt = goals.filter(g => g.status === s && emps.some(e => e.id === g.eId)).length
                return cnt > 0 ? (
                  <div key={s} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, padding: '8px 10px', background: 'var(--bgs)', borderRadius: 8 }}>
                    <Badge cls={STATUS_BADGE[s] || 'b-m'}>{s}</Badge>
                    <span style={{ fontFamily: 'var(--fd)', fontWeight: 700, fontSize: 18 }}>{cnt}</span>
                  </div>
                ) : null
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
