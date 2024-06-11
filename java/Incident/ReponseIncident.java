package Incident;

import java.io.Serializable;

public class ReponseIncident implements Serializable {

    private int statusCode;
    private String contentType, responseBody;

    public ReponseIncident(int status, String contenttype, String body) {
        this.statusCode = status;
        this.contentType = contenttype;
        this.responseBody = body;
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

    @Override
    public String toString() {
        return "ReponseIncident{{" +
                "statusCode=" + this.statusCode +
                ", contentType='" + this.contentType + '\'' +
                ", responseBody='" + this.responseBody + '\'' +
                '}';
    }
}
