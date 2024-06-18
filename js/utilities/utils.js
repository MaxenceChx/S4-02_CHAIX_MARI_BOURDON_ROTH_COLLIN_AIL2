// Fonction qui retourne true si l'utilisateur utilise un appareil Apple (iPhone, iPad, iPod, Macintosh)
function isAppleDevice() {
    return /iPhone|iPad|iPod|Macintosh/.test(navigator.userAgent);
}

export { isAppleDevice }; // Exportation de la fonction isAppleDevice