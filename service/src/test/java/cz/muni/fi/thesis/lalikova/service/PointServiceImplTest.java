package cz.muni.fi.thesis.lalikova.service;

import cz.muni.fi.thesis.lalikova.ServiceConfiguration;
import cz.muni.fi.thesis.lalikova.dao.PointDao;
import cz.muni.fi.thesis.lalikova.entity.Coordinates;
import cz.muni.fi.thesis.lalikova.entity.Photo;
import cz.muni.fi.thesis.lalikova.entity.Point;
import cz.muni.fi.thesis.lalikova.entity.PointTag;
import cz.muni.fi.thesis.lalikova.entity.Route;
import cz.muni.fi.thesis.lalikova.exceptions.DaoDataAccessException;
import org.hibernate.service.spi.ServiceException;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.testng.AbstractTestNGSpringContextTests;
import org.testng.Assert;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;
import org.testng.collections.Sets;

import javax.validation.ConstraintViolationException;
import java.util.Arrays;
import java.util.List;
import java.util.Set;

import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ContextConfiguration(classes = ServiceConfiguration.class)
public class PointServiceImplTest extends AbstractTestNGSpringContextTests {

    @Mock
    private PointDao pointDao;

    @Autowired
    @InjectMocks
    private PointService pointService;

    private Point point1;
    private Point point2;

    private Coordinates coordinates1;
    private Coordinates coordinates2;

    private Set<PointTag> pointTags1;
    private Set<PointTag> pointTags2;

    private Set<Photo> photos1;
    private Set<Photo> photos2;

    private Route route1;

    @BeforeMethod
    public void init() throws ServiceException {
        MockitoAnnotations.initMocks(this);
        initPoint();
    }

    @Test
    public void createPoint(){
        doNothing().when(pointDao).create(point1);
        pointService.create(point1);

        verify(pointDao).create(point1);
    }

    @Test(expectedExceptions = NullPointerException.class)
    public void createPointNullPointThrowsNullPointerException(){
        doNothing().when(pointDao).create(null);
        doThrow(NullPointerException.class).when(pointDao).create(null);
        pointService.create(null);
    }

    @Test(expectedExceptions = DaoDataAccessException.class)
    public void createPointDaoLayerThrowsDaoDataAccessException(){
        doNothing().when(pointDao).create(point1);
        doThrow(ConstraintViolationException.class).when(pointDao).create(point1);
        pointService.create(point1);
    }

    @Test
    public void findPointById() {
        when(pointDao.findById(point1.getId())).thenReturn(point1);
        Point pointReturned = pointService.findById(point1.getId());

        Assert.assertEquals(pointReturned, point1);
    }

    @Test(expectedExceptions = NullPointerException.class)
    public void findByIdNullIdThrowsNullPointerException() {
        doThrow(NullPointerException.class).when(pointDao).findById(null);
        pointService.findById(null);
    }

    @Test(expectedExceptions = DaoDataAccessException.class)
    public void findByIdDaoLayerThrowsDaoDataAccessException(){
        Long nonexistentId = 3L;
        doThrow(ConstraintViolationException.class).when(pointDao).findById(nonexistentId);
        pointService.findById(nonexistentId);
    }

    @Test
    public void findAllPoints(){
        List<Point> allPoints = List.of(point1, point2);
        when(pointDao.findAll()).thenReturn(allPoints);
        List<Point> returnedPoints = pointService.findAll();

        Assert.assertEquals(2, returnedPoints.size());
        Assert.assertEquals(allPoints.get(0), returnedPoints.get(0));
        Assert.assertEquals(allPoints.get(1), returnedPoints.get(1));
    }

    @Test
    public void findAllWithNoPoints() {
        List<Point> noPoints = List.of();
        when(pointDao.findAll()).thenReturn(noPoints);
        List<Point> returnedPoints = pointService.findAll();

        Assert.assertEquals(0, returnedPoints.size());
    }

    @Test(expectedExceptions = DaoDataAccessException.class)
    public void findAllDaoLayerThrowsDaoDataAccessException(){
        doThrow(ConstraintViolationException.class).when(pointDao).findAll();
        pointService.findAll();
    }

