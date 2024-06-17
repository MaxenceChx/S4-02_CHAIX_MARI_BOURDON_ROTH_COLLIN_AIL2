import { initMap } from "./map.js";
import { getRestaurants, addRestaurant, addRestaurantFromClick } from "./modules/restaurantsModule.js";
import { getBusStops } from "./modules/busStopsModule.js";
import { getVeloStations } from "./modules/veloStationsModule.js";
import { getSchools } from "./modules/schoolsModule.js";
import { getCirculation } from "./modules/circulationModule.js";
import { getMeteo } from "./modules/meteoModule.js";

initMap(); // Initialisation de la carte

const addFromClickForm = document.getElementById('addFromClickForm');

// Code pour la gestion des événements
document.addEventListener('DOMContentLoaded', function() {
    const addFormLink = document.querySelector('nav ul li:nth-child(3) a'); // Sélectionne le lien "Ajouter un restaurant"
    const meteoLink = document.querySelector('nav ul li:nth-child(4) a'); // Sélectionne le lien "Meteo"
    const addForm = document.getElementById('addForm'); // Sélectionne le formulaire
    const meteoModal = document.getElementById('weatherModal'); // Sélectionne la modal météo
    const statusButton = document.getElementById('statusButton'); // Sélectionne le bouton de statut
    const statusModal = document.getElementById('statusModal'); // Sélectionne la modal de statut
    const closeModal = document.querySelectorAll('.close'); // Sélectionne les boutons de fermeture
    const statusDetails = document.getElementById('statusDetails'); // Sélectionne les détails de statut

    // Initialisation des modules
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

    // Affiche le formulaire d'ajout de restaurant
    addFormLink.addEventListener('click', function(event) {
        event.preventDefault();
        addForm.style.display = 'block'; // Affiche le formulaire
        document.getElementById('restaurantName').focus();
    });

    // Fonction pour masquer le formulaire
    function closeForm() {
        addForm.style.display = 'none'; // Masque le formulaire
        addFromClickForm.style.display = 'none'; // Masque le formulaire
    }

    // Fonction pour gérer la soumission du formulaire
    function handleFormSubmit(event) {
        event.preventDefault();
    
        // Récupère les valeurs des champs
        const restaurantName = document.getElementById('restaurantName').value;
        const street = document.getElementById('street').value;
        const postalCode = document.getElementById('postalCode').value;
        const city = document.getElementById('city').value;

        addRestaurant(restaurantName, street, postalCode, city); // Ajoute un restaurant
    
        // Réinitialise le formulaire et le masque
        document.querySelector('#addForm form').reset();
        closeForm();
    }

    // Fonction pour gérer la soumission du formulaire d'ajout de restaurant
    function handleFormFromClickSubmit(event) {
        event.preventDefault();

        // Récupère les valeurs des champs
        const restaurantName = document.getElementById('restaurantNameFromClick').value;
        const lat = document.getElementById('lat').value;
        const lng = document.getElementById('lng').value;

        addRestaurantFromClick(restaurantName, lat, lng); // Ajoute un restaurant à partir d'un clic

        // Réinitialise le formulaire et le masque
        document.querySelector('#addFromClickForm form').reset();
        closeForm();
    }

    // Gestion des boutons d'annulation
    const cancelBtn = document.querySelectorAll('.cancel-btn');
    for (const button of cancelBtn) {
        button.addEventListener('click', closeForm);
    }

    // Gestion de la soumission des formulaires
    const addFormForm = document.querySelector('#addForm form');
    addFormForm.addEventListener('submit', handleFormSubmit);

    // Gestion de la soumission du formulaire d'ajout de restaurant
    const addFromClickFormForm = document.querySelector('#addFromClickForm form');
    addFromClickFormForm.addEventListener('submit', handleFormFromClickSubmit);

    // Gestion de la modal de statut
    statusButton.addEventListener('click', function() {
        statusModal.style.display = 'block';
        updateStatusDetails();
    });

    // Gestion des boutons de fermeture
    for (const button of closeModal) {
        button.addEventListener('click', function() {
            statusModal.style.display = 'none';
            meteoModal.style.display = 'none';
            addFromClickForm.style.display = 'none';
            addForm.style.display = 'none';
        });
    }

    // Gestion de la fermeture des modales
    window.addEventListener('click', function(event) {
        if (event.target == statusModal) {
            statusModal.style.display = 'none';
        }
        if (event.target == meteoModal) {
            meteoModal.style.display = 'none';
        }
        if (event.target == addFromClickForm) {
            addFromClickForm.style.display = 'none';
        }
        if (event.target == addForm) {
            addForm.style.display = 'none';
        }
    });

    // Fonction pour mettre à jour les détails de statut
    function updateStatusDetails() {
        statusDetails.innerHTML = '';
        for (const [moduleName, { status, displayName }] of Object.entries(modulesStatus)) {
            const li = document.createElement('li');
            li.textContent = `${displayName} : ${status ? '✅' : '❌'}`;
            statusDetails.appendChild(li);
        }
    }

    // Gestion du lien de la météo
    meteoLink.addEventListener('click', function(event) {
        event.preventDefault();
        getMeteo();
        meteoModal.style.display = 'block';
    });

    // Fonction pour vérifier les statuts des modules
    async function checkModuleStatuses() {
        // Vérification du statut du module veloStations
        try {
            modulesStatus.veloStations.status = await getVeloStations();
        } catch (error) {
            modulesStatus.veloStations.status = false;
        }

        // Vérification du statut du module busStops
        try {
            modulesStatus.busStops.status = await getBusStops();
        } catch (error) {
            modulesStatus.busStops.status = false;
        }

        // Vérification du statut du module restaurants
        try {
            modulesStatus.restaurants.status = await getRestaurants();
        } catch (error) {
            modulesStatus.restaurants.status = false;
        }

        // Vérification du statut du module circulation
        try {
            modulesStatus.circulation.status = await getCirculation();
        } catch (error) {
            modulesStatus.circulation.status = false;
        }

        // Vérification du statut du module schools
        try {
            modulesStatus.schools.status = await getSchools();
        } catch (error) {
            modulesStatus.schools.status = false;
        }

        // Vérification du statut du module meteo
        try {
            modulesStatus.meteo.status = await getMeteo();
        } catch (error) {
            modulesStatus.meteo.status = false;
        }

        // Mise à jour des détails de statut
        const statusCount = Object.values(modulesStatus).filter(module => module.status).length;
        statusButton.textContent = `${statusCount} ✅ | ${Object.keys(modulesStatus).length - statusCount} ❌`;
    }

    // Vérification des statuts des modules
    checkModuleStatuses();
});

export { addFromClickForm }; // Exportation du formulaire d'ajout de restaurant
