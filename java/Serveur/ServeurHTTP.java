package Serveur;

import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpServer;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.rmi.registry.LocateRegistry;
import java.rmi.registry.Registry;
import java.rmi.server.UnicastRemoteObject;
import java.util.HashMap;
import java.util.Map;

public class ServeurHTTP {
    private static ClientRMI client;

    public static void main(String[] args) throws IOException {
        // Lancement du client RMI
        Registry reg = LocateRegistry.createRegistry(1099);
        client = new ClientRMI();
        InterfaceClient icr = (InterfaceClient) UnicastRemoteObject.exportObject(client, 0);
        reg.rebind("clientRMI", icr);

        System.out.println("Lancement du serveur Http en cours...");

        // Crée un serveur HTTP sur le port 8000
        HttpServer server = HttpServer.create(new InetSocketAddress(8000), 0);

        // Crée des contextes pour les différentes routes
        server.createContext("/api/restaurants", new GetRestaurants(client));
        server.createContext("/api/restaurant", exchange -> {
            // Extraire les paramètres de la requête
            String query = exchange.getRequestURI().getQuery();
            String restaurantId = null;

            if (query != null) {
                String[] queryParams = query.split("&");

                for (String param : queryParams) {
                    String[] keyValue = param.split("=");

                    if (keyValue.length == 2 && keyValue[0].equals("nom")) {
                        restaurantId = keyValue[1];
                        break;
                    }
                }
            }

            // Créer une instance de getRestaurant avec l'ID du restaurant
            HttpHandler handler = new GetRestaurant(restaurantId, client);

            // Exécuter la logique de traitement de la requête dans getRestaurant
            handler.handle(exchange);
        });

        server.createContext("/api/reservation", exchange -> {
            if (exchange.getRequestMethod().equalsIgnoreCase("POST")) {
                InputStreamReader isr = new InputStreamReader(exchange.getRequestBody(), StandardCharsets.UTF_8);
                BufferedReader br = new BufferedReader(isr);
                String temp = br.readLine();
                StringBuilder sb = new StringBuilder();
                while (temp != null) {
                    sb.append(temp);
                    temp = br.readLine();
                }

                String jsonString = sb.toString();
                JSONObject obj = new JSONObject(jsonString);
                // Ajoute les valeurs à une map
                Map<String, String> parameters = new HashMap<>();
                parameters.put("nom", obj.getString("nom"));
                parameters.put("prenom", obj.getString("prenom"));
                parameters.put("nbpers", obj.getString("nbpers"));
                parameters.put("numtel", obj.getString("numtel"));
                parameters.put("date", obj.getString("date"));
                parameters.put("id_restaurant", obj.getString("id_restaurant"));

                HttpHandler handler = new PostReservation(parameters, client);

                handler.handle(exchange);
            }
        });

        server.createContext("/api/incidents", new GetIncidents(client));
        server.createContext("/api/etablissements", new GetEtablissements(client));
        server.setExecutor(null); // Crée un exécuteur par défaut
        server.start();
        // Affiche un message de lancement du serveur
        System.out.println("Serveur Http démarré sur le port 8000");
    }
}
