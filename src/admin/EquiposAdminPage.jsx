import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/EquiposAdminPage.css";
import { getEquipos, createEquipo, deleteEquipo } from "../config/api";


export default function EquiposAdminPage() {
  const [equipos, setEquipos] = useState([]);
  const [form, setForm] = useState({ nombre: "", pais: "", escudoUrl: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    cargarEquipos();
  }, []);

  const cargarEquipos = async () => {
    try {
      const res = await getEquipos();
      setEquipos(res.data);
    } catch {
      setError("Error al cargar los equipos.");
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  const handleCrear = async (e) => {
    e.preventDefault();
    if (!form.nombre.trim()) {
      setError("El nombre del equipo es obligatorio.");
      return;
    }
    setLoading(true);
    try {
      await createEquipo(form);
      setSuccess(`Equipo "${form.nombre}" creado correctamente.`);
      setForm({ nombre: "", escudoUrl: "" }); 
      
      cargarEquipos();
    } catch (err) {
      
      console.error("🔥 Error desde Spring Boot:", err.response?.data || err.message);
    
      const msg = err.response?.data?.message;
      if (err.response?.status === 409) {
        setError(msg || "Ya existe un equipo con ese nombre.");
      } else {
        setError(msg || "Error al crear el equipo.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEliminar = async (id, nombre) => {
    if (!confirm(`¿Eliminar el equipo "${nombre}"?`)) return;
    try {
      await deleteEquipo(id);
      setSuccess(`Equipo "${nombre}" eliminado.`);
      cargarEquipos();
    } catch (err) {
      const msg = err.response?.data?.message;
      if (err.response?.status === 409) {
        setError(`No se puede eliminar "${nombre}": tiene partidos asociados.`);
      } else {
        setError(msg || "Error al eliminar el equipo.");
      }
    }
  };

  return (
    <div className="admin-page">
      {/* Header */}
      <div className="admin-header">
        <div className="admin-header-left">
          <img src="/logo2026.png" alt="Logo" className="admin-logo" />
          <h1 className="admin-title">⚽ Gestión de Equipos</h1>
        </div>
        <button className="btn-volver" onClick={() => navigate("/home")}>
          ← Volver
        </button>
      </div>

      {/* Formulario alta */}
      <div className="admin-card">
        <h2 className="card-title">➕ Nuevo Equipo</h2>
        <form onSubmit={handleCrear} className="equipo-form">
          <input
            type="text"
            name="nombre"
            placeholder="Nombre del equipo *"
            value={form.nombre}
            onChange={handleChange}
            maxLength={50}
            className="input-field"
          />
          
          <input
            type="text"
            name="escudoUrl"
            placeholder="URL del escudo (opcional)"
            value={form.escudoUrl}
            onChange={handleChange}
            maxLength={150}
            className="input-field"
          />
          <button type="submit" className="btn-crear" disabled={loading}>
            {loading ? "Creando..." : "Crear Equipo"}
          </button>
        </form>

        {error && <p className="msg-error">⚠ {error}</p>}
        {success && <p className="msg-success">✔ {success}</p>}
      </div>

      {/* Tabla de equipos */}
      <div className="admin-card">
        <h2 className="card-title">🏆 Equipos Registrados ({equipos.length})</h2>
        {equipos.length === 0 ? (
          <p className="msg-vacio">No hay equipos registrados aún.</p>
        ) : (
          <table className="equipos-tabla">
            <thead>
              <tr>
                <th>#</th>
                <th>Escudo</th>
                <th>Nombre</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {equipos.map((eq) => (
                <tr key={eq.id}>
                  <td>{eq.id}</td>
                  <td>
                    {eq.escudoUrl ? (
                      <img src={eq.escudoUrl} alt={eq.nombre} className="escudo-img" />
                    ) : (
                      <span className="sin-escudo">🏳</span>
                    )}
                  </td>
                  <td>{eq.nombre}</td>
                  <td>
                    <button
                      className="btn-eliminar"
                      onClick={() => handleEliminar(eq.id, eq.nombre)}
                    >
                      🗑 Eliminar
                    </button>
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