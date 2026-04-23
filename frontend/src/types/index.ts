export interface Vehicle {
  id: string
  type: 'bus' | 'bike' | 'scooter' | 'car'
  status: string
  latitude: number
  longitude: number
  batteryPct: number | null
}

export interface Stop {
  id: string
  name: string
  latitude: number
  longitude: number
}

export interface RouteStop {
  stopId: string
  order: number
}

export interface Route {
  id: string
  name: string
  stops: RouteStop[]
}