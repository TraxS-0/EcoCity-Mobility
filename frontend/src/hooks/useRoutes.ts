import { useEffect, useState } from 'react'
import { api } from '../services/api'
import type { Route } from '../types'

export function useRoutes() {
  const [routes, setRoutes] = useState<Route[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    api.routes.getAll()
      .then(setRoutes)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  return { routes, loading, error }
}