import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import {
  Trophy, Clock, CheckCircle2, XCircle, Edit3,
  MapPin, Users, Medal, Star, ChevronRight, Lock, LogOut, TrendingUp
} from 'lucide-react'
import './styles/HomePage.css'
import { useAuth } from '../config/auth/AuthContext'

const mockMatches = [
  {
    id: 1,
    equipoLocal: { nombre: 'Argentina', iso: 'ar' },
    equipoVisitante: { nombre: 'Canadá', iso: 'ca' },
    fechaJornada: 'Grupo A · Jornada 1',
    horaInicio: '2026-06-11T20:00:00',
    estado: 'EN_JUEGO',
    golesLocal: 1,
    golesVisitante: 0,
  },
  {
    id: 2,
    equipoLocal: { nombre: 'Brasil', iso: 'br' },
    equipoVisitante: { nombre: 'México', iso: 'mx' },
    fechaJornada: 'Grupo B · Jornada 1',
    horaInicio: '2026-06-11T23:00:00',
    estado: 'POR_JUGARSE',
    golesLocal: null,
    golesVisitante: null,
  },
  {
    id: 3,
    equipoLocal: { nombre: 'Francia', iso: 'fr' },
    equipoVisitante: { nombre: 'Marruecos', iso: 'ma' },
    fechaJornada: 'Grupo C · Jornada 1',
    horaInicio: '2026-06-12T18:00:00',
    estado: 'POR_JUGARSE',
    golesLocal: null,
    golesVisitante: null,
  },
  {
    id: 4,
    equipoLocal: { nombre: 'España', iso: 'es' },
    equipoVisitante: { nombre: 'Japón', iso: 'jp' },
    fechaJornada: 'Grupo D · Jornada 1',
    horaInicio: '2026-06-12T21:00:00',
    estado: 'POR_JUGARSE',
    golesLocal: null,
    golesVisitante: null,
  },
  {
    id: 5,
    equipoLocal: { nombre: 'Alemania', iso: 'de' },
    equipoVisitante: { nombre: 'Portugal', iso: 'pt' },
    fechaJornada: 'Grupo E · Jornada 1',
    horaInicio: '2026-06-13T18:00:00',
    estado: 'POR_JUGARSE',
    golesLocal: null,
    golesVisitante: null,
  },
]

const legends = [
  {
    nombre: 'Lionel Messi',
    pais: 'Argentina',
    logro: 'Campeón 2022 · Balón de Oro',
    goles: 13,
    imagen: '/img/messi.jpg',
  },
  {
    nombre: 'Diego Maradona',
    pais: 'Argentina',
    logro: 'Campeón 1986 · La Mano de Dios',
    goles: 8,
    imagen: '/img/maradona.jpg',
  },
  {
    nombre: 'Pelé',
    pais: 'Brasil',
    logro: 'Tricampeón · El Rey del Fútbol',
    goles: 12,
    imagen: '/img/pele.jpg',
  },
  {
    nombre: 'Miroslav Klose',
    pais: 'Alemania',
    logro: 'Campeón 2014 · Máximo goleador',
    goles: 16,
    imagen: '/img/klose.jpg',
  },
  {
    nombre: 'Ronaldo R9',
    pais: 'Brasil',
    logro: 'Bicampeón · El Fenómeno',
    goles: 15,
    imagen: '/img/ronaldo-r9.jpg',
  },
  {
    nombre: 'Cristiano Ronaldo',
    pais: 'Portugal',
    logro: 'Capitán histórico · 5 Mundiales',
    goles: 8,
    imagen: '/img/cristiano.jpg',
  },
  {
    nombre: 'Kylian Mbappé',
    pais: 'Francia',
    logro: 'Campeón 2018 · La nueva era',
    goles: 12,
    imagen: '/img/mbappe.jpg',
  },
]

