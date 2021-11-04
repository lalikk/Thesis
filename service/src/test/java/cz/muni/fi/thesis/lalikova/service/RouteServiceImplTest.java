package cz.muni.fi.thesis.lalikova.service;

import cz.muni.fi.thesis.lalikova.ServiceConfiguration;
import cz.muni.fi.thesis.lalikova.dao.RouteDao;
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

import javax.validation.ConstraintViolationException;
import java.util.List;

import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ContextConfiguration(classes = ServiceConfiguration.class)
public class RouteServiceImplTest extends AbstractTestNGSpringContextTests {

    @Mock
    private RouteDao routeDao;

    @Autowired
    @InjectMocks
    private RouteService routeService;

    private Route route1;
    private Route route2;

    @BeforeMethod
    public void init() throws ServiceException {
        MockitoAnnotations.initMocks(this);
        initRoute();
    }

    @Test
    public void createRoute(){
        doNothing().when(routeDao).create(route1);
        routeService.create(route1);

        verify(routeDao).create(route1);
    }

    @Test(expectedExceptions = NullPointerException.class)
    public void createRouteNullRouteThrowsNullPointerException(){
        doNothing().when(routeDao).create(null);
        doThrow(NullPointerException.class).when(routeDao).create(null);
        routeService.create(null);
    }

    @Test(expectedExceptions = DaoDataAccessException.class)
    public void createRouteDaoLayerThrowsDaoDataAccessException(){
        doNothing().when(routeDao).create(route1);
        doThrow(ConstraintViolationException.class).when(routeDao).create(route1);
        routeService.create(route1);
    }

    @Test
    public void findRouteById() {
        when(routeDao.findById(route1.getId())).thenReturn(route1);
        Route routeReturned = routeService.findById(route1.getId());

        Assert.assertEquals(routeReturned, route1);
    }

    @Test(expectedExceptions = NullPointerException.class)
    public void findByIdNullIdThrowsNullPointerException() {
        doThrow(NullPointerException.class).when(routeDao).findById(null);
        routeService.findById(null);
    }

    @Test(expectedExceptions = DaoDataAccessException.class)
    public void findByIdDaoLayerThrowsDaoDataAccessException(){
        Long nonexistentId = 3L;
        doThrow(ConstraintViolationException.class).when(routeDao).findById(nonexistentId);
        routeService.findById(nonexistentId);
    }

    @Test
    public void findAllRoutes(){
        List<Route> allRoutes = List.of(route1, route2);
        when(routeDao.findAll()).thenReturn(allRoutes);
        List<Route> returnedRoutes = routeService.findAll();

        Assert.assertEquals(2, returnedRoutes.size());
        Assert.assertEquals(allRoutes.get(0), returnedRoutes.get(0));
        Assert.assertEquals(allRoutes.get(1), returnedRoutes.get(1));
    }

    @Test
    public void findAllWithNoRoutes() {
        List<Route> noRoutes = List.of();
        when(routeDao.findAll()).thenReturn(noRoutes);
        List<Route> returnedRoutes = routeService.findAll();

        Assert.assertEquals(0, returnedRoutes.size());
    }

    @Test(expectedExceptions = DaoDataAccessException.class)
    public void findAllDaoLayerThrowsDaoDataAccessException(){
        doThrow(ConstraintViolationException.class).when(routeDao).findAll();
        routeService.findAll();
    }

    @Test
    public void updateRoute() {
        route1.setDescription("New route 2 description");
        doNothing().when(routeDao).update(route1);
        routeService.update(route1);

        verify(routeDao).update(route1);
    }

    @Test(expectedExceptions = NullPointerException.class)
    public void updateRouteNullThrowsNullPointerException() {
        doNothing().when(routeDao).update(null);
        doThrow(NullPointerException.class).when(routeDao).update(null);
        routeService.update(null);
    }

    @Test(expectedExceptions = DaoDataAccessException.class)
    public void updateRouteDaoLayerThrowsDaoDataAccessException() {
        Route invalidRoute = new Route();
        invalidRoute.setDescription("Invalid Route Title");
        doNothing().when(routeDao).update(invalidRoute);
        doThrow(ConstraintViolationException.class).when(routeDao).update(invalidRoute);
        routeService.update(invalidRoute);
    }

    @Test
    public void removeRouteById() {
        doNothing().when(routeDao).remove(route1);
        routeService.removeById(route1.getId());

        verify(routeDao).findById(route1.getId());
    }

    @Test(expectedExceptions = NullPointerException.class)
    public void removeByIdNullIdThrowsNullPointerException() {
        doThrow(NullPointerException.class).when(routeDao).remove(null);
        routeService.removeById(null);
    }

    @Test(expectedExceptions = DaoDataAccessException.class)
    public void removeByIdDaoLayerThrowsDaoDataAccessException() {
        when(routeDao.findById(route1.getId())).thenReturn(route1);
        doThrow(ConstraintViolationException.class).when(routeDao).remove(route1);
        routeService.removeById(route1.getId());
    }

    private void initRoute() {
        route1 = new Route();
        route1.setId(1L);
        route1.setDescription("Route 1 Description");
        route1.setTitle("Route 1");

        route2 = new Route();
        route2.setId(2L);
        route2.setDescription("Route 2 Description");
        route2.setTitle("Route 2");
    }
}
