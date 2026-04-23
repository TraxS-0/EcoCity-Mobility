import { useEffect, useState } from 'react'

export default function LoginPage() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setTimeout(() => setVisible(true), 100)
  }, [])

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0f0d',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'DM Sans', sans-serif",
      overflow: 'hidden',
      position: 'relative'
    }}>
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
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <circle cx="16" cy="16" r="15" stroke="#34d399" strokeWidth="1.5"/>
            <path d="M10 20 Q16 8 22 20" stroke="#34d399" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
            <circle cx="16" cy="16" r="2" fill="#34d399"/>
          </svg>
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
          color: '#6b7280',
          fontSize: 16,
          margin: '0 0 48px',
          letterSpacing: '0.2px'
        }}>
          Bicicletas, patinetes y buses en tiempo real.
        </p>

        <button
          onClick={() => { window.location.href = '/api/auth/login' }}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 12,
            background: 'transparent',
            border: '1.5px solid #34d399',
            color: '#34d399',
            padding: '14px 28px',
            borderRadius: 8,
            fontSize: 15,
            fontWeight: 500,
            cursor: 'pointer',
            letterSpacing: '0.2px',
            transition: 'background 0.2s, color 0.2s',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.background = '#34d399'
            ;(e.currentTarget as HTMLButtonElement).style.color = '#0a0f0d'
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.background = 'transparent'
            ;(e.currentTarget as HTMLButtonElement).style.color = '#34d399'
          }}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor">
            <path d="M9 1.5C4.86 1.5 1.5 4.86 1.5 9s3.36 7.5 7.5 7.5 7.5-3.36 7.5-7.5S13.14 1.5 9 1.5zm3.53 5.03L9 10.06 5.47 6.53a6 6 0 0 1 7.06 0z"/>
          </svg>
          Continuar con Google
        </button>

        <p style={{ color: '#374151', fontSize: 12, marginTop: 32 }}>
          Al continuar aceptas los términos de uso
        </p>
      </div>

      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');`}</style>
    </div>
  )
}