const venues = [
  {
    ciudad: 'New York / New Jersey',
    estadio: 'MetLife Stadium',
    pais: 'EE.UU.',
    capacidad: '82.500',
    nota: 'Sede de la Gran Final',
  },
  {
    ciudad: 'Los Ángeles',
    estadio: 'Rose Bowl',
    pais: 'EE.UU.',
    capacidad: '87.500',
    nota: 'Estadio icónico del Mundial 94',
  },
  {
    ciudad: 'Ciudad de México',
    estadio: 'Estadio Azteca',
    pais: 'México',
    capacidad: '87.000',
    nota: 'El único estadio con 3 Mundiales',
  },
  {
    ciudad: 'Vancouver',
    estadio: 'BC Place',
    pais: 'Canadá',
    capacidad: '54.500',
    nota: 'Primera vez de Canadá como sede',
  },
  {
    ciudad: 'Dallas',
    estadio: 'AT&T Stadium',
    pais: 'EE.UU.',
    capacidad: '80.000',
    nota: 'El estadio de la NFL más grande',
  },
  {
    ciudad: 'Miami',
    estadio: 'Hard Rock Stadium',
    pais: 'EE.UU.',
    capacidad: '65.000',
    nota: 'Sede de semifinales',
  },
]

const prizes = [
  { position: '1° Lugar', icon: <Trophy size={18} />, prize: '$500 USD', details: 'Trofeo personalizado + Entradas a la Final', color: '#FFD700' },
  { position: '2° Lugar', icon: <Medal size={18} />, prize: '$200 USD', details: 'Medalla de plata + Pack oficial FIFA', color: '#C0C0C0' },
  { position: '3° Lugar', icon: <Medal size={18} />, prize: '$100 USD', details: 'Medalla de bronce + Camiseta firmada', color: '#CD7F32' },
  { position: '4° – 10°', icon: <Star size={18} />, prize: 'Premio especial', details: 'Merchandising oficial Mundial 2026', color: '#4ade80' },
]

function formatMatchTime(horaInicio) {
  const date = new Date(horaInicio)
  return date.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })
}

function formatMatchDate(horaInicio) {
  const date = new Date(horaInicio)
  return date.toLocaleDateString('es-AR', { day: '2-digit', month: 'short' })
}

