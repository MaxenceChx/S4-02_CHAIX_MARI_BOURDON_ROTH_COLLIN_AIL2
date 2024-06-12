// Importation des modules nécessaires
import { low_veloStationIcon, medium_veloStationIcon, high_veloStationIcon } from '../utilities/icons.js';
import { isAppleDevice } from '../utilities/utils.js';
import { stationsLayer, markers_stations } from '../map.js';

const gbfs = 'https://transport.data.gouv.fr/gbfs/nancy/gbfs.json';
var system_information_url;
var station_information_url;
var station_status_url;
var stations_status;

// Fonction pour obtenir les stations de vélo
async function getVeloStations() {
    await initNancyUrl();
}

// Fonction pour initialiser les URL de Nancy
async function initNancyUrl() {
    const nancy = await fetch(gbfs).then(response => response.json());
    system_information_url = nancy.data.fr.feeds.find(feed => feed.name === 'system_information').url;
    station_information_url = nancy.data.fr.feeds.find(feed => feed.name === 'station_information').url;
    station_status_url = nancy.data.fr.feeds.find(feed => feed.name === 'station_status').url;

    stations_status = await fetch(station_status_url).then(response => response.json());

    await getStations();
    return;
}

// Fonction pour obtenir les informations des stations
async function getStations() {
    var stations = await fetch(station_information_url).then(response => response.json());

    for (var station of stations.data.stations) {
        await processStation(station);
    }
}

// Fonction pour traiter chaque station
async function processStation(station) {
    var station_status = await getStationStatus(station.station_id);
    var lastUpdate = new Date(station_status.last_reported * 1000);

    var bikesPercentage = (station_status.num_bikes_available / station.capacity) * 100;
    var docksPercentage = (station_status.num_docks_available / station.capacity) * 100;

    var markerIcon = bikesPercentage > 50 ? high_veloStationIcon : (bikesPercentage > 25 ? medium_veloStationIcon : low_veloStationIcon);

    var popupContent = generatePopupContent(station, station_status, lastUpdate);

    var marker = createMarker(station, markerIcon, popupContent);

    markers_stations.push(marker);
    stationsLayer.addLayer(marker);
}

// Fonction pour générer le contenu de la popup
function generatePopupContent(station, station_status, lastUpdate) {
    return `
        <div class="popup">
            <h3 class="name">${station.name}</h3>
            <p class="address">${station.address}</p>
            <p class="total-spaces">Total des places : ${station.capacity}</p>
            <p class="info">Nombre de vélos disponibles : <span class="bikes-available ${getAvailabilityClass(station_status.num_bikes_available, station.capacity)}">${station_status.num_bikes_available}</span></p>
            <p class="info">Nombre de places disponibles : <span class="docks-available ${getAvailabilityClass(station_status.num_docks_available, station.capacity)}">${station_status.num_docks_available}</span></p>
            <p class="last-update">Dernière actualisation : ${lastUpdate.toLocaleString('fr-FR')}</p>
            
            <a href="http://maps.apple.com/?daddr=${station.lat},${station.lon}&dirflg=w" class="directions-button" target="_blank">
                <img class="directions-icon" src="img/${isAppleDevice ? 'apple_maps.png' : 'google_maps.png'}" alt="Itinéraire" />
            </a>
        </div>`;
}

// Fonction pour créer un marqueur
function createMarker(station, markerIcon, popupContent) {
    var popup = L.popup().setContent(popupContent);
    return L.marker([station.lat, station.lon], { icon: markerIcon }).bindPopup(popup);
}

// Fonction pour obtenir le statut de la station
async function getStationStatus(station_id) {
    return stations_status.data.stations.find(station => station.station_id === station_id);
}

// Fonction pour obtenir la classe d'accessibilité
function getAvailabilityClass(available, total) {
    var percentage = (available / total) * 100;
    return percentage > 50 ? 'high' : (percentage > 25 ? 'medium' : 'low');
}

// Exportation des fonctions nécessaires
export { getVeloStations };