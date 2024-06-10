const map = L.map('map').setView([48.6893, 6.1790], 13);

const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

getStations();

// récupérer la liste des stations de vélos
async function getStations() {
    const nancy = await fetch('https://transport.data.gouv.fr/gbfs/nancy/gbfs.json')
        .then(response => response.json());

    const system_information_url = nancy.data.fr.feeds.find(feed => feed.name === 'system_information').url;
    const station_information_url = nancy.data.fr.feeds.find(feed => feed.name === 'station_information').url;
    const station_status_url = nancy.data.fr.feeds.find(feed => feed.name === 'station_status').url;

    var myIcon = L.icon({
        iconUrl: 'img/velo_station.png',
        iconSize: [35, 35],
        iconAnchor: [35, 35],
        popupAnchor: [-17.5, -35],
    });

    var stations = await fetch(station_information_url).then(response => response.json());

    for (station of stations.data.stations) {
        var station_status = await getStationStatus(station_status_url, station.station_id);

        var popup = L.popup().setContent(
            `<h3>${station.name}</h3>
            <p>Nombre de vélos disponibles : ${station_status.num_bikes_available}</p>
            <p>Nombre de places disponibles : ${station_status.num_docks_available}</p>`
        );

        L.marker([station.lat, station.lon], {icon: myIcon}).addTo(map).bindPopup(popup);
    }
}


async function getStationStatus(station_status_url, station_id) {
    const station_status = await fetch(station_status_url).then(response => response.json());
    return station_status.data.stations.find(station => station.station_id === station_id);
}