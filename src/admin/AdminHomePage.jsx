import { useNavigate } from "react-router-dom";
import { useAuth } from "../config/auth/AuthContext";
import "./styles/AdminHomePage.css";

const CARDS = [
  {
    icon: "🏆",
    titulo: "Equipos",
    descripcion: "Registrá y eliminá los equipos participantes del torneo.",
    ruta: "/admin/equipos",
    accion: "Gestionar Equipos",
  },
  {
    icon: "📅",
    titulo: "Fechas",
    descripcion: "Creá las fechas o jornadas del campeonato.",
    ruta: "/admin/fechas",
    accion: "Gestionar Fechas",
  },
  {
    icon: "⚔️",
    titulo: "Partidos",
    descripcion: "Armá el calendario asignando partidos a cada fecha.",
    ruta: "/admin/partidos",
    accion: "Gestionar Partidos",
  },
];

export default function AdminHomePage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="admin-home">
      {/* Header */}
      <div className="admin-home-header">
        <div className="admin-home-header-left">
          <img src="/logo2026.png" alt="Logo" className="admin-home-logo" />
          <div>
            <h1 className="admin-home-title">Panel de Administración</h1>
            <p className="admin-home-subtitle">
              Bienvenido, <span className="admin-home-email">{user?.email || "Administrador"}</span>
            </p>
          </div>
        </div>
        <div className="admin-home-header-right">
          <button className="btn-ir-home" onClick={() => navigate("/home")}>
            🏠 Ir al Prode
          </button>
          <button className="btn-logout" onClick={handleLogout}>
            Cerrar sesión
          </button>
        </div>
      </div>

      {/* Badge admin */}
      <div className="admin-badge">
        🔐 Modo Administrador activo
      </div>

      {/* Cards */}
      <div className="admin-home-grid">
        {CARDS.map((card) => (
          <div
            key={card.ruta}
            className="admin-home-card"
            onClick={() => navigate(card.ruta)}
          >
            <div className="card-icon">{card.icon}</div>
            <h2 className="card-titulo">{card.titulo}</h2>
            <p className="card-descripcion">{card.descripcion}</p>
            <button className="card-btn">{card.accion} →</button>
          </div>
        ))}
      </div>
    </div>
  );
}