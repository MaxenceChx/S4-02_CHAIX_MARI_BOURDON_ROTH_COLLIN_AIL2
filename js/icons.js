const high_veloStationIcon = L.IconMaterial.icon({
    icon: 'directions_bike',
    iconColor: 'black',
    markerColor: 'rgba(0, 255, 0, 0.5)',
    outlineWidth: 1,
    iconSize: [31, 42],
    popupAnchor: [0, -42],
});

const medium_veloStationIcon = L.IconMaterial.icon({
    icon: 'directions_bike',
    iconColor: 'black',
    markerColor: 'rgba(255, 255, 0, 0.5)',
    outlineWidth: 1,
    iconSize: [31, 42],
    popupAnchor: [0, -42],
});

const low_veloStationIcon = L.IconMaterial.icon({
    icon: 'directions_bike',
    iconColor: 'black',
    markerColor: 'rgba(255, 0, 0, 0.5)',
    outlineWidth: 1,
    iconSize: [31, 42],
    popupAnchor: [0, -42],
});

const restaurantIcon = L.IconMaterial.icon({
    icon: 'restaurant',
    iconColor: 'black',
    markerColor: 'rgba(255,0,0,0.5)',
    outlineWidth: 1,
    iconSize: [31, 42],
    popupAnchor: [0, -42],
});

export { high_veloStationIcon, medium_veloStationIcon, low_veloStationIcon, restaurantIcon };
