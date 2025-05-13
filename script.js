const map = L.map('map').setView([-22.2307, -54.8206], 17);

L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
  attribution: '&copy; <a href="https://carto.com/">CartoDB</a>',
  maxZoom: 20
}).addTo(map);

// Grupo de marcadores com cluster
const markers = L.markerClusterGroup({
  iconCreateFunction: function (cluster) {
    const count = cluster.getChildCount();
    let size = 'small';
    if (count >= 100) size = 'large';
    else if (count >= 10) size = 'medium';

    return new L.DivIcon({
      html: `<div><span>${count}</span></div>`,
      className: 'marker-cluster marker-cluster-' + size,
      iconSize: new L.Point(40, 40)
    });
  }
});

let pontosLayer;

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

    markers.addLayer(pontosLayer);
    map.addLayer(markers);
  })
  .catch(err => console.error("Erro ao carregar pontos:", err));

// Controle de visibilidade
document.getElementById('togglePontos').addEventListener('change', function () {
  this.checked ? map.addLayer(markers) : map.removeLayer(markers);
});
