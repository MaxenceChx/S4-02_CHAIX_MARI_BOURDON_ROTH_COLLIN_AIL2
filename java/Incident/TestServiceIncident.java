package Incident;

import java.io.FileNotFoundException;
import java.rmi.AccessException;
import java.rmi.NotBoundException;
import java.rmi.RemoteException;
import java.rmi.registry.LocateRegistry;
import java.rmi.registry.Registry;
import java.rmi.server.ServerNotActiveException;

public class TestServiceIncident {
    public static void main(String[] args) {
        try {
            // Spécifiez l'adresse IP et le port du registre RMI
            String adresse = "localhost";
            int port = 1099;

            if (args.length > 0) {
                adresse = args[0];
            }
            if (args.length > 1) {
                port = Integer.parseInt(args[1]);
            }

            // Récupérer le registre RMI
            Registry registry = LocateRegistry.getRegistry(adresse, port);

            // Chercher le service "incidents" dans le registre
            InterfaceIncident incidentService = (InterfaceIncident) registry.lookup("incidents");

            // Appeler la méthode `recupererIncidents` et afficher la réponse
            ReponseIncident response = incidentService.recupererIncidents();
            System.out.println("Status Code: " + response.getStatusCode());
            System.out.println("Content Type: " + response.getContentType());
            System.out.println("Response Body: " + response.getResponseBody());

        } catch (AccessException e) {
            e.printStackTrace();
        } catch (RemoteException e) {
            e.printStackTrace();
        } catch (NotBoundException e) {
            e.printStackTrace();
        } catch (ServerNotActiveException e) {
            throw new RuntimeException(e);
        } catch (FileNotFoundException e) {
            throw new RuntimeException(e);
        }
    }
}
