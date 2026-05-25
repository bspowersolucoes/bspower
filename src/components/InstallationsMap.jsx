import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { Zap } from 'lucide-react'
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
  { id: 1,  lat: -13.2558, lon: -43.4178, title: 'Usina Hotel Imperial',            size: '18.2 kWp', type: 'Comercial'    },
  { id: 2,  lat: -13.2480, lon: -43.4050, title: 'Instalação Residencial',           size: '6.5 kWp',  type: 'Residencial'  },
  { id: 3,  lat: -13.2630, lon: -43.4320, title: 'Escola Municipal',                 size: '22.0 kWp', type: 'Institucional' },
  { id: 4,  lat: -13.2410, lon: -43.4250, title: 'Instalação Residencial',           size: '5.2 kWp',  type: 'Residencial'  },
  { id: 5,  lat: -13.2700, lon: -43.4000, title: 'Comércio Local — Supermercado',    size: '33.0 kWp', type: 'Comercial'    },
  { id: 6,  lat: -13.2350, lon: -43.4500, title: 'Instalação Residencial',           size: '8.7 kWp',  type: 'Residencial'  },
  { id: 7,  lat: -13.2800, lon: -43.4400, title: 'Posto de Saúde',                   size: '12.5 kWp', type: 'Institucional' },
  { id: 8,  lat: -13.2200, lon: -43.3900, title: 'Pequena Indústria',                size: '55.0 kWp', type: 'Industrial'   },
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
    popupAnchor: [0, -38],
  })
}

export default function InstallationsMap() {
  return (
    <div className="installations-map-wrap">
      <MapContainer
        center={CENTER}
        zoom={12}
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
            <Popup>
              <div className="map-popup">
                <span className="map-popup-tag" style={{ background: TYPE_COLOR[inst.type] + '22', color: TYPE_COLOR[inst.type] }}>
                  {inst.type}
                </span>
                <strong>{inst.title}</strong>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Zap size={12} /> {inst.size}</span>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}
