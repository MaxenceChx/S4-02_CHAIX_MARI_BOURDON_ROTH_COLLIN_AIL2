import { initMap } from "./map.js";
import { addRestaurant } from "./modules/restaurantsModule.js";

initMap(); // Initialisation de la carte

document.addEventListener('DOMContentLoaded', function() {
    const addFormLink = document.querySelector('nav ul li:nth-child(3) a'); // Sélectionne le lien "Ajouter un restaurant"
    const addForm = document.getElementById('addForm'); // Sélectionne le formulaire

    addFormLink.addEventListener('click', function(event) {
        event.preventDefault();

        addForm.style.display = 'block'; // Affiche le formulaire
    });

    // Fonction de fermeture du formulaire
    function closeForm() {
        addForm.style.display = 'none'; // Masque le formulaire
    }

    // Fonction de soumission du formulaire
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

    // Ajout d'un écouteur d'événement "click" sur le bouton de fermeture
    const closeFormBtn = document.querySelector('.close-form-btn');
    closeFormBtn.addEventListener('click', closeForm);

    // Ajout d'un écouteur d'événement "click" sur le bouton "Annuler"
    const cancelBtn = document.querySelector('.cancel-btn');
    cancelBtn.addEventListener('click', closeForm);

    // Ajout d'un écouteur d'événement "submit" sur le formulaire
    const addFormForm = document.querySelector('#addForm form');
    addFormForm.addEventListener('submit', handleFormSubmit);
});