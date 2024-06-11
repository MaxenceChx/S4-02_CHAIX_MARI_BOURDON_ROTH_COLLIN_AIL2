package Incident;
import java.io.FileNotFoundException;
import java.rmi.Remote;
import java.rmi.RemoteException;
import java.rmi.server.ServerNotActiveException;

public interface InterfaceIncident extends Remote{

    public ReponseIncident getIncident() throws RemoteException, FileNotFoundException, ServerNotActiveException;

}
