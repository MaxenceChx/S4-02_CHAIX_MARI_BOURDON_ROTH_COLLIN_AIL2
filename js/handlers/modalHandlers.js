// Fonction pour afficher un modal
function showModal(modal) {
    modal.style.display = 'block';
}

// Fonction pour masquer un modal
function hideModal(modal) {
    modal.style.display = 'none';
}

// Fonction pour fermer un modal lors d'un clic en dehors
function closeModalOnOutsideClick(event, modal) {
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}

export { showModal, hideModal, closeModalOnOutsideClick }; // Exportation des fonctions
