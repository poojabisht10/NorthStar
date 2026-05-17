import { useState, useCallback } from 'react'
import { Sidebar, Topbar, Login } from './components/layout.jsx'
import EmpDashboard from './views/employee/Dashboard.jsx'
import EmpGoals     from './views/employee/Goals.jsx'
import EmpCheckin   from './views/employee/Checkin.jsx'
import MgrDashboard from './views/manager/Dashboard.jsx'
import MgrApprovals from './views/manager/Approvals.jsx'
import MgrCheckin   from './views/manager/Checkin.jsx'
import AdminDashboard from './views/admin/Dashboard.jsx'
import AdminAnalytics from './views/admin/Analytics.jsx'
import { AdminAudit, AdminCycle } from './views/admin/AuditCycle.jsx'
import { USERS }        from './lib/constants.js'
import { INIT_GOALS, INIT_CHECKINS, INIT_AUDIT, INIT_NOTIFS } from './lib/data.js'
import { uid, nowTs }   from './lib/utils.js'

export default function App() {
  const [user,     setUser]     = useState(null)
  const [page,     setPage]     = useState('dashboard')
  const [goals,    setGoals]    = useState(INIT_GOALS)
  const [checkIns, setCheckIns] = useState(INIT_CHECKINS)
  const [auditLog, setAuditLog] = useState(INIT_AUDIT)
  const [notifs,   setNotifs]   = useState(INIT_NOTIFS)

  const addNotif = useCallback((msg, type = 'info') => {
    setNotifs(p => [{ id: 'n' + uid(), ts: nowTs(), msg, type, read: false }, ...p])
  }, [])

  const markRead = useCallback(() => {
    setNotifs(p => p.map(n => ({ ...n, read: true })))
  }, [])

  const switchUser = useCallback(u => {
    setUser(u)
    setPage('dashboard')
  }, [])

  const nav = useCallback(p => setPage(p), [])

  if (!user) return <Login onLogin={u => { setUser(u); setPage('dashboard') }} />

  // Count approvals pending for this manager
  const myEmps = Object.values(USERS).filter(u => u.mgr === user.id)
  const pendingCount = goals.filter(g => myEmps.some(e => e.id === g.eId) && g.status === 'submitted').length

  const renderPage = () => {
    // Shared props
    const shared = { goals, setGoals, setAuditLog, addNotif }

    switch (user.role) {
      case 'employee':
        switch (page) {
          case 'dashboard': return <EmpDashboard user={user} goals={goals} onNav={nav} />
          case 'goals':     return <EmpGoals     user={user} {...shared} />
          case 'checkin':   return <EmpCheckin   user={user} goals={goals} setGoals={setGoals} setAuditLog={setAuditLog} />
        }
        break

      case 'manager':
        switch (page) {
          case 'dashboard':  return <MgrDashboard  user={user} goals={goals} checkIns={checkIns} onNav={nav} />
          case 'approvals':  return <MgrApprovals  user={user} goals={goals} setGoals={setGoals} setAuditLog={setAuditLog} addNotif={addNotif} />
          case 'checkin':    return <MgrCheckin    user={user} goals={goals} setGoals={setGoals} checkIns={checkIns} setCheckIns={setCheckIns} setAuditLog={setAuditLog} />
          case 'analytics':  return <AdminAnalytics goals={goals} checkIns={checkIns} />
        }
        break

      case 'admin':
        switch (page) {
          case 'dashboard': return <AdminDashboard goals={goals} checkIns={checkIns} onNav={nav} setGoals={setGoals} setAuditLog={setAuditLog} addNotif={addNotif} />
          case 'cycle':     return <AdminCycle />
          case 'analytics': return <AdminAnalytics goals={goals} checkIns={checkIns} />
          case 'audit':     return <AdminAudit auditLog={auditLog} />
        }
        break
    }

    return <div style={{ padding: 30, color: 'var(--ts)' }}>Page not found</div>
  }

  return (
    <div className="app">
      <Sidebar user={user} page={page} onNav={nav} onSwitch={switchUser} pendingCount={pendingCount} />
      <div className="main">
        <Topbar user={user} page={page} notifs={notifs} markRead={markRead} />
        <div className="content">{renderPage()}</div>
      </div>
    </div>
  )
}
