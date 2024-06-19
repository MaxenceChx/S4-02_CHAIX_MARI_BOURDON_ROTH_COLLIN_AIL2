package Restaurant;

import java.rmi.NotBoundException;
import java.rmi.server.ExportException;
import java.rmi.server.UnicastRemoteObject;
import java.rmi.AccessException;
import java.rmi.ConnectException;
import java.rmi.RemoteException;
import java.rmi.registry.Registry;
import java.rmi.registry.LocateRegistry;

import Serveur.InterfaceClient;

public class LancerServiceRestaurant {

    public static void main(String[] args) throws AccessException, RemoteException {
        try {
            // On récupère le port spécifié en argument ou 1099 par défaut
            int port = 1099;
            String adresse = "127.0.0.1";
            if (args.length > 0) {
                adresse = args[0];
            }
            if (args.length > 1) {
                port = Integer.parseInt(args[1]);
            }
            // On crée une instance du service
            ServiceRestaurant serv = new ServiceRestaurant();
            InterfaceRestaurant ir = (InterfaceRestaurant) UnicastRemoteObject.exportObject(serv, 0);

            Registry reg = LocateRegistry.getRegistry(adresse, port);
            InterfaceClient icr = (InterfaceClient) reg.lookup("clientRMI");
            icr.enregistrerService(ir, "restaurant");

            System.out.println("Service Incidents lancé sur le port " + port);
            // On gère les exceptions
        } catch (NumberFormatException e) {
            System.out.println("Le port spécifié n'est pas un entier");
        } catch (ExportException e){
            System.out.println("Le port pour l’export de l’objet est déjà utilisé");
        } catch (ConnectException e) {
            System.out.println("L’annuaire rmiregistry est introuvable");
        } catch (RemoteException e) {
            e.printStackTrace();
        } catch (NotBoundException e) {
            throw new RuntimeException(e);
        }
    }
}
