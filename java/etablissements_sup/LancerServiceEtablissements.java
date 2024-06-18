package etablissements_sup;

import java.rmi.AccessException;
import java.rmi.ConnectException;
import java.rmi.NotBoundException;
import java.rmi.RemoteException;
import java.rmi.registry.LocateRegistry;
import java.rmi.registry.Registry;
import java.rmi.server.ExportException;
import java.rmi.server.UnicastRemoteObject;
import Serveur.InterfaceClient;

public class LancerServiceEtablissements {
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
            ServiceEtablissements serv = new ServiceEtablissements();
            InterfaceEtablissements ie = (InterfaceEtablissements) UnicastRemoteObject.exportObject(serv, 0);
            System.out.println(ie);
            // On exporte l'objet
            //InterfaceEtablissements rd = (InterfaceEtablissements) UnicastRemoteObject.exportObject(serv, 0);
            // On récupère l'annuaire distant rmiregistry
            Registry reg = LocateRegistry.getRegistry(adresse, port);
            InterfaceClient icr = (InterfaceClient) reg.lookup("clientRMI");
            icr.enregistrerService(ie, "etablissements");
            // On enregistre le service dans l'annuaire
            //reg.rebind("etablissements", rd);
            // On affiche un message pour le suivi
            System.out.println("Service Etablissements lancé sur le port " + port);
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
            e.printStackTrace();
        }
    }
}
