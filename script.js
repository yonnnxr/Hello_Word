const map = L.map('map').setView([-22.205, -54.811], 13);

L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
  maxZoom: 20
}).addTo(map);
const pontosCluster = L.markerClusterGroup();

fetch('https://api-geo-ymve.onrender.com/dados')
  .then(res => res.json())
  .then(data => {
    const pontos = L.geoJSON(data, {
      onEachFeature: function (feature, layer) {
        const props = feature.properties;
        let popup = `<strong>${props.ocorr}</strong><br>`;
        popup += `Logradouro: ${props.logradouro || '-'}<br>`;
        popup += `Número: ${props.num || '-'}<br>`;
        popup += `Bairro: ${props.bairro || '-'}<br>`;
        popup += `Matrícula: ${props.matricula || '-'}<br>`;
        layer.bindPopup(popup);
      },
      pointToLayer: function (feature, latlng) {
        return L.marker(latlng);
      }
    });

    pontosCluster.addLayer(pontos);
    map.addLayer(pontosCluster);
    const checkbox = document.getElementById('togglePontos');
    checkbox.addEventListener('change', function () {
      if (checkbox.checked) {
        map.addLayer(pontosCluster);
      } else {
        map.removeLayer(pontosCluster);
      }
    });
  })
  .catch(err => {
    console.error('Erro ao carregar dados GeoJSON:', err);
  });
