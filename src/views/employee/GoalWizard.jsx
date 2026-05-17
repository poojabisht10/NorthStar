import { useState } from 'react'
import { Modal } from '../../components/ui.jsx'
import { AICoach } from '../../components/ai.jsx'
import { THRUST, UOM, QS } from '../../lib/constants.js'
import { uid, sumWt } from '../../lib/utils.js'

const STEPS = ['Define Goal', 'Set Measurement', 'Assign Weight', 'AI Review']

export default function GoalWizard({ user, goals, onSave, onClose }) {
  const [step, setStep] = useState(0)
  const [form, setForm] = useState({ thrust: '', title: '', desc: '', uom: 'min', target: '', unit: '', wt: '' })
  const [errs, setErrs] = useState({})

  const myGoals = goals.filter(g => g.eId === user.id && g.status !== 'returned')
  const usedWt  = sumWt(myGoals)
  const remWt   = 100 - usedWt
  const F = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const validate = s => {
    const e = {}
    if (s === 0) {
      if (!form.thrust) e.thrust = 'Select a thrust area'
      if (!form.title.trim()) e.title = 'Goal title is required'
      if (!form.desc.trim()) e.desc = 'Description is required'
    }
    if (s === 1) {
      if (form.uom !== 'zero' && !form.target) e.target = 'Target value is required'
      if (!form.unit.trim()) e.unit = 'Unit / metric is required'
    }
    if (s === 2) {
      const w = Number(form.wt)
      if (!form.wt) e.wt = 'Weightage is required'
      else if (w < 10) e.wt = 'Minimum weightage is 10%'
      else if (w > remWt) e.wt = `Only ${remWt}% available`
      else if (myGoals.length >= 8) e.wt = 'Maximum 8 goals per employee'
    }
    setErrs(e)
    return !Object.keys(e).length
  }

  const next = () => { if (validate(step)) setStep(s => s + 1) }
  const save = () => {
    if (!validate(2)) return
    const tgt = form.uom === 'zero' ? 0 : form.uom === 'timeline' ? form.target : Number(form.target)
    onSave({
      id: 'g' + uid(), eId: user.id, thrust: form.thrust, title: form.title, desc: form.desc,
      uom: form.uom, target: tgt, unit: form.unit, wt: Number(form.wt),
      status: 'draft',
      ach: { Q1: null, Q2: null, Q3: null, Q4: null },
      st:  { Q1: 'Not Started', Q2: 'Not Started', Q3: 'Not Started', Q4: 'Not Started' },
      shared: false,
    })
    onClose()
  }

  return (
    <Modal onClose={onClose} cls="m-lg">
      {/* Header */}
      <div className="fl-b mb3">
        <h3 style={{ fontFamily: 'var(--fd)', fontWeight: 700, fontSize: 17 }}>✦ Create New Goal</h3>
        <button className="btn btn-g btn-xs" onClick={onClose}>✕</button>
      </div>

      {/* Step indicator */}
      <div className="step-row">
        {STEPS.map((s, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', flex: i < STEPS.length - 1 ? 1 : undefined }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <div className={`step-dot${step === i ? ' act' : step > i ? ' done' : ''}`}>
                {step > i ? '✓' : i + 1}
              </div>
              <span style={{ fontSize: 10, color: 'var(--tm)', whiteSpace: 'nowrap' }}>{s}</span>
            </div>
            {i < STEPS.length - 1 && <div className={`step-line${step > i ? ' done' : ''}`} />}
          </div>
        ))}
      </div>

      {/* Step 0 — Define */}
      {step === 0 && (
        <div className="fu">
          <div className="fg">
            <label className="fl">Thrust Area *</label>
            <select className={`sel${errs.thrust ? ' err' : ''}`} value={form.thrust} onChange={e => F('thrust', e.target.value)}>
              <option value="">Select thrust area…</option>
              {THRUST.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            {errs.thrust && <p className="fe">{errs.thrust}</p>}
          </div>
          <div className="fg">
            <label className="fl">Goal Title *</label>
            <input className={`inp${errs.title ? ' err' : ''}`} placeholder="e.g. Achieve Monthly Sales Target" value={form.title} onChange={e => F('title', e.target.value)} />
            {errs.title && <p className="fe">{errs.title}</p>}
          </div>
          <div className="fg">
            <label className="fl">Goal Description *</label>
            <textarea className={`txta${errs.desc ? ' err' : ''}`} placeholder="Describe what success looks like in specific, measurable terms…" value={form.desc} onChange={e => F('desc', e.target.value)} />
            {errs.desc && <p className="fe">{errs.desc}</p>}
          </div>
        </div>
      )}

      {/* Step 1 — Measurement */}
      {step === 1 && (
        <div className="fu">
          <div className="fg">
            <label className="fl">Unit of Measurement *</label>
            {UOM.map(u => (
              <div key={u.v} className={`uom-opt${form.uom === u.v ? ' sel' : ''}`} onClick={() => F('uom', u.v)}>
                <div className={`uom-radio${form.uom === u.v ? ' sel' : ''}`}>
                  {form.uom === u.v && <div className="uom-dot" />}
                </div>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600 }}>{u.l}</p>
                  <p style={{ fontSize: 11, color: 'var(--tm)' }}>{u.eg}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="gr2">
            {form.uom !== 'zero' && (
              <div className="fg">
                <label className="fl">Target {form.uom === 'timeline' ? 'Date' : 'Value'} *</label>
                <input
                  className={`inp${errs.target ? ' err' : ''}`}
                  type={form.uom === 'timeline' ? 'date' : 'number'}
                  placeholder="Enter target…"
                  value={form.target}
                  onChange={e => F('target', e.target.value)}
                />
                {errs.target && <p className="fe">{errs.target}</p>}
              </div>
            )}
            <div className="fg">
              <label className="fl">Unit / Metric *</label>
              <input className={`inp${errs.unit ? ' err' : ''}`} placeholder="e.g. ₹, %, hours, count" value={form.unit} onChange={e => F('unit', e.target.value)} />
              {errs.unit && <p className="fe">{errs.unit}</p>}
            </div>
          </div>
        </div>
      )}

      {/* Step 2 — Weightage */}
      {step === 2 && (
        <div className="fu">
          <div style={{ background: 'var(--bgs)', border: '1px solid var(--br)', borderRadius: 8, padding: 12, marginBottom: 14 }}>
            <div className="fl-b">
              <span style={{ fontSize: 12.5, color: 'var(--ts)' }}>Remaining Available Weightage</span>
              <span style={{ fontSize: 18, fontWeight: 700, fontFamily: 'var(--fd)', color: remWt > 0 ? 'var(--succ)' : 'var(--dang)' }}>{remWt}%</span>
            </div>
            <div className="we-bar mt1">
              <div className="we-fill" style={{ width: `${usedWt}%`, background: 'var(--acc)' }} />
            </div>
            <p style={{ fontSize: 11, color: 'var(--tm)', marginTop: 4 }}>{myGoals.length}/8 goals · {usedWt}% assigned</p>
          </div>
          <div className="fg">
            <label className="fl">Goal Weightage (%) *</label>
            <input className={`inp${errs.wt ? ' err' : ''}`} type="number" min="10" max={remWt} placeholder={`10–${remWt}%`} value={form.wt} onChange={e => F('wt', e.target.value)} />
            {errs.wt && <p className="fe">{errs.wt}</p>}
            <p className="fh">Min 10% per goal · All goals must total exactly 100%</p>
          </div>
          {Number(form.wt) >= 10 && Number(form.wt) <= remWt && (
            <div className="alert-ok">
              After adding this goal: <strong>{usedWt + Number(form.wt)}% / 100%</strong> total weightage used
            </div>
          )}
        </div>
      )}

      {/* Step 3 — AI Review */}
      {step === 3 && (
        <div className="fu">
          <p style={{ fontSize: 13, color: 'var(--ts)', marginBottom: 14 }}>Your AI Goal Coach has analysed your submission:</p>
          <AICoach goal={{ ...form, target: form.target || 0 }} />
        </div>
      )}

      {/* Footer */}
      <div className="sep" />
      <div className="fl-b">
        <div style={{ display: 'flex', gap: 8 }}>
          {step > 0 && <button className="btn btn-s btn-sm" onClick={() => setStep(s => s - 1)}>← Back</button>}
          <button className="btn btn-g btn-sm" onClick={onClose}>Cancel</button>
        </div>
        {step < 3
          ? <button className="btn btn-p btn-sm" onClick={next}>Continue →</button>
          : <button className="btn btn-ok btn-sm" onClick={save}>✓ Save Goal</button>}
      </div>
    </Modal>
  )
}
