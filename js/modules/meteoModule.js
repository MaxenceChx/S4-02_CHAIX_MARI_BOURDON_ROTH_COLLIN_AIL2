// Constante contenant l'URL de l'API météo
const meteo_url = 'https://www.infoclimat.fr/public-api/gfs/json?_ll=48.67103,6.15083&_auth=ARsDFFIsBCZRfFtsD3lSe1Q8ADUPeVRzBHgFZgtuAH1UMQNgUTNcPlU5VClSfVZkUn8AYVxmVW0Eb1I2WylSLgFgA25SNwRuUT1bPw83UnlUeAB9DzFUcwR4BWMLYwBhVCkDb1EzXCBVOFQoUmNWZlJnAH9cfFVsBGRSPVs1UjEBZwNkUjIEYVE6WyYPIFJjVGUAZg9mVD4EbwVhCzMAMFQzA2JRMlw5VThUKFJiVmtSZQBpXGtVbwRlUjVbKVIuARsDFFIsBCZRfFtsD3lSe1QyAD4PZA%3D%3D&_c=19f3aa7d766b6ba91191c8be71dd1ab2';

// Fonction pour obtenir les données météo
async function getMeteo() {
    const data = await fetchWeatherData();

    if (data) {
        updateWeatherModal(data);
        return true;
    } else {
        return false;
    }
}

// Fonction pour obtenir les données météo depuis l'API
async function fetchWeatherData() {
    try {
        const response = await fetch(meteo_url);
        const data = await response.json();

        // Filtrer les données pour ne garder que les prévisions futures
        if (data.request_state === 200) {
            const now = new Date();
            const filteredKeys = Object.keys(data)
                .filter(key => {
                    const date = new Date(key);
                    return !isNaN(date) && date > now;
                })
                .sort((a, b) => new Date(a) - new Date(b))
                .slice(0, 5);
            
            const kelvinToCelsius = kelvin => parseFloat((kelvin - 273.15).toFixed(1)); // Conversion de Kelvin en Celsius

            // Filtrer les données pour ne garder que les informations nécessaires
            const filteredData = filteredKeys.reduce((obj, key) => {
                const hourData = data[key];
                obj[key] = {
                    humidite_2m: hourData.humidite ? hourData.humidite["2m"] : null,
                    pluie: hourData.pluie,
                    risque_neige: hourData.risque_neige === "oui",
                    temperature_2m: hourData.temperature ? kelvinToCelsius(hourData.temperature["2m"]) : null,
                    vent_direction_10m: hourData.vent_direction ? hourData.vent_direction["10m"] : null,
                    vent_moyen_10m: hourData.vent_moyen ? hourData.vent_moyen["10m"] : null,
                    vent_rafales_10m: hourData.vent_rafales ? hourData.vent_rafales["10m"] : null,
                    pression_niveau_de_la_mer: hourData.pression ? hourData.pression.niveau_de_la_mer : null,
                    nebulosite: hourData.nebulosite ? hourData.nebulosite.totale : null,
                };
                return obj;
            }, {});

            return filteredData;
        } else {
            return false;
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        return false;
    }
}

// Fonction pour mettre à jour le bouton de la météo
function updateBouton(weatherData) {
    const firstEntry = Object.keys(weatherData)[0];
    const data = weatherData[firstEntry];

    // Mettre à jour l'icon du bouton en fonction des conditions météo
    const meteoIcon = document.getElementById('meteo-icon');
    if (data.pluie > 1) {
        meteoIcon.className = 'fas fa-cloud-showers-heavy fa-xl';
    } else if (data.nebulosite > 50) {
        meteoIcon.className = 'fas fa-cloud fa-xl';
    } else if (data.risque_neige) {
        meteoIcon.className = 'fas fa-snowflake fa-xl';
    } else {
        meteoIcon.className = 'fas fa-sun fa-xl';
    }
}

// Fonction pour mettre à jour le modal de la météo
function updateWeatherModal(weatherData) {
    updateBouton(weatherData);

    // Mettre à jour les boutons de la météo
    const weatherButtonsContainer = document.getElementById('weather-buttons-container');
    weatherButtonsContainer.innerHTML = '';

    // Créer un bouton pour chaque date
    for (const [date, data] of Object.entries(weatherData)) {
        const button = document.createElement('button');
        button.className = 'weather-button';
        button.innerText = date.slice(8, 10) + '/' + date.slice(5, 7) + ' - ' + date.slice(11, 16); // Format de la date
        button.addEventListener('click', function() {
            updateWeatherDetails(data);

            // Mettre à jour l'aspect des boutons
            const buttons = document.getElementsByClassName('weather-button');
            for (const button of buttons) {
                button.classList.remove('active');
            }
            button.classList.add('active');
        });
        weatherButtonsContainer.appendChild(button);
    }

    // Mettre à jour les détails de la météo avec les données de la première date
    const firstEntry = Object.keys(weatherData)[0];
    updateWeatherDetails(weatherData[firstEntry]);
    const firstButton = document.getElementsByClassName('weather-button')[0];
    firstButton.classList.add('active');
}

// Fonction pour mettre à jour les détails de la météo
function updateWeatherDetails(data) {
    document.getElementById('humidite').innerText = data.humidite_2m;
    document.getElementById('nuage').innerText = data.nebulosite;
    document.getElementById('pluie').innerText = data.pluie;
    document.getElementById('pression').innerText = data.pression_niveau_de_la_mer/100;
    document.getElementById('neige').innerText = data.risque_neige ? 'Oui' : 'Non';
    document.getElementById('temperature').innerText = data.temperature_2m.toFixed(1);
    document.getElementById('directionVent').innerText = data.vent_direction_10m;
    document.getElementById('vitesseVent').innerText = data.vent_moyen_10m;
    document.getElementById('rafaleVent').innerText = data.vent_rafales_10m;

    // Mettre à jour l'icône générale en fonction des conditions météo
    const generalIcon = document.getElementById('general-icon');
    if (data.pluie > 1) {
        generalIcon.className = 'fas fa-cloud-showers-heavy fa-2xl';
    } else if (data.nebulosite > 50) {
        generalIcon.className = 'fas fa-cloud fa-2xl';
    } else if (data.risque_neige) {
        generalIcon.className = 'fas fa-snowflake fa-2xl';
    } else {
        generalIcon.className = 'fas fa-sun fa-2xl';
    }

    // Mettre à jour l'icône de la direction du vent
    const windDirectionIcon = document.getElementById('wind-direction-icon');
    windDirectionIcon.style.transform = `rotate(${data.vent_direction_10m}deg)`;
}

export { getMeteo }; // Exportation des fonctions