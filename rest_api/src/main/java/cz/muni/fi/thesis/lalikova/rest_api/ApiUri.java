package cz.muni.fi.thesis.lalikova.rest_api;

public enum ApiUri {

    ROOT_URI ("/rest"),

    ROOT_URI_USER ("/users/{id}"),
    ROOT_URI_USERS("/users"),

    ROOT_URI_COORDINATE ("/coordinates/{id}"),
    ROOT_URI_COORDINATES("/coordinates"),

    ROOT_URI_PHOTO ("/photos/{id}"),
    ROOT_URI_PHOTOS("/photos"),

    ROOT_URI_ROUTE ("/routes/{id}"),
    ROOT_URI_ROUTES("/routes"),

    ROOT_URI_PHOTO_TAG ("/point_tags/{id}"),
    ROOT_URI_PHOTO_TAGS("/point_tags"),

    ROOT_URI_POINT ("/points/{id}"),
    ROOT_URI_POINTS("/points");

    private final String uri;
    ApiUri(String uri) {
        this.uri = uri;
    }

    private String getUri() {
        return uri;
    }
}
