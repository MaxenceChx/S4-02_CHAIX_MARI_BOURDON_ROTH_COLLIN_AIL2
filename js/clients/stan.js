class Stan {
    // Récupère les prochains passages pour un arrêt donné
    static async getProchainsPassages(arret) {
        const rep = (await Stan.getClient().request({
            method: 'POST',
            body: `requete=tempsreel_submit&requete_val%5Barret%5D=${arret.osmid}&requete_val%5Bligne_omsid%5D=${arret.ligne?.osmid}`
        })).split('<li>').slice(1);
        const passages = [];
        for (const rawPassageLi of rep) {
            const direction = /<span>([^"]+)<\/span><\/span>/g.exec(rawPassageLi);
            const ligne = /<span id="ui-ligne-(\d+)".*\/pictolignes\/([^"]+).png'/g.exec(rawPassageLi);
            const regexPassagesNow = /class="tpsreel-temps-item large-1 "><i class="icon-car1"><\/i><i title="Temps Réel" class="icon-wifi2"><\/i>/g;
            const regexPassagesMin = /class="tpsreel-temps-item large-1 ">(\d+) min/g;
            const regexPassagesH = /temps-item-heure">(\d+)h(\d+)(.*)<\/a>/g;
            let rawPassage;
            while ((rawPassage = regexPassagesMin.exec(rawPassageLi)) !== null) {
                passages.push({
                    arret: { ligne: { ...arret.ligne, id: parseInt(ligne[1], 10), numlignepublic: ligne[2] }, ...arret },
                    direction: direction[1],
                    temps_min: parseInt(rawPassage[1]),
                    temps_theorique: false
                });
            }
            while ((rawPassage = regexPassagesH.exec(rawPassageLi)) !== null) {
                passages.push({
                    arret: { ligne: { ...arret.ligne, id: parseInt(ligne[1], 10), numlignepublic: ligne[2] }, ...arret },
                    direction: direction[1],
                    temps_min: parseInt(rawPassage[1]) * 60 + parseInt(rawPassage[2]),
                    temps_theorique: rawPassage[0].includes('tpsreel-temps-item-tpstheorique')
                });
            }
            while ((rawPassage = regexPassagesNow.exec(rawPassageLi)) !== null) {
                passages.push({
                    arret: { ligne: { ...arret.ligne, id: parseInt(ligne[1], 10), numlignepublic: ligne[2] }, ...arret },
                    direction: direction[1],
                    temps_min: 0,
                    temps_theorique: false
                });
            }
        }
        return passages;
    }

    // Récupère le client pour les requêtes
    static getClient() {
        return {
            async request(options) {
                const response = await fetch('https://www.reseau-stan.com/?type=476', {
                    method: options.method || 'GET',
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest',
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: options.body
                });
                return response.text();
            }
        };
    }
}

export default Stan; // Exportation de la classe
