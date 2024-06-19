import { addRestaurant, addRestaurantFromClick, reserverRestaurant } from '../modules/restaurantsModule.js';

// Fonction pour gérer la soumission du formulaire
function handleFormSubmit(event) {
    event.preventDefault(); // Empêcher le rechargement de la page

    // Récupérer les valeurs des champs
    const restaurantName = document.getElementById('restaurantName').value;
    const street = document.getElementById('street').value;
    const postalCode = document.getElementById('postalCode').value;
    const city = document.getElementById('city').value;

    addRestaurant(restaurantName, street, postalCode, city); // Ajouter le restaurant

    // Réinitialiser le formulaire et masquer le modal
    document.querySelector('#addForm form').reset();
    document.getElementById('addForm').style.display = 'none';
}

// Fonction pour gérer la soumission du formulaire d'ajout de restaurant à partir d'un clic
function handleFormFromClickSubmit(event) {
    event.preventDefault(); // Empêcher le rechargement de la page

    // Récupérer les valeurs des champs
    const restaurantName = document.getElementById('restaurantNameFromClick').value;
    const lat = document.getElementById('lat').value;
    const lng = document.getElementById('lng').value;

    addRestaurantFromClick(restaurantName, lat, lng); // Ajouter le restaurant

    // Réinitialiser le formulaire et masquer le modal
    document.querySelector('#addFromClickForm form').reset();
    document.getElementById('addFromClickForm').style.display = 'none';
}

// Fonction pour gérer la soumission du formulaire de réservation
function handleFormReservationSubmit(event) {
    event.preventDefault(); // Empêcher le rechargement de la page

    // Récupérer les valeurs des champs
    const restaurantId = document.getElementById('reservationRestaurantName').getAttribute('data-id');
    const restaurantName = document.getElementById('reservationRestaurantName').value;
    const date = document.getElementById('date').value;
    const time = document.getElementById('heure').value;
    const nbPersonnes = document.getElementById('nbPersonnes').value;
    const nom = document.getElementById('nom').value;
    const prenom = document.getElementById('prenom').value;

    reserverRestaurant(restaurantId, restaurantName, date, time, nbPersonnes, nom, prenom); // Réserver le restaurant

    // Réinitialiser le formulaire et masquer le modal
    document.querySelector('#reservationForm form').reset();
    document.getElementById('reservationForm').style.display = 'none';
}

export { handleFormSubmit, handleFormFromClickSubmit, handleFormReservationSubmit }; // Exportation des fonctions
