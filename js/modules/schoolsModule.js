// Importation des modules nécessaires
import { schoolIcon } from '../utilities/icons.js';
import { isAppleDevice } from '../utilities/utils.js';
import { schoolsLayer, markers_schools } from '../map.js';

const schoolsUrl = 'https://data.enseignementsup-recherche.gouv.fr/api/explore/v2.1/catalog/datasets/fr-esr-cartographie_formations_parcoursup/records?select=etab_uai%2C%20etab_nom%2C%20etab_url%2C%20etab_gps&limit=-1&refine=annee%3A%222023%22&refine=departement%3A%22Meurthe-et-Moselle%22';

// Fonction pour obtenir les établissements scolaires
async function getSchools() {
    return fetchSchools();
}

// Fonction permettant d'obtenir les établissements scolaires
async function fetchSchools() {
    const data = await fetch(schoolsUrl).then(response => response.json());

    if (data) {
        const uniqueResults = [];
        const seenEtabs = new Set();

        // On ne garde que les établissements uniques
        data.results.forEach(item => {
            if (!seenEtabs.has(item.etab_uai)) {
                seenEtabs.add(item.etab_uai);
                uniqueResults.push(item);
            }
        });

        // On crée un marqueur pour chaque établissement
        for (const school of uniqueResults) {
            const nom = school.etab_nom;
            const url = school.etab_url;
            const lat = school.etab_gps.lat;
            const lon = school.etab_gps.lon;

            const marker = createMarker(nom, url, lat, lon);

            markers_schools.push(marker);
            schoolsLayer.addLayer(marker);
        }

        return true;
    } else {
        return false;
    }
}

// Fonction pour générer le contenu de la popup
function generatePopupContent(nom, url, lat, lon) {
    return `
        <div class="popup">
            <h3 class="name">${nom}</h3>
            <a href="${url}" class="address">${url}</a>
            <a href="http://maps.apple.com/?daddr=${lat},${lon}&dirflg=w" class="directions-button" target="_blank">
                <img class="directions-icon" src="img/${isAppleDevice ? 'apple_maps.png' : 'google_maps.png'}" alt="Itinéraire" />
            </a>
        </div>
    `;
}

// Fonction pour créer un marqueur
function createMarker(nom, url, lat, lon) {
    var popup = L.popup().setContent(generatePopupContent(nom, url, lat, lon));
    return L.marker([lat, lon], { icon: schoolIcon }).bindPopup(popup);
}

export { getSchools }; // Exportation des fonctions