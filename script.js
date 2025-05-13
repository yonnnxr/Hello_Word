
var map = L.map('map', {
  zoomControl: false
}).setView([-22.2049, -54.8116], 12);

var osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap',
  maxZoom: 19
}).addTo(map);


var satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
  attribution: '© Esri & OpenStreetMap contributors',
  maxZoom: 18
});

var baseMaps = {
  "Mapa": osmLayer,
  "Satélite": satelliteLayer
};

L.control.layers(baseMaps).addTo(map);

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

document.getElementById('loadingMessage').style.display = 'block';
fetch('https://api-geo-ymve.onrender.com/dados')
  .then(res => res.json())
  .then(data => {
    const pontosLayer = L.geoJSON(data, {
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

    const count = data.features.length;
    document.querySelector('#quantitativo strong').textContent = count;

    document.getElementById('loadingMessage').style.display = 'none';
  })
  .catch(err => {
    alert("Erro ao carregar dados, tente novamente.");
    document.getElementById('loadingMessage').style.display = 'none';
    console.error("Erro ao carregar pontos:", err);
  });

document.getElementById('togglePontos').addEventListener('change', function () {
  this.checked ? map.addLayer(markers) : map.removeLayer(markers);
});
const menuToggle = document.getElementById('menu-toggle');
const sidebar = document.getElementById('sidebar');
const mapDiv = document.getElementById('map');

menuToggle.addEventListener('click', () => {
  sidebar.classList.toggle('active');
  mapDiv.classList.toggle('sidebar-open');
});
