import { useEffect, useState } from 'react'

export default function LoginPage() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setTimeout(() => setVisible(true), 100)
  }, [])

  return (
    <div style={{
      minHeight: '100vh',
      background: 'url(/loginbg.png) center/cover no-repeat',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'DM Sans', sans-serif",
      overflow: 'hidden',
      position: 'relative'
    }}>
      <div style={{
        position: 'absolute', inset: 0,
        background: 'rgba(0,0,0,0.85)'
      }} />
      {/* Grid background */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'linear-gradient(rgba(52,211,153,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(52,211,153,0.05) 1px, transparent 1px)',
        backgroundSize: '40px 40px'
      }} />

      {/* Glow */}
      <div style={{
        position: 'absolute',
        width: 500, height: 500,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(52,211,153,0.12) 0%, transparent 70%)',
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none'
      }} />

      <div style={{
        position: 'relative',
        textAlign: 'center',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(24px)',
        transition: 'opacity 0.7s ease, transform 0.7s ease'
      }}>
        {/* Logo */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 48
        }}>
          <img src="/weblogo.png" style={{ width: 48, height: 48, objectFit: 'contain' }} />
          <span style={{ color: '#f0fdf4', fontSize: 18, fontWeight: 600, letterSpacing: '-0.3px' }}>
            EcoCity<span style={{ color: '#34d399' }}>.</span>
          </span>
        </div>

        <h1 style={{
          color: '#f0fdf4',
          fontSize: 48,
          fontWeight: 700,
          letterSpacing: '-1.5px',
          lineHeight: 1.1,
          margin: '0 0 16px',
        }}>
          Movilidad urbana<br />
          <span style={{ color: '#34d399' }}>sostenible</span>
        </h1>

        <p style={{
          color: '#b0b0b0',
          fontSize: 16,
          margin: '0 0 48px',
          letterSpacing: '0.2px'
        }}>
          Bicicletas, patinetes y guaguas 😉  en tiempo real.
        </p>

        <button
  onClick={() => { window.location.href = '/api/auth/login' }}
  style={{
    display: 'inline-flex', alignItems: 'center', gap: 12,
    background: 'transparent',
    border: '1.5px solid #fcfcfc',
    color: '#ffffff',
    padding: '14px 28px',
    borderRadius: 8,
    fontSize: 15,
    fontWeight: 500,
    cursor: 'pointer',
    letterSpacing: '0.2px',
    transition: 'background 0.2s, color 0.2s',
  }}
  onMouseEnter={e => {
    (e.currentTarget as HTMLButtonElement).style.background = '#ffffff'
    ;(e.currentTarget as HTMLButtonElement).style.color = '#0a0f0d'
  }}
  onMouseLeave={e => {
    (e.currentTarget as HTMLButtonElement).style.background = 'transparent'
    ;(e.currentTarget as HTMLButtonElement).style.color = '#ffffff'
  }}
>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="20" height="20" style={{ flexShrink: 0 }}>
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
  </svg>
  Continuar con Google
</button>

        <p style={{ color: '#cdcdcd', fontSize: 12, marginTop: 32 }}>
          Al continuar aceptas los términos de uso
        </p>
      </div>

      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');`}</style>
    </div>
  )
}