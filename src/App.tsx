import { useEffect } from 'react'
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom'
import { Header } from './components/Header'
import { BottomNav } from './components/BottomNav'
import { HomeScreen } from './screens/HomeScreen'
import { LibraryScreen } from './screens/LibraryScreen'
import { SetsScreen } from './screens/SetsScreen'
import { TrainSetupScreen } from './screens/TrainSetupScreen'
import { TrainBoardScreen } from './screens/TrainBoardScreen'
import { ReviewBoardScreen } from './screens/ReviewBoardScreen'
import { StatsScreen } from './screens/StatsScreen'
import { SettingsScreen } from './screens/SettingsScreen'
import { useStore } from './store/useStore'

function AppShell() {
  const init = useStore((s) => s.init)
  useEffect(() => { init() }, [init])
  const { pathname } = useLocation()
  const isBoardRoute = pathname === '/train/board'
  const hideBottomNav = pathname === '/train/board' || pathname === '/review'

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <Header />
      <main className={isBoardRoute ? undefined : 'scroll-area'}
        style={{ flex: 1, minHeight: 0, overflow: isBoardRoute ? 'hidden' : 'auto' }}>
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/library" element={<LibraryScreen />} />
          <Route path="/sets" element={<SetsScreen />} />
          <Route path="/train" element={<TrainSetupScreen />} />
          <Route path="/train/board" element={<TrainBoardScreen />} />
          <Route path="/review" element={<ReviewBoardScreen />} />
          <Route path="/stats" element={<StatsScreen />} />
          <Route path="/settings" element={<SettingsScreen />} />
        </Routes>
      </main>
      {!hideBottomNav && <BottomNav />}
    </div>
  )
}

function App() {
  return (
    <HashRouter>
      <AppShell />
    </HashRouter>
  )
}

export default App
