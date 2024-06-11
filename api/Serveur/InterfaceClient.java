import java.rmi.Remote;
import java.rmi.RemoteException;

public interface InterfaceClient {

    public void enregistrerService(Remote service, String nomService) throws RemoteException;

    public void supprimerService(Remote service);
}
