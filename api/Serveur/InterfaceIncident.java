import Incident.ReponseIncident;

import java.io.FileNotFoundException;
import java.rmi.Remote;
import java.rmi.RemoteException;
import java.rmi.server.ServerNotActiveException;

public interface InterfaceIncident extends Remote{

    public ReponseIncident recupererIncidents() throws RemoteException, FileNotFoundException, ServerNotActiveException;

}
