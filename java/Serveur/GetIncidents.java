package Serveur;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import Incident.ReponseIncident;

import java.io.IOException;
import java.io.OutputStream;

public class GetIncidents implements HttpHandler {

    private ClientRMI cr;

    public GetIncidents(ClientRMI cr) {
        this.cr = cr;
    }

    @Override
    public void handle(HttpExchange t) throws IOException {
        try {
            ReponseIncident response = (ReponseIncident) this.cr.appelRMI("recupererIncidents", null);

            t.getResponseHeaders().set("Content-Type", response.getContentType());
            t.sendResponseHeaders(response.getStatusCode(), response.getResponseBody().getBytes().length);
            OutputStream os = t.getResponseBody();
            os.write(response.getResponseBody().getBytes());
            os.close();
        } catch (IOException e) {
            String message = "Une erreur s'est produite lors du traitement de la requête : " + e.getMessage();
            e.printStackTrace();
            throw new RuntimeException(message, e);
        }
    }
}
