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
            String response = (String) cr.appelRMI("creerRestaurant", new String[]{
                parameters.get("nom"),
                parameters.get("adresse"),
                parameters.get("latitude"),
                parameters.get("longitude")
            });

            // Send response
            t.getResponseHeaders().set("Content-Type", "application/json");
            t.sendResponseHeaders(200, response.getBytes().length);
            OutputStream os = t.getResponseBody();
            System.out.println(response);
            os.write(response.getBytes());
            os.close();
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}
