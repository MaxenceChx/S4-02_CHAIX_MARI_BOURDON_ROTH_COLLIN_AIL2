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
        try {
            // Add CORS headers
            Utils.addCorsHeaders(t);

            if (t.getRequestMethod().equalsIgnoreCase("OPTIONS")) {
                // Respond to preflight CORS requests
                t.sendResponseHeaders(204, -1); // No Content
                return;
            }

            String response = (String) cr.appelRMI("CreerRestaurant", new String[]{
                    parameters.get("nom"),
                    parameters.get("adresse"),
                    parameters.get("latitude"),
                    parameters.get("longitude")});
            t.getResponseHeaders().set("Content-Type", "application/json");
            t.sendResponseHeaders(200, response.getBytes().length);
            OutputStream os = t.getResponseBody();
            os.write(response.getBytes());
            os.close();
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}
