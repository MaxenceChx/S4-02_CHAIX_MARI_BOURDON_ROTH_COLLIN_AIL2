package Restaurant;

import org.json.JSONObject;

import java.rmi.Remote;
import java.rmi.RemoteException;
import java.rmi.server.ServerNotActiveException;
import java.sql.Date;
import java.sql.Time;

// Définition de l'interface du service distant
public interface InterfaceRestaurant extends Remote{
    // Définition de la méthode distante qui throw RemoteException et ServerNotActiveException
    public String recupererRestaurants() throws RemoteException, ServerNotActiveException;
    public String recupererRestaurant(int num) throws RemoteException, ServerNotActiveException;

    public String creerRestaurant(String nom, String adresse, Double latitude, Double longitude) throws RemoteException, ServerNotActiveException;

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
    public String enregistrerReservation(int idrestau, Date date, Time heure, String nom, String prenom, int nb_personne) throws RemoteException, ServerNotActiveException;


}
