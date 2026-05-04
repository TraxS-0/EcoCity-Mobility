import { useEffect, useState } from 'react'
import type { User } from '../types'

export function useUser() {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const token = sessionStorage.getItem('token')
    if (!token) return

    fetch('/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(setUser)
      .catch(console.error)
  }, [])

  return { user }
}