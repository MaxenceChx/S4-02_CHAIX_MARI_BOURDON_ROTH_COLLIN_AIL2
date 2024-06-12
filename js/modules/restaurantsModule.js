// Importation des modules nécessaires
import { restaurantIcon } from '../utilities/icons.js';
import { isAppleDevice } from '../utilities/utils.js';
import { restaurantsLayer, markers_restaurants } from '../map.js';
import { getCoordinatesFromAddress } from '../utilities/adresses.js';

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

// Fonction pour générer le contenu de la popup
function generatePopupContent(nom, adresse, lat, lon) {
    return `
        <div class="station-popup">
            <h3 class="station-name">${nom}</h3>
            <p>${adresse}</p>
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

export { addRestaurant }; // Exportation de la fonction addRestaurant