// Importation des modules nécessaires
import { restaurantIcon } from '../utilities/icons.js';
import { serveurRmiUrl } from '../utilities/config.js';
import { isAppleDevice } from '../utilities/utils.js';
import { restaurantsLayer, markers_restaurants } from '../map.js';
import { getCoordinatesFromAddress, getAdressFromCoordinates } from '../utilities/adresses.js';

const restaurantsUrl = serveurRmiUrl + 'restaurants';
const reservationUrl = serveurRmiUrl + 'reservation';
const createRestaurantUrl = serveurRmiUrl + 'createRestaurant';

// Fonction pour obtenir les restaurants
async function getRestaurants() {
    return fetchRestaurants();
}

async function fetchRestaurants() {
    const data = await fetch(restaurantsUrl).then(response => response.json());

    if (data) {
        // On crée un marqueur pour chaque restaurant
        for (const restaurant of data.restaurants) {
            var id = restaurant.id;
            var nom = restaurant.nom;
            var adresse = restaurant.adresse;
            var latitude = restaurant.latitude;
            var longitude = restaurant.longitude;

            var marker = createMarker(id, nom, adresse, latitude, longitude);

            markers_restaurants.push(marker);
            restaurantsLayer.addLayer(marker);
        }

        return true;
    } else {
        return false;
    }
}

// Fonction permettant d'ajouter un restaurant
async function addRestaurant(nom, rue, codePostal, ville) {
    var adresse = `${rue}, ${codePostal} ${ville}`;
    var coordinates = await getCoordinatesFromAddress(adresse);
    var lon = coordinates[1].toString();
    var lat = coordinates[0].toString();

    return creerRestaurant(nom, adresse, lat, lon);
}

// Fonction permettant d'ajouter un restaurant à partir d'un clic
async function addRestaurantFromClick(nom, lat, lon) {
    var adresse = await getAdressFromCoordinates(lat, lon);

    return creerRestaurant(nom, adresse, lat, lon);
}

async function creerRestaurant(nom, adresse, latitude, longitude) {
    const data = {
        nom: nom,
        adresse: adresse,
        latitude: latitude,
        longitude: longitude
    };

    try {
        const response = await fetch(createRestaurantUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const errorMessage = `Une erreur HTTP ${response.status} s'est produite lors de la création du restaurant.`;
            throw new Error(errorMessage);
        }

        const jsonResponse = await response.json();
        console.log('Réponse du serveur :', jsonResponse);
        return jsonResponse; // Cette étape pourrait renvoyer une confirmation ou d'autres informations du serveur
    } catch (error) {
        console.error('Erreur lors de la création du restaurant :', error);
        throw error;
    }
}

// Fonction pour réserver un restaurant
async function reserverRestaurant(id_restaurant, date, heure, nbpers, nom, prenom) {
    const data = {
        id_restaurant: id_restaurant,
        date: date,
        heure: heure,
        nom: nom,
        prenom: prenom,
        nbpers: nbpers
    };

    try {
        const response = await fetch(reservationUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const errorMessage = `Une erreur HTTP ${response.status} s'est produite lors de la réservation.`;
            throw new Error(errorMessage);
        }

        const jsonResponse = await response.json();
        console.log('Réponse du serveur :', jsonResponse);
        return jsonResponse;
    } catch (error) {
        console.error('Erreur lors de la réservation :', error);
        throw error;
    }
}

// Fonction pour générer le contenu de la popup
function generatePopupContent(id, nom, adresse, lat, lon) {
    return `
        <div class="popup">
            <h3 class="name">${nom}</h3>
            <p class="address">${adresse}</p>
            <button class="reservation-button" data-nom="${nom}" data-id="${id}">Réserver</button>
            <a href="http://maps.apple.com/?daddr=${lat},${lon}&dirflg=w" class="directions-button" target="_blank">
                <img class="directions-icon" src="img/${isAppleDevice ? 'apple_maps.png' : 'google_maps.png'}" alt="Itinéraire" />
            </a>
        </div>
    `;
}

// Fonction pour créer un marqueur
function createMarker(id, nom, adresse, lat, lon) {
    var popup = L.popup().setContent(generatePopupContent(id, nom, adresse, lat, lon));
    return L.marker([lat, lon], { icon: restaurantIcon }).bindPopup(popup);
}

export { addRestaurant, getRestaurants, addRestaurantFromClick, reserverRestaurant }; // Exportation des fonctions