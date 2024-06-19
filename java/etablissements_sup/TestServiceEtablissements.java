package etablissements_sup;

import java.rmi.registry.LocateRegistry;
import java.rmi.registry.Registry;

public class TestServiceEtablissements {
    public static void main(String[] args) {
        try {
            // Adresse et port du registre RMI
            String adresse = "127.0.0.1";
            int port = 1099;

            // Récupération du registre RMI
            Registry reg = LocateRegistry.getRegistry(adresse, port);

            // Recherche du service dans le registre
            InterfaceEtablissements ie = (InterfaceEtablissements) reg.lookup("etablissements");

            // Appel d'une méthode sur le service
            ReponseEtablissement reponse = ie.recupererEtablissements();
            System.out.println(reponse);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}

