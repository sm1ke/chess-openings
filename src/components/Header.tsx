import { useState } from 'react'
import { NavLink, Link, useLocation } from 'react-router-dom'
import { useStore } from '../store/useStore'

const menuLinks = [
  { to: '/', label: 'Home' },
  { to: '/library', label: 'Library' },
  { to: '/sets', label: 'Sets' },
  { to: '/train', label: 'Train' },
  { to: '/stats', label: 'Stats' },
  { to: '/settings', label: 'Settings' },
]

export function Header() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  const isBoardRoute = pathname === '/train/board'
  const trainSession = useStore((s) => s.trainSession)
  const openings = useStore((s) => s.openings)

  let boardSubtitle = ''
  if (isBoardRoute && trainSession) {
    if (trainSession.mode === 'single' && trainSession.openingId) {
      const o = openings.find((x) => x.id === trainSession.openingId)
      boardSubtitle = o?.name ?? ''
    } else if (trainSession.mode === 'all') {
      boardSubtitle = 'All Openings'
    } else if (trainSession.mode === 'color' && trainSession.color) {
      boardSubtitle = `All ${trainSession.color === 'white' ? 'White' : 'Black'} Openings`
    } else if (trainSession.mode === 'set' && trainSession.setId) {
      boardSubtitle = 'Set Training'
    } else if (trainSession.mode === 'tag' && trainSession.tag) {
      boardSubtitle = `Tag: ${trainSession.tag}`
    }
  }

  return (
    <>
      <header
        className="flex items-center justify-between px-4 py-3"
        style={{ background: 'var(--chess-sidebar)', borderBottom: '1px solid var(--chess-border)' }}
      >
        <button
          className="text-xl leading-none"
          style={{ background: 'none', border: 'none', color: 'var(--chess-text)', cursor: 'pointer' }}
          aria-label="Menu"
          onClick={() => setOpen((v) => !v)}
        >
          ☰
        </button>
        <div style={{ textAlign: 'center' }}>
          <Link to="/" className="font-semibold no-underline" style={{ color: 'var(--chess-text)', display: 'block', lineHeight: 1.2 }}>Chess Trainer</Link>
          {boardSubtitle && (
            <span style={{ color: 'var(--chess-text-muted)', fontSize: 11, display: 'block', lineHeight: 1.2 }}>{boardSubtitle}</span>
          )}
        </div>
        <div style={{ width: 28 }} /> {/* spacer to center title */}
      </header>

      {open && (
        <>
          <div
            className="fixed inset-0 z-40"
            style={{ background: 'rgba(0,0,0,0.5)' }}
            onClick={() => setOpen(false)}
          />
          <nav
            className="fixed top-0 left-0 h-full z-50 flex flex-col pt-12 px-6 gap-4"
            style={{ width: 220, background: 'var(--chess-panel)', borderRight: '1px solid var(--chess-border)' }}
          >
            {menuLinks.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="text-lg no-underline"
                style={({ isActive }) => ({
                  color: isActive ? 'var(--chess-accent)' : 'var(--chess-text)',
                  fontWeight: isActive ? 600 : 400,
                })}
              >
                {l.label}
              </NavLink>
            ))}
          </nav>
        </>
      )}
    </>
  )
}
