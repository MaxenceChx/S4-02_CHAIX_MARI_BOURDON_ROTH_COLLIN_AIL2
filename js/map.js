import { high_veloStationIcon, medium_veloStationIcon, low_veloStationIcon } from './icons.js';

var map;
var mtLayer;

const key = 'OA43qAVRL040lPW78C3p';

const gbfs = 'https://transport.data.gouv.fr/gbfs/nancy/gbfs.json';
var system_information_url;
var station_information_url;
var station_status_url;
var stations_status;

initMap();

async function initMap() {
    const nancy = await fetch('https://api-adresse.data.gouv.fr/search/?q=nancy&type=municipality&postcode=54000&limit=1').then(response => response.json());
    var coordinates = nancy.features[0].geometry.coordinates.reverse();
    
    map = L.map('map').setView(coordinates, 14);

    mtLayer = L.maptilerLayer({
        apiKey: key,
        style: "streets-v2",
    }).addTo(map);

    initNancyUrl();
    return;
}

async function initNancyUrl() {
    const nancy = await fetch(gbfs).then(response => response.json());
    system_information_url = nancy.data.fr.feeds.find(feed => feed.name === 'system_information').url;
    station_information_url = nancy.data.fr.feeds.find(feed => feed.name === 'station_information').url;
    station_status_url = nancy.data.fr.feeds.find(feed => feed.name === 'station_status').url;

    stations_status = await fetch(station_status_url).then(response => response.json());

    getStations();
    return;
}

async function getStations() {
    var stations = await fetch(station_information_url).then(response => response.json());

    for (var station of stations.data.stations) {
        var station_status = await getStationStatus(station.station_id);
        var lastUpdate = new Date(station_status.last_reported * 1000);

        // Calculer les pourcentages
        var bikesPercentage = (station_status.num_bikes_available / station.capacity) * 100;
        var docksPercentage = (station_status.num_docks_available / station.capacity) * 100;

        // Définir les classes en fonction des pourcentages
        var bikesClass = bikesPercentage > 50 ? 'high' : (bikesPercentage > 25 ? 'medium' : 'low');
        var docksClass = docksPercentage > 50 ? 'high' : (docksPercentage > 25 ? 'medium' : 'low');

        // Choisir l'icône appropriée
        var markerIcon = bikesPercentage > 50 ? high_veloStationIcon : (bikesPercentage > 25 ? medium_veloStationIcon : low_veloStationIcon);

        var popup = L.popup().setContent(
            `<div class="station-popup">
                <h3 class="station-name">${station.name}</h3>
                <p class="total-spaces">Total des places : ${station.capacity}</p>
                <p class="station-info">Nombre de vélos disponibles : <span class="bikes-available ${bikesClass}">${station_status.num_bikes_available}</span></p>
                <p class="station-info">Nombre de places disponibles : <span class="docks-available ${docksClass}">${station_status.num_docks_available}</span></p>
                <p class="last-update">Dernière actualisation : ${lastUpdate.toLocaleString('fr-FR')}</p>
            </div>`
        );

        L.marker([station.lat, station.lon], {icon: markerIcon}).addTo(map).bindPopup(popup);
    }
    return;
}


async function getStationStatus(station_id) {
    return stations_status.data.stations.find(station => station.station_id === station_id);
}