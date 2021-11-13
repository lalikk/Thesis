package cz.muni.fi.thesis.lalikova.rest_api.security;

public class JwtResponse {
    private final String jwt;
    private final String role;
    private final String username;

    public JwtResponse(String jwt, String role, String username) {
        this.jwt = jwt;
        this.role = role;
        this.username = username;
    }

    public String getJwt() {
        return jwt;
    }

    public String getRole() {
        return role;
    }

    public String getUsername() {
        return username;
    }
}
