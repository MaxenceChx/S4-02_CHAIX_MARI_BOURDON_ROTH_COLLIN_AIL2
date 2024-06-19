package Serveur;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import etablissements_sup.ReponseEtablissement;

import java.io.IOException;
import java.io.OutputStream;

public class GetEtablissements implements HttpHandler {

    private ClientRMI cr;

    public GetEtablissements(ClientRMI cr) {
        this.cr = cr;
    }

    @Override
    public void handle(HttpExchange t) throws IOException {
        try {
            if (t.getRequestMethod().equalsIgnoreCase("OPTIONS")) {
                // Respond to preflight CORS requests
                Utils.addCorsHeaders(t);
                t.sendResponseHeaders(204, -1); // No Content
                return;
            }

            ReponseEtablissement response = (ReponseEtablissement) this.cr.appelRMI("recupererEtablissements", null);

            t.getResponseHeaders().set("Content-Type", response.getContentType());
            Utils.addCorsHeaders(t);
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