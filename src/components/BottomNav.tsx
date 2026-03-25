import { NavLink } from 'react-router-dom'

const tabs = [
  { to: '/', label: 'Home', icon: '♞', exact: true },
  { to: '/library', label: 'Library', icon: '📚', exact: false },
  { to: '/sets', label: 'Sets', icon: '🗂', exact: false },
  { to: '/train', label: 'Train', icon: '♟', exact: false },
  { to: '/stats', label: 'Stats', icon: '📊', exact: false },
]

export function BottomNav() {
  return (
    <nav
      data-bottom-nav
      className="flex items-stretch"
      style={{ background: 'var(--chess-sidebar)', borderTop: '1px solid var(--chess-border)', flexShrink: 0 }}
    >
      {tabs.map((t) => (
        <NavLink
          key={t.to}
          to={t.to}
          end={t.exact}
          className="flex-1 flex flex-col items-center gap-0.5 py-2 text-xs no-underline"
          style={({ isActive }) => ({
            color: isActive ? 'var(--chess-accent)' : 'var(--chess-text-muted)',
          })}
        >
          <span style={{ fontSize: 18, lineHeight: 1 }}>{t.icon}</span>
          <span style={{ fontSize: 10 }}>{t.label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
