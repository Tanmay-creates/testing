// All API access lives here. With no VITE_API_URL the app runs in demo mode
// using an in-memory list (it is not saved anywhere and resets on refresh).
const BASE = import.meta.env.VITE_API_URL
export const isDemo = !BASE

const wait = (v) => new Promise((r) => setTimeout(() => r(v), 150))
const now = Date.now()
let demo = [
  { id: 'd1', title: 'Prepare the demo', is_done: false, priority: 'High', created_at: new Date(now - 3e5).toISOString() },
  { id: 'd2', title: 'Write the README', is_done: false, priority: 'Medium', created_at: new Date(now - 2e6).toISOString() },
  { id: 'd3', title: 'Set up the database table', is_done: true, priority: 'High', created_at: new Date(now - 9e6).toISOString() },
  { id: 'd4', title: 'Pick a colour palette', is_done: true, priority: 'Low', created_at: new Date(now - 2e7).toISOString() },
]

async function request(path, options = {}) {
  let res
  try {
    res = await fetch(BASE + path, { headers: { 'Content-Type': 'application/json' }, ...options })
  } catch {
    throw new Error('Can’t reach the server. Check that the backend is running.')
  }
  if (!res.ok) {
    let detail = null
    try {
      const body = await res.json()
      if (typeof body.detail === 'string') detail = body.detail
      else if (Array.isArray(body.detail)) detail = 'Please check the task title and try again.'
    } catch { /* no JSON body */ }
    throw new Error(detail || `Something went wrong (${res.status}).`)
  }
  return res.status === 204 ? null : res.json()
}

export const listTasks = () => (isDemo ? wait(demo.map((t) => ({ ...t }))) : request('/tasks'))

export async function createTask({ title, priority }) {
  const clean = title.trim()
  if (!clean) throw new Error('Enter a task title.')
  if (isDemo) {
    const task = { id: crypto.randomUUID(), title: clean, is_done: false, priority, created_at: new Date().toISOString() }
    demo = [task, ...demo]
    return wait({ ...task })
  }
  return request('/tasks', { method: 'POST', body: JSON.stringify({ title: clean, priority }) })
}

export async function updateTask(id, changes) {
  if (isDemo) {
    demo = demo.map((t) => (t.id === id ? { ...t, ...changes } : t))
    return wait({ ...demo.find((t) => t.id === id) })
  }
  return request(`/tasks/${id}`, { method: 'PATCH', body: JSON.stringify(changes) })
}

export async function deleteTask(id) {
  if (isDemo) {
    demo = demo.filter((t) => t.id !== id)
    return wait(null)
  }
  return request(`/tasks/${id}`, { method: 'DELETE' })
}
