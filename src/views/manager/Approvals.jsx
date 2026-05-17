import { useState } from 'react'
import { Av, Badge, Modal, EmptyState } from '../../components/ui.jsx'
import { USERS, UOM, STATUS_BADGE } from '../../lib/constants.js'
import { fmtV, sumWt, uid, nowTs } from '../../lib/utils.js'

export default function MgrApprovals({ user, goals, setGoals, setAuditLog, addNotif }) {
  const myEmps = Object.values(USERS).filter(u => u.mgr === user.id)
  const [editing, setEditing]         = useState({})
  const [returnModal, setReturnModal] = useState(null)
  const [returnComment, setReturnComment] = useState('')

  const pending = goals.filter(g => myEmps.some(e => e.id === g.eId) && g.status === 'submitted')
  const grouped = myEmps.reduce((m, e) => {
    const eg = pending.filter(g => g.eId === e.id)
    if (eg.length) m[e.id] = { emp: e, goals: eg }
    return m
  }, {})

  const approve = empId => {
    setGoals(p => p.map(g => g.eId === empId && g.status === 'submitted' ? { ...g, status: 'approved' } : g))
    setAuditLog(p => [{ id: 'a' + uid(), ts: nowTs(), uid: user.id, action: 'Goals Approved', entity: USERS[empId]?.name, detail: 'All goals approved and locked' }, ...p])
    addNotif?.(`${USERS[empId]?.name}'s goals have been approved`, 'approval')
  }

  const confirmReturn = () => {
    if (!returnModal) return
    setGoals(p => p.map(g =>
      g.eId === returnModal.empId && g.status === 'submitted'
        ? { ...g, status: 'returned', returnComment: returnComment || 'Please review and resubmit.' }
        : g
    ))
    setAuditLog(p => [{ id: 'a' + uid(), ts: nowTs(), uid: user.id, action: 'Goals Returned', entity: returnModal.empName, detail: returnComment || 'Returned for rework' }, ...p])
    addNotif?.(`${returnModal.empName}'s goals returned for rework`, 'alert')
    setReturnModal(null)
    setReturnComment('')
  }

  const saveEdit = gId => {
    if (!editing[gId]) return
    const { wt, target } = editing[gId]
    setGoals(p => p.map(g => g.id === gId
      ? { ...g, ...(wt ? { wt: Number(wt) } : {}), ...(target !== undefined && target !== '' ? { target: Number(target) } : {}) }
      : g))
    setEditing(p => { const n = { ...p }; delete n[gId]; return n })
  }

  if (!Object.keys(grouped).length) return (
    <div className="fu">
      <div className="ph"><h1 className="ph-t">Pending Approvals</h1></div>
      <EmptyState icon="✅" title="No pending approvals" sub="All goal sheets have been reviewed" />
    </div>
  )

  return (
    <div className="fu">
      <div className="ph">
        <div>
          <h1 className="ph-t">Pending Approvals</h1>
          <p className="ph-s">{pending.length} goals from {Object.keys(grouped).length} employee(s) awaiting review</p>
        </div>
      </div>

      {/* Return Modal */}
      {returnModal && (
        <Modal onClose={() => { setReturnModal(null); setReturnComment('') }} cls="m-sm">
          <h3 style={{ fontFamily: 'var(--fd)', fontWeight: 700, marginBottom: 12 }}>↩ Return Goals for Rework</h3>
          <p style={{ fontSize: 13, color: 'var(--ts)', marginBottom: 14 }}>
            Returning <strong>{returnModal.empName}</strong>'s goal sheet. Add specific feedback so they know exactly what to fix.
          </p>
          <div className="fg">
            <label className="fl">Manager Feedback (Optional)</label>
            <textarea className="txta"
              placeholder="e.g. Total weightage is not 100%. Please redistribute and ensure each goal meets the minimum 10% threshold."
              value={returnComment}
              onChange={e => setReturnComment(e.target.value)} />
          </div>
          <div className="fl-b mt2">
            <button className="btn btn-g btn-sm" onClick={() => { setReturnModal(null); setReturnComment('') }}>Cancel</button>
            <button className="btn btn-d btn-sm" onClick={confirmReturn}>↩ Confirm Return</button>
          </div>
        </Modal>
      )}

      {Object.values(grouped).map(({ emp, goals: eg }) => {
        const total = sumWt(eg)
        return (
          <div key={emp.id} className="card mb3">
            <div className="fl-b mb3" style={{ flexWrap: 'wrap', gap: 10 }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <Av name={emp.name} av={emp.av} size={42} />
                <div>
                  <p style={{ fontWeight: 700, fontSize: 14 }}>{emp.name}</p>
                  <p style={{ fontSize: 12, color: 'var(--tm)' }}>
                    {emp.dept} · {eg.length} goals · Total weight:{' '}
                    <span style={{ color: total === 100 ? 'var(--succ)' : 'var(--dang)', fontWeight: 600 }}>{total}%</span>
                  </p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn btn-d btn-sm" onClick={() => setReturnModal({ empId: emp.id, empName: emp.name })}>↩ Return</button>
                <button className="btn btn-ok btn-sm" onClick={() => approve(emp.id)} disabled={total !== 100}>✓ Approve & Lock</button>
              </div>
            </div>

            {total !== 100 && (
              <div className="alert-d mb3">⚠ Total weightage is {total}% — must equal exactly 100% to approve</div>
            )}

            <div style={{ overflowX: 'auto' }}>
              <table className="tbl">
                <thead>
                  <tr><th>Goal</th><th>Thrust Area</th><th>UoM</th><th>Target</th><th>Weight</th><th>Shared</th><th>Edit</th></tr>
                </thead>
                <tbody>
                  {eg.map(g => (
                    <tr key={g.id}>
                      <td>
                        <p style={{ fontWeight: 500 }}>{g.title}</p>
                        <p style={{ fontSize: 11, color: 'var(--tm)' }}>{g.desc.slice(0, 48)}…</p>
                      </td>
                      <td><Badge cls="b-m">{g.thrust.split(' ')[0]}</Badge></td>
                      <td style={{ fontSize: 12, color: 'var(--ts)' }}>{UOM.find(u => u.v === g.uom)?.l.split('–')[0].trim()}</td>
                      <td>
                        {editing[g.id]
                          ? <input type="number" className="inp" style={{ width: 90, padding: '4px 8px', fontSize: 12 }}
                              value={editing[g.id].target ?? String(g.target)}
                              onChange={e => setEditing(p => ({ ...p, [g.id]: { ...p[g.id], target: e.target.value } }))} />
                          : <span style={{ fontSize: 12.5 }}>{fmtV(g.target, g.uom, g.unit)}</span>}
                      </td>
                      <td>
                        {editing[g.id]
                          ? <input type="number" className="inp" style={{ width: 65, padding: '4px 8px', fontSize: 12 }}
                              value={editing[g.id].wt ?? String(g.wt)}
                              onChange={e => setEditing(p => ({ ...p, [g.id]: { ...p[g.id], wt: e.target.value } }))} />
                          : <span style={{ fontWeight: 600 }}>{g.wt}%</span>}
                      </td>
                      <td>{g.shared ? <Badge cls="b-p">🔗 Yes</Badge> : <span style={{ color: 'var(--tm)', fontSize: 12 }}>No</span>}</td>
                      <td>
                        {editing[g.id]
                          ? <div style={{ display: 'flex', gap: 4 }}>
                              <button className="btn btn-ok btn-xs" onClick={() => saveEdit(g.id)}>Save</button>
                              <button className="btn btn-g btn-xs" onClick={() => setEditing(p => { const n = { ...p }; delete n[g.id]; return n })}>✕</button>
                            </div>
                          : <button className="btn btn-g btn-xs" onClick={() => setEditing(p => ({ ...p, [g.id]: {} }))}>Edit</button>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      })}
    </div>
  )
}
