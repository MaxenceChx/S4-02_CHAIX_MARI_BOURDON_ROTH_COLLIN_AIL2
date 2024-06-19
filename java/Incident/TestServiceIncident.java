package Incident;

import java.rmi.registry.LocateRegistry;
import java.rmi.registry.Registry;

public class TestServiceIncident {
    public static void main(String[] args) {
        try {
            String adresse = "127.0.0.1";
            int port = 1099;

            Registry reg = LocateRegistry.getRegistry(adresse, port);
            InterfaceIncident ii = (InterfaceIncident) reg.lookup("incidents");

            ReponseIncident reponse = ii.recupererIncidents();
            System.out.println(reponse);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}