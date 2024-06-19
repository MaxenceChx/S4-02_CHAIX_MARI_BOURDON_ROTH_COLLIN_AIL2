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

        String url = "https://data.enseignementsup-recherche.gouv.fr/api/explore/v2.1/catalog/datasets/fr-esr-cartographie_formations_parcoursup/records?select=etab_uai%2C%20etab_nom%2C%20etab_url%2C%20etab_gps&limit=-1&refine=annee%3A%222023%22&refine=departement%3A%22Meurthe-et-Moselle%22";
        String urlProxy = "www-cache.iutnc.univ-lorraine.fr";
        int port = 3128;
        HttpClient httpClient = HttpClient.newBuilder()
                .proxy(ProxySelector.of(new InetSocketAddress(urlProxy, port)))
                .build();

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(url))
                .build();

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
