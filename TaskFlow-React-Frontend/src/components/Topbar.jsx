import { Menu, Search, Moon, Sun } from 'lucide-react'

export default function Topbar({ query, setQuery, theme, toggleTheme, onMenu }) {
  return (
    <header className="topbar">
      <button className="icon-btn menu-btn" onClick={onMenu} aria-label="Open menu">
        <Menu size={18} strokeWidth={2} />
      </button>
      <div className="search">
        <label htmlFor="search" className="sr-only">Search tasks</label>
        <Search size={18} strokeWidth={2} aria-hidden="true" />
        <input
          id="search"
          type="search"
          placeholder="Search tasks…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <button
        className="icon-btn"
        onClick={toggleTheme}
        aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {theme === 'dark' ? <Sun size={18} strokeWidth={2} /> : <Moon size={18} strokeWidth={2} />}
      </button>
      <span className="avatar" aria-hidden="true">TF</span>
    </header>
  )
}
