import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { useVehicles } from '../hooks/useVehicles'
import { useStops } from '../hooks/useStops'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

const vehicleIcon = (type: string) => L.divIcon({
  className: '',
  html: `<div style="
    width:32px;height:32px;border-radius:50%;
    background:${type === 'bus' ? '#3b82f6' : type === 'bike' ? '#34d399' : '#f59e0b'};
    border:2px solid white;
    display:flex;align-items:center;justify-content:center;
    font-size:14px;box-shadow:0 2px 8px rgba(0,0,0,0.3)
  ">${type === 'bus' ? '🚌' : type === 'bike' ? '🚲' : type === 'scooter' ? '🛴' : '🚗'}</div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 16]
})

const stopIcon = L.divIcon({
  className: '',
  html: `<div style="
    width:12px;height:12px;border-radius:50%;
    background:#f0fdf4;border:2px solid #34d399;
    box-shadow:0 0 6px rgba(52,211,153,0.5)
  "></div>`,
  iconSize: [12, 12],
  iconAnchor: [6, 6]
})

export default function MapPage() {
  const navigate = useNavigate()
  const { vehicles, loading: loadingV } = useVehicles()
  const { stops, loading: loadingS } = useStops()

  useEffect(() => {
    const token = sessionStorage.getItem('token')
    if (!token) navigate('/')
  }, [navigate])

  return (
    <div style={{ position: 'relative', height: '100vh', width: '100%', background: '#0a0f0d' }}>

      {/* Header */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, zIndex: 1000,
        background: 'rgba(10,15,13,0.85)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(52,211,153,0.15)',
        padding: '12px 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        fontFamily: "'DM Sans', sans-serif"
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
            <circle cx="16" cy="16" r="15" stroke="#34d399" strokeWidth="1.5"/>
            <path d="M10 20 Q16 8 22 20" stroke="#34d399" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
            <circle cx="16" cy="16" r="2" fill="#34d399"/>
          </svg>
          <span style={{ color: '#f0fdf4', fontSize: 16, fontWeight: 600, letterSpacing: '-0.3px' }}>
            EcoCity<span style={{ color: '#34d399' }}>.</span>
          </span>
        </div>

        <div style={{ display: 'flex', gap: 24 }}>
          {[
            { label: 'Vehículos', value: vehicles.length, color: '#34d399' },
            { label: 'Paradas', value: stops.length, color: '#3b82f6' },
          ].map(s => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{ color: s.color, fontSize: 18, fontWeight: 700, lineHeight: 1 }}>{s.value}</div>
              <div style={{ color: '#6b7280', fontSize: 11, marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>

        <button
          onClick={() => { sessionStorage.removeItem('token'); window.location.href = '/' }}
          style={{
            background: 'transparent', border: '1px solid #374151',
            color: '#6b7280', padding: '6px 14px', borderRadius: 6,
            fontSize: 13, cursor: 'pointer', fontFamily: 'inherit'
          }}
        >
          Salir
        </button>
      </div>

      {(loadingV || loadingS) && (
        <div style={{
          position: 'absolute', inset: 0, zIndex: 999,
          background: '#0a0f0d', display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          fontFamily: "'DM Sans', sans-serif", color: '#34d399', fontSize: 16
        }}>
          Cargando mapa...
        </div>
      )}

      <MapContainer
        center={[28.1, -15.4]}
        zoom={12}
        style={{ height: '100vh', width: '100%' }}
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution="© OpenStreetMap © CARTO"
        />
        {vehicles.map(v => (
          <Marker key={v.id} position={[v.latitude, v.longitude]} icon={vehicleIcon(v.type)}>
            <Popup>
              <strong>{v.type}</strong><br />
              Estado: {v.status}<br />
              {v.batteryPct !== null && `Batería: ${v.batteryPct}%`}
            </Popup>
          </Marker>
        ))}
        {stops.map(s => (
          <Marker key={s.id} position={[s.latitude, s.longitude]} icon={stopIcon}>
            <Popup>{s.name}</Popup>
          </Marker>
        ))}
      </MapContainer>

      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');`}</style>
    </div>
  )
}