package Incident;

import java.io.Serializable;

public class ReponseIncident implements Serializable {
    public int statusCode;
    public String contentType, responseBody;

    public ReponseIncident(int statusCode, String contentType, String responseBody) {
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

    public String getResponseBody() {
        return responseBody;
    }
}