export default function HomePage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [imgErrors, setImgErrors] = useState({})

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const handleImgError = (nombre) => {
    setImgErrors((prev) => ({ ...prev, [nombre]: true }))
  }

  return (
    <div className="hp-root">
      {/* ── NAVBAR ── */}
      <nav className="hp-navbar">
        <div className="hp-navbar-left">
          <img
            src="/img/logo-mundial-2026.svg"
            alt="FIFA Logo"
            className="hp-navbar-logo"
            onError={(e) => { e.target.style.display = 'none' }}
          />
          <span className="hp-navbar-title">PRODE MUNDIAL 2026</span>
        </div>
        <div className="hp-navbar-right">
          <span className="hp-navbar-user">👤 {user?.email}</span>

          <button className="hp-btn-admin hp-icon-btn" onClick={() => navigate('/pronosticos')}>
            <Edit3 size={14} /> MIS PRONÓSTICOS
          </button>
          <button className="hp-btn-admin hp-icon-btn" onClick={() => navigate('/leaderboard')}>
            <TrendingUp size={14} /> LEADERBOARD
          </button>
          {user?.rol === 'ADMIN' && (
            <button className="hp-btn-admin hp-icon-btn" onClick={() => navigate('/admin')}>
              <Lock size={14} /> PANEL ADMIN
            </button>
          )}
          <button className="hp-btn-logout hp-icon-btn" onClick={handleLogout}>
            <LogOut size={14} /> CERRAR SESIÓN
          </button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="hp-hero">
        <div className="hp-hero-glow" />
        <div className="hp-hero-content">
          <img
            src="/img/logo-mundial-2026.png"
            alt="FIFA World Cup 2026"
            className="hp-hero-logo"
          />
          <h1 className="hp-hero-title">PRODE MUNDIAL 2026</h1>
          <p className="hp-hero-subtitle">¿Quién va a levantar la Copa del Mundo?</p>
          <div className="hp-hero-hosts">
            <span className="hp-host-badge">Estados Unidos</span>
            <span className="hp-host-sep">·</span>
            <span className="hp-host-badge">México</span>
            <span className="hp-host-sep">·</span>
            <span className="hp-host-badge">Canadá</span>
          </div>
          <p className="hp-hero-dates">11 de junio — 19 de julio de 2026</p>
          <div className="hp-hero-stats">
            <div className="hp-hero-stat">
              <span className="hp-hero-stat-num">48</span>
              <span className="hp-hero-stat-label">Equipos</span>
            </div>
            <div className="hp-hero-stat-divider" />
            <div className="hp-hero-stat">
              <span className="hp-hero-stat-num">104</span>
              <span className="hp-hero-stat-label">Partidos</span>
            </div>
            <div className="hp-hero-stat-divider" />
            <div className="hp-hero-stat">
              <span className="hp-hero-stat-num">16</span>
              <span className="hp-hero-stat-label">Estadios</span>
            </div>
            <div className="hp-hero-stat-divider" />
            <div className="hp-hero-stat">
              <span className="hp-hero-stat-num">3</span>
              <span className="hp-hero-stat-label">Países sede</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── MAIN 3-COLUMN LAYOUT ── */}
      <div className="hp-main">
        {/* LEFT SIDEBAR — PARTIDOS */}
        <aside className="hp-sidebar-left">
          <h2 className="hp-sidebar-title">PRÓXIMOS PARTIDOS</h2>
          <div className="hp-matches-list">
            {mockMatches.map((match) => (
              <div
                key={match.id}
                className={`hp-match-card${match.estado === 'EN_JUEGO' ? ' hp-match-live' : ''}`}
              >
                {match.estado === 'EN_JUEGO' && (
                  <div className="hp-live-badge">● EN VIVO</div>
                )}
                <div className="hp-match-fecha">{match.fechaJornada}</div>
                <div className="hp-match-row">
                  <div className="hp-match-team">
                    <img src={`https://flagcdn.com/w40/${match.equipoLocal.iso}.png`} alt={match.equipoLocal.nombre} className="hp-flag-img" />
                    <span className="hp-match-name">{match.equipoLocal.nombre}</span>
                  </div>
                  <div className="hp-match-score">
                    {match.estado === 'EN_JUEGO'
                      ? `${match.golesLocal} - ${match.golesVisitante}`
                      : 'vs'}
                  </div>
                  <div className="hp-match-team hp-team-right">
                    <span className="hp-match-name">{match.equipoVisitante.nombre}</span>
                    <img src={`https://flagcdn.com/w40/${match.equipoVisitante.iso}.png`} alt={match.equipoVisitante.nombre} className="hp-flag-img" />
                  </div>
                </div>
                <div className="hp-match-time">
                  <Clock size={10} style={{ display: 'inline', marginRight: '4px' }} />
                  {formatMatchDate(match.horaInicio)} · {formatMatchTime(match.horaInicio)}
                </div>
                {match.estado === 'POR_JUGARSE' && (
                  <button className="hp-btn-pronosticar hp-icon-btn">
                    <Edit3 size={14} /> PRONOSTICAR
                  </button>
                )}
              </div>
            ))}
          </div>
        </aside>

        {/* CENTER — MAIN CONTENT */}
        <main className="hp-center">
          <section className="hp-section">
            <h2 className="hp-section-title">¿QUÉ ES EL PRODE?</h2>
            <p className="hp-section-lead">
              El <strong>Prode del Mundial 2026</strong> es una competencia de predicciones donde tenés que anticipar los resultados de los partidos.
            </p>
            <div className="hp-rules-grid">
              <div className="hp-rule-card">
                <Clock className="hp-rule-icon" size={28} />
                <div className="hp-rule-title">CERRÁ ANTES DE TIEMPO</div>
                <p className="hp-rule-text">Los pronósticos cierran <strong>30 minutos antes del inicio</strong> del partido.</p>
              </div>
              <div className="hp-rule-card">
                <CheckCircle2 className="hp-rule-icon" size={28} color="#4ade80" />
                <div className="hp-rule-title">3 PUNTOS — RESULTADO EXACTO</div>
                <p className="hp-rule-text">Acertá <strong>exactamente</strong> los goles del local y visitante para el pleno.</p>
              </div>
              <div className="hp-rule-card">
                <Star className="hp-rule-icon" size={28} color="#60a5fa" />
                <div className="hp-rule-title">1 PUNTO — TENDENCIA CORRECTA</div>
                <p className="hp-rule-text">Acertaste quién gana o que empata, sumás 1 punto al tablero general.</p>
              </div>
              <div className="hp-rule-card">
                <XCircle className="hp-rule-icon" size={28} color="#f87171" />
                <div className="hp-rule-title">0 PUNTOS — SIN ACIERTO</div>
                <p className="hp-rule-text">No acertaste la tendencia. Sin puntos esta vez.</p>
              </div>
            </div>
          </section>

          <section className="hp-section">
            <h2 className="hp-section-title">LEYENDAS DEL MUNDIAL</h2>
            <div className="hp-legends-grid">
              {legends.map((legend) => (
                <div key={legend.nombre} className="hp-legend-card">
                  <div className="hp-legend-img-wrap">
                    {!imgErrors[legend.nombre] ? (
                      <img src={legend.imagen} alt={legend.nombre} className="hp-legend-img" onError={() => handleImgError(legend.nombre)} />
                    ) : (
                      <div className="hp-legend-fallback"><Trophy size={48} color="#4b5563" /></div>
                    )}
                  </div>
                  <div className="hp-legend-info">
                    <div className="hp-legend-name">{legend.nombre}</div>
                    <div className="hp-legend-country">{legend.pais}</div>
                    <div className="hp-legend-logro">{legend.logro}</div>
                    <div className="hp-legend-goles">⚽ {legend.goles} goles mundialistas</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="hp-section">
            <h2 className="hp-section-title">SEDES DEL MUNDIAL 2026</h2>
            <div className="hp-venues-grid">
              {venues.map((v) => (
                <div key={v.estadio} className="hp-venue-card">
                  <div className="hp-venue-country"><MapPin size={10} style={{ display: 'inline' }} /> {v.pais}</div>
                  <div className="hp-venue-stadium">{v.estadio}</div>
                  <div className="hp-venue-city">{v.ciudad}</div>
                  <div className="hp-venue-cap"><Users size={10} style={{ display: 'inline' }} /> {v.capacidad} espectadores</div>
                  {v.nota && <div className="hp-venue-note"><Star size={10} style={{ display: 'inline' }} /> {v.nota}</div>}
                </div>
              ))}
            </div>
          </section>
        </main>

        {/* RIGHT SIDEBAR — PRIZES + LEADERBOARD */}
        <aside className="hp-sidebar-right">
          <h2 className="hp-sidebar-title">PREMIOS</h2>
          <div className="hp-prizes-list">
            {prizes.map((p) => (
              <div key={p.position} className="hp-prize-card" style={{ borderColor: `${p.color}40` }}>
                <div className="hp-prize-pos hp-icon-btn" style={{ color: p.color }}>
                  {p.icon} {p.position}
                </div>
                <div className="hp-prize-amount" style={{ color: p.color }}>{p.prize}</div>
                <div className="hp-prize-detail">{p.details}</div>
              </div>
            ))}
          </div>

          <div className="hp-ball-card">
            <img
              src="/img/balon-oficial.jpg"
              alt="Balón del Mundial"
              className="hp-ball-img"
            />
            <div className="hp-ball-info">
              <div className="hp-ball-title">BALÓN OFICIAL</div>
              <div style={{ fontSize: '11px', color: '#9ca3af' }}>Diseño conceptual 2026</div>
            </div>
          </div>

          <h2 className="hp-sidebar-title" style={{ marginTop: '28px' }}>RANKING ACTUAL</h2>
          <div className="hp-leaderboard">
            <div className="hp-leaderboard-list">
              {['1° —', '2° —', '3° —', '4°  —', '5°  —'].map((item, i) => (
                <div key={i} className="hp-lb-row">
                  <span className="hp-lb-pos">{item}</span>
                  <span className="hp-lb-pts">-- pts</span>
                </div>
              ))}
            </div>
            <button className="hp-btn-ranking hp-icon-btn" onClick={() => navigate('/leaderboard')}>VER RANKING COMPLETO <ChevronRight size={14} /></button>
          </div>

          <div className="hp-sidebar-facts">
            <h3 className="hp-facts-title">DATOS DEL TORNEO</h3>
            <ul className="hp-facts-list">
              <li>48 selecciones clasificadas</li>
              <li>12 grupos de 4 equipos</li>
              <li>104 partidos en total</li>
              <li>16 estadios en 3 países</li>
            </ul>
          </div>

        </aside>
      </div>

      <footer className="hp-footer">
        <div className="hp-footer-inner">
          <span>Prode Mundial 2026 · UTN FRVM · Programación 4</span>
          <span>Hecho en Argentina con React & Java Spring Boot</span>
        </div>
      </footer>
    </div>
  )
}