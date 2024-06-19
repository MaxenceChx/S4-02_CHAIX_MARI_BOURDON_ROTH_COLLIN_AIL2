package Incident;

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


public class ServiceIncident implements InterfaceIncident {
    public ReponseIncident recupererIncidents() throws RemoteException, ServerNotActiveException, FileNotFoundException {
        ReponseIncident resultat = null;

        String url = "https://carto.g-ny.org/data/cifs/cifs_waze_v2.json";
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

            resultat = new ReponseIncident(statusCode, contentType, response.body());

        } catch (IOException | InterruptedException e) {
            e.printStackTrace();
            System.exit(1);
        }
        return resultat;
    }
}
