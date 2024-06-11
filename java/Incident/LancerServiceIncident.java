package Incident;

import java.rmi.AccessException;
import java.rmi.NotBoundException;
import java.rmi.RemoteException;
import java.rmi.registry.LocateRegistry;
import java.rmi.registry.Registry;
import java.rmi.server.UnicastRemoteObject;

public class LancerServiceIncident {

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
            ServiceIncident serv = new ServiceIncident();
            // On exporte l'objet
            InterfaceIncident ii = (InterfaceIncident) UnicastRemoteObject.exportObject(serv, 0);
            // On récupère l'annuaire distant rmiregistry
            //Registry reg = LocateRegistry.getRegistry(adresse, port);
            //InterfaceClientRMI icr = (InterfaceClientRMI) reg.lookup("clientRMI");
            //icr.enregistrerService(ii, "incidents");
            Registry reg = LocateRegistry.createRegistry(port);
            // On enregistre le service dans l'annuaire
            reg.rebind("incidents", ii);
            //On affiche un message pour le suivi
            System.out.println("Service Etablissements lancé sur le port " + port);
            // On gère les exceptions
        } catch (RemoteException e) {
            e.printStackTrace();
        }
    }
}
