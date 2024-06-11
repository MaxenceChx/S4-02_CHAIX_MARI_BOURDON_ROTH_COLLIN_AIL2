import { high_veloStationIcon, medium_veloStationIcon, low_veloStationIcon, restaurantIcon, busStopIcon } from './icons.js';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabaseUrl = 'https://ichugcwxitnaaevoydlv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImljaHVnY3d4aXRuYWFldm95ZGx2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTc2NzYwNDQsImV4cCI6MjAzMzI1MjA0NH0.yzdFwMIbnIF61hXD-smfyGj5sk5NjFmTtTKBbD6yK24';
const supabase = createClient(supabaseUrl, supabaseKey);

var map;
var mtLayer;

const key = 'OA43qAVRL040lPW78C3p';

const gbfs = 'https://transport.data.gouv.fr/gbfs/nancy/gbfs.json';
var system_information_url;
var station_information_url;
var station_status_url;
var stations_status;

var is_apple_device;

initMap();

//getBusStops();

async function initMap() {
    const nancy = await fetch('https://api-adresse.data.gouv.fr/search/?q=nancy&type=municipality&postcode=54000&limit=1').then(response => response.json());
    var coordinates = nancy.features[0].geometry.coordinates.reverse();
    
    map = L.map('map').setView(coordinates, 13);

    mtLayer = L.maptilerLayer({
        apiKey: key,
        style: "streets-v2",
    }).addTo(map);

    is_apple_device = isAppleDevice();

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
                <p class="station-address">${station.address}</p>
                <p class="total-spaces">Total des places : ${station.capacity}</p>
                <p class="station-info">Nombre de vélos disponibles : <span class="bikes-available ${bikesClass}">${station_status.num_bikes_available}</span></p>
                <p class="station-info">Nombre de places disponibles : <span class="docks-available ${docksClass}">${station_status.num_docks_available}</span></p>
                <p class="last-update">Dernière actualisation : ${lastUpdate.toLocaleString('fr-FR')}</p>
                
                <a href="http://maps.apple.com/?daddr=${station.lat},${station.lon}&dirflg=w" class="directions-button" target="_blank">
                    <img class="directions-icon" src="img/${is_apple_device ? 'apple_maps.png' : 'google_maps.png'}" alt="Itinéraire" />
                </a>
            </div>`
        );

        L.marker([station.lat, station.lon], {icon: markerIcon}).addTo(map).bindPopup(popup);
    }
    return;
}


async function getStationStatus(station_id) {
    return stations_status.data.stations.find(station => station.station_id === station_id);
}

function isAppleDevice() {
    return /iPhone|iPad|iPod|Macintosh/.test(navigator.userAgent);
}

async function getBusStops() {
    
    let { data: stops, error } = await supabase
    .from('stops')
    .select('*');

    for (var stop of stops) {
        var popup = L.popup().setContent(
            `<div class="station-popup">
                <h3 class="station-name">${stop.stop_name}</h3>
                <a href="http://maps.apple.com/?daddr=${stop.stop_lat},${stop.stop_lon}&dirflg=w" class="directions-button" target="_blank">
                    <img class="directions-icon" src="img/${is_apple_device ? 'apple_maps.png' : 'google_maps.png'}" alt="Itinéraire" />
                </a>
            </div>`
        );

        L.marker([stop.stop_lat, stop.stop_lon], {icon: busStopIcon}).addTo(map).bindPopup(popup);
    }
}