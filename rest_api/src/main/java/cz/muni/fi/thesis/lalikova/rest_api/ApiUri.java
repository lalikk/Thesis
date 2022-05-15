package cz.muni.fi.thesis.lalikova.rest_api;

public class ApiUri {

    public static final String ROOT_URI = "/rest";

    public static final String ROOT_URI_USER = "/users/{id}";
    public static final String ROOT_URI_USERS = "/users";

    public static final String ROOT_URI_COORDINATE = "/coordinates/{id}";
    public static final String ROOT_URI_COORDINATES = "/coordinates";

    public static final String ROOT_URI_DISTANCE = "/distances/{id}";
    public static final String ROOT_URI_DISTANCE_AUTH = "/auth/distances/{id}";
    public static final String ROOT_URI_DISTANCES = "/distances";
    public static final String ROOT_URI_DISTANCES_AUTH = "/auth/distances";

    public static final String ROOT_URI_PHOTO = "/photos/{id}";
    public static final String ROOT_URI_PHOTOS = "/photos";

    public static final String ROOT_URI_ROUTE = "/routes/{id}";
    public static final String ROOT_URI_ROUTES = "/routes";

    public static final String ROOT_URI_ROUTES_AUTH = "/auth/routes";

    public static final String ROOT_URI_ROUTE_AUTH = "/auth/route/{id}";

    public static final String ROOT_URI_POINT_TAG = "/point_tags/{id}";
    public static final String ROOT_URI_POINT_TAGS = "/point_tags";

    public static final String ROOT_URI_POINT = "/points/{id}";
    public static final String ROOT_URI_POINTS = "/points";
    public static final String ROOT_URI_POINTS_AUTH = "/auth/points";
    public static final String ROOT_URI_POINT_AUTH = "/auth/point/{id}";
    public static final String ROOT_URI_ROUTE_POINTS = "/route_points/{id}";

    public static final String ROOT_URI_LOGIN = "/login";
    public static final String ROOT_URI_AUTH = "/auth_check";

}
