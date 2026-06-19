import { useEffect } from 'react'
import { HashRouter, Route, Routes } from 'react-router-dom'
import { NavBar } from './components/NavBar'
import { Home } from './pages/Home'
import { LearnPage } from './pages/LearnPage'
import { LessonPage } from './pages/LessonPage'
import { Sandbox } from './sandbox/Sandbox'
import { pyodideClient } from './pyodide/pyodideClient'

export default function App() {
  // Begin booting Pyodide as soon as the app loads (first visit is slowest).
  useEffect(() => {
    pyodideClient.preload()
  }, [])

  return (
    <HashRouter>
      <NavBar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/learn" element={<LearnPage />} />
          <Route path="/lesson/:id" element={<LessonPage />} />
          <Route path="/sandbox" element={<Sandbox />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
      <footer className="mx-auto max-w-6xl px-4 py-10 text-center text-sm text-slate-400">
        PySim — real Python in your browser via Pyodide. Built for learning.
      </footer>
    </HashRouter>
  )
}
