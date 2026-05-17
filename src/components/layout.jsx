import { useState } from 'react'
import { Av, Badge } from './ui.jsx'
import { USERS, NAV, PAGE_TITLES, CURRENT_Q, CURRENT_FY } from '../lib/constants.js'
import { fmtDate } from '../lib/utils.js'

const ROLE_COL = { employee: 'var(--blue)', manager: 'var(--succ)', admin: 'var(--purp)' }
const NOTIF_ICON = { approval: '✅', info: 'ℹ️', checkin: '💬', alert: '⚠️' }

// ── Sidebar ───────────────────────────────────────────────────
export const Sidebar = ({ user, page, onNav, onSwitch, pendingCount }) => {
  const nav = NAV[user.role] || []
  return (
    <div className="sb">
      <div className="sb-logo">
        <div className="sb-logo-t">★ NorthStar</div>
        <div className="sb-logo-s">Goal Management · FY {CURRENT_FY}</div>
      </div>

      {/* User card */}
      <div style={{ padding: '10px 10px 6px' }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', padding: '8px', borderRadius: 8, background: 'var(--bgc)', border: '1px solid var(--br)' }}>
          <Av name={user.name} av={user.av} size={32} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: 12.5, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.name}</p>
            <p style={{ fontSize: 10.5, textTransform: 'capitalize', color: ROLE_COL[user.role], fontWeight: 600 }}>{user.role} · {user.dept}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="ns-label">Navigation</div>
      {nav.map(n => (
        <div key={n.k} className={`ni${page === n.k ? ' act' : ''}`} onClick={() => onNav(n.k)}>
          <span className="nic">{n.i}</span>
          <span>{n.l}</span>
          {n.k === 'approvals' && pendingCount > 0 && (
            <span className="ni-badge">{pendingCount}</span>
          )}
        </div>
      ))}

      <div style={{ flex: 1 }} />

      {/* Demo role switcher */}
      <div style={{ padding: '8px 8px 14px', borderTop: '1px solid var(--br)' }}>
        <div className="ns-label" style={{ marginBottom: 5 }}>Demo — Switch User</div>
        {Object.values(USERS).map(u => (
          <div
            key={u.id}
            style={{
              display: 'flex', gap: 6, alignItems: 'center', padding: '4px 6px',
              borderRadius: 6, cursor: 'pointer', marginBottom: 2,
              border: `1px solid ${u.id === user.id ? 'var(--acc)' : 'transparent'}`,
              background: u.id === user.id ? 'var(--accD)' : undefined,
            }}
            onClick={() => onSwitch(u)}
          >
            <Av name={u.name} av={u.av} size={20} />
            <span style={{ fontSize: 11, color: u.id === user.id ? 'var(--acc)' : 'var(--ts)' }}>
              {u.name.split(' ')[0]}{' '}
              <span style={{ color: 'var(--tm)', textTransform: 'capitalize' }}>({u.role.slice(0, 3)})</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Topbar ────────────────────────────────────────────────────
export const Topbar = ({ user, page, notifs, markRead }) => {
  const [showNotif, setShowNotif] = useState(false)
  const unread = (notifs || []).filter(n => !n.read).length

  const toggle = () => {
    setShowNotif(s => !s)
    if (!showNotif) markRead?.()
  }

  return (
    <div className="topbar">
      <div style={{ flex: 1 }}>
        <span style={{ fontFamily: 'var(--fd)', fontSize: 14, fontWeight: 600 }}>{PAGE_TITLES[page] || page}</span>
        <span style={{ fontSize: 11, color: 'var(--tm)', marginLeft: 10 }}>FY {CURRENT_FY} · {CURRENT_Q} Active</span>
      </div>

      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        {/* Bell */}
        <div style={{ position: 'relative' }}>
          <button className="btn btn-g" style={{ padding: '6px 10px', fontSize: 17, position: 'relative' }} onClick={toggle}>
            🔔
            {unread > 0 && (
              <span style={{ position: 'absolute', top: 2, right: 2, width: 14, height: 14, borderRadius: '50%', background: 'var(--dang)', fontSize: 9, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                {unread}
              </span>
            )}
          </button>

          {showNotif && (
            <div className="notif-panel">
              <p style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--ts)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '.4px' }}>Notifications</p>
              {(notifs || []).slice(0, 6).map(n => (
                <div key={n.id} className={`notif-item${n.read ? '' : ' unread'}`}>
                  <span style={{ fontSize: 15, flexShrink: 0 }}>{NOTIF_ICON[n.type] || '📌'}</span>
                  <div>
                    <p style={{ fontSize: 12, lineHeight: 1.4 }}>{n.msg}</p>
                    <p style={{ fontSize: 10.5, color: 'var(--tm)', marginTop: 2 }}>{fmtDate(n.ts)}</p>
                  </div>
                </div>
              ))}
              {!(notifs || []).length && <p style={{ fontSize: 12, color: 'var(--tm)', textAlign: 'center', padding: 14 }}>No notifications</p>}
              <button className="btn btn-g btn-xs mt2" style={{ width: '100%', justifyContent: 'center' }} onClick={() => setShowNotif(false)}>Close</button>
            </div>
          )}
        </div>

        <div style={{ fontSize: 11, textAlign: 'right' }}>
          <div style={{ color: 'var(--ts)', fontWeight: 500, fontSize: 12 }}>{user.email}</div>
        </div>
        <Av name={user.name} av={user.av} size={34} />
      </div>
    </div>
  )
}

// ── Login ─────────────────────────────────────────────────────
export const Login = ({ onLogin }) => {
  const [sel, setSel] = useState(null)
  const roles = [
    { key: 'employee', icon: '↗', label: 'Employee',      desc: 'Create goals, log achievements, and track your personal growth journey.', users: ['emp1', 'emp2', 'emp3', 'emp4'], cta: 'Employee' },
    { key: 'manager',  icon: '✓', label: 'Manager (L1)',  desc: 'Approve goals, conduct check-ins, and oversee team progress.',          users: ['mgr1', 'mgr2'], cta: 'Manager' },
    { key: 'admin',    icon: '◫', label: 'Admin / HR',    desc: 'Org oversight, cycle management, and ensure organization-wide alignment.', users: ['admin1'], cta: 'Admin / HR' },
  ]
  const selRole = roles.find(r => r.key === sel)
  const features = [
    { icon: '◉', label: 'AI Goal Coach' },
    { icon: '↗', label: 'Smart Analytics' },
    { icon: '◌', label: 'AI Insights' },
    { icon: '⟡', label: 'Shared Goals' },
    { icon: '▣', label: 'CSV Export' },
  ]

  return (
    <div className="login-bg">
      <div className="login-wrap">
        <div className="landing-brand">
          <div className="landing-title">☆ NorthStar</div>
        </div>

        <div className="landing-features">
          {features.map((f) => (
            <span key={f.label} className="landing-pill"><span>{f.icon}</span>{f.label}</span>
          ))}
        </div>

        <div className="landing-panel">
          <h2 className="landing-panel-title">Select Your Role to Access the Platform</h2>
          <div className="landing-roles">
            {roles.map(r => (
              <div key={r.key} className={`role-card${sel === r.key ? ' sel' : ''}`} onClick={() => setSel(r.key)}>
                <div className="role-emoji">{r.icon}</div>
                <div className="role-title">{r.label}</div>
                <div className="role-desc">{r.desc}</div>
                <button className="role-cta" onClick={(e) => { e.stopPropagation(); setSel(r.key) }}>{r.cta} →</button>
              </div>
            ))}
          </div>
        </div>

        {selRole && (
          <div className="landing-login">
            <p className="landing-login-label">Login as:</p>
            <div className="landing-login-list">
              {selRole.users.map(uid => {
                const u = USERS[uid]
                return (
                  <button key={uid} className="btn btn-s landing-login-btn" onClick={() => onLogin(u)}>
                    <Av name={u.name} av={u.av} size={28} />
                    <div className="landing-login-user">
                      <div className="landing-login-name">{u.name}</div>
                      <div className="landing-login-dept">{u.dept}</div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        <div className="landing-footer">
          Powered by Groq AI · Built with ♥ for AtomQuest Hackathon 1.0
        </div>
      </div>
    </div>
  )
}
