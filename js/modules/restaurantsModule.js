// Importation des modules nécessaires
import { restaurantIcon } from '../utilities/icons.js';
import { isAppleDevice } from '../utilities/utils.js';
import { restaurantsLayer, markers_restaurants } from '../map.js';
import { getCoordinatesFromAddress, getAdressFromCoordinates } from '../utilities/adresses.js';

// Fonction pour obtenir les restaurants
async function getRestaurants() {
    return false;
}

// Fonction permettant d'ajouter un restaurant
async function addRestaurant(nom, rue, codePostal, ville) {
    var adresse = `${rue}, ${codePostal} ${ville}`;
    var coordinates = await getCoordinatesFromAddress(adresse);
    var lon = coordinates[1];
    var lat = coordinates[0];

    var marker = createMarker(nom, adresse, lat, lon);

    markers_restaurants.push(marker);
    restaurantsLayer.addLayer(marker);

    return;
}

// Fonction permettant d'ajouter un restaurant à partir d'un clic
async function addRestaurantFromClick(nom, lat, lon) {
    var adresse = await getAdressFromCoordinates(lat, lon);

    var marker = createMarker(nom, adresse, lat, lon);

    markers_restaurants.push(marker);
    restaurantsLayer.addLayer(marker);

    return;
}

// Fonction pour générer le contenu de la popup
function generatePopupContent(nom, adresse, lat, lon) {
    return `
        <div class="popup">
            <h3 class="name">${nom}</h3>
            <p class="address">${adresse}</p>
            <button class="reservation-button">Réserver</button>
            <a href="http://maps.apple.com/?daddr=${lat},${lon}&dirflg=w" class="directions-button" target="_blank">
                <img class="directions-icon" src="img/${isAppleDevice ? 'apple_maps.png' : 'google_maps.png'}" alt="Itinéraire" />
            </a>
        </div>
    `;
}

// Fonction pour créer un marqueur
function createMarker(nom, adresse, lat, lon) {
    var popup = L.popup().setContent(generatePopupContent(nom, adresse, lat, lon));
    return L.marker([lat, lon], { icon: restaurantIcon }).bindPopup(popup);
}

export { addRestaurant, getRestaurants, addRestaurantFromClick }; // Exportation des fonctions