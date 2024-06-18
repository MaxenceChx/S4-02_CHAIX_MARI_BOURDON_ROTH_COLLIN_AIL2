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
    private static final boolean DEBUG = true;
    public static void main(String[] args) {
        try {
            // On récupère le port spécifié en argument ou 1099 par défaut
            Registry reg = null;

            try {
                if (args.length != 2) {
                    System.out.println("utilisation : java Appel <adresse annuaire> <port annuaire>");
                    System.out.println("utilisation des valeurs par défaut : ");
                    System.out.println("\t- adresse : 127.0.0.1");
                    System.out.println("\t- port : 1099");
                    System.out.println();
                    reg = LocateRegistry.getRegistry("127.0.0.1", 1099);
                } else {
                    reg = LocateRegistry.getRegistry(args[0], Integer.parseInt(args[1]));
                }
                if (DEBUG){
                    System.out.println("annuaire local récupéré");
                }
            } catch (RemoteException e) {
                System.out.println("connexion au serveur impossible");
                System.exit(1);
            } catch (NumberFormatException e) {
                System.out.println("le port doit être un entier");
                System.exit(1);
            }

            // On crée une instance du service
            ServiceRestaurant serv = new ServiceRestaurant();
            if (DEBUG){
                System.out.println("service lancé");
            }

            // On exporte l'objet
            InterfaceRestaurant rd = (InterfaceRestaurant) UnicastRemoteObject.exportObject(serv, 0);
            if (DEBUG){
                System.out.println("objet exporté");
            }

            if (DEBUG){
                System.out.println("annuaire local récupéré");
            }

            // On enregistre le service dans l'annuaire
            InterfaceClient icr = (InterfaceClient) reg.lookup("clientRMI");
            icr.enregistrerService(rd, "service");
            if (DEBUG){
                System.out.println("service enregistré");
            }

            // On gère les exceptions
        } catch (NumberFormatException e) {
            System.out.println("erreur : le port spécifié n'est pas un entier");
            System.exit(1);
        } catch (ExportException e){
            System.out.println("erreur : le port pour l’export de l’objet est déjà utilisé");
            System.exit(1);
        } catch (ConnectException e) {
            System.out.println("erreur : l’annuaire rmiregistry est introuvable");
            System.exit(1);
        } catch (AccessException e) {
            System.out.println("erreur : accès interdit");
            System.exit(1);
        } catch (RemoteException e) {
            System.out.println("erreur : connexion au serveur impossible");
            System.exit(1);
        } catch (NotBoundException e) {
            e.printStackTrace();
        }
    }
}
