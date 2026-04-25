const API_KEY = import.meta.env.VITE_ORS_API_KEY

export async function getRouteGeometry(coords: [number, number][]): Promise<[number, number][]> {
  const body = {
    coordinates: coords.map(([lat, lng]) => [lng, lat]) // ORS usa [lng, lat]
  }

  const res = await fetch('https://api.openrouteservice.org/v2/directions/driving-car/geojson', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': API_KEY
    },
    body: JSON.stringify(body)
  })

  if (!res.ok) throw new Error(`ORS error: ${res.status}`)

  const data = await res.json()
  const geometry: [number, number][] = data.features[0].geometry.coordinates.map(
    ([lng, lat]: [number, number]) => [lat, lng] // convertimos de vuelta a [lat, lng]
  )
  return geometry
}