package Serveur;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;

import java.io.IOException;
import java.io.OutputStream;
import java.util.Map;

public class PostRestaurant implements HttpHandler {

    private Map<String, String> parameters;
    private ClientRMI cr;
    public PostRestaurant(Map<String, String> parameters, ClientRMI cr) {
        this.parameters = parameters;
        this.cr = cr;
    }


    @Override
    public void handle(HttpExchange t) throws IOException {
        String response = (String) cr.appelRMI("CreerRestaurant", new String[] {
                parameters.get("nom"),
                parameters.get("adresse"),
                parameters.get("latitude"),
                parameters.get("longitude")});
        t.getResponseHeaders().set("Content-Type", "application/json");
        // Envoyer la réponse
        t.sendResponseHeaders(200, response.getBytes().length);
        OutputStream os = t.getResponseBody();
        os.write(response.getBytes());
        os.close();
    }
}
