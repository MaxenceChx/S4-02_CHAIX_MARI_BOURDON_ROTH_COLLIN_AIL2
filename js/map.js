// Importation des modules
import { getBusStops } from './modules/busStopsModule.js';
import { getVeloStations } from './modules/veloStationsModule.js';
import { getCoordinatesFromCity } from './utilities/adresses.js';

var map;
var mtLayer;

const key = 'OA43qAVRL040lPW78C3p';

var markers_stations = [];
var markers_restaurants = [];
var markers_bus_stops = [];
var markers_accidents = [];
var markers_schools = [];

var stationsLayer = L.layerGroup(markers_stations);
var restaurantsLayer = L.layerGroup(markers_restaurants);
var busStopsLayer = L.layerGroup(markers_bus_stops);
var accidentsLayer = L.layerGroup(markers_accidents);
var schoolsLayer = L.layerGroup(markers_schools);

var overlayMaps = {
    "🚲 Stations de vélo": stationsLayer,
    "🍽️ Restaurants": restaurantsLayer,
    "🚏 Arrêts de bus": busStopsLayer,
    "🚗 Accidents": accidentsLayer,
    "🎓 Établissements scolaires": schoolsLayer
};

async function initMap() {
    var coordinates = await getCoordinatesFromCity('Nancy');
    
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


export { initMap }; // Exportation de la fonction initMap
export { busStopsLayer, markers_bus_stops }; // Exportation des arrêts de bus
export { stationsLayer, markers_stations }; // Exportation des stations de vélo
export { restaurantsLayer, markers_restaurants }; // Exportation des restaurants
export { accidentsLayer, markers_accidents }; // Exportation des accidents
export { schoolsLayer, markers_schools }; // Exportation des établissements scolaires