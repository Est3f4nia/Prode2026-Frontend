import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../config/auth/AuthContext'
import { authService } from '../config/api'
import AuthLeft from './styles/AuthLeft'
import '../login/styles/auth.css'

export default function RegisterPage() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [form, setForm] = useState({ nombre: '', email: '', password: '', confirm: '' })
  const [errors, setErrors] = useState({})
  const [alert, setAlert] = useState(null)
  const [loading, setLoading] = useState(false)

  const validate = () => {
    const e = {}
    if (!form.nombre.trim())  e.nombre   = 'El nombre es requerido'
    if (!form.email)          e.email    = 'El email es requerido'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Email inválido'
    if (!form.password)       e.password = 'La contraseña es requerida'
    else if (form.password.length < 8) e.password = 'Mínimo 6 caracteres'
    if (form.password !== form.confirm)  e.confirm = 'Las contraseñas no coinciden'
    return e
  }

  const handleChange = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
    setErrors(er => ({ ...er, [e.target.name]: '' }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    setLoading(true)
    setAlert(null)

    try {
      const { data } = await authService.register({
        username: form.nombre,
        email: form.email,
        password: form.password,
      })
      login(data)
      navigate('/home')
    } catch (err) {
      //console.error("El error real atrapado es:", err);
      const msg = err.response?.data?.message || 'Error al registrar el usuario'
      setAlert({ type: 'error', text: msg })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-layout">
      <AuthLeft />
      <div className="auth-divider" />

      <div className="auth-right">
        <div className="auth-form-wrapper">
          <div className="form-header">
            <div className="form-eyebrow">Unite al prode</div>
            <h1 className="form-title">CREAR<br />CUENTA</h1>
            <p className="form-subtitle">Registrate y empezá a pronosticar</p>
          </div>

          {alert && (
            <div className={`alert alert-${alert.type}`}>
              {alert.type === 'error' ? '⚠️' : '✅'} {alert.text}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="field-group">
              <label className="field-label" htmlFor="nombre">Nombre</label>
              <div className="field-input-wrapper">
                <input
                  id="nombre"
                  name="nombre"
                  type="text"
                  className="field-input"
                  placeholder="Tu nombre"
                  value={form.nombre}
                  onChange={handleChange}
                  autoComplete="name"
                />
                <span className="field-icon">👤</span>
              </div>
              {errors.nombre && <p className="field-error">{errors.nombre}</p>}
            </div>

            <div className="field-group">
              <label className="field-label" htmlFor="email">Email</label>
              <div className="field-input-wrapper">
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="field-input"
                  placeholder="tu@email.com"
                  value={form.email}
                  onChange={handleChange}
                  autoComplete="email"
                />
                <span className="field-icon">✉️</span>
              </div>
              {errors.email && <p className="field-error">{errors.email}</p>}
            </div>

            <div className="field-group">
              <label className="field-label" htmlFor="password">Contraseña</label>
              <div className="field-input-wrapper">
                <input
                  id="password"
                  name="password"
                  type="password"
                  className="field-input"
                  placeholder="Mínimo 6 caracteres"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                />
                <span className="field-icon">🔒</span>
              </div>
              {errors.password && <p className="field-error">{errors.password}</p>}
            </div>

            <div className="field-group">
              <label className="field-label" htmlFor="confirm">Repetir contraseña</label>
              <div className="field-input-wrapper">
                <input
                  id="confirm"
                  name="confirm"
                  type="password"
                  className="field-input"
                  placeholder="••••••••"
                  value={form.confirm}
                  onChange={handleChange}
                  autoComplete="new-password"
                />
                <span className="field-icon">🔑</span>
              </div>
              {errors.confirm && <p className="field-error">{errors.confirm}</p>}
            </div>

            <button
              type="submit"
              className={`btn-submit ${loading ? 'loading' : ''}`}
              disabled={loading}
            >
              {loading ? 'REGISTRANDO...' : 'UNIRME AL PRODE 🏆'}
            </button>
          </form>

          <div className="form-divider">o</div>

          <p className="form-switch">
            ¿Ya tenés cuenta?{' '}
            <Link to="/login">Iniciá sesión</Link>
          </p>
        </div>
      </div>
    </div>
  )
}