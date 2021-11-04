package cz.muni.fi.thesis.lalikova;

import cz.muni.fi.thesis.lalikova.dao.CoordinatesDao;
import cz.muni.fi.thesis.lalikova.entity.Coordinates;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.testng.AbstractTestNGSpringContextTests;
import org.testng.annotations.AfterClass;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;

import javax.validation.ConstraintViolationException;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@ContextConfiguration(classes = cz.muni.fi.thesis.lalikova.InMemoryDb.class)
public class CoordinatesDaoImplTest extends AbstractTestNGSpringContextTests {

    @Autowired
    private CoordinatesDao coordinatesDao;

    private Coordinates coordinates1;
    private Coordinates coordinates2;

    @BeforeClass
    public void init() {
        initCoordinates();
    }

    @AfterClass
    public void cleanup() {
        removeCoordinates();
    }

    @Test
    public void testCreate() {
        Coordinates coordinates = new Coordinates();
        coordinates.setLatitude(49.2107581);
        coordinates.setLongitude(16.6188150);
        coordinatesDao.create(coordinates);
        assertThat(coordinatesDao.findById(coordinates.getId())).isEqualTo(coordinates);
    }

    @Test
    public void testFindById() {
        Coordinates foundCoordinates = coordinatesDao.findById(coordinates1.getId());
        assertThat(coordinates1).isEqualTo(foundCoordinates);
    }

    @Test
    public void testFindAll() {
        List<Coordinates> foundCoordinates = coordinatesDao.findAll();
        assertThat(foundCoordinates.size()).isGreaterThanOrEqualTo(2);
        assertThat(foundCoordinates).contains(coordinates1).contains(coordinates2);
    }

    @Test
    public void testRemove() {
        Long coordinates1Id = coordinates1.getId();
        coordinatesDao.remove(coordinates1);
        assertThat(coordinatesDao.findById(coordinates1Id)).isNull();
    }

    @Test(expectedExceptions = ConstraintViolationException.class)
    public void createCoordinatesNullLatitude() {
        Coordinates coordinates = new Coordinates();
        coordinates.setLatitude(null);
        coordinates.setLongitude(0D);
        coordinatesDao.create(coordinates);
    }

    @Test(expectedExceptions = NullPointerException.class)
    public void createNullCoordinates() {
        coordinatesDao.create(null);
    }

    @Test(expectedExceptions = NullPointerException.class)
    public void updateNullCoordinates() {
        coordinatesDao.update(null);
    }

    @Test(expectedExceptions = NullPointerException.class)
    public void deleteNullCoordinates() {
        coordinatesDao.remove(null);
    }

    @Test(expectedExceptions = NullPointerException.class)
    public void findByNullId() {
        coordinatesDao.findById(null);
    }

    @Test
    public void findByIdNonExistentCoordinates() {
        assertThat(coordinatesDao.findById(9079867687L)).isNull();
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

    private void removeCoordinates() {
        for (Coordinates coordinates : coordinatesDao.findAll()) {
            coordinatesDao.remove(coordinates);
        }
    }
}
