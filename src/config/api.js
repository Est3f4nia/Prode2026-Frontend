import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: { 'Content-Type': 'application/json' },
})

// Attach token to every request if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('prode_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})


// ── Auth ─────────────────────────────────────────────────────
export const authService = {
  register: (data) => api.post('/auth/register', data),
  login:    (data) => api.post('/auth/login', data),
}

// ── Equipos ──────────────────────────────────────────────────
export const getEquipos    = ()     => api.get('/equipos')
export const createEquipo  = (data) => api.post('/equipos', data)
export const deleteEquipo  = (id)   => api.delete(`/equipos/${id}`)

// ── Fechas (Jornadas) ────────────────────────────────────────
export const getFechas    = ()     => api.get('/fechas')
export const createFecha  = (data) => api.post('/fechas', data)

// ── Partidos ─────────────────────────────────────────────────
export const getPartidos    = ()        => api.get('/partidos')
export const createPartido  = (data)    => api.post('/partidos', data)
export const updatePartido  = (id, data) => api.patch(`/partidos/${id}`, data)
export const cargarResultadoPartido = (id, data) => api.patch(`/partidos/${id}/resultado`, data);

// ── Historial ─────────────────────────────────────────────────
export const getHistorialEquipo = (equipoId) => api.get(`/equipos/${equipoId}/historial`)

export default api