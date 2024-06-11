// Importation des modules
import { getBusStops } from './busStopsModule.js';
import { getVeloStations } from './veloStationsModule.js';

var map;
var mtLayer;

const key = 'OA43qAVRL040lPW78C3p';

var markers_stations = [];
var markers_restaurants = [];
var markers_bus_stops = [];
var markers_accidents = [];

var stationsLayer = L.layerGroup(markers_stations);
var restaurantsLayer = L.layerGroup(markers_restaurants);
var busStopsLayer = L.layerGroup(markers_bus_stops);
var accidentsLayer = L.layerGroup(markers_accidents);

var overlayMaps = {
    "🚲 Stations de vélo": stationsLayer,
    "🍽️ Restaurants": restaurantsLayer,
    "🚏 Arrêts de bus": busStopsLayer,
    "🚗 Accidents": accidentsLayer,
};

initMap();

async function initMap() {
    const nancy = await fetch('https://api-adresse.data.gouv.fr/search/?q=nancy&type=municipality&postcode=54000&limit=1').then(response => response.json());
    var coordinates = nancy.features[0].geometry.coordinates.reverse();
    
    map = L.map('map').setView(coordinates, 13);

    mtLayer = L.maptilerLayer({
        apiKey: key,
        style: "streets-v2",
    }).addTo(map);

    stationsLayer.addTo(map);
    restaurantsLayer.addTo(map);

    L.control.layers(null, overlayMaps).addTo(map);

    await getVeloStations(); // Stations de vélo
    await getBusStops(); // Arrêts de bus
    return;
}

export { busStopsLayer, markers_bus_stops, accidentsLayer, markers_accidents, restaurantsLayer, markers_restaurants, stationsLayer, markers_stations};