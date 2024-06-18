    // Importation des modules
    import { getCoordinatesFromCity } from './utilities/adresses.js';
    import { addFromClickForm } from './handlers/eventHandlers.js';

    var map;
    var mtLayer;

    const key = 'OA43qAVRL040lPW78C3p'; // Clé d'API MapTiler

    // Initialisation des marqueurs
    var markers_stations = [];
    var markers_restaurants = [];
    var markers_bus_stops = [];
    var markers_circulation = [];
    var markers_schools = [];

    // Initialisation des calques
    var stationsLayer = L.layerGroup(markers_stations);
    var restaurantsLayer = L.layerGroup(markers_restaurants);
    var busStopsLayer = L.layerGroup(markers_bus_stops);
    var circulationLayer = L.layerGroup(markers_circulation);
    var schoolsLayer = L.layerGroup(markers_schools);

    // Initialisation des calques superposés
    var overlayMaps = {
        "🚲 Stations de vélo": stationsLayer,
        "🍽️ Restaurants": restaurantsLayer,
        "🚗 Circulation": circulationLayer,
        "🎓 Établissements scolaires": schoolsLayer,
        "🚏 Arrêts de bus": busStopsLayer
    };

    // Fonction d'initialisation de la carte
    async function initMap() {
        var coordinates = await getCoordinatesFromCity('Nancy'); // Coordonnées de Nancy
        
        map = L.map('map').setView(coordinates, 13); // Initialisation de la carte

        // Ajout de la couche MapTiler
        mtLayer = L.maptilerLayer({
            apiKey: key,
            style: "streets-v2",
        }).addTo(map);

        // Ajout des calques
        stationsLayer.addTo(map);
        restaurantsLayer.addTo(map);
        circulationLayer.addTo(map);
        schoolsLayer.addTo(map);

        // Ajout du contrôle des calques
        L.control.layers(null, overlayMaps).addTo(map);

        // Ajout d'un marqueur lors d'un clic
        map.on('click', function(e) {
            addFromClickForm.style.display = 'block';   
            document.getElementById('lat').value = e.latlng.lat;
            document.getElementById('lng').value = e.latlng.lng;
            document.getElementById('restaurantNameFromClick').focus();
        });
        
        return;
    }

    export { initMap }; // Exportation de la fonction initMap
    export { busStopsLayer, markers_bus_stops }; // Exportation des arrêts de bus
    export { stationsLayer, markers_stations }; // Exportation des stations de vélo
    export { restaurantsLayer, markers_restaurants }; // Exportation des restaurants
    export { circulationLayer, markers_circulation }; // Exportation de la circulation
    export { schoolsLayer, markers_schools }; // Exportation des établissements scolaires