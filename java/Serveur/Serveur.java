package Serveur;

import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpsConfigurator;
import com.sun.net.httpserver.HttpsParameters;
import com.sun.net.httpserver.HttpsServer;
import org.json.JSONObject;

import javax.net.ssl.*;
import java.io.BufferedReader;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStreamReader;
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
                // add the values to a map
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
        server.setExecutor(null); // creates a default executor
        server.start();
        // on affiche un message de lancement du serveur
        System.out.println("Serveur Http démarré sur le port 8000");
    }
}
