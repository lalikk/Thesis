package cz.muni.fi.thesis.lalikova;

import cz.muni.fi.thesis.lalikova.dao.CoordinatesDao;
import cz.muni.fi.thesis.lalikova.dao.PhotoDao;
import cz.muni.fi.thesis.lalikova.dao.PointDao;
import cz.muni.fi.thesis.lalikova.dao.PointTagDao;
import cz.muni.fi.thesis.lalikova.dao.RouteDao;
import cz.muni.fi.thesis.lalikova.entity.Coordinates;
import cz.muni.fi.thesis.lalikova.entity.Photo;
import cz.muni.fi.thesis.lalikova.entity.Point;
import cz.muni.fi.thesis.lalikova.entity.PointTag;
import cz.muni.fi.thesis.lalikova.entity.Route;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.testng.AbstractTestNGSpringContextTests;
import org.testng.annotations.AfterClass;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;
import org.testng.collections.Sets;

import javax.validation.ConstraintViolationException;
import java.util.Arrays;
import java.util.List;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;

@ContextConfiguration(classes = cz.muni.fi.thesis.lalikova.InMemoryDb.class)
public class PointDaoImplTest extends AbstractTestNGSpringContextTests {

    @Autowired
    private PointDao pointDao;

    @Autowired
    private PointTagDao pointTagDao;

    @Autowired
    private PhotoDao photoDao;

    @Autowired
    private CoordinatesDao coordinatesDao;

    @Autowired
    private RouteDao routeDao;

    private Point point1;
    private Point point2;

    private Coordinates coordinates1;
    private Coordinates coordinates2;

    private Set<PointTag> pointTags1;
    private Set<PointTag> pointTags2;

    private Set<Photo> photos1;
    private Set<Photo> photos2;

    private Route route1;

    @BeforeClass
    public void init() {
        initPoint();
    }

    @AfterClass
    public void cleanup() {
        removePoint();
    }

    @Test
    public void testCreate() {
        Point point = new Point();
        point.setTitle("Test point");
        point.setDescription("Test create point");
        point.setCoordinates(coordinates1);
        pointDao.create(point);
        assertThat(pointDao.findById(point.getId())).isEqualTo(point);
    }

    @Test
    public void testFindById() {
        Point foundPoint = pointDao.findById(point1.getId());
        assertThat(point1).isEqualTo(foundPoint);
    }

    @Test
    public void testFindAll() {
        List<Point> foundPoint = pointDao.findAll();
        assertThat(foundPoint.size()).isGreaterThanOrEqualTo(2);
        assertThat(foundPoint).contains(point1).contains(point2);
    }

    @Test
    public void testUpdate() {
        point1.setDescription("New updated description");
        pointDao.update(point1);
        Point searchResult = pointDao.findById(point1.getId());
        assertThat(searchResult).isEqualTo(point1);
    }

    @Test
    public void testRemove() {
        Long point1Id = point1.getId();
        pointDao.remove(point1);
        assertThat(pointDao.findById(point1Id)).isNull();
    }

    @Test(expectedExceptions = ConstraintViolationException.class)
    public void createPointNullTitle() {
        Point point = new Point();
        point.setDescription("Test point with no name");
        pointDao.create(point);
    }

    @Test(expectedExceptions = NullPointerException.class)
    public void createNullPoint() {
        pointDao.create(null);
    }

    @Test(expectedExceptions = NullPointerException.class)
    public void updateNullPoint() {
        pointDao.update(null);
    }

    @Test(expectedExceptions = NullPointerException.class)
    public void deleteNullPoint() {
        pointDao.remove(null);
    }

    @Test(expectedExceptions = NullPointerException.class)
    public void findByNullId() {
        pointDao.findById(null);
    }

    @Test
    public void findByIdNonExistentPoint() {
        assertThat(pointDao.findById(9079867687L)).isNull();
    }

    private void initPoint() {
        initPhotos();
        initPointTags();
        initCoordinates();
        initRoute();
        point1 = new Point();
        point1.setTitle("Test create point 1");
        point1.setDescription("Test point");
        point1.setCoordinates(coordinates1);
        point1.setPhotos(photos1);
        point1.setTags(pointTags1);
        point1.setRoutes(Sets.newHashSet(Arrays.asList(route1)));
        pointDao.create(point1);
        point2 = new Point();
        point2.setTitle("Test create point 2");
        point2.setDescription("Test point");
        point2.setCoordinates(coordinates2);
        point2.setPhotos(photos2);
        point2.setTags(pointTags2);
        point2.setRoutes(Sets.newHashSet(Arrays.asList(route1)));
        pointDao.create(point2);
    }

    private void initPhotos() {
        Photo photo1 = new Photo();
        photo1.setDescription("Test create photo 1");
        photo1.setImage("Image mock url");
        photoDao.create(photo1);
        Photo photo2 = new Photo();
        photo2.setDescription("Test create photo 2");
        photo2.setImage("Image mock url");
        photoDao.create(photo2);
        Photo photo3 = new Photo();
        photo3.setDescription("Test create photo 3");
        photo3.setImage("Image mock url");
        photoDao.create(photo3);
        photos1 = Sets.newHashSet(Arrays.asList(photo1, photo2));
        photos2 = Sets.newHashSet(Arrays.asList(photo3));
    }

    private void initPointTags() {
        PointTag pointTag1 = new PointTag();
        pointTag1.setName("Test create pointTag 1");
        pointTag1.setDescription("Test pointTag");
        pointTagDao.create(pointTag1);
        PointTag pointTag2 = new PointTag();
        pointTag2.setName("Test create pointTag 2");
        pointTag2.setDescription("Test pointTag");
        pointTagDao.create(pointTag2);
        PointTag pointTag3 = new PointTag();
        pointTag3.setName("Test create pointTag 3");
        pointTag3.setDescription("Test pointTag");
        pointTagDao.create(pointTag3);
        pointTags1 = Sets.newHashSet(Arrays.asList(pointTag1, pointTag3));
        pointTags2 = Sets.newHashSet(Arrays.asList(pointTag2, pointTag3));
    }

    private void initCoordinates() {
        coordinates1 = new Coordinates();
        coordinates1.setLatitude(0D);
        coordinates1.setLongitude(0D);
        coordinatesDao.create(coordinates1);
        coordinates2 = new Coordinates();
        coordinates2.setLatitude(49.195278);
        coordinates2.setLongitude(16.608333);
        coordinatesDao.create(coordinates2);
    }

    private void initRoute() {
        route1 = new Route();
        route1.setDescription("Test create route 1");
        route1.setTitle("Route 1");
        route1.setPoints(Sets.newHashSet(Arrays.asList(point1,point2)));
        routeDao.create(route1);
    }

    private void removePoint() {
        for (Point point : pointDao.findAll()) {
            pointDao.remove(point);
        }
    }
}
