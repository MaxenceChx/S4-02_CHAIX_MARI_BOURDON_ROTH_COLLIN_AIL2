package Restaurant;

import java.rmi.Remote;
import java.rmi.RemoteException;
import java.rmi.server.ServerNotActiveException;
import java.sql.Date;
import java.sql.Time;

public interface InterfaceRestaurant extends Remote {
    String recupererRestaurants() throws RemoteException, ServerNotActiveException;
    String recupererRestaurant(int num) throws RemoteException, ServerNotActiveException;
    String creerRestaurant(String nom, String adresse, Double latitude, Double longitude) throws RemoteException, ServerNotActiveException;
    String enregistrerReservation(int idrestau, String date, String heure, String nom, String prenom, int nb_personne) throws RemoteException, ServerNotActiveException;
}
