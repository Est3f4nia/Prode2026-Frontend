import { useEffect, useState } from "react";
import { getFechas, createFecha } from "../config/api";
import { useNavigate } from "react-router-dom";
import "./styles/FechasAdminPage.css";

const ESTADO_LABEL = {
  PROGRAMADA: "🕒 Programada",
  EN_JUEGO: "🟢 En juego",
  FINALIZADA: "🏁 Finalizada",
};

export default function FechasAdminPage() {
  const [fechas, setFechas] = useState([]);
  const [nombre, setNombre] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    cargarFechas();
  }, []);

  const cargarFechas = async () => {
    try {
      const res = await getFechas();
      setFechas(res.data);
    } catch {
      setError("Error al cargar las fechas.");
    }
  };

  const handleChange = (e) => {
    setNombre(e.target.value);
    setError("");
    setSuccess("");
  };

  const handleCrear = async (e) => {
    e.preventDefault();
    if (!nombre.trim()) {
      setError("El nombre de la fecha es obligatorio.");
      return;
    }
    setLoading(true);
    try {
      await createFecha({ nombre });
      setSuccess(`Fecha "${nombre}" creada correctamente.`);
      setNombre("");
      cargarFechas();
    } catch (err) {
      const msg = err.response?.data?.detail || err.response?.data?.message;
      if (err.response?.status === 409) {
        setError(msg || "Ya existe una fecha con ese nombre.");
      } else {
        setError(msg || "Error al crear la fecha.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div className="admin-header-left">
          <img src="/logo2026.png" alt="Logo" className="admin-logo" />
          <h1 className="admin-title">📅 Gestión de Fechas</h1>
        </div>
        <button className="btn-volver" onClick={() => navigate("/home")}>
          ← Volver
        </button>
      </div>

      {/* Formulario alta */}
      <div className="admin-card">
        <h2 className="card-title">➕ Nueva Fecha</h2>
        <form onSubmit={handleCrear} className="fecha-form">
          <input
            type="text"
            name="nombre"
            placeholder="Nombre de la fecha (ej: Fecha 1) *"
            value={nombre}
            onChange={handleChange}
            maxLength={100}
            className="input-field"
          />
          <button type="submit" className="btn-crear" disabled={loading}>
            {loading ? "Creando..." : "Crear Fecha"}
          </button>
        </form>

        {error && <p className="msg-error">⚠ {error}</p>}
        {success && <p className="msg-success">✔ {success}</p>}
      </div>

      {/* Tabla de fechas */}
      <div className="admin-card">
        <h2 className="card-title">📋 Fechas Registradas ({fechas.length})</h2>
        {fechas.length === 0 ? (
          <p className="msg-vacio">No hay fechas registradas aún.</p>
        ) : (
          <table className="fechas-tabla">
            <thead>
              <tr>
                <th>#</th>
                <th>Nombre</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {fechas.map((f) => (
                <tr key={f.id}>
                  <td>{f.id}</td>
                  <td>{f.nombre}</td>
                  <td>
                    <span className={`badge-estado badge-${f.estado?.toLowerCase()}`}>
                      {ESTADO_LABEL[f.estado] || f.estado}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}