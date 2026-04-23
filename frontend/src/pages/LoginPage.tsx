export default function LoginPage() {
  const handleLogin = () => {
    window.location.href = '/api/auth/login'
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <h1>EcoCity Mobility</h1>
      <button onClick={handleLogin}>Iniciar sesión con Google</button>
    </div>
  )
}