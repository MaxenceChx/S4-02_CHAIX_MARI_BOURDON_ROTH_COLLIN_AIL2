// Fonction pour obtenir les coordonnées à partir d'une adresse
async function getCoordinatesFromAddress(adresse) {
    const response = await fetch(`https://api-adresse.data.gouv.fr/search/?q=${adresse}&limit=1`).then(response => response.json());
    return response.features[0].geometry.coordinates.reverse();
}

// Fonction pour obtenir les coordonnées à partir d'une ville
async function getCoordinatesFromCity(city) {
    const response = await fetch(`https://api-adresse.data.gouv.fr/search/?q=${city}&type=municipality&limit=1`).then(response => response.json());
    return response.features[0].geometry.coordinates.reverse();
}

// Fonction pour obtenir l'adresse à partir de coordonnées
async function getAdressFromCoordinates(lat, lon) {
    const response = await fetch(`https://api-adresse.data.gouv.fr/reverse/?lon=${lon}&lat=${lat}`).then(response => response.json());
    return response.features[0].properties.label;
}

export { getCoordinatesFromAddress, getCoordinatesFromCity, getAdressFromCoordinates }; // Exportation des fonctions de géolocalisation