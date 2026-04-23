import type { Vehicle, Stop, Route } from '../types'

const BASE_URL = '/api'

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const token = sessionStorage.getItem('token')
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers
    }
  })
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)
  return res.json()
}

export const api = {
  vehicles: {
    getAll: (page = 1, size = 20) =>
      request<Vehicle[]>(`/vehicles?page=${page}&size=${size}`),
    getById: (id: string) =>
      request<Vehicle>(`/vehicles/${id}`)
  },
  stops: {
    getAll: (page = 1, size = 20) =>
      request<Stop[]>(`/stops?page=${page}&size=${size}`),
    getById: (id: string) =>
      request<Stop>(`/stops/${id}`)
  },
  routes: {
    getAll: (page = 1, size = 20) =>
      request<Route[]>(`/routes?page=${page}&size=${size}`),
    getById: (id: string) =>
      request<Route>(`/routes/${id}`)
  }
}