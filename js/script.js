import { initMap } from "./map.js";
import { checkModuleStatuses } from "./modules/statusModule.js";

initMap(); // Initialisation de la carte

// Vérification des statuts des modules
checkModuleStatuses();