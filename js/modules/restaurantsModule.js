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

            var marker = createMarker(nom, adresse, latitude, longitude);

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

// Fonction créer restaurant qui fait un post
let creationEnCours = false; // Variable pour suivre l'état de la création en cours

async function creerRestaurant(nom, adresse, latitude, longitude) {
    if (creationEnCours) {
        console.log("Une création est déjà en cours. Attendez la réponse précédente.");
        return;
    }

    const url = 'https://127.0.0.1:8000/api/createRestaurant';
    const data = {
        nom: nom,
        adresse: adresse,
        latitude: latitude,
        longitude: longitude
    };

    try {
        creationEnCours = true; // Marquer la création en cours

        const response = await fetch(url, {
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
    } finally {
        creationEnCours = false; // Réinitialiser l'état après la fin de la requête
    }
}

// Fonction pour réserver un restaurant
async function reserverRestaurant(nomRestaurant, date, heure, nbPersonnes, nom, prenom) {
    console.log(`Réservation pour ${nom} ${prenom} au restaurant ${nomRestaurant} le ${date} à ${heure} pour ${nbPersonnes} personnes.`);
}

// Fonction pour générer le contenu de la popup
function generatePopupContent(nom, adresse, lat, lon) {
    return `
        <div class="popup">
            <h3 class="name">${nom}</h3>
            <p class="address">${adresse}</p>
            <button class="reservation-button" data-id="${nom}">Réserver</button>
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

export { addRestaurant, getRestaurants, addRestaurantFromClick, reserverRestaurant }; // Exportation des fonctions