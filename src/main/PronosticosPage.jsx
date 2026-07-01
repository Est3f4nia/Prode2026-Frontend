import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Edit3, Save, X, Lock, CheckCircle, Home, ChevronDown, ChevronUp } from 'lucide-react';
import { useAuth } from '../config/auth/AuthContext';
import { getHistorialEquipo } from '../config/api';
import './styles/PronosticosPage.css';


export default function PronosticosPage() {
    const { user, token } = useAuth();
    const navigate = useNavigate();
    const [partidos, setPartidos] = useState([]);
    const [pronosticos, setPronosticos] = useState({});
    const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });

    const api = axios.create({ baseURL: 'http://localhost:8080/api' });

    api.interceptors.request.use((config) => {
        if (token) config.headers.Authorization = `Bearer ${token}`;
        return config;
    });

    const cargarDatos = useCallback(async () => {
        try {
            const [pRes, proRes] = await Promise.all([
                api.get('/partidos'),
                api.get('/pronosticos')
            ]);
            setPartidos(pRes.data);
            const map = {};
            proRes.data.forEach(p => map[p.partidoId] = p);
            setPronosticos(map);
        } catch (error) {
            const msg = error?.response?.data?.message || "Error al cargar pronósticos";
            setMensaje({ texto: msg, tipo: "error" });
        }
    }, [api]);

    useEffect(() => {
        if (token && user && user.id) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            cargarDatos();
        }
    }, [token, user, cargarDatos]);

    const handleSave = async (partidoId, golesLocal, golesVisitante, pronosticoExistente) => {
        try {
            const payload = {
                partidoId,
                golesLocalPredicho: parseInt(golesLocal),
                golesVisitantePredicho: parseInt(golesVisitante)
            };

            if (pronosticoExistente) {
                await api.patch('/pronosticos', payload);
            } else {
                await api.post('/pronosticos', payload);
            }

            setMensaje({ texto: "Pronóstico guardado", tipo: "success" });
            setTimeout(() => setMensaje({ texto: '', tipo: '' }), 3000);
            cargarDatos();
        } catch {
            setMensaje({ texto: "Error al guardar", tipo: "error" });
        }
    };

    const filtrarPartidos = () => {
        const ahora = new Date();

        const finalizados = partidos.filter(p => {
            const inicio = new Date(p.fechaHoraInicio);
            return inicio < ahora && p.golesLocal !== null;
        });

        const conPronostico = partidos.filter(p => {
            const inicio = new Date(p.fechaHoraInicio);
            return inicio > ahora && pronosticos[p.id];
        });

        const sinPronostico = partidos.filter(p => {
            const inicio = new Date(p.fechaHoraInicio);
            return inicio > ahora && !pronosticos[p.id];
        });

        return { finalizados, conPronostico, sinPronostico };
    };

    const { finalizados, conPronostico, sinPronostico } = filtrarPartidos();

    return (
        <div className="pr-root">
            <div className="pr-main">
                <div className="pr-header">
                    <div className="pr-header-top">
                        <button
                            className="pr-btn-home"
                            onClick={() => navigate('/home')}
                        >
                            <Home size={18} /> VOLVER AL HOME
                        </button>
                        <div className="pr-titulo-centro">
                            <h1 className="pr-title">MIS PRONÓSTICOS</h1>
                            <p className="pr-subtitle">Copa del Mundo <strong>2026</strong></p>
                        </div>
                        <div style={{ width: '120px' }}></div>
                    </div>
                </div>

                {mensaje.texto && (
                    <div className={`pr-alert ${mensaje.tipo}`}>
                        {mensaje.tipo === 'success' ? <CheckCircle size={18} /> : <Lock size={18} />}
                        {mensaje.texto}
                    </div>
                )}

                {partidos.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px 20px', color: '#999' }}>
                        <p style={{ fontSize: '18px' }}>No hay partidos cargados</p>
                    </div>
                ) : (
                    <>
                        {finalizados.length > 0 && (
                            <div className="pr-section">
                                <h2 className="pr-section-title">PARTIDOS FINALIZADOS</h2>
                                <div className="pr-grid">
                                    {finalizados.map(partido => (
                                        <PartidoCardFinalizado
                                            key={partido.id}
                                            partido={partido}
                                            pronostico={pronosticos[partido.id]}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {conPronostico.length > 0 && (
                            <div className="pr-section">
                                <h2 className="pr-section-title">PRONÓSTICOS REALIZADOS</h2>
                                <div className="pr-grid">
                                    {conPronostico.map(partido => (
                                        <PartidoCard
                                            key={partido.id}
                                            partido={partido}
                                            pronostico={pronosticos[partido.id]}
                                            onSave={handleSave}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {sinPronostico.length > 0 && (
                            <div className="pr-section">
                                <h2 className="pr-section-title">DISPONIBLES PARA PRONOSTICAR</h2>
                                <div className="pr-grid">
                                    {sinPronostico.map(partido => (
                                        <PartidoCard
                                            key={partido.id}
                                            partido={partido}
                                            pronostico={pronosticos[partido.id]}
                                            onSave={handleSave}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {finalizados.length === 0 && conPronostico.length === 0 && sinPronostico.length === 0 && (
                            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#999' }}>
                                <p style={{ fontSize: '18px' }}>No hay partidos disponibles</p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

function PartidoCard({ partido, pronostico, onSave }) {
    const [local, setLocal] = useState(pronostico?.golesLocalPredicho || 0);
    const [visita, setVisita] = useState(pronostico?.golesVisitantePredicho || 0);
    const [editando, setEditando] = useState(false);

    // Historial state
    const [historialAbierto, setHistorialAbierto] = useState(null); // null | 'local' | 'visitante'
    const [historialLocal, setHistorialLocal] = useState(null);
    const [historialVisitante, setHistorialVisitante] = useState(null);
    const [cargandoHistorial, setCargandoHistorial] = useState(false);

    const inicio = new Date(partido.fechaHoraInicio);
    const ahora = new Date();
    const tiempoRestante = inicio - ahora;
    const bloqueado = tiempoRestante < (30 * 60 * 1000);
    const proximoAIniciar = tiempoRestante < (2 * 60 * 60 * 1000);

    const handleGuardar = () => {
        onSave(partido.id, local, visita, pronostico);
        setEditando(false);
    };

    const handleEditar = () => {
        setLocal(pronostico?.golesLocalPredicho || 0);
        setVisita(pronostico?.golesVisitantePredicho || 0);
        setEditando(true);
    };

    const handleCancelar = () => {
        setLocal(pronostico?.golesLocalPredicho || 0);
        setVisita(pronostico?.golesVisitantePredicho || 0);
        setEditando(false);
    };

    const toggleHistorial = async (equipo) => {
        if (historialAbierto === equipo) {
            setHistorialAbierto(null);
            return;
        }
        setHistorialAbierto(equipo);
        const esLocal = equipo === 'local';
        const yaLoaded = esLocal ? historialLocal !== null : historialVisitante !== null;
        if (yaLoaded) return;

        const equipoId = esLocal ? partido.equipoLocalId : partido.equipoVisitanteId;
        setCargandoHistorial(true);
        try {
            const res = await getHistorialEquipo(equipoId);
            const data = res.data?.data ?? [];
            if (esLocal) setHistorialLocal(data);
            else setHistorialVisitante(data);
        } catch {
            if (esLocal) setHistorialLocal([]);
            else setHistorialVisitante([]);
        } finally {
            setCargandoHistorial(false);
        }
    };

    const historialActual = historialAbierto === 'local' ? historialLocal : historialVisitante;
    const nombreEquipoActual = historialAbierto === 'local'
        ? partido.equipoLocalNombre
        : partido.equipoVisitanteNombre;

    return (
        <div className={`pr-card ${bloqueado ? 'bloqueado' : ''} ${proximoAIniciar ? 'proximo' : ''}`}>
            <div className="pr-card-header">
                <span className="pr-fase">{partido.fechaNombre}</span>
                {pronostico && !editando && (
                    <span style={{ fontSize: '11px', color: '#4ade80', fontWeight: 'bold' }}>✓ GUARDADO</span>
                )}
            </div>

            <div className="pr-equipos">
                <div className="pr-equipo">
                    {partido.equipoLocalEscudo && (
                        <div className="pr-bandera-wrap">
                            <img src={partido.equipoLocalEscudo} alt="Local" className="pr-bandera" />
                        </div>
                    )}
                    <span className="pr-nombre">{partido.equipoLocalNombre}</span>
                </div>

                <input
                    type="number"
                    className="pr-input"
                    value={local}
                    onChange={e => setLocal(e.target.value)}
                    disabled={bloqueado && !editando}
                />

                <span className="pr-vs">VS</span>

                <input
                    type="number"
                    className="pr-input"
                    value={visita}
                    onChange={e => setVisita(e.target.value)}
                    disabled={bloqueado && !editando}
                />

                <div className="pr-equipo pr-equipo-right">
                    <span className="pr-nombre">{partido.equipoVisitanteNombre}</span>
                    {partido.equipoVisitanteEscudo && (
                        <div className="pr-bandera-wrap">
                            <img src={partido.equipoVisitanteEscudo} alt="Visitante" className="pr-bandera" />
                        </div>
                    )}
                </div>
            </div>

            {/* Botones de historial */}
            <div className="pr-historial-btns">
                <button
                    className={`pr-historial-toggle ${historialAbierto === 'local' ? 'activo' : ''}`}
                    onClick={() => toggleHistorial('local')}
                >
                    {historialAbierto === 'local' ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                    Historial {partido.equipoLocalNombre}
                </button>
                <button
                    className={`pr-historial-toggle ${historialAbierto === 'visitante' ? 'activo' : ''}`}
                    onClick={() => toggleHistorial('visitante')}
                >
                    {historialAbierto === 'visitante' ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                    Historial {partido.equipoVisitanteNombre}
                </button>
            </div>

            {/* Panel desplegable de historial */}
            {historialAbierto && (
                <div className="pr-historial-panel">
                    <div className="pr-historial-titulo">Últimos resultados — {nombreEquipoActual}</div>
                    {cargandoHistorial || historialActual === null ? (
                        <div className="pr-historial-cargando">Cargando...</div>
                    ) : historialActual.length === 0 ? (
                        <div className="pr-historial-vacio">Sin partidos finalizados</div>
                    ) : (
                        <ul className="pr-historial-lista">
                            {historialActual.map((h) => (
                                <li key={h.partidoId} className="pr-historial-item">
                                    <span className="pr-hist-equipo">{h.equipoLocal}</span>
                                    <span className="pr-hist-marcador">{h.golesLocal} — {h.golesVisitante}</span>
                                    <span className="pr-hist-equipo pr-hist-equipo-right">{h.equipoVisitante}</span>
                                    <span className={`pr-hist-badge pr-hist-badge--${(h.resultado || '').toLowerCase()}`}>
                                        {h.resultado === 'LOCAL' ? 'L' : h.resultado === 'VISITANTE' ? 'V' : 'E'}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}

            <div className="pr-card-footer">
                {bloqueado ? (
                    <button className="pr-btn-bloqueado" disabled>
                        <Lock size={16} /> CERRADO PARA EDICIÓN
                    </button>
                ) : editando ? (
                    <>
                        <button className="pr-btn-guardar" onClick={handleGuardar}>
                            <Save size={16} /> GUARDAR
                        </button>
                        <button
                            className="pr-btn-cancelar"
                            onClick={handleCancelar}
                            style={{
                                marginLeft: '8px',
                                background: 'rgba(255, 255, 255, 0.05)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                color: '#999',
                                flex: 1,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '6px'
                            }}
                        >
                            <X size={16} /> CANCELAR
                        </button>
                    </>
                ) : pronostico ? (
                    <button className="pr-btn-guardar" onClick={handleEditar}>
                        <Edit3 size={16} /> EDITAR PRONÓSTICO
                    </button>
                ) : (
                    <button className="pr-btn-guardar" onClick={handleGuardar}>
                        <Save size={16} /> GUARDAR PRONÓSTICO
                    </button>
                )}
            </div>
        </div>
    );
}

function PartidoCardFinalizado({ partido, pronostico }) {
    const resultadoReal = `${partido.golesLocal} - ${partido.golesVisitante}`;

    const tienePronostico = pronostico !== undefined;
    const pronosticoTexto = tienePronostico
        ? `${pronostico.golesLocalPredicho} - ${pronostico.golesVisitantePredicho}`
        : 'No se realizó pronóstico';

    const puntos = tienePronostico ? (pronostico.puntosOtorgados || 0) : 0;

    return (
        <div className="pr-card pr-card-finalizado">
            <div className="pr-card-header">
                <span className="pr-fase">{partido.fechaNombre}</span>
                {tienePronostico && (
                    <span style={{ fontSize: '11px', color: '#4ade80', fontWeight: 'bold' }}>✓ GUARDADO</span>
                )}
            </div>

            <div className="pr-equipos">
                <div className="pr-equipo">
                    {partido.equipoLocalEscudo && (
                        <div className="pr-bandera-wrap">
                            <img src={partido.equipoLocalEscudo} alt="Local" className="pr-bandera" />
                        </div>
                    )}
                    <span className="pr-nombre">{partido.equipoLocalNombre}</span>
                </div>

                <div className="pr-resultado-real">
                    {resultadoReal}
                </div>

                <div className="pr-equipo pr-equipo-right">
                    <span className="pr-nombre">{partido.equipoVisitanteNombre}</span>
                    {partido.equipoVisitanteEscudo && (
                        <div className="pr-bandera-wrap">
                            <img src={partido.equipoVisitanteEscudo} alt="Visitante" className="pr-bandera" />
                        </div>
                    )}
                </div>
            </div>

            <div className="pr-pronostico-info">
                <div className="pr-label-pronostico">Tu pronóstico:</div>
                <div className={`pr-pronostico-valor ${!tienePronostico ? 'sin-pronostico' : ''}`}>
                    {pronosticoTexto}
                </div>
            </div>

            {tienePronostico && (
                <div className="pr-puntos">
                    <span className="pr-puntos-label">Puntos obtenidos:</span>
                    <span className="pr-puntos-valor">{puntos}</span>
                </div>
            )}
        </div>
    );
}