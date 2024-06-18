import { getRestaurants } from "./restaurantsModule.js";
import { getBusStops } from "./busStopsModule.js";
import { getVeloStations } from "./veloStationsModule.js";
import { getSchools } from "./schoolsModule.js";
import { getCirculation } from "./circulationModule.js";
import { getMeteo } from "./meteoModule.js";

// Statuts des modules
let modulesStatus = {
    veloStations: {
        status: false,
        displayName: "Stations de vélos"
    },
    busStops: {
        status: false,
        displayName: "Arrêts de bus"
    },
    restaurants: {
        status: false,
        displayName: "Restaurants"
    },
    circulation: {
        status: false,
        displayName: "Impact sur la circulation"
    },
    schools: {
        status: false,
        displayName: "Établissements scolaires"
    },
    meteo: {
        status: false,
        displayName: "Météo"
    }
};

// Fonction pour mettre à jour les détails des statuts
function updateStatusDetails() {
    const statusDetails = document.getElementById('statusDetails');
    statusDetails.innerHTML = '';
    // Pour chaque module, créer un élément de liste
    for (const [moduleName, { status, displayName }] of Object.entries(modulesStatus)) {
        const li = document.createElement('li');
        li.textContent = `${displayName} : ${status ? '✅' : '❌'}`;
        statusDetails.appendChild(li);
    }
}

// Fonction pour vérifier les statuts des modules
async function checkModuleStatuses() {
    try {
        modulesStatus.veloStations.status = await getVeloStations();
    } catch {
        modulesStatus.veloStations.status = false;
    }

    try {
        modulesStatus.busStops.status = await getBusStops();
    } catch {
        modulesStatus.busStops.status = false;
    }

    try {
        modulesStatus.restaurants.status = await getRestaurants();
    } catch {
        modulesStatus.restaurants.status = false;
    }

    try {
        modulesStatus.circulation.status = await getCirculation();
    } catch {
        modulesStatus.circulation.status = false;
    }

    try {
        modulesStatus.schools.status = await getSchools();
    } catch {
        modulesStatus.schools.status = false;
    }

    try {
        modulesStatus.meteo.status = await getMeteo();
    } catch {
        modulesStatus.meteo.status = false;
    }

    // Mettre à jour le bouton des statuts
    const statusCount = Object.values(modulesStatus).filter(module => module.status).length;
    document.getElementById('statusButton').textContent = `${statusCount} ✅ | ${Object.keys(modulesStatus).length - statusCount} ❌`;

    updateStatusDetails();
}

export { checkModuleStatuses }; // Exportation de la fonction