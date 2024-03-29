package cz.muni.fi.thesis.lalikova;

import cz.muni.fi.thesis.lalikova.dao.CoordinatesDao;
import cz.muni.fi.thesis.lalikova.dao.PointDao;
import cz.muni.fi.thesis.lalikova.dao.PointTagDao;
import cz.muni.fi.thesis.lalikova.dao.PhotoDao;
import cz.muni.fi.thesis.lalikova.dao.RouteDao;
import cz.muni.fi.thesis.lalikova.entity.Route;
import cz.muni.fi.thesis.lalikova.entity.PointTag;
import cz.muni.fi.thesis.lalikova.entity.Photo;
import cz.muni.fi.thesis.lalikova.entity.Coordinates;
import cz.muni.fi.thesis.lalikova.entity.Point;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.util.Collections;
import java.util.Set;

@Component
@Transactional
public class TestData
{
    @Autowired
    private PointDao pointDao;

    @Autowired
    private RouteDao routeDao;

    @Autowired
    private PhotoDao photoDao;

    @Autowired
    private PointTagDao pointTagDao;

    @Autowired
    private CoordinatesDao coordinatesDao;

    public void loadData() throws IOException {
        PointTag pointTag1 = createPointTag("Tag 1", "First tag");
        PointTag pointTag2 = createPointTag("Tag 2", "Second tag");

        Route route1 = createRoute("Route 1", "Route desc");
        Route route2 = createRoute("Route 2", "Route desc");
        Route route3 = createRoute("Route 3", "Route desc");

        Point point1 = createPoint("Point 1", "Point 1", Set.of(pointTag1, pointTag2), Set.of(route1,route2));
        Point point2 = createPoint("Point 2", "Point 2", Set.of(pointTag1, pointTag2), Set.of(route1,route2));
        Point point3 = createPoint("Point 3", "Point 3", Set.of(pointTag2), Set.of(route1));
        Point point4 = createPoint("Point 4", "Point 4", Set.of(pointTag2), Set.of(route1,route2));
        Point point5 = createPoint("Point 5", "Point 5", Set.of(pointTag1), Set.of(route2));
        Point point6 = createPoint("Point 6", "Point 6", Collections.EMPTY_SET, Set.of(route1));

        Coordinates coordinates1 = createCoordinates(1.00, 2.00, point1);   // TODO find values to work with maps later
        Coordinates coordinates2 = createCoordinates(1.00, 2.00, point2);
        Coordinates coordinates3 = createCoordinates(1.00, 2.00, point3);
        Coordinates coordinates4 = createCoordinates(1.00, 2.00, point4);
        Coordinates coordinates5 = createCoordinates(1.00, 2.00, point5);
        Coordinates coordinates6 = createCoordinates(1.00, 2.00, point6);

        Photo photo1 = createPhoto("photo 1", "", point1);      // TODO get photo urls
        Photo photo2 = createPhoto("photo 2", "", point2);
        Photo photo2_1 = createPhoto("photo 2", "", point2);
        Photo photo2_2 = createPhoto("photo 2", "", point2);
        Photo photo2_3 = createPhoto("photo 2", "", point2);
        Photo photo2_4 = createPhoto("photo 2", "", point2);
        Photo photo2_5 = createPhoto("photo 2", "", point2);
        Photo photo2_6 = createPhoto("photo 2", "", point2);
        Photo photo3 = createPhoto("photo 3", "", point3);
        Photo photo3_1 = createPhoto("photo 3", "", point3);
        Photo photo3_2 = createPhoto("photo 3", "", point3);
        Photo photo3_3 = createPhoto("photo 3", "", point3);
        Photo photo4 = createPhoto("photo 4", "", point4);
        Photo photo4_1 = createPhoto("photo 4", "", point4);
        Photo photo4_2 = createPhoto("photo 4", "", point4);
        Photo photo4_3 = createPhoto("photo 4", "", point4);
        Photo photo4_4 = createPhoto("photo 4", "", point4);
        Photo photo4_5 = createPhoto("photo 4", "", point4);
        Photo photo4_6 = createPhoto("photo 4", "", point4);
        Photo photo5 = createPhoto("photo 5", "", point5);
        Photo photo6 = createPhoto("photo 6", "", point6);

    }

    private Coordinates createCoordinates(double longitude, double latitude, Point point){
        Coordinates coordinates = new Coordinates();
        coordinates.setLatitude(latitude);
        coordinates.setLongitude(longitude);
        coordinates.setPoint(point);
        coordinatesDao.create(coordinates);
        return coordinates;
    }

    private Photo createPhoto(String desc, String url, Point point){
        Photo photo = new Photo();
        photo.setDescription(desc);
        photo.setImage(url);
        photo.setPoint(point);
        photoDao.create(photo);
        return photo;
    }

    private PointTag createPointTag(String title, String desc){
        PointTag pointTag = new PointTag();
        pointTag.setDescription(desc);
        pointTag.setName(title);
        pointTagDao.create(pointTag);
        return pointTag;
    }

    private Point createPoint(String title, String desc, Set<PointTag> tags, Set<Route> routes){
        Point point = new Point();
        point.setDescription(desc);
        point.setTitle(title);
        point.setTags(tags);
        point.setRoutes(routes);
        pointDao.create(point);
        return point;
    }

    private Route createRoute(String title, String desc) {
        Route route = new Route();
        route.setTitle(title);
        route.setDescription(desc);
        routeDao.create(route);
        return route;
    }
}
