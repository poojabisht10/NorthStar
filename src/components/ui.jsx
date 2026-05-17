import { avColor, pctCol } from '../lib/utils.js'

export const Av = ({ name, av, size = 32 }) => (
  <div className="av" style={{ width: size, height: size, background: avColor(name || 'X'), color: '#06101e', fontSize: size * 0.35 }}>
    {av || (name || '?').slice(0, 2).toUpperCase()}
  </div>
)

export const Badge = ({ cls, children }) => (
  <span className={`bdg ${cls || 'b-m'}`}>{children}</span>
)

export const Prog = ({ pct, height = 5 }) => (
  <div className="pb" style={{ height }}>
    <div className="pf" style={{ width: `${Math.min(pct || 0, 100)}%`, background: pctCol(pct || 0) }} />
  </div>
)

export const Spinner = ({ lg }) => (
  <div className={`spin${lg ? ' spin-lg' : ''}`} />
)

export const Modal = ({ onClose, cls, children }) => (
  <div className="modal-bg" onClick={e => { if (e.target.className === 'modal-bg') onClose() }}>
    <div className={`modal ${cls || 'm-md'}`}>{children}</div>
  </div>
)

export const ProgressRing = ({ pct, size = 80, stroke = 7, children }) => {
  const r = size / 2 - stroke
  const circ = 2 * Math.PI * r
  const off = circ - (Math.min(pct || 0, 100) / 100) * circ
  return (
    <div style={{ position: 'relative', width: size, height: size, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width={size} height={size} style={{ position: 'absolute', top: 0, left: 0, transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--br)" strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={pctCol(pct || 0)} strokeWidth={stroke}
          strokeDasharray={circ} strokeDashoffset={off} strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset .6s ease' }} />
      </svg>
      <div style={{ textAlign: 'center', zIndex: 1 }}>{children}</div>
    </div>
  )
}

export const StatCard = ({ val, lbl, sub, subCol, icon, accent }) => (
  <div className="sc" style={accent ? { borderColor: accent, borderLeftWidth: 3 } : {}}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div>
        <div className="sv">{val}</div>
        <div className="sl">{lbl}</div>
        {sub && <div className="ss" style={{ color: subCol || 'var(--ts)' }}>{sub}</div>}
      </div>
      {icon && <div style={{ fontSize: 26, opacity: .35 }}>{icon}</div>}
    </div>
  </div>
)

export const AlertBanner = ({ type = 'w', children }) => (
  <div className={`alert-${type} mb3`}>{children}</div>
)

export const EmptyState = ({ icon, title, sub, action }) => (
  <div className="empty">
    <div className="empty-i">{icon}</div>
    <p className="empty-t">{title}</p>
    {sub && <p className="empty-s">{sub}</p>}
    {action && <div className="mt3">{action}</div>}
  </div>
)
