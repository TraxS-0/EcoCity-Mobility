import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet'
import { useVehicles } from '../hooks/useVehicles'
import { useStops } from '../hooks/useStops'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useRoutes } from '../hooks/useRoutes'
import { getRouteGeometry } from '../services/routing'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

const vehicleIcon = (type: string) => L.divIcon({
  className: '',
  html: `<div style="
    width:32px;height:32px;border-radius:50%;
    background:${type === 'bus' ? '#3b82f6' : type === 'bike' ? '#34d399' : type === 'scooter' ? '#f59e0b' : '#a78bfa'};
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
  const { routes } = useRoutes()
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null)
  const [routeGeometry, setRouteGeometry] = useState<[number, number][]>([])

  const [filters, setFilters] = useState({
    bus: true, bike: true, scooter: true, car: true,
    active: true, inactive: true,
    stops: true
  })

  const [sidebarOpen, setSidebarOpen] = useState(true)

  useEffect(() => {
    const token = sessionStorage.getItem('token')
    if (!token) navigate('/')
  }, [navigate])

  useEffect(() => {
    if (!selectedRouteId) {
      setRouteGeometry([])
      return
    }
    const route = routes.find(r => r.id === selectedRouteId)
    if (!route) return

    const coords = route.stops
      .slice().sort((a, b) => a.order - b.order)
      .map(rs => stops.find(s => s.id === rs.stopId))
      .filter(Boolean)
      .map(s => [s!.latitude, s!.longitude] as [number, number])

    if (coords.length < 2) return

    getRouteGeometry(coords)
      .then(setRouteGeometry)
      .catch(console.error)
  }, [selectedRouteId, routes, stops])

  const filteredVehicles = vehicles.filter(v =>
    filters[v.type as keyof typeof filters] &&
    filters[v.status as keyof typeof filters]
  )

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
          <img src="/weblogo.png" style={{ width: 24, height: 24, objectFit: 'contain' }} />
          <span style={{ color: '#f0fdf4', fontSize: 16, fontWeight: 600, letterSpacing: '-0.3px' }}>
            EcoCity Mobility<span style={{ color: '#34d399' }}>.</span>
          </span>
        </div>

        <button
          onClick={() => { sessionStorage.removeItem('token'); window.location.href = '/' }}
          style={{
            background: 'transparent', border: '1px solid #374151',
            color: '#6b7280', padding: '6px 14px', borderRadius: 6,
            fontSize: 13, cursor: 'pointer', fontFamily: 'inherit'
          }}
        >
          Cerrar Sesión
        </button>
      </div>

      {/* Sidebar */}
      <div style={{
        position: 'absolute', top: 70, left: 12, zIndex: 1000,
        width: sidebarOpen ? 220 : 0,
        padding: sidebarOpen ? '16px' : 0,
        overflow: 'hidden',
        background: 'rgba(10,15,13,0.9)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(52,211,153,0.15)',
        borderRadius: 12,
        fontFamily: "'DM Sans', sans-serif",
        display: 'flex', flexDirection: 'column', gap: 24,
        opacity: sidebarOpen ? 1 : 0,
        transition: sidebarOpen
            ? 'width 0.3s ease, padding 0.3s ease, opacity 0.15s ease'
            : 'width 0.3s ease, padding 0.3s ease, opacity 0.3s ease 0.15s',
        }}>
        {/* Tipos */}
        <div>
          <p style={{ color: '#6b7280', fontSize: 11, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 12 }}>Tipo</p>
          {[
            { key: 'bus',     label: 'Bus',      emoji: '🚌', color: '#3b82f6' },
            { key: 'bike',    label: 'Bici',     emoji: '🚲', color: '#34d399' },
            { key: 'scooter', label: 'Patinete', emoji: '🛴', color: '#f59e0b' },
            { key: 'car',     label: 'Coche',    emoji: '🚗', color: '#a78bfa' },
          ].map(({ key, label, emoji, color }) => (
            <div
              key={key}
              onClick={() => setFilters(f => ({ ...f, [key]: !f[key as keyof typeof f] }))}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '8px 10px', borderRadius: 8, marginBottom: 4,
                cursor: 'pointer',
                background: filters[key as keyof typeof filters] ? `${color}18` : 'transparent',
                border: `1px solid ${filters[key as keyof typeof filters] ? color : 'transparent'}`,
                transition: 'all 0.2s'
              }}
            >
              <span style={{ fontSize: 16 }}>{emoji}</span>
              <span style={{ color: filters[key as keyof typeof filters] ? '#f0fdf4' : '#6b7280', fontSize: 14 }}>{label}</span>
            </div>
          ))}
        </div>

        {/* Estado */}
        <div>
          <p style={{ color: '#6b7280', fontSize: 11, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 12 }}>Estado</p>
          {[
            { key: 'active',   label: 'Activo',   color: '#34d399' },
            { key: 'inactive', label: 'Inactivo', color: '#ef4444' },
          ].map(({ key, label, color }) => (
            <div
              key={key}
              onClick={() => setFilters(f => ({ ...f, [key]: !f[key as keyof typeof f] }))}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '8px 10px', borderRadius: 8, marginBottom: 4,
                cursor: 'pointer',
                background: filters[key as keyof typeof filters] ? `${color}18` : 'transparent',
                border: `1px solid ${filters[key as keyof typeof filters] ? color : 'transparent'}`,
                transition: 'all 0.2s'
              }}
            >
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: color }} />
              <span style={{ color: filters[key as keyof typeof filters] ? '#f0fdf4' : '#6b7280', fontSize: 14 }}>{label}</span>
            </div>
          ))}
        </div>

        {/* Paradas */}
        <div>
          <p style={{ color: '#6b7280', fontSize: 11, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 12 }}>Capas</p>
          <div
            onClick={() => setFilters(f => ({ ...f, stops: !f.stops }))}
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '8px 10px', borderRadius: 8,
              cursor: 'pointer',
              background: filters.stops ? 'rgba(59,130,246,0.1)' : 'transparent',
              border: `1px solid ${filters.stops ? '#3b82f6' : 'transparent'}`,
              transition: 'all 0.2s'
            }}
          >
            <span style={{ fontSize: 16 }}>🚏</span>
            <span style={{ color: filters.stops ? '#f0fdf4' : '#6b7280', fontSize: 14 }}>Paradas</span>
          </div>
        </div>
        {/* Rutas */}
        <div>
        <p style={{ color: '#6b7280', fontSize: 11, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 12 }}>Rutas</p>
        {routes.map(r => (
            <div
            key={r.id}
            onClick={() => setSelectedRouteId(prev => prev === r.id ? null : r.id)}
            style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '8px 10px', borderRadius: 8, marginBottom: 4,
                cursor: 'pointer',
                background: selectedRouteId === r.id ? 'rgba(52,211,153,0.1)' : 'transparent',
                border: `1px solid ${selectedRouteId === r.id ? '#34d399' : 'transparent'}`,
                transition: 'all 0.2s'
            }}
            >
            <span style={{ fontSize: 16 }}>🗺️</span>
            <span style={{ color: selectedRouteId === r.id ? '#f0fdf4' : '#6b7280', fontSize: 14 }}>{r.name}</span>
            </div>
        ))}
        {routes.length === 0 && (
            <p style={{ color: '#374151', fontSize: 13 }}>Sin rutas</p>
        )}
        </div>
      </div>

      {/* Toggle sidebar */}
      <button
        onClick={() => setSidebarOpen(o => !o)}
        style={{
            position: 'absolute',
            top: 70,
            left: sidebarOpen ? 244 : 12,
            zIndex: 1001,
            background: 'rgba(10,15,13,0.9)',
            border: '1px solid rgba(52,211,153,0.3)',
            color: '#34d399',
            width: 28, height: 28,
            borderRadius: 6,
            cursor: 'pointer',
            fontSize: 14,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'left 0.3s ease',
            fontFamily: 'inherit'
        }}
        >
        {sidebarOpen ? '←' : '☰'}
        </button>

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
        center={[28.086704236575745, -16.72835535781988]}
        zoom={16}
        style={{ height: '100vh', width: '100%' }}
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution="© OpenStreetMap © CARTO"
        />
        {filteredVehicles.map(v => (
          <Marker key={v.id} position={[v.latitude, v.longitude]} icon={vehicleIcon(v.type)}>
            <Popup>
              <strong>{v.type}</strong><br />
              Estado: {v.status}<br />
              {v.batteryPct !== null && `Batería: ${v.batteryPct}%`}
            </Popup>
          </Marker>
        ))}
        {filters.stops && stops.map(s => (
          <Marker key={s.id} position={[s.latitude, s.longitude]} icon={stopIcon}>
            <Popup>{s.name}</Popup>
          </Marker>
        ))}
        {routeGeometry.length > 0 && (
          <Polyline positions={routeGeometry} color="#34d399" weight={3} opacity={0.8} />
        )}
      </MapContainer>

      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');`}</style>
    </div>
  )
}