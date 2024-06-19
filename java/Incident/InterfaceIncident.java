package Incident;

import java.io.FileNotFoundException;
import java.rmi.Remote;
import java.rmi.RemoteException;
import java.rmi.server.ServerNotActiveException;

// Définition de l'interface du service distant
public interface InterfaceIncident extends Remote{
    // Définition de la méthode distante qui throw RemoteException et ServerNotActiveException
    public ReponseIncident recupererIncidents() throws RemoteException, ServerNotActiveException, FileNotFoundException;
}
