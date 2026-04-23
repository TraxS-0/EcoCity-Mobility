import { useEffect, useState } from 'react'
import { api } from '../services/api'
import type { Vehicle } from '../types'

export function useVehicles() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    api.vehicles.getAll()
      .then(setVehicles)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  return { vehicles, loading, error }
}