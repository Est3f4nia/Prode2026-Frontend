import { useEffect, useState } from "react";
import { getEquipos, getFechas, getPartidos, createPartido, updatePartido, cargarResultadoPartido } from "../api";
import { useNavigate } from "react-router-dom";
import "./PartidosAdminPage.css";

const ESTADO_LABEL = {
  POR_JUGARSE: "🕒 Por jugarse",
  EN_JUEGO: "🟢 En juego",
  FINALIZADO: "🏁 Finalizado",
};

const initialForm = {
  fechaId: "",
  equipoLocalId: "",
  equipoVisitanteId: "",
  fechaHoraInicio: "",
};

export default function PartidosAdminPage() {
  const [partidos, setPartidos] = useState([]);
  const [equipos, setEquipos] = useState([]);
  const [fechas, setFechas] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Estados para el Modal de Resultados
  const [modalAbierto, setModalAbierto] = useState(false);
  const [partidoActivo, setPartidoActivo] = useState(null);
  const [golesLocal, setGolesLocal] = useState("");
  const [golesVisitante, setGolesVisitante] = useState("");

  useEffect(() => {
    cargarTodo();
  }, []);

  const cargarTodo = async () => {
    try {
      const [eqRes, fechaRes, partidoRes] = await Promise.all([
        getEquipos(),
        getFechas(),
        getPartidos(),
      ]);
      setEquipos(eqRes.data);
      setFechas(fechaRes.data);
      setPartidos(partidoRes.data);
    } catch {
      setError("Error al cargar los datos.");
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  const handleCrear = async (e) => {
    e.preventDefault();

    if (!form.fechaId || !form.equipoLocalId || !form.equipoVisitanteId || !form.fechaHoraInicio) {
      setError("Todos los campos son obligatorios.");
      return;
    }

    if (form.equipoLocalId === form.equipoVisitanteId) {
      setError("El equipo local y el equipo visitante no pueden ser el mismo.");
      return;
    }

    setLoading(true);
    try {
      const fechaHoraUTC = new Date(form.fechaHoraInicio).toISOString();

      await createPartido({
        fechaId: Number(form.fechaId),
        equipoLocalId: Number(form.equipoLocalId),
        equipoVisitanteId: Number(form.equipoVisitanteId),
        fechaHoraInicio: fechaHoraUTC,
      });

      setSuccess("Partido creado correctamente.");
      setForm(initialForm);
      cargarTodo();
    } catch (err) {
      const detail = err.response?.data?.detail || err.response?.data?.message;
      const errores = err.response?.data?.errors;
      if (errores && errores.length > 0) {
        setError(errores.join(" | "));
      } else {
        setError(detail || "Error al crear el partido.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleIniciar = async (partido) => {
    if (!confirm(`¿Marcar el partido ${partido.equipoLocalNombre} vs ${partido.equipoVisitanteNombre} como "En juego"?`)) return;
    try {
      await updatePartido(partido.id, { estado: "EN_JUEGO" });
      setSuccess("Partido actualizado a 'En juego'.");
      cargarTodo();
    } catch (err) {
      const detail = err.response?.data?.detail || err.response?.data?.message;
      setError(detail || "Error al actualizar el partido.");
    }
  };

  // Funciones del Modal de Resultados
  const abrirModal = (partido) => {
    setPartidoActivo(partido);
    setGolesLocal(partido.golesLocal ?? "");
    setGolesVisitante(partido.golesVisitante ?? "");
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setPartidoActivo(null);
    setGolesLocal("");
    setGolesVisitante("");
  };

  const handleGuardarResultado = async (e) => {
    e.preventDefault();
    try {
      await cargarResultadoPartido(partidoActivo.id, {
        golesLocal: Number(golesLocal),
        golesVisitante: Number(golesVisitante),
      });
      setSuccess("¡Resultado cargado exitosamente!");
      cerrarModal();
      cargarTodo(); // Recargar la tabla automáticamente
    } catch (err) {
      const detail = err?.response?.data?.detail || err?.response?.data?.message;
      setError(detail || "Error al cargar el resultado del partido.");
      cerrarModal();
    }
  };

  const formatFecha = (iso) => {
    if (!iso) return "-";
    return new Date(iso).toLocaleString("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div className="admin-header-left">
          <img src="/logo2026.png" alt="Logo" className="admin-logo" />
          <h1 className="admin-title">⚔️ Gestión de Partidos</h1>
        </div>
        <button className="btn-volver" onClick={() => navigate("/home")}>
          ← Volver
        </button>
      </div>

      {/* Formulario alta */}
      <div className="admin-card">
        <h2 className="card-title">➕ Nuevo Partido</h2>
        <form onSubmit={handleCrear} className="partido-form">
          <select name="fechaId" value={form.fechaId} onChange={handleChange} className="input-field">
            <option value="">Fecha / Jornada *</option>
            {fechas.map((f) => (
              <option key={f.id} value={f.id}>{f.nombre}</option>
            ))}
          </select>

          <select name="equipoLocalId" value={form.equipoLocalId} onChange={handleChange} className="input-field">
            <option value="">Equipo Local *</option>
            {equipos.map((eq) => (
              <option key={eq.id} value={eq.id}>{eq.nombre}</option>
            ))}
          </select>

          <select name="equipoVisitanteId" value={form.equipoVisitanteId} onChange={handleChange} className="input-field">
            <option value="">Equipo Visitante *</option>
            {equipos.map((eq) => (
              <option key={eq.id} value={eq.id}>{eq.nombre}</option>
            ))}
          </select>

          <input type="datetime-local" name="fechaHoraInicio" value={form.fechaHoraInicio} onChange={handleChange} className="input-field" />

          <button type="submit" className="btn-crear" disabled={loading}>
            {loading ? "Creando..." : "Crear Partido"}
          </button>
        </form>

        {error && <p className="msg-error">⚠ {error}</p>}
        {success && <p className="msg-success">✔ {success}</p>}
      </div>

      {/* Tabla de partidos */}
      <div className="admin-card">
        <h2 className="card-title">📋 Partidos Registrados ({partidos.length})</h2>
        {partidos.length === 0 ? (
          <p className="msg-vacio">No hay partidos registrados aún.</p>
        ) : (
          <table className="partidos-tabla">
            <thead>
              <tr>
                <th>#</th>
                <th>Fecha/Jornada</th>
                <th style={{textAlign: 'right'}}>Local</th>
                <th></th>
                <th>Visitante</th>
                <th>Inicio</th>
                <th>Estado</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {partidos.map((p) => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{p.fechaNombre}</td>
                  <td style={{textAlign: 'right'}}>{p.equipoLocalNombre}</td>
                  <td className="vs-cell">
                    {p.golesLocal !== null && p.golesVisitante !== null 
                      ? `${p.golesLocal} - ${p.golesVisitante}` 
                      : "vs"}
                  </td>
                  <td>{p.equipoVisitanteNombre}</td>
                  <td>{formatFecha(p.fechaHoraInicio)}</td>
                  <td>
                    <span className={`badge-estado badge-${p.estado?.toLowerCase()}`}>
                      {ESTADO_LABEL[p.estado] || p.estado}
                    </span>
                  </td>
                  <td>
                    {p.estado === "POR_JUGARSE" && (
                      <button className="btn-iniciar" onClick={() => handleIniciar(p)}>
                        ▶ Iniciar
                      </button>
                    )}
                    {p.estado === "EN_JUEGO" && (
                      <button className="btn-iniciar" onClick={() => abrirModal(p)} style={{ background: '#f0c040', color: '#1a3a1a', borderColor: '#f0c040' }}>
                        ⚽ Cargar Resultado
                      </button>
                    )}
                    {p.estado === "FINALIZADO" && (
                      <span className="msg-vacio">FINALIZADO</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* MODAL DE RESULTADOS */}
      {modalAbierto && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Cargar Resultado</h3>
            <p style={{ textAlign: "center", marginBottom: "20px", color: "#f0c040", fontWeight: "bold" }}>
              {partidoActivo?.equipoLocalNombre} vs {partidoActivo?.equipoVisitanteNombre}
            </p>
            <form onSubmit={handleGuardarResultado}>
              <div className="form-group">
                <label>Goles {partidoActivo?.equipoLocalNombre}</label>
                <input
                  type="number"
                  min="0"
                  required
                  value={golesLocal}
                  onChange={(e) => setGolesLocal(e.target.value)}
                  className="input-field"
                  style={{ width: '100%', boxSizing: 'border-box' }}
                />
              </div>
              <div className="form-group">
                <label>Goles {partidoActivo?.equipoVisitanteNombre}</label>
                <input
                  type="number"
                  min="0"
                  required
                  value={golesVisitante}
                  onChange={(e) => setGolesVisitante(e.target.value)}
                  className="input-field"
                  style={{ width: '100%', boxSizing: 'border-box' }}
                />
              </div>
              <div style={{ display: "flex", gap: "10px", marginTop: "25px" }}>
                <button type="button" onClick={cerrarModal} className="btn-modal-cancelar">
                  Cancelar
                </button>
                <button type="submit" className="btn-modal-guardar">
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}