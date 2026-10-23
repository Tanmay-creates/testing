import { LayoutList, Circle, CheckCircle2, Flag, CheckSquare } from 'lucide-react'

const VIEWS = [
  { id: 'all', label: 'All tasks', icon: LayoutList },
  { id: 'open', label: 'Open', icon: Circle },
  { id: 'done', label: 'Done', icon: CheckCircle2 },
]
const PRIORITIES = ['High', 'Medium', 'Low']

export default function Sidebar({ tasks, view, setView, priority, setPriority, open, onClose }) {
  const count = (fn) => tasks.filter(fn).length
  const viewCount = { all: tasks.length, open: count((t) => !t.is_done), done: count((t) => t.is_done) }

  const pick = (fn) => () => { fn(); onClose() }

  return (
    <>
      <div className={`scrim ${open ? 'show' : ''}`} onClick={onClose} aria-hidden="true" />
      <aside className={`sidebar ${open ? 'open' : ''}`} aria-label="Task navigation">
        <div className="brand">
          <span className="brand-mark"><CheckSquare size={20} strokeWidth={2} /></span>
          <span className="brand-name">TaskFlow</span>
        </div>

        <nav>
          <h2 className="nav-title">Views</h2>
          <ul>
            {VIEWS.map(({ id, label, icon: Icon }) => (
              <li key={id}>
                <button
                  className={`nav-item ${view === id ? 'active' : ''}`}
                  aria-current={view === id ? 'true' : undefined}
                  onClick={pick(() => setView(id))}
                >
                  <Icon size={18} strokeWidth={2} aria-hidden="true" />
                  <span>{label}</span>
                  <span className="count">{viewCount[id]}</span>
                </button>
              </li>
            ))}
          </ul>

          <h2 className="nav-title">Priority</h2>
          <ul>
            {PRIORITIES.map((p) => (
              <li key={p}>
                <button
                  className={`nav-item ${priority === p ? 'active' : ''}`}
                  aria-current={priority === p ? 'true' : undefined}
                  onClick={pick(() => setPriority(priority === p ? null : p))}
                >
                  <Flag size={18} strokeWidth={2} aria-hidden="true" className={`flag-${p.toLowerCase()}`} />
                  <span>{p}</span>
                  <span className="count">{count((t) => t.priority === p)}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  )
}
