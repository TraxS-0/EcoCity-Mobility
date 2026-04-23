import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { useVehicles } from '../hooks/useVehicles'
import { useStops } from '../hooks/useStops'
import 'leaflet/dist/leaflet.css'

export default function MapPage() {
  const { vehicles, loading: loadingV } = useVehicles()
  const { stops, loading: loadingS } = useStops()

  if (loadingV || loadingS) return <p>Cargando...</p>

  return (
    <MapContainer center={[28.1, -15.4]} zoom={12} style={{ height: '100vh', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="© OpenStreetMap contributors"
      />
      {vehicles.map(v => (
        <Marker key={v.id} position={[v.latitude, v.longitude]}>
          <Popup>{v.type} — {v.status}</Popup>
        </Marker>
      ))}
      {stops.map(s => (
        <Marker key={s.id} position={[s.latitude, s.longitude]}>
          <Popup>{s.name}</Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}