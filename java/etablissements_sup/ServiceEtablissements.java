package etablissements_sup;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.net.InetSocketAddress;
import java.net.ProxySelector;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.rmi.RemoteException;
import java.rmi.server.ServerNotActiveException;


public class ServiceEtablissements implements InterfaceEtablissements {
    public ReponseEtablissement recupererEtablissements() throws RemoteException, ServerNotActiveException, FileNotFoundException {
        ReponseEtablissement resultat = null;


        //new ServiceEtablissements().recupererEtablissements();
        // URL fournie sur arche non fonctionnelle
        //String url = "https://www.data.gouv.fr/fr/datasets/r/5fb6d2e3-609c-481d-9104-350e9ca134fa";
        // URL qui donne toutes les données json
        //String url = "https://data.enseignementsup-recherche.gouv.fr//explore/dataset/fr-esr-principaux-etablissements-enseignement-superieur/download?format=json&amp;timezone=Europe/Berlin&amp;use_labels_for_header=false";
        // URL qui donne les établissements d'enseignement supérieur de l'aire urbaine de Nancy
        //String url = "https://data.enseignementsup-recherche.gouv.fr/api/records/1.0/search/?dataset=fr-esr-implantations_etablissements_d_enseignement_superieur_publics&q=&refine.uucr_nom=Nancy";
        String url = "https://data.enseignementsup-recherche.gouv.fr/api/explore/v2.1/catalog/datasets/fr-esr-cartographie_formations_parcoursup/records?select=etab_uai%2C%20etab_nom%2C%20etab_url%2C%20etab_gps&limit=-1&refine=annee%3A\"2023\"&refine=departement%3A\"Meurthe-et-Moselle\"";
        String urlProxy = "www-cache";
        int port = 3128;
        //HttpClient httpClient = HttpClient.newHttpClient();
        HttpClient httpClient = HttpClient.newBuilder().proxy(ProxySelector.of(new InetSocketAddress(urlProxy, port))).build();
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(url))
                .build();
//        HttpClient httpClient = HttpClient.newBuilder().build();
//        HttpRequest request = HttpRequest.newBuilder()
//                .uri(URI.create(url))
//                .build();

        try {

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            int statusCode = response.statusCode();
            String contentType = response.headers().firstValue("Content-Type").orElse("");


            resultat = new ReponseEtablissement(statusCode, contentType, response.body());

        } catch (IOException | InterruptedException e) {
            e.printStackTrace();
            System.exit(1);
        }
        return resultat;
    }
}
