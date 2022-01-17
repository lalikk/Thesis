package cz.muni.fi.thesis.lalikova;

import cz.muni.fi.thesis.lalikova.dao.*;
import cz.muni.fi.thesis.lalikova.entity.Coordinates;
import cz.muni.fi.thesis.lalikova.entity.Photo;
import cz.muni.fi.thesis.lalikova.entity.PointTag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.parameters.P;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.net.CookieHandler;

@Component
@Transactional
public class TestData
{
    public static final String POINT_1_NAME = "Point 1";
    public static final String POINT_2_NAME = "Point 2";
    public static final String POINT_3_NAME = "Point 3";
    public static final String POINT_4_NAME = "Point 4";
    public static final String POINT_5_NAME = "Point 5";
    public static final String POINT_6_NAME = "Point 6";



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

    @Autowired
    private UserDao userDao;

    @Autowired
    private AdvancedUserDao advancedUserDao;


    public void loadData() throws IOException {
        Coordinates coordinates1 = createCoordinates(1.00, 2.00);   // TODO find values to work with maps later
        Coordinates coordinates2 = createCoordinates(1.00, 2.00);
        Coordinates coordinates3 = createCoordinates(1.00, 2.00);
        Coordinates coordinates4 = createCoordinates(1.00, 2.00);
        Coordinates coordinates5 = createCoordinates(1.00, 2.00);
        Coordinates coordinates6 = createCoordinates(1.00, 2.00);

        Photo photo1 = createPhoto("photo 1", "");      // TODO get photo urls
        Photo photo2 = createPhoto("photo 2", "");
        Photo photo3 = createPhoto("photo 3", "");
        Photo photo4 = createPhoto("photo 4", "");
        Photo photo5 = createPhoto("photo 5", "");
        Photo photo6 = createPhoto("photo 6", "");

        PointTag pointTag1 = createPointTag("Tag 1", "First tag");
        PointTag pointTag2 = createPointTag("Tag 2", "Second tag");


    }

    private Coordinates createCoordinates(double longitude, double latitude){
        Coordinates coordinates = new Coordinates();
        coordinates.setLatitude(latitude);
        coordinates.setLongitude(longitude);
        coordinatesDao.create(coordinates);
        return coordinates;
    }

    private Photo createPhoto(String desc, String url){
        Photo photo = new Photo();
        photo.setDescription(desc);
        photo.setImage(url);
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














}
