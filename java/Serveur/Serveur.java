package Serveur;

import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpsConfigurator;
import com.sun.net.httpserver.HttpsParameters;
import com.sun.net.httpserver.HttpsServer;
import org.json.JSONException;
import org.json.JSONObject;

import javax.net.ssl.*;
import java.io.*;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.rmi.registry.LocateRegistry;
import java.rmi.registry.Registry;
import java.rmi.server.UnicastRemoteObject;
import java.security.*;
import java.security.cert.CertificateException;
import java.util.HashMap;
import java.util.Map;

public class Serveur {
    private static ClientRMI client;
    public static void main(String[] args) throws IOException, NoSuchAlgorithmException, KeyStoreException, CertificateException, UnrecoverableKeyException, KeyManagementException {

        // Lancement du client RMI
        Registry reg = LocateRegistry.createRegistry(1099);
        client = new ClientRMI();
        InterfaceClient icr = (InterfaceClient) UnicastRemoteObject.exportObject(client, 0);
        reg.rebind("clientRMI", icr);


        System.out.println("Lancement du serveur Https en cours...");

        HttpsServer server = HttpsServer.create(new InetSocketAddress(8000), 0);
        SSLContext sslContext = SSLContext.getInstance("TLS");

        // initialise the keystore
        char[] password = "password".toCharArray();
        KeyStore ks = KeyStore.getInstance("JKS");
        FileInputStream fis = new FileInputStream("java/key.jks");
        ks.load(fis, password);
        fis.close();

        // setup the key manager factory
        KeyManagerFactory kmf = KeyManagerFactory.getInstance("SunX509");
        kmf.init(ks, password);

        // setup the trust manager factory
        TrustManagerFactory tmf = TrustManagerFactory.getInstance("SunX509");
        tmf.init(ks);

        // setup the HTTPS context and parameters
        sslContext.init(kmf.getKeyManagers(), tmf.getTrustManagers(), null);
        server.setHttpsConfigurator(new HttpsConfigurator(sslContext) {
            public void configure(HttpsParameters params) {
                try {
                    // initialise the SSL context
                    SSLContext context = getSSLContext();
                    SSLEngine engine = context.createSSLEngine();
                    params.setNeedClientAuth(false);
                    params.setCipherSuites(engine.getEnabledCipherSuites());
                    params.setProtocols(engine.getEnabledProtocols());

                    // Set the SSL parameters
                    SSLParameters sslParameters = context.getSupportedSSLParameters();
                    params.setSSLParameters(sslParameters);

                } catch (Exception ex) {
                    System.out.println("Failed to create HTTPS port");
                }
            }
        });
        server.createContext("/api/restaurants", new GetRestaurants(client));
        server.createContext("/api/restaurant", exchange -> {
            // Extraire l'ID du restaurant de l'URI de la requête
            String requestURI = exchange.getRequestURI().toString();
            String[] uriParts = requestURI.split("/");
            String restaurantId = null;

            if (uriParts.length > 3) {
                restaurantId = uriParts[3];
            }

            // Créer une instance de GetRestaurant avec l'ID du restaurant
            HttpHandler handler = new GetRestaurant(restaurantId, client);

            // Exécuter la logique de traitement de la requête dans GetRestaurant
            handler.handle(exchange);
        });

        server.createContext("/api/reservation", exchange -> {
            System.out.println("Nouvelle requête " + exchange.getRequestMethod() + " reçue sur " + exchange.getRequestURI());

            // Add CORS headers
            Utils.addCorsHeaders(exchange);

            if (exchange.getRequestMethod().equalsIgnoreCase("OPTIONS")) {
                // Respond to preflight CORS requests
                exchange.sendResponseHeaders(204, -1); // No Content
                return;
            }

            if (exchange.getRequestMethod().equalsIgnoreCase("POST")) {
                InputStreamReader isr = new InputStreamReader(exchange.getRequestBody(), StandardCharsets.UTF_8);
                BufferedReader br = new BufferedReader(isr);
                StringBuilder sb = new StringBuilder();
                String temp;
                while ((temp = br.readLine()) != null) {
                    sb.append(temp);
                }
                String jsonString = sb.toString();

                System.out.println("Données JSON reçues pour la réservation : " + jsonString);

                try {
                    JSONObject obj = new JSONObject(jsonString);

                    // Ajouter les valeurs à une map
                    Map<String, String> parameters = new HashMap<>();
                    parameters.put("id_restaurant", obj.getString("id_restaurant"));
                    parameters.put("nom", obj.getString("nom"));
                    parameters.put("prenom", obj.getString("prenom"));
                    parameters.put("nbpers", obj.getString("nbpers"));
                    parameters.put("date", obj.getString("date"));
                    parameters.put("heure", obj.getString("heure"));

                    System.out.println("Paramètres extraits pour la réservation : " + parameters);

                    // Créer une instance de PostReservation avec les paramètres et le client RMI
                    HttpHandler handler = new PostReservation(parameters, client);
                    handler.handle(exchange);

                    System.out.println("Réservation créée avec succès.");

                } catch (JSONException e) {
                    e.printStackTrace();
                    // En cas d'erreur lors de la lecture du JSON
                    String errorResponse = "{\"success\": false, \"error\": \"Erreur lors de la lecture des données JSON pour la réservation.\"}";
                    exchange.sendResponseHeaders(400, errorResponse.getBytes().length);
                    OutputStream os = exchange.getResponseBody();
                    os.write(errorResponse.getBytes());
                    os.close();
                }
            } else {
                // Répondre avec une méthode non autorisée si ce n'est pas une requête POST
                System.out.println("Méthode de requête non autorisée : " + exchange.getRequestMethod());
                exchange.sendResponseHeaders(405, -1); // 405 Method Not Allowed
            }
        });


        server.createContext("/api/createRestaurant", exchange -> {
            System.out.println("Nouvelle requête " + exchange.getRequestMethod() + " reçue sur " + exchange.getRequestURI());

            // Add CORS headers
            Utils.addCorsHeaders(exchange);

            if (exchange.getRequestMethod().equalsIgnoreCase("OPTIONS")) {
                // Respond to preflight CORS requests
                exchange.sendResponseHeaders(204, -1); // No Content
                return;
            }

            if (exchange.getRequestMethod().equalsIgnoreCase("POST")) {
                InputStreamReader isr = new InputStreamReader(exchange.getRequestBody(), StandardCharsets.UTF_8);
                BufferedReader br = new BufferedReader(isr);
                StringBuilder sb = new StringBuilder();
                String temp;
                while ((temp = br.readLine()) != null) {
                    sb.append(temp);
                }
                String jsonString = sb.toString();

                System.out.println("Données JSON reçues : " + jsonString);

                try {
                    JSONObject obj = new JSONObject(jsonString);

                    // Ajouter les valeurs à une map
                    Map<String, String> parameters = new HashMap<>();
                    parameters.put("nom", obj.getString("nom"));
                    parameters.put("adresse", obj.getString("adresse"));
                    parameters.put("latitude", obj.getString("latitude"));
                    parameters.put("longitude", obj.getString("longitude"));

                    System.out.println("Paramètres extraits : " + parameters);

                    // Créer une instance de PostRestaurant avec les paramètres et le client RMI
                    HttpHandler handler = new PostRestaurant(parameters, client);
                    handler.handle(exchange);

                    System.out.println("Restaurant créé avec succès.");

                } catch (JSONException e) {
                    e.printStackTrace();
                    // En cas d'erreur lors de la lecture du JSON
                    String errorResponse = "{\"success\": false, \"error\": \"Erreur lors de la lecture des données JSON.\"}";
                    exchange.sendResponseHeaders(400, errorResponse.getBytes().length);
                    OutputStream os = exchange.getResponseBody();
                    os.write(errorResponse.getBytes());
                    os.close();
                }
            } else {
                // Répondre avec une méthode non autorisée si ce n'est pas une requête POST
                System.out.println("Méthode de requête non autorisée : " + exchange.getRequestMethod());
                exchange.sendResponseHeaders(405, -1); // 405 Method Not Allowed
            }
        });


        server.createContext("/api/incidents", new GetIncidents(client));

        server.createContext("/api/etablissements", new GetEtablissements(client));
        server.setExecutor(null); // creates a default executor
        server.start();
        // on affiche un message de lancement du serveur
        System.out.println("Serveur Http démarré sur le port 8000");
    }
}
