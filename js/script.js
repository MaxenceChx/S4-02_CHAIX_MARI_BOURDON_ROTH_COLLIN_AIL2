import { initMap } from "./map.js";
import { getRestaurants, addRestaurant } from "./modules/restaurantsModule.js";
import { getBusStops } from "./modules/busStopsModule.js";
import { getVeloStations } from "./modules/veloStationsModule.js";
import { getSchools } from "./modules/schoolsModule.js";
import { getAccidents } from "./modules/accidentsModule.js";

initMap(); // Initialisation de la carte

document.addEventListener('DOMContentLoaded', function() {
    const addFormLink = document.querySelector('nav ul li:nth-child(3) a'); // Sélectionne le lien "Ajouter un restaurant"
    const addForm = document.getElementById('addForm'); // Sélectionne le formulaire
    const statusButton = document.getElementById('statusButton');
    const statusModal = document.getElementById('statusModal');
    const closeModal = document.querySelector('.close');
    const statusDetails = document.getElementById('statusDetails');

    let modulesStatus = {
        veloStations: {
            status: false,
            displayName: "Stations de vélo"
        },
        busStops: {
            status: false,
            displayName: "Arrêts de bus"
        },
        restaurants: {
            status: false,
            displayName: "Restaurants"
        },
        accidents: {
            status: false,
            displayName: "Accidents"
        },
        schools: {
            status: false,
            displayName: "Établissements scolaires"
        }
    };

    addFormLink.addEventListener('click', function(event) {
        event.preventDefault();
        addForm.style.display = 'block'; // Affiche le formulaire
    });

    function closeForm() {
        addForm.style.display = 'none'; // Masque le formulaire
    }

    function handleFormSubmit(event) {
        event.preventDefault();
    
        const restaurantName = document.getElementById('restaurantName').value;
        const street = document.getElementById('street').value;
        const postalCode = document.getElementById('postalCode').value;
        const city = document.getElementById('city').value;

        addRestaurant(restaurantName, street, postalCode, city);
    
        document.querySelector('#addForm form').reset();
        closeForm();
    }

    const closeFormBtn = document.querySelector('.close-form-btn');
    closeFormBtn.addEventListener('click', closeForm);

    const cancelBtn = document.querySelector('.cancel-btn');
    cancelBtn.addEventListener('click', closeForm);

    const addFormForm = document.querySelector('#addForm form');
    addFormForm.addEventListener('submit', handleFormSubmit);

    statusButton.addEventListener('click', function() {
        statusModal.style.display = 'block';
        updateStatusDetails();
    });

    closeModal.addEventListener('click', function() {
        statusModal.style.display = 'none';
    });

    window.addEventListener('click', function(event) {
        if (event.target == statusModal) {
            statusModal.style.display = 'none';
        }
    });

    function updateStatusDetails() {
        statusDetails.innerHTML = '';
        for (const [moduleName, { status, displayName }] of Object.entries(modulesStatus)) {
            const li = document.createElement('li');
            li.textContent = `${displayName} : ${status ? '✅' : '❌'}`;
            statusDetails.appendChild(li);
        }
    }

    async function checkModuleStatuses() {
        try {
            modulesStatus.veloStations.status = await getVeloStations();
        } catch (error) {
            modulesStatus.veloStations.status = false;
        }

        try {
            modulesStatus.busStops.status = await getBusStops();
        } catch (error) {
            modulesStatus.busStops.status = false;
        }

        try {
            modulesStatus.restaurants.status = await getRestaurants();
        } catch (error) {
            modulesStatus.restaurants.status = false;
        }

        try {
            modulesStatus.accidents.status = await getAccidents();
        } catch (error) {
            modulesStatus.accidents.status = false;
        }

        try {
            modulesStatus.schools.status = await getSchools();
        } catch (error) {
            modulesStatus.schools.status = false;
        }

        // Update the status button text
        const statusCount = Object.values(modulesStatus).filter(module => module.status).length;
        statusButton.textContent = `${statusCount} ✅ | ${Object.keys(modulesStatus).length - statusCount} ❌`;
    }

    checkModuleStatuses();
});
