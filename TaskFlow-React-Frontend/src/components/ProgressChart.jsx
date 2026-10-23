const PRIORITIES = ['High', 'Medium', 'Low']
const R = 52
const C = 2 * Math.PI * R

export default function ProgressChart({ tasks }) {
  const total = tasks.length
  const done = tasks.filter((t) => t.is_done).length
  const pct = total ? Math.round((done / total) * 100) : 0

  const rows = PRIORITIES.map((p) => {
    const group = tasks.filter((t) => t.priority === p)
    const d = group.filter((t) => t.is_done).length
    return { p, total: group.length, done: d, pct: group.length ? (d / group.length) * 100 : 0 }
  })

  return (
    <section className="card chart" aria-labelledby="chart-title">
      <h2 id="chart-title" className="section-title">Progress</h2>
      <div className="chart-body">
        <div className="ring" role="img" aria-label={`${pct}% complete: ${done} of ${total} tasks done`}>
          <svg viewBox="0 0 120 120" aria-hidden="true">
            <circle className="ring-track" cx="60" cy="60" r={R} />
            <circle
              className="ring-fill"
              cx="60" cy="60" r={R}
              strokeDasharray={`${(C * pct) / 100} ${C}`}
              transform="rotate(-90 60 60)"
            />
          </svg>
          <div className="ring-label">
            <strong>{pct}%</strong>
            <span>complete</span>
          </div>
        </div>

        <ul className="bars" aria-label="Progress by priority">
          {rows.map((r) => (
            <li key={r.p}>
              <div className="bar-head">
                <span>{r.p}</span>
                <span className="muted">{r.done} of {r.total} done</span>
              </div>
              <div className="bar-track">
                <div className={`bar-fill fill-${r.p.toLowerCase()}`} style={{ width: `${r.pct}%` }} />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
