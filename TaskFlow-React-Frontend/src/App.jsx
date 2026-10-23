import { useCallback, useEffect, useMemo, useState } from 'react'
import Sidebar from './components/Sidebar.jsx'
import Topbar from './components/Topbar.jsx'
import StatsRow from './components/StatsRow.jsx'
import ProgressChart from './components/ProgressChart.jsx'
import TaskForm from './components/TaskForm.jsx'
import TaskList from './components/TaskList.jsx'
import { listTasks, createTask, updateTask, deleteTask, isDemo } from './services/tasksApi.js'

const HEADINGS = { all: 'All tasks', open: 'Open tasks', done: 'Done tasks' }
const normalize = (t) => ({ ...t, priority: t.priority || 'Medium' })

export default function App() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [busyIds, setBusyIds] = useState(new Set())
  const [view, setView] = useState('all')
  const [priority, setPriority] = useState(null)
  const [query, setQuery] = useState('')
  const [drawer, setDrawer] = useState(false)
  const [theme, setTheme] = useState(() =>
    window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  )

  useEffect(() => { document.documentElement.dataset.theme = theme }, [theme])

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && setDrawer(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const data = await listTasks()
      setTasks(data.map(normalize))
    } catch (e) {
      setError(e.message || 'Couldn’t load tasks. Try again.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const setBusy = (id, on) =>
    setBusyIds((prev) => {
      const next = new Set(prev)
      on ? next.add(id) : next.delete(id)
      return next
    })

  async function handleAdd(input) {
    const created = normalize(await createTask(input))
    setTasks((prev) => [created, ...prev])
    setNotice('Task added.')
  }

  async function handleToggle(task) {
    setBusy(task.id, true)
    setError('')
    try {
      const updated = normalize(await updateTask(task.id, { is_done: !task.is_done }))
      setTasks((prev) => prev.map((t) => (t.id === task.id ? updated : t)))
      setNotice(updated.is_done ? 'Task marked as done.' : 'Task reopened.')
    } catch (e) {
      setError(e.message)
    } finally {
      setBusy(task.id, false)
    }
  }

  async function handleDelete(task) {
    if (!window.confirm(`Delete “${task.title}”? This can’t be undone.`)) return
    setBusy(task.id, true)
    setError('')
    try {
      await deleteTask(task.id)
      setTasks((prev) => prev.filter((t) => t.id !== task.id))
      setNotice('Task deleted.')
    } catch (e) {
      setError(e.message)
    } finally {
      setBusy(task.id, false)
    }
  }

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    return tasks
      .filter((t) => (view === 'open' ? !t.is_done : view === 'done' ? t.is_done : true))
      .filter((t) => (priority ? t.priority === priority : true))
      .filter((t) => (q ? t.title.toLowerCase().includes(q) : true))
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
  }, [tasks, view, priority, query])

  const heading = priority ? `${priority} priority` : HEADINGS[view]

  return (
    <div className="shell">
      <Sidebar
        tasks={tasks} view={view} setView={setView}
        priority={priority} setPriority={setPriority}
        open={drawer} onClose={() => setDrawer(false)}
      />
      <div className="content">
        <Topbar
          query={query} setQuery={setQuery}
          theme={theme} toggleTheme={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          onMenu={() => setDrawer(true)}
        />
        <main className="page">
          {isDemo && (
            <p className="banner" role="note">
              Demo mode: sample tasks are kept in memory and reset on refresh. Set VITE_API_URL to use the backend.
            </p>
          )}
          <h1>{heading}</h1>

          <StatsRow tasks={tasks} />
          <ProgressChart tasks={tasks} />
          <TaskForm onAdd={handleAdd} />

          {error && (
            <div className="error-banner" role="alert">
              <span>{error}</span>
              <button className="btn" onClick={load}>Try again</button>
            </div>
          )}

          <TaskList
            tasks={visible} totalCount={tasks.length} loading={loading}
            busyIds={busyIds} onToggle={handleToggle} onDelete={handleDelete}
          />
          <p className="sr-only" role="status" aria-live="polite">{notice}</p>
        </main>
      </div>
    </div>
  )
}
