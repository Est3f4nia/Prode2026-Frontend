import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from './AuthContext'
import { authService } from './api'
import AuthLeft from './AuthLeft'
import './auth.css'

export default function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [alert, setAlert] = useState(null)
  const [loading, setLoading] = useState(false)

  const validate = () => {
    const e = {}
    if (!form.email)    e.email    = 'El email es requerido'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Email inválido'
    if (!form.password) e.password = 'La contraseña es requerida'
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
      const { data } = await authService.login(form)
      login(data)
      navigate('/home')
    } catch (err) {
      const msg = err.response?.data?.message || 'Credenciales incorrectas'
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
            <div className="form-eyebrow">Acceso a la plataforma</div>
            <h1 className="form-title">INICIAR<br />SESIÓN</h1>
            <p className="form-subtitle">Ingresá tu cuenta para ver tus pronósticos</p>
          </div>

          {alert && (
            <div className={`alert alert-${alert.type}`}>
              {alert.type === 'error' ? '⚠️' : '✅'} {alert.text}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
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
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                />
                <span className="field-icon">🔒</span>
              </div>
              {errors.password && <p className="field-error">{errors.password}</p>}
            </div>

            <button
              type="submit"
              className={`btn-submit ${loading ? 'loading' : ''}`}
              disabled={loading}
            >
              {loading ? 'INGRESANDO...' : 'ENTRAR AL PRODE ⚽'}
            </button>
          </form>

          <div className="form-divider">o</div>

          <p className="form-switch">
            ¿No tenés cuenta?{' '}
            <Link to="/register">Registrate acá</Link>
          </p>
        </div>
      </div>
    </div>
  )
}