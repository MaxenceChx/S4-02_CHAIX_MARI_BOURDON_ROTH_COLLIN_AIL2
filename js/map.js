var map;
var tiles;

const veloStationIcon = L.icon({
    iconUrl: 'img/ping_velo.png',
    iconSize: [32.375, 35],
    iconAnchor: [32.375, 35],
    popupAnchor: [-16.1875, -35],
});

const gbfs = 'https://transport.data.gouv.fr/gbfs/nancy/gbfs.json';
var system_information_url;
var station_information_url;
var station_status_url;

initMap();

async function initMap() {
    const nancy = await fetch('https://api-adresse.data.gouv.fr/search/?q=nancy&type=municipality&postcode=54000&limit=1').then(response => response.json());
    var coordinates = nancy.features[0].geometry.coordinates.reverse();
    
    map = L.map('map').setView(coordinates, 14);

    tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    initNancyUrl();
}

async function initNancyUrl() {
    const nancy = await fetch(gbfs).then(response => response.json());
    system_information_url = nancy.data.fr.feeds.find(feed => feed.name === 'system_information').url;
    station_information_url = nancy.data.fr.feeds.find(feed => feed.name === 'station_information').url;
    station_status_url = nancy.data.fr.feeds.find(feed => feed.name === 'station_status').url;

    getStations();
}

async function getStations() {
    var stations = await fetch(station_information_url).then(response => response.json());

    for (station of stations.data.stations) {
        var station_status = await getStationStatus(station.station_id);

        var popup = L.popup().setContent(
            `<h3>${station.name}</h3>
            <p>Nombre de vélos disponibles : ${station_status.num_bikes_available}</p>
            <p>Nombre de places disponibles : ${station_status.num_docks_available}</p>`
        );

        L.marker([station.lat, station.lon], {icon: veloStationIcon}).addTo(map).bindPopup(popup);
    }
}


async function getStationStatus(station_id) {
    const station_status = await fetch(station_status_url).then(response => response.json());
    return station_status.data.stations.find(station => station.station_id === station_id);
}