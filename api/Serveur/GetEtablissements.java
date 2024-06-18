import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import etablissements_sup.ReponseEtablissement;

import java.io.IOException;
import java.io.OutputStream;

public class GetEtablissements implements HttpHandler {

    private ClientRMI cr;

    public GetEtablissements(ClientRMI cr) {
        this.cr = cr;
    }
    @Override
    public void handle(HttpExchange t) throws IOException {
        try {
            ReponseEtablissement response = (ReponseEtablissement) this.cr.appelRMI("recupererEtablissements", null);
            t.getResponseHeaders().set("Content-Type", response.getContentType());
            t.sendResponseHeaders(response.getStatusCode(), response.getResponseBody().getBytes().length);
            OutputStream os = t.getResponseBody();
            os.write(response.getResponseBody().getBytes());
            os.close();
        } catch (IOException e) {
            String message = "Une erreur s'est produite lors du traitement de la requête : " + e.getMessage();
            throw new RuntimeException(message, e);
        }
    }
}
