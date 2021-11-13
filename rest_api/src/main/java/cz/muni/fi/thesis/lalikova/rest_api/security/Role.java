package cz.muni.fi.thesis.lalikova.rest_api.security;

public enum Role {

    LIMITED ( "LIMITED_ACCESS"),
    FULL ("FULL_ACCESS");

    private final String type;
    Role(String type) {
        this.type = type;
    }

    private String getType() {
        return type;
    }
}
