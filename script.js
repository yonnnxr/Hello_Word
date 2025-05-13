// Inicializa o mapa
var map = L.map('map').setView([-22.2049274382639, -54.8116765895665], 12);

// Adiciona o mapa base (OpenStreetMap)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap',
  maxZoom: 19
}).addTo(map);

// Adiciona o mapa de satélite
var satelliteLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap',
  maxZoom: 19
}).addTo(map);

// Adiciona um grupo de clusters de marcadores
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

// Exibe o indicador de carregamento
document.getElementById('loadingMessage').style.display = 'block';
document.getElementById('loadingSpinner').style.display = 'block';

// Carregar os dados da API
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

    // Atualiza o quantitativo de imóveis
    const count = data.features.length;
    document.querySelector('#quantitativo strong').textContent = count;

    // Oculta o indicador de carregamento
    document.getElementById('loadingMessage').style.display = 'none';
    document.getElementById('loadingSpinner').style.display = 'none';
  })
  .catch(err => {
    alert("Erro ao carregar dados, tente novamente.");
    document.getElementById('loadingMessage').style.display = 'none';
    document.getElementById('loadingSpinner').style.display = 'none';
    console.error("Erro ao carregar pontos:", err);
  });

// Alternar camadas
document.getElementById('togglePontos').addEventListener('change', function () {
  this.checked ? map.addLayer(markers) : map.removeLayer(markers);
});
