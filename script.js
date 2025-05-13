function mercatorToLatLng(x, y) {
  var lon = x / 20037508.34 * 180;
  var lat = y / 20037508.34 * 180;
  lat = 180 / Math.PI * (2 * Math.atan(Math.exp(lat * Math.PI / 180)) - Math.PI / 2);
  return [lat, lon];
}

var map = L.map('map').setView([-22.2307, -54.8206], 17);

L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
  attribution: '&copy; <a href="https://carto.com/">CartoDB',
  maxZoom: 20
}).addTo(map);

let pontosLayer;

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

fetch('https://api-geo-ymve.onrender.com/dados')
  .then(res => res.json())
  .then(data => {
    // Corrigir todas as coordenadas do GeoJSON para EPSG:4326
    data.features.forEach(feature => {
      if (feature.geometry.type === "Point") {
        const [x, y] = feature.geometry.coordinates;
        feature.geometry.coordinates = mercatorToLatLng(x, y);
      }
    });

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

document.getElementById('togglePontos').addEventListener('change', function () {
  this.checked ? map.addLayer(markers) : map.removeLayer(markers);
});
