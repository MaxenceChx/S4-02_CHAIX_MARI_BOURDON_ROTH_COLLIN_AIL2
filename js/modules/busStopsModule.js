// Importation des modules nécessaires
import { supabase } from '../clients/supabaseClient.js';
import { busStopIcon } from '../utilities/icons.js';
import { isAppleDevice } from '../utilities/utils.js';
import { busStopsLayer, markers_bus_stops } from '../map.js';
import Stan from '../clients/stan.js';

// Fonction pour obtenir les arrêts de bus
async function getBusStops() {
    let { data: stops, error } = await fetchBusStopsFromDatabase();

    if (error) {
        return false;
    }

    for (var stop of stops) {
        await processBusStop(stop);
    }

    return true;
}

// Fonction pour récupérer les arrêts de bus depuis la base de données
async function fetchBusStopsFromDatabase() {
    return await supabase
        .from('stops')
        .select('*')
        .not('osmid', 'is', null);
}

// Fonction pour traiter chaque arrêt de bus
async function processBusStop(stop) {
    var popupContent = generatePopupContent(stop);
    var marker = createMarker(stop, popupContent);

    marker.on('popupopen', async function(e) {
        var osmid = getOsMidFromPopup(e.popup);

        var listeLignes = await fetchBusLinesForStop(osmid);

        updateBadgesInPopup(e.popup, listeLignes);
    });

    addMarkerToLayers(marker);

    return;
}

// Fonction pour générer le contenu de la popup
function generatePopupContent(stop) {
    return `
        <div class="popup" data-id=${stop.osmid}>
            <h3 class="name">${stop.stop_name}${stop.wheelchair_boarding == 1 || stop.platform_code == 1 ? '<span class="material-symbols-outlined">accessible</span>' : ''}</h3>
            <div class="badges"></div>
            <div class="prochains-passages"></div>
            <a href="http://maps.apple.com/?daddr=${stop.stop_lat},${stop.stop_lon}&dirflg=w" class="directions-button" target="_blank">
                <img class="directions-icon" src="img/${isAppleDevice ? 'apple_maps.png' : 'google_maps.png'}" alt="Itinéraire" />
            </a>
        </div>
    `;
}

// Fonction pour créer un marqueur
function createMarker(stop, popupContent) {
    var popup = L.popup().setContent(popupContent);
    return L.marker([stop.stop_lat, stop.stop_lon], { icon: busStopIcon }).bindPopup(popup);
}

// Fonction pour récupérer l'identifiant osmid de la popup
function getOsMidFromPopup(popup) {
    return popup.getElement().getElementsByClassName('popup')[0].getAttribute('data-id');
}

// Fonction pour récupérer les lignes de bus pour un arrêt donné
async function fetchBusLinesForStop(osmid) {
    var listeLignes = [];

    let { data: lignesArrets, error: errorLignesArrets } = await supabase
        .from('lignesArrets')
        .select('')
        .eq('arret', osmid);

    if (errorLignesArrets) {
        return listeLignes;
    }

    for (var ligneArret of lignesArrets) {
        let { data: lignes, error: errorLignes } = await supabase
            .from('lignes')
            .select('*')
            .eq('osmid', ligneArret.ligne);

        if (errorLignes) {
            console.error(errorLignes);
            continue;
        }

        if (lignes.length > 0) {
            listeLignes.push(lignes[0]);
        }
    }

    return listeLignes;
}

// Fonction pour mettre à jour les badges dans la popup
function updateBadgesInPopup(popup, listeLignes) {
    var popupElement = popup.getElement();
    var badgesContainer = popupElement.querySelector(`.badges`);
    if (badgesContainer) {
        badgesContainer.innerHTML = '';
        listeLignes.forEach(function(ligne) {
            var badge = document.createElement('span');
            badge.className = 'badge';
            if (ligne.numlignepublic.length > 2) {
                badge.classList.add('oval');
            }
            badge.style.backgroundColor = ligne.route_color;
            badge.style.color = ligne.text_color;
            badge.textContent = ligne.numlignepublic;
            badgesContainer.appendChild(badge);

            badge.addEventListener('click', function() {
                updateProchainsPassagesInPopup(popup, getOsMidFromPopup(popup), ligne.osmid);
                
                var badges = badgesContainer.getElementsByClassName('badge');
                Array.from(badges).forEach(function(badge) {
                    badge.classList.add('not-selected');
                });
                badge.classList.remove('not-selected');
            });
        });
    }
}

// Fonction pour ajouter le marqueur aux couches
function addMarkerToLayers(marker) {
    markers_bus_stops.push(marker);
    busStopsLayer.addLayer(marker);
}

function updateProchainsPassagesInPopup(popup, arret_osmid, ligne_osmid) {
    var arret = {
        osmid: arret_osmid,
        ligne: {
            osmid: ligne_osmid
        }
    };

    Stan.getProchainsPassages(arret).then(function(prochainsPassages) {
        var popupElement = popup.getElement();
        var prochainsPassagesContainer = popupElement.querySelector(`.prochains-passages`);
        if (prochainsPassagesContainer) {
            prochainsPassagesContainer.innerHTML = '';
            if (prochainsPassages.length === 0) {
                var aucunPassage = document.createElement('div');
                aucunPassage.textContent = 'Aucun passage prévu';
                prochainsPassagesContainer.appendChild(aucunPassage);
            } else {
                prochainsPassages.forEach(function(passage) {
                    var prochainPassage = document.createElement('div');
                    prochainPassage.className = 'prochain-passage';
                    prochainPassage.textContent = `${passage.direction} : ${passage.temps_min} min`;
                    prochainPassage.classList.add('info');
                    prochainsPassagesContainer.appendChild(prochainPassage);
                });
            }
        }
    });

}

// Exportation des fonctions nécessaires
export { getBusStops };
