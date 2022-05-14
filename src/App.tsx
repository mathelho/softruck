import mapboxgl from 'mapbox-gl'
import { useEffect, useRef, useState } from 'react';
import './styles/index.scss';

export function App() {
  mapboxgl.accessToken = 'pk.eyJ1IjoibWF0aGVsaG8iLCJhIjoiY2wzNXY5eDBrMDlmbDNpcGxnZ3A5NWF1ZyJ9._2VpiZBKbWt9yUL_tKW9zA';

  const mapContainer = useRef<any>(null);
  const map = useRef<any>(null);
  const [lng, setLng] = useState(-46.3);
  const [lat, setLat] = useState(-23.95);
  const [zoom, setZoom] = useState(13);

  // inicializa o mapa
  useEffect(() => {
    if (map.current) return; // inicializa o mapa apenas uma vez

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [lng, lat],
      zoom: zoom
    });
  })

  // mais um useEffect para atualizar os estados declarados anteriormente.
  // são atualizados quando o usuário interage com o mapa
  useEffect(() => {
    if (!map.current) return; // só é possível mover o mapa se ele já estiver inicializado

    map.current.on('move', () => {
      setLng(map.current.getCenter().lng.toFixed(4));
      setLat(map.current.getCenter().lat.toFixed(4));
      setZoom(map.current.getZoom().toFixed(2));
    });
  })

  return (
    <div>
      <div className='sidebar'>
        Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
      </div>

      <div ref={mapContainer} className='map-container' />
    </div>
  );
}