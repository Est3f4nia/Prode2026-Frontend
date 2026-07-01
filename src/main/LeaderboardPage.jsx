import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Home, Trophy, Users } from 'lucide-react';
import './styles/LeaderboardPage.css';
import { useAuth } from '../config/auth/AuthContext';

const api = axios.create({ baseURL: 'http://localhost:8080/api' });

export default function LeaderboardPage() {
    const { user, token } = useAuth();
    const navigate = useNavigate();
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });

    api.interceptors.request.use((config) => {
        if (token) config.headers.Authorization = `Bearer ${token}`;
        return config;
    });

    useEffect(() => {
        const cargarRanking = async () => {
            setLoading(true);
            try {
                const res = await api.get('/ranking');
                setUsuarios(res.data);
                setMensaje({ texto: '', tipo: '' });
            } catch (error) {
                const msg = error?.response?.data?.message || "Error al cargar el ranking";
                setMensaje({ texto: msg, tipo: "error" });
            } finally {
                setLoading(false);
            }
        };

        if (token && user && user.id) {
            cargarRanking();
        }
    }, [token, user]);

    const getMedalIcon = (posicion) => {
        if (posicion === 1) return '🥇';
        if (posicion === 2) return '🥈';
        if (posicion === 3) return '🥉';
        return null;
    };

    const esUsuarioActual = (usuarioId) => user?.id === usuarioId;

    return (
        <div className="lb-root">
            <div className="lb-main">
                <div className="lb-header">
                    <button
                        className="lb-btn-home"
                        onClick={() => navigate('/home')}
                    >
                        <Home size={18} /> VOLVER AL HOME
                    </button>
                    <div className="lb-titulo-centro">
                        <div className="lb-titulo-icon">
                            <Trophy size={40} />
                        </div>
                        <h1 className="lb-title">LEADERBOARD</h1>
                        <p className="lb-subtitle">Ranking de Jugadores <strong>Copa del Mundo 2026</strong></p>
                    </div>
                    <div style={{ width: '120px' }}></div>
                </div>

                {mensaje.texto && (
                    <div className={`lb-alert ${mensaje.tipo}`}>
                        {mensaje.texto}
                    </div>
                )}

                {loading ? (
                    <div className="lb-loading">
                        <div className="lb-spinner"></div>
                        <p>Cargando ranking...</p>
                    </div>
                ) : usuarios.length === 0 ? (
                    <div className="lb-empty">
                        <Users size={48} />
                        <p>No hay usuarios en el ranking aún</p>
                    </div>
                ) : (
                    <div className="lb-container">
                        <div className="lb-table-wrapper">
                            <table className="lb-table">
                                <thead>
                                    <tr>
                                        <th className="lb-col-pos">POS</th>
                                        <th className="lb-col-usuario">USUARIO</th>
                                        <th className="lb-col-puntos">PUNTOS</th>
                                        <th className="lb-col-plenos">PLENOS</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {usuarios.map((usuario, index) => {
                                        const posicion = index + 1;
                                        const medalIcon = getMedalIcon(posicion);
                                        const esActual = esUsuarioActual(usuario.usuarioId);

                                        return (
                                            <tr key={usuario.usuarioId} className={`lb-row ${esActual ? 'lb-row-actual' : ''}`}>
                                                <td className="lb-col-pos">
                                                    <div className="lb-posicion">
                                                        {medalIcon ? (
                                                            <span className="lb-medal">{medalIcon}</span>
                                                        ) : (
                                                            <span className="lb-numero">{posicion}</span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="lb-col-usuario">
                                                    <div className="lb-usuario-info">
                                                        <span className="lb-usuario-nombre">{usuario.usuarioNombre}</span>
                                                        {esActual && <span className="lb-badge-yo">(TÚ)</span>}
                                                    </div>
                                                </td>
                                                <td className="lb-col-puntos">
                                                    <span className="lb-puntos">{usuario.puntosTotal}</span>
                                                </td>
                                                <td className="lb-col-plenos">
                                                    <span className="lb-plenos">{usuario.planosExactos}</span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        <div className="lb-info">
                            <p className="lb-info-text">
                                <strong>Ordenamiento:</strong> Puntos totales (descendente) → Plenos exactos (descendente) → Antigüedad
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
