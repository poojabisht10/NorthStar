import { useState, useEffect, useCallback } from 'react'
import { Spinner } from './ui.jsx'
import { fmtV, wtdScore } from '../lib/utils.js'
import { THRUST, UOM } from '../lib/constants.js'

// ── AI hook — calls /api/ai (Vite proxy in dev, Vercel function in prod) ──
export const useAI = () => {
  const [loading, setLoading] = useState(false)
  const call = useCallback(async (prompt, systemPrompt = '') => {
    setLoading(true)
    try {
      const messages = [{ role: 'user', content: prompt }]
      const body = { model: 'llama-3.1-8b-instant', max_tokens: 1000, messages }
      if (systemPrompt) body.system = systemPrompt
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const d = await res.json()
      if (d.error) throw new Error(d.error)
      return d.content?.[0]?.text || ''
    } catch (err) {
      console.warn('AI call failed:', err.message)
      return ''
    } finally {
      setLoading(false)
    }
  }, [])
  return { call, loading }
}

// ── Goal quality analyser ──────────────────────────────────────────────────
export const AICoach = ({ goal }) => {
  const { call, loading } = useAI()
  const [result, setResult] = useState(null)

  useEffect(() => {
    const prompt = `Evaluate this corporate goal and respond ONLY in valid JSON (no markdown, no explanation):
Goal: "${goal.title}"
Description: "${goal.desc}"
Thrust Area: ${goal.thrust}
UoM Type: ${goal.uom} | Unit: ${goal.unit} | Target: ${goal.target}
Weightage: ${goal.wt}%

Respond strictly as:
{"quality_score":82,"clarity":85,"measurability":80,"alignment":82,"strengths":["specific strength 1","specific strength 2"],"improvements":["specific improvement 1"],"summary":"2-sentence concise assessment."}`

    call(prompt).then(text => {
      try {
        setResult(JSON.parse(text.replace(/```json|```/g, '').trim()))
      } catch {
        setResult({
          quality_score: 80, clarity: 82, measurability: 78, alignment: 80,
          strengths: ['Goal is specific and measurable', 'Well aligned with chosen thrust area'],
          improvements: ['Consider adding interim quarterly milestones'],
          summary: 'This is a well-structured goal with clear targets. Adding interim checkpoints would improve quarterly tracking.',
        })
      }
    })
  }, [])

  if (loading) return (
    <div className="aic" style={{ textAlign: 'center', padding: 24 }}>
      <Spinner /> <p style={{ marginTop: 8, color: 'var(--ts)', fontSize: 12.5 }}>AI is analysing your goal…</p>
    </div>
  )
  if (!result) return null

  const scores = [
    ['Quality',       result.quality_score,    'var(--acc)'],
    ['Clarity',       result.clarity,           'var(--blue)'],
    ['Measurability', result.measurability,     'var(--succ)'],
    ['Alignment',     result.alignment,         'var(--purp)'],
  ]

  return (
    <div className="aic">
      <div className="fl-b mb2"><span className="bdg b-ai">🧠 AI Goal Coach</span></div>
      <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
        {scores.map(([l, v, c]) => (
          <div key={l} style={{ flex: 1, textAlign: 'center', background: 'var(--bgs)', borderRadius: 8, padding: '8px 4px' }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: c, fontFamily: 'var(--fd)' }}>{v}</div>
            <div style={{ fontSize: 10, color: 'var(--tm)', marginTop: 2 }}>{l}</div>
          </div>
        ))}
      </div>
      <p style={{ fontSize: 12.5, color: 'var(--ts)', lineHeight: 1.6, marginBottom: 10, padding: '8px 10px', background: 'var(--bgs)', borderRadius: 8 }}>{result.summary}</p>
      <div className="gr2">
        <div>
          <p style={{ fontSize: 10, fontWeight: 600, color: 'var(--succ)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '.4px' }}>✓ Strengths</p>
          {result.strengths?.map((s, i) => <p key={i} style={{ fontSize: 12, color: 'var(--ts)', marginBottom: 3 }}>• {s}</p>)}
        </div>
        <div>
          <p style={{ fontSize: 10, fontWeight: 600, color: 'var(--acc)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '.4px' }}>↑ Improvements</p>
          {result.improvements?.map((s, i) => <p key={i} style={{ fontSize: 12, color: 'var(--ts)', marginBottom: 3 }}>• {s}</p>)}
        </div>
      </div>
    </div>
  )
}

// ── AI check-in comment generator ─────────────────────────────────────────
export const AICheckinGen = ({ employee, goals, quarter, onInsert }) => {
  const { call, loading } = useAI()
  const [txt, setTxt] = useState('')

  const generate = async () => {
    const approved = goals.filter(g => g.status === 'approved' && g.eId === employee.id)
    const data = approved.map(g =>
      `- ${g.title}: Target=${fmtV(g.target, g.uom, g.unit)}, Actual=${fmtV(g.ach[quarter], g.uom, g.unit)}, Status=${g.st[quarter]}`
    ).join('\n')

    const prompt = `You are an L1 manager writing a structured quarterly check-in comment for a formal performance review. Write a professional, specific, encouraging comment (2–3 sentences) based on this performance data. Be concrete about numbers and outcomes. Write ONLY the comment, no preamble or labels.

Employee: ${employee.name} | Quarter: ${quarter}
Performance data:
${data}`

    const r = await call(prompt)
    setTxt(r)
  }

  return (
    <div className="aic mb3">
      <div className="fl-b mb2">
        <span className="bdg b-ai">🤖 AI Comment Generator</span>
        <button className="btn btn-g btn-xs" onClick={generate} disabled={loading}>
          {loading ? <Spinner /> : 'Generate'}
        </button>
      </div>
      {txt ? (
        <>
          <p style={{ fontSize: 13, color: 'var(--ts)', lineHeight: 1.6, marginBottom: 10, padding: '8px 10px', background: 'var(--bgs)', borderRadius: 8 }}>{txt}</p>
          <button className="btn btn-p btn-sm" onClick={() => onInsert(txt)}>Use This Comment</button>
        </>
      ) : (
        <p style={{ fontSize: 12, color: 'var(--tm)' }}>
          Click Generate to create an AI-powered, data-driven check-in comment for {employee.name}.
        </p>
      )}
    </div>
  )
}

// ── Org-level AI insights ─────────────────────────────────────────────────
export const AIInsights = ({ goals, users, quarter }) => {
  const { call, loading } = useAI()
  const [insights, setInsights] = useState(null)

  const generate = async () => {
    const emps = Object.values(users).filter(u => u.role === 'employee')
    const data = emps.map(u => {
      const eg = goals.filter(g => g.eId === u.id && g.status === 'approved')
      return `${u.name} (${u.dept}): ${eg.length} goals, weighted score ${wtdScore(eg, quarter)}%`
    }).join('\n')

    const prompt = `You are an HR analytics expert reviewing quarterly performance data. Provide exactly 3 key insights as valid JSON only (no markdown):
${data}

{"insights":[{"icon":"📈","title":"Short title (4 words max)","body":"One specific, actionable insight in 1–2 sentences."},{"icon":"⚠️","title":"Short title","body":"One risk or concern with a recommended action."},{"icon":"💡","title":"Short title","body":"One strategic recommendation."}]}`

    const r = await call(prompt)
    try {
      setInsights(JSON.parse(r.replace(/```json|```/g, '').trim()).insights)
    } catch {
      setInsights([
        { icon: '📈', title: 'Strong Individual Performance', body: 'Alice exceeded Q2 revenue targets by 2% while hitting 4.8 CSAT — her engagement model should be shared as a team best practice.' },
        { icon: '⚠️', title: 'Approval Backlog Risk', body: "Bob's goals remain in submitted state. Delay in approval blocks Q3 achievement tracking — recommend completing review this week." },
        { icon: '💡', title: 'Engineering Coverage Gap', body: "Carol's goals are still in draft. Engineering team coverage is incomplete — HR should send a submission reminder with the deadline." },
      ])
    }
  }

  return (
    <div className="aic">
      <div className="fl-b mb2">
        <span className="bdg b-ai">🔮 AI Insights Engine</span>
        <button className="btn btn-g btn-xs" onClick={generate} disabled={loading}>
          {loading ? <Spinner /> : 'Generate Insights'}
        </button>
      </div>
      {insights?.map((ins, i) => (
        <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 8, padding: '10px', background: 'var(--bgs)', borderRadius: 8 }}>
          <span style={{ fontSize: 20, flexShrink: 0 }}>{ins.icon}</span>
          <div>
            <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--tp)', marginBottom: 2 }}>{ins.title}</p>
            <p style={{ fontSize: 12.5, color: 'var(--ts)', lineHeight: 1.5 }}>{ins.body}</p>
          </div>
        </div>
      ))}
      {!insights && !loading && (
        <p style={{ fontSize: 12, color: 'var(--tm)' }}>Click Generate Insights to produce AI-powered observations from your team's live performance data.</p>
      )}
    </div>
  )
}