    @Test
    public void updatePoint() {
        point1.setDescription("New point 2 description");
        doNothing().when(pointDao).update(point1);
        pointService.update(point1);

        verify(pointDao).update(point1);
    }

    @Test(expectedExceptions = NullPointerException.class)
    public void updatePointNullThrowsNullPointerException() {
        doNothing().when(pointDao).update(null);
        doThrow(NullPointerException.class).when(pointDao).update(null);
        pointService.update(null);
    }

    @Test(expectedExceptions = DaoDataAccessException.class)
    public void updatePointDaoLayerThrowsDaoDataAccessException() {
        Point invalidPoint = new Point();
        invalidPoint.setDescription("Invalid Point Title");
        doNothing().when(pointDao).update(invalidPoint);
        doThrow(ConstraintViolationException.class).when(pointDao).update(invalidPoint);
        pointService.update(invalidPoint);
    }

    @Test
    public void removePointById() {
        doNothing().when(pointDao).remove(point1);
        pointService.removeById(point1.getId());

        verify(pointDao).findById(point1.getId());
    }

    @Test(expectedExceptions = NullPointerException.class)
    public void removeByIdNullIdThrowsNullPointerException() {
        doThrow(NullPointerException.class).when(pointDao).remove(null);
        pointService.removeById(null);
    }

    @Test(expectedExceptions = DaoDataAccessException.class)
    public void removeByIdDaoLayerThrowsDaoDataAccessException() {
        when(pointDao.findById(point1.getId())).thenReturn(point1);
        doThrow(ConstraintViolationException.class).when(pointDao).remove(point1);
        pointService.removeById(point1.getId());
    }

    private void initPoint() {
        initPhotos();
        initPointTags();
        initCoordinates();
        initRoute();
        point1 = new Point();
        point1.setId(1L);
        point1.setTitle("Test create point 1");
        point1.setDescription("Test point");
        point1.setCoordinates(coordinates1);
        point1.setPhotos(photos1);
        point1.setTags(pointTags1);
        point1.setRoutes(Sets.newHashSet(Arrays.asList(route1)));
        point2 = new Point();
        point1.setId(2L);
        point2.setTitle("Test create point 2");
        point2.setDescription("Test point");
        point2.setCoordinates(coordinates2);
        point2.setPhotos(photos2);
        point2.setTags(pointTags2);
        point2.setRoutes(Sets.newHashSet(Arrays.asList(route1)));
    }

    private void initPhotos() {
        Photo photo1 = new Photo();
        photo1.setDescription("Test create photo 1");
        photo1.setImage("Image mock bytes".getBytes());
        Photo photo2 = new Photo();
        photo2.setDescription("Test create photo 2");
        photo2.setImage("Image mock bytes".getBytes());
        Photo photo3 = new Photo();
        photo3.setDescription("Test create photo 3");
        photo3.setImage("Image mock bytes".getBytes());
        photos1 = Sets.newHashSet(Arrays.asList(photo1, photo2));
        photos2 = Sets.newHashSet(Arrays.asList(photo3));
    }

    private void initPointTags() {
        PointTag pointTag1 = new PointTag();
        pointTag1.setName("Test create pointTag 1");
        pointTag1.setDescription("Test pointTag");
        PointTag pointTag2 = new PointTag();
        pointTag2.setName("Test create pointTag 2");
        pointTag2.setDescription("Test pointTag");
        PointTag pointTag3 = new PointTag();
        pointTag3.setName("Test create pointTag 3");
        pointTag3.setDescription("Test pointTag");
        pointTags1 = Sets.newHashSet(Arrays.asList(pointTag1, pointTag3));
        pointTags2 = Sets.newHashSet(Arrays.asList(pointTag2, pointTag3));
    }

    private void initCoordinates() {
        coordinates1 = new Coordinates();
        coordinates1.setLatitude(0D);
        coordinates1.setLongitude(0D);
        coordinates2 = new Coordinates();
        coordinates2.setLatitude(49.195278);
        coordinates2.setLongitude(16.608333);
    }

    private void initRoute() {
        route1 = new Route();
        route1.setDescription("Test create route 1");
        route1.setTitle("Route 1");
        route1.setPoints(Sets.newHashSet(Arrays.asList(point1,point2)));
    }

}
