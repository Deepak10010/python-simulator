import { NavLink } from 'react-router-dom'

export function NavBar() {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `rounded-xl px-3 py-1.5 font-bold transition ${
      isActive ? 'bg-brand-500 text-white' : 'text-slate-600 hover:bg-slate-100'
    }`

  return (
    <header className="sticky top-0 z-20 border-b-2 border-slate-100 bg-white/80 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center gap-2 px-4 py-3">
        <NavLink to="/" className="mr-auto flex items-center gap-2 text-xl font-extrabold">
          <span className="text-2xl">🐍</span>
          <span>
            Py<span className="text-brand-500">Sim</span>
          </span>
        </NavLink>
        <NavLink to="/learn" className={linkClass}>
          📚 Learn
        </NavLink>
        <NavLink to="/sandbox" className={linkClass}>
          🧪 Sandbox
        </NavLink>
      </nav>
    </header>
  )
}
