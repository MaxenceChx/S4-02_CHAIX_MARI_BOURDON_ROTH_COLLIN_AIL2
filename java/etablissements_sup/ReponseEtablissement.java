package etablissements_sup;

import org.json.JSONObject;

import java.io.Serializable;

public class ReponseEtablissement implements Serializable {
    public int statusCode;
    public String contentType, responseBody;

    public ReponseEtablissement(int statusCode, String contentType, JSONObject responseBody) {
        this.statusCode = statusCode;
        this.contentType = contentType;
        this.responseBody = responseBody;
    }

    @Override
    public String toString() {
        return "ReponseEtablissement{" +
                "statusCode=" + statusCode +
                ", contentType='" + contentType + '\'' +
                ", responseBody='" + responseBody + '\'' +
                '}';
    }

    public int getStatusCode() {
        return statusCode;
    }

    public String getContentType() {
        return contentType;
    }

    public JSONObject getResponseBody() {
        return responseBody;
    }
}
