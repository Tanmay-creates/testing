export default function StatsRow({ tasks }) {
  const done = tasks.filter((t) => t.is_done).length
  const items = [
    { label: 'Total', value: tasks.length, cls: '' },
    { label: 'Open', value: tasks.length - done, cls: 'is-primary' },
    { label: 'Done', value: done, cls: 'is-success' },
  ]
  return (
    <ul className="stats" aria-label="Task totals">
      {items.map((s) => (
        <li key={s.label} className="card stat">
          <span className={`stat-num ${s.cls}`}>{s.value}</span>
          <span className="stat-label">{s.label}</span>
        </li>
      ))}
    </ul>
  )
}
