import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import { Lock, Save, AlertCircle } from 'lucide-react';
import './PronosticosPage.css';

export default function PronosticosPage() {
    console.log("PronosticosPage se está renderizando...");
    const { user, token } = useAuth();
    const [partidos, setPartidos] = useState([]);
    const [pronosticos, setPronosticos] = useState({});
    const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });

    const api = axios.create({ baseURL: 'http://localhost:8080/api' });

    api.interceptors.request.use((config) => {
        if (token) config.headers.Authorization = `Bearer ${token}`;
        return config;
    });

    useEffect(() => {
        if (token && user && user.id) {
            cargarDatos();
        }
    }, [token, user]);

    const cargarDatos = async () => {
        try {
            const [pRes, proRes] = await Promise.all([
                api.get('/partidos'),
                api.get(`/pronosticos/usuario/${user.id}`)
            ]);
            setPartidos(pRes.data);
            const map = {};
            proRes.data.forEach(p => map[p.partidoId] = p);
            setPronosticos(map);
        } catch (err) {
            console.error("Error al cargar:", err.response);
        }
    };

    const handleSave = async (partidoId, golesLocal, golesVisitante) => {
        try {
            await api.post('/pronosticos', { usuarioId: user.id, partidoId, golesLocal, golesVisitante });
            setMensaje({ texto: "Guardado", tipo: "success" });
            cargarDatos();
        } catch (err) {
            setMensaje({ texto: "Error al guardar", tipo: "error" });
        }
    };

    // --- AQUÍ ESTÁ EL CAMBIO ---
    console.log("Estado de partidos:", partidos);

    return (
        <div className="pr-container">
            <h1>MIS PRONÓSTICOS 2026</h1>
            {mensaje.texto && <div className={`msg ${mensaje.tipo}`}>{mensaje.texto}</div>}
            
            {partidos.length === 0 ? (
                <div className="no-data">
                    <h2>No hay partidos cargados</h2>
                </div>
            ) : (
                <div className="pr-grid">
                    {partidos.map(partido => (
                        <PartidoCard 
                            key={partido.id} 
                            partido={partido} 
                            pronostico={pronosticos[partido.id]}
                            onSave={handleSave}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

function PartidoCard({ partido, pronostico, onSave }) {
    const [local, setLocal] = useState(pronostico?.golesLocal || 0);
    const [visita, setVisita] = useState(pronostico?.golesVisitante || 0);
    
    const inicio = new Date(partido.horaInicio);
    const ahora = new Date();
    const bloqueado = (inicio - ahora) < (30 * 60 * 1000);

    return (
        <div className="pr-card">
            <div className="pr-info">{partido.fechaJornada}</div>
            <div className="pr-match">
                <span>{partido.equipoLocal.nombre}</span>
                <input type="number" value={local} onChange={e => setLocal(e.target.value)} disabled={bloqueado} />
                <span>VS</span>
                <input type="number" value={visita} onChange={e => setVisita(e.target.value)} disabled={bloqueado} />
                <span>{partido.equipoVisitante.nombre}</span>
            </div>
            {!bloqueado && (
                <button onClick={() => onSave(partido.id, local, visita)}>
                    <Save size={16}/> Guardar
                </button>
            )}
        </div>
    );
}