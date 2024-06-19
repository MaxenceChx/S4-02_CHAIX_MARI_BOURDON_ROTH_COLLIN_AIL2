import { handleFormSubmit, handleFormFromClickSubmit, handleFormReservationSubmit } from './formHandlers.js';
import { showModal, hideModal, closeModalOnOutsideClick } from './modalHandlers.js';
import { getMeteo } from '../modules/meteoModule.js';


const addFromClickForm = document.getElementById('addFromClickForm'); // Formulaire d'ajout de restaurant (en dehors de la fonction pour pouvoir l'exporter)

// Fonction d'initialisation des événements
document.addEventListener('DOMContentLoaded', function() {
    const addFormLink = document.querySelector('nav ul li:nth-child(3) a'); // Lien pour ajouter un restaurant
    const meteoLink = document.querySelector('nav ul li:nth-child(4) a'); // Lien pour afficher la météo
    const statusButton = document.getElementById('statusButton'); // Bouton pour afficher les statuts
    const addForm = document.getElementById('addForm'); // Formulaire d'ajout de restaurant
    const reservationForm = document.getElementById('reservationForm'); // Formulaire de réservation
    const meteoModal = document.getElementById('weatherModal'); // Modal de la météo
    const statusModal = document.getElementById('statusModal'); // Modal des statuts
    const closeModal = document.querySelectorAll('.close, .cancel-btn'); // Boutons pour fermer les modals

    const dateInput = document.getElementById('date'); // Champ de date
    const today = new Date().toISOString().split('T')[0]; // Date du jour
    dateInput.setAttribute('min', today); // Date minimale

// Événements
    // Lorsque l'utilisateur clique sur le lien pour ajouter un restaurant
    addFormLink.addEventListener('click', function(event) {
        event.preventDefault();
        showModal(addForm);
        document.getElementById('restaurantName').focus();
    });

    // Lorsque l'utilisateur clique sur le lien pour afficher la météo
    meteoLink.addEventListener('click', async function(event) {
        event.preventDefault();
        await getMeteo();
        showModal(meteoModal);
    });

    // Lorsque l'utilisateur clique sur le bouton pour afficher les statuts
    statusButton.addEventListener('click', function() {
        showModal(statusModal);
    });

    // Lorsque l'utilisateur clique sur un bouton de réservation
    document.addEventListener('click', function(event) {
        if (event.target.classList.contains('reservation-button')) {
            const nom = event.target.getAttribute('data-nom');
            showModal(reservationForm);
            document.getElementById('reservationRestaurantName').value = nom;
            document.getElementById('reservationRestaurantName').setAttribute('data-id', event.target.getAttribute('data-id'));
        }
    });

    // Lorsque l'utilisateur clique sur un bouton de la météo
    closeModal.forEach(button => {
        button.addEventListener('click', function() {
            hideModal(statusModal);
            hideModal(meteoModal);
            hideModal(addFromClickForm);
            hideModal(addForm);
            hideModal(reservationForm);
        });
    });

    // Lorsque l'utilisateur clique en dehors du modal
    window.addEventListener('click', function(event) {
        closeModalOnOutsideClick(event, statusModal); // Fermer le modal des statuts
        closeModalOnOutsideClick(event, meteoModal); // Fermer le modal de la météo
        closeModalOnOutsideClick(event, addFromClickForm); // Fermer le modal d'ajout de restaurant
        closeModalOnOutsideClick(event, addForm); // Fermer le modal d'ajout de restaurant
        closeModalOnOutsideClick(event, reservationForm); // Fermer le modal de réservation
    });

// Lorsque l'utilisateur soumet un formulaire
    // Ajout de restaurant
    const addFormForm = document.querySelector('#addForm form');
    addFormForm.addEventListener('submit', handleFormSubmit);

    // Ajout de restaurant à partir d'un clic
    const addFromClickFormForm = document.querySelector('#addFromClickForm form');
    addFromClickFormForm.addEventListener('submit', handleFormFromClickSubmit);

    // Réservation de restaurant
    const reservationFormForm = document.querySelector('#reservationForm form');
    reservationFormForm.addEventListener('submit', handleFormReservationSubmit);
});

export { addFromClickForm }; // Exportation du formulaire d'ajout de restaurant