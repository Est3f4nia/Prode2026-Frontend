import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './AuthContext'
import LoginPage    from './LoginPage'
import RegisterPage from './RegisterPage'
import HomePage     from './HomePage'
import EquiposAdminPage from "./admin/EquiposAdminPage";
import FechasAdminPage from "./admin/FechasAdminPage";
import PartidosAdminPage from "./admin/PartidosAdminPage";
import AdminHomePage from "./admin/AdminHomePage";
import PronosticosPage from './PronosticosPage';
import LeaderboardPage from './LeaderboardPage';

function ProtectedRoute({ children }) {
  const { user } = useAuth()
  return user ? children : <Navigate to="/login" replace />
}

function PublicRoute({ children }) {
  const { user } = useAuth()
  return !user ? children : <Navigate to="/home" replace />
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login"    element={<PublicRoute><LoginPage /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
      <Route path="/pronosticos" element={<ProtectedRoute><PronosticosPage /></ProtectedRoute>} />
      <Route path="/leaderboard" element={<ProtectedRoute><LeaderboardPage /></ProtectedRoute>} />
      <Route path="/home"     element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
      <Route path="/admin/equipos"  element={<EquiposAdminPage />} />
      <Route path="/admin/fechas"   element={<FechasAdminPage />} />
      <Route path="/admin/partidos" element={<PartidosAdminPage />} />
      <Route path="/admin" element={<AdminHomePage />} />
    </Routes>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  )
}