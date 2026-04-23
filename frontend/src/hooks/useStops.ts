import { useEffect, useState } from 'react'
import { api } from '../services/api'
import type { Stop } from '../types'

export function useStops() {
  const [stops, setStops] = useState<Stop[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    api.stops.getAll()
      .then(setStops)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  return { stops, loading, error }
}