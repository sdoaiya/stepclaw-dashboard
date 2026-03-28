import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import MainLayout from './components/Layout/MainLayout'
import HomePage from './pages/Home'
import TLCPage from './pages/TLC'
import LOSPage from './pages/LOS'
import MSSPage from './pages/MSS'
import DRSPage from './pages/DRS'
import './App.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <MainLayout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/tlc/*" element={<TLCPage />} />
            <Route path="/los/*" element={<LOSPage />} />
            <Route path="/mss/*" element={<MSSPage />} />
            <Route path="/drs/*" element={<DRSPage />} />
          </Routes>
        </MainLayout>
      </Router>
    </QueryClientProvider>
  )
}

export default App
