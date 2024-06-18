// Fonction: Création des icônes personnalisées pour les marqueurs
function createCustomIcon(icon, markerColor) {
    return L.IconMaterial.icon({
        icon: icon,
        iconColor: 'black',
        markerColor: markerColor,
        outlineWidth: 1,
        iconSize: [31, 42],
        popupAnchor: [0, -42],
    });
}

// Icônes personnalisées pour les marqueurs
const high_veloStationIcon = createCustomIcon('directions_bike', 'rgba(40, 167, 69, 0.75)'); // Icône de station de vélos avec un pourcentage de vélos disponibles supérieur à 50%
const medium_veloStationIcon = createCustomIcon('directions_bike', 'rgba(255, 193, 7, 0.75)'); // Icône de station de vélos avec un pourcentage de vélos disponibles entre 25% et 50%
const low_veloStationIcon = createCustomIcon('directions_bike', 'rgba(220, 53, 69, 0.75)'); // Icône de station de vélos avec un pourcentage de vélos disponibles inférieur à 25%
const restaurantIcon = createCustomIcon('restaurant', 'rgba(66, 133, 245, 0.75)'); // Icône de restaurant
const busStopIcon = createCustomIcon('directions_bus', 'rgba(188, 66, 245, 0.75)'); // Icône d'arrêt de bus
const schoolIcon = createCustomIcon('school', 'rgba(211, 194, 206, 0.75)'); // Icône d'étabissement scolaire
const circulationIcon = createCustomIcon('warning', 'rgba(255, 145, 0, 0.75)'); // Icône de circulation

// Exportation des icônes personnalisées
export { high_veloStationIcon, medium_veloStationIcon, low_veloStationIcon, restaurantIcon, busStopIcon, schoolIcon, circulationIcon };
