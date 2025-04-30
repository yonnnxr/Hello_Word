var map = L.map('map').setView([-20.4799, -55.5368], 15);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap',
    maxZoom: 22
}).addTo(map);

let pontosLayer, redesLayer;

let markers = L.markerClusterGroup({
    iconCreateFunction: function (cluster) {
        let count = cluster.getChildCount();
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

        markers.addLayer(pontosLayer);
        map.addLayer(markers);
    })
    .catch(err => console.error("Erro ao carregar pontos:", err));

fetch('https://api-geo-ymve.onrender.com/redes_agua')
    .then(res => res.json())
    .then(data => {
        redesLayer = L.geoJSON(data, {
            style: { color: 'blue', weight: 3 },
            onEachFeature: (feature, layer) => {
                let popup = '';
                for (const key in feature.properties) {
                    popup += `<strong>${key}</strong>: ${feature.properties[key]}<br>`;
                }
                layer.bindPopup(popup);
            }
        });
        map.addLayer(redesLayer);
    })
    .catch(err => console.error("Erro ao carregar redes de água:", err));

document.getElementById('togglePontos').addEventListener('change', function () {
    if (this.checked) {
        map.addLayer(markers);
    } else {
        map.removeLayer(markers);
    }
});

document.getElementById('toggleRedes').addEventListener('change', function () {
    if (this.checked) {
        map.addLayer(redesLayer);
    } else {
        map.removeLayer(redesLayer);
    }
});
