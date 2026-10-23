import TaskItem from './TaskItem.jsx'

export default function TaskList({ tasks, totalCount, loading, busyIds, onToggle, onDelete }) {
  if (loading) return <p className="state" role="status">Loading tasks…</p>

  if (tasks.length === 0) {
    return (
      <p className="state">
        {totalCount === 0
          ? 'No tasks yet. Add one to get started.'
          : 'No tasks match the current view, priority, or search.'}
      </p>
    )
  }

  return (
    <ul className="task-list">
      {tasks.map((t) => (
        <TaskItem key={t.id} task={t} busy={busyIds.has(t.id)} onToggle={onToggle} onDelete={onDelete} />
      ))}
    </ul>
  )
}
