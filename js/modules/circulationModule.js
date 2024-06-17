// Importation des modules nécessaires
import { isAppleDevice } from '../utilities/utils.js';
import { circulationIcon } from '../utilities/icons.js';
import { circulationLayer, markers_circulation } from '../map.js';

const circulationUrl = 'https://cors-anywhere.herokuapp.com/https://carto.g-ny.org/data/cifs/cifs_waze_v2.json';

// Fonction pour obtenir les informations sur la circulation
async function getCirculation() {
    return fetchCirculation();
}

// Fonction permettant d'obtenir les informations sur la circulation
async function fetchCirculation() {
    const data = await fetch(circulationUrl).then(response => response.json());

    if (data) {
        // On crée un marqueur pour chaque incident
        for (const circulation of data.incidents) {
            const nom = circulation.short_description;
            const adresse = circulation.location.street;
            const desc = circulation.description;
            const starttime = circulation.starttime;
            const endtime = circulation.endtime;
            const lat = parseFloat(circulation.location.polyline.split(' ')[0]);
            const lon = parseFloat(circulation.location.polyline.split(' ')[1]);
    
            const marker = createMarker(nom, adresse, lat, lon, desc, starttime, endtime);
    
            markers_circulation.push(marker);
            circulationLayer.addLayer(marker);
        }

        return true;
    } else {
        return false;
    }
}

// Fonction pour générer le contenu de la popup
function generatePopupContent(nom, adresse, lat, lon, desc, starttime, endtime) {
    return `
        <div class="popup">
            <h3 class="name">${nom}</h3>
            <p class="address">${adresse}</p>
            <p class="description">${desc}</p>
            <p class="time">Du ${starttime.split('T')[0].split('-').reverse().join('/')} au ${endtime.split('T')[0].split('-').reverse().join('/')}</p>
            <a href="http://maps.apple.com/?daddr=${lat},${lon}&dirflg=w" class="directions-button" target="_blank">
                <img class="directions-icon" src="img/${isAppleDevice ? 'apple_maps.png' : 'google_maps.png'}" alt="Itinéraire" />
            </a>
        </div>
    `;
}

// Fonction pour créer un marqueur
function createMarker(nom, adresse, lat, lon, desc, starttime, endtime) {
    var popup = L.popup().setContent(generatePopupContent(nom, adresse, lat, lon, desc, starttime, endtime));
    return L.marker([lat, lon], { icon: circulationIcon }).bindPopup(popup);
}

export { getCirculation }; // Exportation des fonctions