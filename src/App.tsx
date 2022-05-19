import mapboxgl, { LngLatLike } from 'mapbox-gl'
import { useEffect, useRef, useState } from 'react';
import { Sidebar } from './components/Sidebar';
import * as turf from '@turf/turf'

import './styles/index.scss';

export function App() {
  mapboxgl.accessToken = 'pk.eyJ1IjoibWF0aGVsaG8iLCJhIjoiY2wzNXY5eDBrMDlmbDNpcGxnZ3A5NWF1ZyJ9._2VpiZBKbWt9yUL_tKW9zA';

  const mapContainer = useRef<any>(null);
  const map = useRef<any>(null);
  const [lng, setLng] = useState(-46.3);
  const [lat, setLat] = useState(-23.95);
  const [zoom, setZoom] = useState(13);
  const [rotas, setRotas] = useState<any>([]);

  useEffect(() => {
    fetch('./frontend_data_gps.json')
      .then(response => response.json())
      .then(data => setRotas(data['courses'][0]['gps']))
  }, [])

  //console.log(rotas);

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

  useEffect(() => {
    if (!map.current) return;

    const marker = new mapboxgl.Marker()
    .setLngLat([-46.28054, -23.963214])
    
    const pontos: LngLatLike[] = [
      [-46.280544, -23.96325],
      [-46.280536, -23.96319],
      [-46.280566, -23.963218],
      [-46.278824, -23.962782],
      [-46.276578, -23.962299],
      [-46.276151, -23.962701],
      [-46.273192, -23.96197],
      [-46.273007, -23.962278],
      [-46.271715, -23.967683],
      [-46.272499, -23.96945],
      [-46.272075, -23.969783],
      [-46.26827, -23.969396],
      [-46.26833, -23.969987],
      [-46.268985, -23.970339],
      [-46.269761, -23.970108],
      [-46.275067, -23.956029],
      [-46.279812, -23.942894],
      [-46.284281, -23.9299],
      [-46.288398, -23.916852],
      [-46.288417, -23.91664],
      [-46.287455, -23.914834],
      [-46.28177, -23.913184],
      [-46.281638, -23.91327],
      [-46.281013, -23.914424],
      [-46.280867, -23.91432],
      [-46.278857, -23.91349],
      [-46.278849, -23.9135],
      [-46.278848, -23.913497],
      [-46.278836, -23.913488],
      [-46.278843, -23.913478],
      [-46.278582, -23.913452],
      [-46.278654, -23.913488],
      [-46.278691, -23.913492],
      [-46.278697, -23.913491],
      [-46.27867, -23.913502],
      [-46.278706, -23.913457],
      [-46.278714, -23.913509],
      [-46.278682, -23.913505],
      [-46.278645, -23.913515],
      [-46.278662, -23.913506],
      [-46.278711, -23.913525],
      [-46.278736, -23.913536]
    ]

    // uma linha pelas coordenadas
    const route = {
      'type': 'FeatureCollection',
      'features': [
        {
          'type': 'Feature',
          'geometry': {
            'type': 'LineString',
            'coordinates': pontos
          }
        }
      ]
    };

    // um único ponto que será animado pela rota. coordenadas começam na origem
    const point = {
      'type': 'FeatureCollection',
      'features': [
        {
          'type': 'Feature',
          'properties': {},
          'geometry': {
            'type': 'Point',
            'coordinates': [-46.28054, -23.963214]
          }
        }
      ]
    };

    // distância entre o começo e o fim da rota
    const lineDistance = turf.length(route.features[0]);

    const arc = [];

    // steps determinam a velocidade da animação. mais steps = mais lenta
    const steps = 500;

    // desenha um arco entre a origem e o destino
    for (let i = 0; i < lineDistance; i += lineDistance / steps) {
      const segment = turf.along(route.features[0], i);
      arc.push(segment.geometry.coordinates);
    }

    // atualiza a rota com as coordenadas calculadas do arco
    route.features[0].geometry.coordinates = arc;

    // incrementa o valor da medida do ponto
    let counter = 0;

    map.current.on('load', () => {
      // adiciona uma source e layer com o point que vai ser animado
      map.current.addSource('route', {
        'type': 'geojson',
        'data': route
      });

      map.current.addSource('point', {
        'type': 'geojson',
        'data': point
      })

      map.current.addLayer({
        'id': 'route',
        'source': 'route',
        'type': 'line',
        'paint': {
          'line-width': 2,
          'line-color': '#007cbf'
        }
      });

      map.current.addLayer({
        'id': 'point',
        'source': 'point',
        'type': 'symbol',
        'layout': {
          'icon-image': 'airport-15',
          'icon-rotate': ['get', 'bearing'],
          'icon-rotation-alignment': 'map',
          'icon-allow-overlap': true,
          'icon-ignore-placement': true
        }
      });

      function animate() {
        const start = route.features[0].geometry.coordinates[counter >= steps ? counter - 1 : counter];
        const end = route.features[0].geometry.coordinates[counter >= steps ? counter : counter + 1];

        if (!start || !end) return;

        point.features[0].geometry.coordinates = route.features[0].geometry.coordinates[counter];

        point.features[0].properties.bearing = turf.bearing(
          turf.point(start),
          turf.point(end)
        );

        map.current.getSource('point').setData(point);

        if (counter < steps) {
          requestAnimationFrame(animate);
        }

        counter = counter + 1;
      }

      document.getElementById('replay').addEventListener('click', () => {
        // Set the coordinates of the original point back to origin
        point.features[0].geometry.coordinates = [-46.28054, -23.963214];
         
        // Update the source layer
        map.current.getSource('point').setData(point);
         
        // Reset the counter
        counter = 0;
         
        // Restart the animation
        animate(counter);
        });
         
        // Start the animation
        animate(counter);
    })

    function animateMarker(timestamp: number) {
      /*let position = Math.floor(timestamp / 1000) % pontos.length;
      marker.setLngLat(pontos[position]);
      marker.addTo(map.current);
      requestAnimationFrame(animateMarker);*/
    }

    
  });
    

  return (
    <div>
      <Sidebar longitude={lng} latitude={lat} zoom={zoom} />

      <div ref={mapContainer} className='map-container' />

      <div className="overlay">
        <button id="replay">Replay</button>
      </div>
    </div>
  );
}