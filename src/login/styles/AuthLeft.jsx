export default function AuthLeft() {
  return (
    <div className="auth-left">
      {/* Floating decorations */}
      <div className="floating-elements">
        <span className="float-item">⚽</span>
        <span className="float-item">⚽</span>
        <span className="float-item">⚽</span>
        <span className="float-item">⚽</span>
        <span className="float-item">⚽</span>
        <span className="float-item">⚽</span>
        <span className="float-item">⚽</span>
      </div>

      <div className="left-content">
        {/* Trophy image */}
        <div className="trophy-container">
          <div className="trophy-ring" />
          <div className="trophy-ring" />
          <img
            src="/trofeo.jpg"
            alt="Copa del Mundo"
            className="trophy-img"
            onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex' }}
          />
          {/* Fallback si no está la imagen */}
          <div className="trophy-emoji" style={{ display: 'none' }}>🏆</div>
        </div>


        {/* Brand title */}
        <div className="brand-title">PRODE</div>

        {/* Flags */}
        <div className="flags-row">
          <span className="flag-chip" title="Estados Unidos">
            <img src="https://flagcdn.com/w40/us.png" alt="USA" style={{ width: '28px', borderRadius: '4px', display: 'block' }} />
          </span>
          <span className="flag-chip" title="Canadá">
            <img src="https://flagcdn.com/w40/ca.png" alt="Canadá" style={{ width: '28px', borderRadius: '4px', display: 'block' }} />
          </span>
          <span className="flag-chip" title="México">
            <img src="https://flagcdn.com/w40/mx.png" alt="México" style={{ width: '28px', borderRadius: '4px', display: 'block' }} />
          </span>
        </div>
      </div>
    </div>
  )
}
