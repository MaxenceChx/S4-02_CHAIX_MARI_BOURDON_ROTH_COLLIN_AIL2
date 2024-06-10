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

const high_veloStationIcon = createCustomIcon('directions_bike', 'rgba(40, 167, 69, 0.75)');
const medium_veloStationIcon = createCustomIcon('directions_bike', 'rgba(255, 193, 7, 0.75)');
const low_veloStationIcon = createCustomIcon('directions_bike', 'rgba(220, 53, 69, 0.75)');
const restaurantIcon = createCustomIcon('restaurant', 'rgba(66, 133, 245, 0.75)');
const busStopIcon = createCustomIcon('directions_bus', 'rgba(188, 66, 245, 0.75)');

export { high_veloStationIcon, medium_veloStationIcon, low_veloStationIcon, restaurantIcon, busStopIcon };
