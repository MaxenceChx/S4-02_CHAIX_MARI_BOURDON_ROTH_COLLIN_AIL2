async function getCoordinatesFromAddress(adresse) {
    const response = await fetch(`https://api-adresse.data.gouv.fr/search/?q=${adresse}&limit=1`).then(response => response.json());
    return response.features[0].geometry.coordinates.reverse();
}

async function getCoordinatesFromCity(city) {
    const response = await fetch(`https://api-adresse.data.gouv.fr/search/?q=${city}&type=municipality&limit=1`).then(response => response.json());
    return response.features[0].geometry.coordinates.reverse();
}

export { getCoordinatesFromAddress, getCoordinatesFromCity }; // Exportation des fonctions getCoordinatesFromAddress et getCoordinatesFromCity