import { useState, useRef, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { Zap, Maximize, Minimize } from 'lucide-react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix Leaflet's default marker icon URLs broken by Vite's asset bundling
L.Icon.Default.mergeOptions({
  iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const CENTER = [-13.2558, -43.4178] // Bom Jesus da Lapa, BA

const installations = [
  {
    id: 1, lat: -13.2558, lon: -43.4178, type: 'Comercial',
    title: 'Usina Hotel Imperial', size: '18.2 kWp',
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 2, lat: -13.2480, lon: -43.4050, type: 'Residencial',
    title: 'Instalação Residencial', size: '6.5 kWp',
    imageUrl: 'https://images.unsplash.com/photo-1509391366360-1200b7e44e26?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 3, lat: -13.2630, lon: -43.4320, type: 'Institucional',
    title: 'Escola Municipal', size: '22.0 kWp',
    imageUrl: 'https://images.unsplash.com/photo-1497440001374-f26997328c1b?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 4, lat: -13.2410, lon: -43.4250, type: 'Residencial',
    title: 'Instalação Residencial', size: '5.2 kWp',
    imageUrl: 'https://images.unsplash.com/photo-1559302504-64aae6ca6890?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 5, lat: -13.2700, lon: -43.4000, type: 'Comercial',
    title: 'Comércio Local — Supermercado', size: '33.0 kWp',
    imageUrl: 'https://images.unsplash.com/photo-1532601224476-15c79f2f7a51?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 6, lat: -13.2350, lon: -43.4500, type: 'Residencial',
    title: 'Instalação Residencial', size: '8.7 kWp',
    imageUrl: 'https://images.unsplash.com/photo-1576941330965-f6cf63d2f89a?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 7, lat: -13.2800, lon: -43.4400, type: 'Institucional',
    title: 'Posto de Saúde', size: '12.5 kWp',
    imageUrl: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 8, lat: -13.2200, lon: -43.3900, type: 'Industrial',
    title: 'Pequena Indústria', size: '55.0 kWp',
    imageUrl: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 9, lat: -22.271465, lon: -42.615865, type: 'Residencial',
    title: 'Instalação Residencial', size: '6.5 kWp',
    imageUrl: 'https://images.unsplash.com/photo-1497440001374-f26997328c1b?auto=format&fit=crop&w=400&q=80',
  },
]

const TYPE_COLOR = {
  Residencial:   '#ffc533',
  Comercial:     '#22c55e',
  Institucional: '#60a5fa',
  Industrial:    '#f97316',
}

function coloredIcon(type) {
  const color = TYPE_COLOR[type] || '#ffc533'
  const svg = encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="38" viewBox="0 0 28 38">
      <path d="M14 0C6.27 0 0 6.27 0 14c0 9.625 14 24 14 24S28 23.625 28 14C28 6.27 21.73 0 14 0z"
            fill="${color}" stroke="#fff" stroke-width="2"/>
      <circle cx="14" cy="14" r="5" fill="#fff"/>
    </svg>
  `)
  return new L.Icon({
    iconUrl:     `data:image/svg+xml,${svg}`,
    iconSize:    [28, 38],
    iconAnchor:  [14, 38],
    popupAnchor: [0, -42],
  })
}

export default function InstallationsMap() {
  const wrapperRef = useRef(null)
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    function onFsChange() {
      setIsFullscreen(!!document.fullscreenElement)
    }
    document.addEventListener('fullscreenchange', onFsChange)
    return () => document.removeEventListener('fullscreenchange', onFsChange)
  }, [])

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      wrapperRef.current?.requestFullscreen()
    } else {
      document.exitFullscreen()
    }
  }

  return (
    <div ref={wrapperRef} className="installations-map-wrap">
      <button
        className="map-fs-btn"
        onClick={toggleFullscreen}
        title={isFullscreen ? 'Sair da tela cheia' : 'Tela cheia'}
      >
        {isFullscreen ? <Minimize size={17} /> : <Maximize size={17} />}
      </button>

      <MapContainer
        center={CENTER}
        zoom={5}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {installations.map(inst => (
          <Marker
            key={inst.id}
            position={[inst.lat, inst.lon]}
            icon={coloredIcon(inst.type)}
          >
            <Popup maxWidth={232} minWidth={232} className="map-popup-leaflet">
              <div className="map-popup-card">
                <div className="map-popup-img-wrap">
                  <img src={inst.imageUrl} alt={inst.title} loading="lazy" />
                </div>
                <div className="map-popup-body">
                  <span
                    className="map-popup-tag"
                    style={{ background: TYPE_COLOR[inst.type] + '22', color: TYPE_COLOR[inst.type] }}
                  >
                    {inst.type}
                  </span>
                  <strong className="map-popup-title">{inst.title}</strong>
                  <span className="map-popup-size">
                    <Zap size={12} /> {inst.size}
                  </span>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}
