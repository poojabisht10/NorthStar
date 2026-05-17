import { useState } from 'react'
import { Badge, Modal, EmptyState } from '../../components/ui.jsx'
import { AICoach } from '../../components/ai.jsx'
import { QS, UOM, STATUS_BADGE } from '../../lib/constants.js'
import { calcPct, fmtV, sumWt, uid, nowTs } from '../../lib/utils.js'
import GoalWizard from './GoalWizard.jsx'

export default function EmpGoals({ user, goals, setGoals, setAuditLog }) {
  const [showWiz, setShowWiz] = useState(false)
  const [showAI,  setShowAI]  = useState(null)

  const myGoals    = goals.filter(g => g.eId === user.id)
  const activeDrafts = myGoals.filter(g => g.status === 'draft')
  const usedWt     = sumWt(myGoals.filter(g => g.status !== 'returned'))
  const canSubmit  = activeDrafts.length > 0 && usedWt === 100
  const canAdd     = myGoals.filter(g => g.status !== 'returned').length < 8

  const addGoal = g => {
    setGoals(p => [...p, g])
    setAuditLog(p => [{ id: 'a' + uid(), ts: nowTs(), uid: user.id, action: 'Goal Created', entity: g.title, detail: `${g.wt}% weightage · ${g.thrust}` }, ...p])
  }

  const submitGoals = () => {
    setGoals(p => p.map(g => g.eId === user.id && g.status === 'draft' ? { ...g, status: 'submitted' } : g))
    setAuditLog(p => [{ id: 'a' + uid(), ts: nowTs(), uid: user.id, action: 'Goal Submitted', entity: 'Goal Sheet', detail: `Submitted ${activeDrafts.length} goals for manager approval` }, ...p])
  }

  const delGoal = id => setGoals(p => p.filter(g => g.id !== id))

  return (
    <div className="fu">
      <div className="ph">
        <div><h1 className="ph-t">My Goals</h1><p className="ph-s">FY 2024–25 Goal Sheet</p></div>
        <div style={{ display: 'flex', gap: 8 }}>
          {(activeDrafts.length > 0 || !myGoals.length) && canAdd && (
            <button className="btn btn-s btn-sm" onClick={() => setShowWiz(true)}>+ Add Goal</button>
          )}
          {canSubmit && (
            <button className="btn btn-p btn-sm" onClick={submitGoals}>Submit for Approval →</button>
          )}
        </div>
      </div>

      {/* Weightage tracker */}
      <div style={{ background: 'var(--bgs)', border: `1px solid ${usedWt === 100 ? 'var(--succ)' : usedWt > 100 ? 'var(--dang)' : 'var(--br)'}`, borderRadius: 10, padding: 12, marginBottom: 14 }}>
        <div className="fl-b mb1">
          <span style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--ts)' }}>Total Weightage</span>
          <span style={{ fontFamily: 'var(--fd)', fontWeight: 700, fontSize: 16, color: usedWt === 100 ? 'var(--succ)' : usedWt > 100 ? 'var(--dang)' : 'var(--acc)' }}>
            {usedWt}% / 100%
          </span>
        </div>
        <div className="we-bar">
          <div className="we-fill" style={{ width: `${Math.min(usedWt, 100)}%`, background: usedWt === 100 ? 'var(--succ)' : usedWt > 100 ? 'var(--dang)' : 'var(--acc)' }} />
        </div>
        <p style={{ fontSize: 11, color: 'var(--tm)', marginTop: 4 }}>
          {myGoals.filter(g => g.status !== 'returned').length}/8 goals · Must total exactly 100% to submit
        </p>
      </div>

      {!myGoals.length && (
        <EmptyState icon="🎯" title="No goals yet" sub="Create your first goal to get started for FY 2024–25"
          action={<button className="btn btn-p" onClick={() => setShowWiz(true)}>+ Create First Goal</button>} />
      )}

      {myGoals.map(g => (
        <div key={g.id} className={`gc ${g.status}${g.shared ? ' shared' : ''}`}>
          <div className="fl-b mb2">
            <div style={{ display: 'flex', gap: 7, alignItems: 'center', flex: 1, minWidth: 0 }}>
              <span style={{ fontWeight: 600, fontSize: 13.5, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{g.title}</span>
              <Badge cls={STATUS_BADGE[g.status] || 'b-m'}>{g.status}</Badge>
              {g.shared && <Badge cls="b-p">🔗 Shared</Badge>}
            </div>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexShrink: 0 }}>
              <span className="wt">{g.wt}%</span>
              {g.status === 'draft' && <>
                <button className="btn btn-g btn-xs" onClick={() => setShowAI(g)}>🧠 AI</button>
                <button className="btn btn-d btn-xs" onClick={() => delGoal(g.id)}>✕</button>
              </>}
            </div>
          </div>

          <p style={{ fontSize: 12.5, color: 'var(--ts)', marginBottom: 8, lineHeight: 1.5 }}>{g.desc}</p>

          {/* Return comment */}
          {g.status === 'returned' && g.returnComment && (
            <div className="alert-d mb2">
              <strong>↩ Manager Feedback:</strong> {g.returnComment}
            </div>
          )}

          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: 11.5, color: 'var(--tm)' }}>📌 {g.thrust}</span>
            <span style={{ fontSize: 11.5, color: 'var(--tm)' }}>📏 {UOM.find(u => u.v === g.uom)?.l.split('–')[0].trim()}</span>
            {g.uom !== 'zero' && <span style={{ fontSize: 11.5, color: 'var(--tm)' }}>🎯 {fmtV(g.target, g.uom, g.unit)}</span>}
            {g.status === 'approved' && (
              <div style={{ marginLeft: 'auto', display: 'flex', gap: 5 }}>
                {QS.map(q => {
                  const p = calcPct(g, q)
                  return p !== null ? (
                    <span key={q} style={{ fontSize: 11, padding: '2px 7px', borderRadius: 10, background: p >= 100 ? 'var(--succD)' : 'var(--accD)', color: p >= 100 ? 'var(--succ)' : 'var(--acc)', fontWeight: 600 }}>
                      {q}: {Math.round(p)}%
                    </span>
                  ) : null
                })}
              </div>
            )}
          </div>
        </div>
      ))}

      {showWiz && <GoalWizard user={user} goals={goals} onSave={addGoal} onClose={() => setShowWiz(false)} />}

      {showAI && (
        <Modal onClose={() => setShowAI(null)} cls="m-md">
          <div className="fl-b mb3">
            <h3 style={{ fontFamily: 'var(--fd)', fontWeight: 700 }}>AI Goal Analysis</h3>
            <button className="btn btn-g btn-xs" onClick={() => setShowAI(null)}>✕</button>
          </div>
          <AICoach goal={showAI} />
        </Modal>
      )}
    </div>
  )
}
