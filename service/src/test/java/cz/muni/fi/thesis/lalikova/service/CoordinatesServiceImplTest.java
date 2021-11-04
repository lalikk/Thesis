package cz.muni.fi.thesis.lalikova.service;

import cz.muni.fi.thesis.lalikova.ServiceConfiguration;
import cz.muni.fi.thesis.lalikova.dao.CoordinatesDao;
import cz.muni.fi.thesis.lalikova.entity.Coordinates;
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
public class CoordinatesServiceImplTest extends AbstractTestNGSpringContextTests {

    @Mock
    private CoordinatesDao coordinatesDao;

    @Autowired
    @InjectMocks
    private CoordinatesService coordinatesService;

    private Coordinates coordinates1;
    private Coordinates coordinates2;

    @BeforeMethod
    public void init() throws ServiceException {
        MockitoAnnotations.initMocks(this);
        initCoordinates();
    }

    @Test
    public void createCoordinates(){
        doNothing().when(coordinatesDao).create(coordinates1);
        coordinatesService.create(coordinates1);

        verify(coordinatesDao).create(coordinates1);
    }

    @Test(expectedExceptions = NullPointerException.class)
    public void createCoordinatesNullCoordinatesThrowsNullPointerException(){
        doNothing().when(coordinatesDao).create(null);
        doThrow(NullPointerException.class).when(coordinatesDao).create(null);
        coordinatesService.create(null);
    }

    @Test(expectedExceptions = DaoDataAccessException.class)
    public void createCoordinatesDaoLayerThrowsDaoDataAccessException(){
        doNothing().when(coordinatesDao).create(coordinates1);
        doThrow(ConstraintViolationException.class).when(coordinatesDao).create(coordinates1);
        coordinatesService.create(coordinates1);
    }

    @Test
    public void findCoordinatesById() {
        when(coordinatesDao.findById(coordinates1.getId())).thenReturn(coordinates1);
        Coordinates coordinatesReturned = coordinatesService.findById(coordinates1.getId());

        Assert.assertEquals(coordinatesReturned, coordinates1);
    }

    @Test(expectedExceptions = NullPointerException.class)
    public void findByIdNullIdThrowsNullPointerException() {
        doThrow(NullPointerException.class).when(coordinatesDao).findById(null);
        coordinatesService.findById(null);
    }

    @Test(expectedExceptions = DaoDataAccessException.class)
    public void findByIdDaoLayerThrowsDaoDataAccessException(){
        Long nonexistentId = 3L;
        doThrow(ConstraintViolationException.class).when(coordinatesDao).findById(nonexistentId);
        coordinatesService.findById(nonexistentId);
    }

    @Test
    public void findAllCoordinatess(){
        List<Coordinates> allCoordinatess = List.of(coordinates1, coordinates2);
        when(coordinatesDao.findAll()).thenReturn(allCoordinatess);
        List<Coordinates> returnedCoordinatess = coordinatesService.findAll();

        Assert.assertEquals(2, returnedCoordinatess.size());
        Assert.assertEquals(allCoordinatess.get(0), returnedCoordinatess.get(0));
        Assert.assertEquals(allCoordinatess.get(1), returnedCoordinatess.get(1));
    }

    @Test
    public void findAllWithNoCoordinatess() {
        List<Coordinates> noCoordinatess = List.of();
        when(coordinatesDao.findAll()).thenReturn(noCoordinatess);
        List<Coordinates> returnedCoordinatess = coordinatesService.findAll();

        Assert.assertEquals(0, returnedCoordinatess.size());
    }

    @Test(expectedExceptions = DaoDataAccessException.class)
    public void findAllDaoLayerThrowsDaoDataAccessException(){
        doThrow(ConstraintViolationException.class).when(coordinatesDao).findAll();
        coordinatesService.findAll();
    }

    @Test(expectedExceptions = NullPointerException.class)
    public void updateCoordinatesNullThrowsNullPointerException() {
        doNothing().when(coordinatesDao).update(null);
        doThrow(NullPointerException.class).when(coordinatesDao).update(null);
        coordinatesService.update(null);
    }

    @Test(expectedExceptions = DaoDataAccessException.class)
    public void updateCoordinatesDaoLayerThrowsDaoDataAccessException() {
        Coordinates invalidCoordinates = new Coordinates();
        invalidCoordinates.setLongitude(55555555555555555555555555555555D);
        doNothing().when(coordinatesDao).update(invalidCoordinates);
        doThrow(ConstraintViolationException.class).when(coordinatesDao).update(invalidCoordinates);
        coordinatesService.update(invalidCoordinates);
    }

    @Test
    public void removeCoordinatesById() {
        doNothing().when(coordinatesDao).remove(coordinates1);
        coordinatesService.removeById(coordinates1.getId());

        verify(coordinatesDao).findById(coordinates1.getId());
    }

    @Test(expectedExceptions = NullPointerException.class)
    public void removeByIdNullIdThrowsNullPointerException() {
        doThrow(NullPointerException.class).when(coordinatesDao).remove(null);
        coordinatesService.removeById(null);
    }

    @Test(expectedExceptions = DaoDataAccessException.class)
    public void removeByIdDaoLayerThrowsDaoDataAccessException() {
        when(coordinatesDao.findById(coordinates1.getId())).thenReturn(coordinates1);
        doThrow(ConstraintViolationException.class).when(coordinatesDao).remove(coordinates1);
        coordinatesService.removeById(coordinates1.getId());
    }

    private void initCoordinates() {
        coordinates1 = new Coordinates();
        coordinates1.setId(1L);
        coordinates1.setLatitude(0D);
        coordinates1.setLongitude(0D);

        coordinates2 = new Coordinates();
        coordinates2.setId(2L);
        coordinates2.setLatitude(49.195278);
        coordinates2.setLongitude(16.608333);
    }
}
