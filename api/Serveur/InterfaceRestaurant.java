import java.rmi.Remote;
import java.rmi.RemoteException;
import java.rmi.server.ServerNotActiveException;

// Définition de l'interface du service distant
public interface InterfaceRestaurant extends Remote{
    // Définition de la méthode distante qui throw RemoteException et ServerNotActiveException
    public String recupererRestaurants() throws RemoteException, ServerNotActiveException;
    public String recupererRestaurant(String nom) throws RemoteException, ServerNotActiveException;

    /*
    * Méthode pour enregistrer une réservation
    * @param nom : nom du client
    * @param prenom : prénom du client
    * @param nbpers : nombre de personnes
    * @param numtel : numéro de téléphone
    * @param date : date de la réservation
    * @param id_restaurant : id du restaurant
    * @return String : message de confirmation
     */
    public String enregistrerReservation(String nomRestau, String nom, String prénom, int nbpers, String numTel) throws RemoteException, ServerNotActiveException;


}
