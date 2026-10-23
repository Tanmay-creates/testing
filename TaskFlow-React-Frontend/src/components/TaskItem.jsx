import { Check, Trash2 } from 'lucide-react'

const fmt = (iso) =>
  new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })

export default function TaskItem({ task, busy, onToggle, onDelete }) {
  return (
    <li className={`task ${task.is_done ? 'is-done' : ''}`} aria-busy={busy || undefined}>
      <button
        className="check"
        onClick={() => onToggle(task)}
        disabled={busy}
        aria-pressed={task.is_done}
        aria-label={task.is_done ? `Reopen task: ${task.title}` : `Mark as done: ${task.title}`}
      >
        {task.is_done && <Check size={16} strokeWidth={3} aria-hidden="true" />}
      </button>

      <div className="task-main">
        <span className="task-title">{task.title}</span>
        <span className="task-meta">
          <span className={`pill pill-${task.priority.toLowerCase()}`}>{task.priority}</span>
          <span className="muted">{fmt(task.created_at)}</span>
          {task.is_done && <span className="muted">Done</span>}
        </span>
      </div>

      <button
        className="icon-btn danger"
        onClick={() => onDelete(task)}
        disabled={busy}
        aria-label={`Delete task: ${task.title}`}
      >
        <Trash2 size={18} strokeWidth={2} />
      </button>
    </li>
  )
}
