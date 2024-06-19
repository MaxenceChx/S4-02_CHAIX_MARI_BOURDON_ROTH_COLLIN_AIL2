package Serveur;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;

import java.io.IOException;
import java.io.OutputStream;


public class GetRestaurant implements HttpHandler {
    private String restaurantId;
    private ClientRMI cr;

    public GetRestaurant(String restaurantId, ClientRMI cr) {
        this.restaurantId = restaurantId;
        this.cr = cr;
    }

    @Override
    public void handle(HttpExchange t) {
        try {
            String response = (String) cr.appelRMI("recupererRestaurant", new String[] {restaurantId});

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
