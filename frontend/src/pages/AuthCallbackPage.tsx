import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function AuthCallbackPage() {
  const navigate = useNavigate()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const token = params.get('token')
    console.log('token extraído:', token)

    if (token) {
        sessionStorage.setItem('token', token)
        navigate('/map')
    } else {
        navigate('/')
    }
    }, [navigate])


  return <p>Autenticando...</p>
}