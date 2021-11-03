package cz.muni.fi.thesis.lalikova;

import cz.muni.fi.thesis.lalikova.dao.PointDao;
import cz.muni.fi.thesis.lalikova.dao.RouteDao;
import cz.muni.fi.thesis.lalikova.entity.Point;
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
public class RouteDaoImplTest extends AbstractTestNGSpringContextTests {

    @Autowired
    private RouteDao routeDao;

    @Autowired
    private PointDao pointDao;

    private Route route1;
    private Route route2;

    private Set<Point> points1;
    private Set<Point> points2;

    @BeforeClass
    public void init() {
        initRoute();
    }

    @AfterClass
    public void cleanup() {
        removePoint();
        removeRoute();
    }

    @Test
    public void testCreate() {
        Route route = new Route();
        route.setTitle("Route");
        route.setDescription("Test create route");
        route.setPoints(points1);
        routeDao.create(route);
        assertThat(routeDao.findById(route.getId())).isEqualTo(route);
    }

    @Test
    public void testFindById() {
        Route foundRoute = routeDao.findById(route1.getId());
        assertThat(route1).isEqualTo(foundRoute);
    }

    @Test
    public void testFindAll() {
        List<Route> foundRoute = routeDao.findAll();
        assertThat(foundRoute.size()).isGreaterThanOrEqualTo(2);
        assertThat(foundRoute).contains(route1).contains(route2);
    }

    @Test
    public void testUpdate() {
        route1.setDescription("New Route Description");
        routeDao.update(route1);
        Route searchResult = routeDao.findById(route1.getId());
        assertThat(searchResult).isEqualTo(route1);
    }

    @Test
    public void testRemove() {
        Long route1Id = route1.getId();
        routeDao.remove(route1);
        assertThat(routeDao.findById(route1Id)).isNull();
    }

    @Test(expectedExceptions = ConstraintViolationException.class)
    public void createRouteNullTitle() {
        Route route = new Route();
        route.setDescription("Test route with no title");
        routeDao.create(route);
    }

    @Test(expectedExceptions = NullPointerException.class)
    public void createNullRoute() {
        routeDao.create(null);
    }

    @Test(expectedExceptions = NullPointerException.class)
    public void updateNullRoute() {
        routeDao.update(null);
    }

    @Test(expectedExceptions = NullPointerException.class)
    public void deleteNullRoute() {
        routeDao.remove(null);
    }

    @Test(expectedExceptions = NullPointerException.class)
    public void findByNullId() {
        routeDao.findById(null);
    }

    @Test
    public void findByIdNonExistentRoute() {
        assertThat(routeDao.findById(9079867687L)).isNull();
    }

    private void initRoute() {
        initPoints();
        route1 = new Route();
        route1.setDescription("Test create route 1");
        route1.setTitle("Route 1");
        route1.setPoints(points1);
        routeDao.create(route1);
        route2 = new Route();
        route2.setDescription("Test create route 2");
        route2.setTitle("Route 2");
        route2.setPoints(points2);
        routeDao.create(route2);
    }

    private void initPoints(){
        Point point1;
        Point point2;
        point1 = new Point();
        point1.setTitle("Point 1");
        pointDao.create(point1);
        point2 = new Point();
        point2.setTitle("Point 2");
        pointDao.create(point2);
        points1 = Sets.newHashSet(Arrays.asList(point1, point2));
        points2 = Sets.newHashSet(Arrays.asList(point1));
    }

    private void removeRoute() {
        for (Route route : routeDao.findAll()) {
            routeDao.remove(route);
        }
    }

    private void removePoint() {
        for (Point point : pointDao.findAll()) {
            pointDao.remove(point);
        }
    }
}
