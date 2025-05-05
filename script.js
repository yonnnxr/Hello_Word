const API_URL = "https://api-geo-ymve.onrender.com";

const map = L.map('map').setView([-20.4799, -55.5368], 15);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap',
  maxZoom: 22
}).addTo(map);

let pontosCluster = L.markerClusterGroup();
let pontosLayer, redesLayer, quadrasLayer;

// Pontos
fetch('https://api-geo-ymve.onrender.com/dados')
  .then(res => res.json())
  .then(data => {
    pontosLayer = L.geoJSON(data, {
      pointToLayer: (feature, latlng) => L.marker(latlng),
      onEachFeature: (feature, layer) => {
        let popup = '';
        for (const key in feature.properties) {
          popup += `<strong>${key}</strong>: ${feature.properties[key]}<br>`;
        }
        layer.bindPopup(popup);
      }
    });
    pontosCluster.addLayer(pontosLayer);
    map.addLayer(pontosCluster);
    pontosLayer._cluster = pontosCluster;
  });

// Redes de Água
fetch('https://api-geo-ymve.onrender.com/redes_agua')
  .then(res => res.json())
  .then(data => {
    redesLayer = L.geoJSON(data, {
      style: { color: 'blue', weight: 2 },
      onEachFeature: (feature, layer) => {
        let popup = '';
        for (const key in feature.properties) {
          popup += `<strong>${key}</strong>: ${feature.properties[key]}<br>`;
        }
        layer.bindPopup(popup);
      }
    });
    map.addLayer(redesLayer);
  });

// Quadras
fetch('https://api-geo-ymve.onrender.com/quadras')
  .then(res => res.json())
  .then(data => {
    quadrasLayer = L.geoJSON(data, {
      style: { color: 'green', fillOpacity: 0.3, weight: 1 },
      onEachFeature: (feature, layer) => {
        let popup = '';
        for (const key in feature.properties) {
          popup += `<strong>${key}</strong>: ${feature.properties[key]}<br>`;
        }
        layer.bindPopup(popup);
      }
    });
    map.addLayer(quadrasLayer);
  });

// Controle de camadas
document.getElementById('togglePontos').addEventListener('change', function () {
  const cluster = pontosLayer?._cluster;
  if (cluster) {
    this.checked ? map.addLayer(cluster) : map.removeLayer(cluster);
  }
});

document.getElementById('toggleRedes').addEventListener('change', function () {
  if (redesLayer) {
    this.checked ? map.addLayer(redesLayer) : map.removeLayer(redesLayer);
  }
});

document.getElementById('toggleQuadras').addEventListener('change', function () {
  if (quadrasLayer) {
    this.checked ? map.addLayer(quadrasLayer) : map.removeLayer(quadrasLayer);
  }
});
