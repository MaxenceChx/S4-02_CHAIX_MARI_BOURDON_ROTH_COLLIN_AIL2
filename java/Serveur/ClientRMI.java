package Serveur;

import java.io.FileNotFoundException;
import java.io.Serializable;
import java.rmi.ConnectException;
import java.rmi.Remote;
import java.rmi.RemoteException;
import java.rmi.UnknownHostException;
import java.rmi.registry.LocateRegistry;
import java.rmi.registry.Registry;
import java.rmi.server.ServerNotActiveException;
import java.util.HashMap;
import etablissements_sup.*;
import Incident.*;
import Restaurant.*;

public class ClientRMI implements InterfaceClient, Serializable {
    public static String ip = "127.0.0.1";
    public static int port = 1099;
    private HashMap<String, Remote> listeServices;

    public ClientRMI(String ip, int port) {
        this.ip = ip;
        this.port = port;
        this.listeServices = new HashMap<String, Remote>();
    }

    public ClientRMI(){
        this.listeServices = new HashMap<String, Remote>();
    }

    public Object appelRMI(String methode, String[] params) {
        Object response = "{\n\tsuccess: false,\n\tmessage: \"Une erreur est survenue\"\n}";

        try {
            Registry reg = null;
            try {
                reg = LocateRegistry.getRegistry(this.ip, this.port);
            } catch (RemoteException e) {
                System.out.println("connexion au serveur impossible");
                //System.exit(1);
            }

            InterfaceRestaurant ir = null;
            InterfaceEtablissements ie = null;
            InterfaceIncident ii = null;
            try {
                ir = (InterfaceRestaurant) this.listeServices.get("service");
            } catch (Exception e) {
                System.out.println("Service restaurant introuvable");
            }

            try {
                ie = (InterfaceEtablissements) this.listeServices.get("etablissements");
            } catch (Exception e) {
                System.out.println("Service etablissements introuvable");
            }

            try {
                ii = (InterfaceIncident) this.listeServices.get("incidents");
            } catch (Exception e) {
                System.out.println("Service incidents introuvable");
            }

            // On récupère le service distant
            switch (methode) {
                case "recupererRestaurants":
                    response = ir.recupererRestaurants();
                    break;
                case "recupererRestaurant":
                    response = ir.recupererRestaurant(String.valueOf(params[0]));
                    break;
                case "enregistrerReservation":
                    response = ir.enregistrerReservation(params[0], params[1], params[2], Integer.parseInt(params[3]), params[4]);
                    break;
                case "recupererEtablissements":
                    response = ie.recupererEtablissements();
                    break;
                case "recupererIncidents":
                    response = ii.recupererIncidents();
                    break;
            }


            // On gère les exceptions
        } catch (ArrayIndexOutOfBoundsException e) {
            System.out.println("Une IP ou un hôte doit être spécifié en argument");
        } catch (NullPointerException e) {
            e.printStackTrace();
            System.out.println("Le service distant appelé est introuvable");
        } catch (UnknownHostException e) {
            System.out.println("Serveur inexistant ou introuvable");
        } catch (ConnectException e) {
            System.out.println("Impossible de se connecter à l’annuaire rmiregistry distant");
        } catch (RemoteException e) {
            System.out.println("Impossible de se connecter au serveur distant");
        } catch (ServerNotActiveException | FileNotFoundException e) {
            throw new RuntimeException(e);
        }

        return response;
    }

    @Override
    public void enregistrerService(Remote service, String nomService) throws RemoteException {
        this.listeServices.put(nomService, (Remote) service);
        System.out.println("Service " + nomService + " enregistré");
    }

    public void supprimerService(Remote service) {
        this.listeServices.remove(service);
    }
}
