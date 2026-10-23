import { useState } from 'react'
import { Plus } from 'lucide-react'

export default function TaskForm({ onAdd }) {
  const [title, setTitle] = useState('')
  const [priority, setPriority] = useState('Medium')
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')

  async function submit(e) {
    e.preventDefault()
    if (pending || !title.trim()) return
    setPending(true)
    setError('')
    try {
      await onAdd({ title, priority })
      setTitle('')
    } catch (err) {
      setError(err.message)
    } finally {
      setPending(false)
    }
  }

  return (
    <form className="card task-form" onSubmit={submit} noValidate>
      <div className="form-row">
        <label htmlFor="new-title" className="sr-only">Task title</label>
        <input
          id="new-title"
          className="field grow"
          placeholder="Add a task…"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={error ? 'form-error' : undefined}
        />
        <label htmlFor="new-priority" className="sr-only">Priority</label>
        <select id="new-priority" className="field" value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option>High</option>
          <option>Medium</option>
          <option>Low</option>
        </select>
        <button className="btn primary" type="submit" disabled={pending || !title.trim()}>
          <Plus size={18} strokeWidth={2} aria-hidden="true" />
          {pending ? 'Adding…' : 'Add task'}
        </button>
      </div>
      {error && <p id="form-error" className="error-text" role="alert">{error}</p>}
    </form>
  )
}
