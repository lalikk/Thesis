package cz.muni.fi.thesis.lalikova.service;

import cz.muni.fi.thesis.lalikova.ServiceConfiguration;
import cz.muni.fi.thesis.lalikova.dao.PointTagDao;
import cz.muni.fi.thesis.lalikova.entity.PointTag;
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
public class PointTagServiceImplTest extends AbstractTestNGSpringContextTests {

    @Mock
    private PointTagDao pointTagDao;

    @Autowired
    @InjectMocks
    private PointTagService pointTagService;

    private PointTag pointTag1;
    private PointTag pointTag2;

    @BeforeMethod
    public void init() throws ServiceException {
        MockitoAnnotations.initMocks(this);
        initPointTag();
    }

    @Test
    public void createPointTag(){
        doNothing().when(pointTagDao).create(pointTag1);
        pointTagService.create(pointTag1);

        verify(pointTagDao).create(pointTag1);
    }

    @Test(expectedExceptions = NullPointerException.class)
    public void createPointTagNullPointTagThrowsNullPointerException(){
        doNothing().when(pointTagDao).create(null);
        doThrow(NullPointerException.class).when(pointTagDao).create(null);
        pointTagService.create(null);
    }

    @Test(expectedExceptions = DaoDataAccessException.class)
    public void createPointTagDaoLayerThrowsDaoDataAccessException(){
        doNothing().when(pointTagDao).create(pointTag1);
        doThrow(ConstraintViolationException.class).when(pointTagDao).create(pointTag1);
        pointTagService.create(pointTag1);
    }

    @Test
    public void findPointTagById() {
        when(pointTagDao.findById(pointTag1.getId())).thenReturn(pointTag1);
        PointTag pointTagReturned = pointTagService.findById(pointTag1.getId());

        Assert.assertEquals(pointTagReturned, pointTag1);
    }

    @Test(expectedExceptions = NullPointerException.class)
    public void findByIdNullIdThrowsNullPointerException() {
        doThrow(NullPointerException.class).when(pointTagDao).findById(null);
        pointTagService.findById(null);
    }

    @Test(expectedExceptions = DaoDataAccessException.class)
    public void findByIdDaoLayerThrowsDaoDataAccessException(){
        Long nonexistentId = 3L;
        doThrow(ConstraintViolationException.class).when(pointTagDao).findById(nonexistentId);
        pointTagService.findById(nonexistentId);
    }

    @Test
    public void findAllPointTags(){
        List<PointTag> allPointTags = List.of(pointTag1, pointTag2);
        when(pointTagDao.findAll()).thenReturn(allPointTags);
        List<PointTag> returnedPointTags = pointTagService.findAll();

        Assert.assertEquals(2, returnedPointTags.size());
        Assert.assertEquals(allPointTags.get(0), returnedPointTags.get(0));
        Assert.assertEquals(allPointTags.get(1), returnedPointTags.get(1));
    }

    @Test
    public void findAllWithNoPointTags() {
        List<PointTag> noPointTags = List.of();
        when(pointTagDao.findAll()).thenReturn(noPointTags);
        List<PointTag> returnedPointTags = pointTagService.findAll();

        Assert.assertEquals(0, returnedPointTags.size());
    }

    @Test(expectedExceptions = DaoDataAccessException.class)
    public void findAllDaoLayerThrowsDaoDataAccessException(){
        doThrow(ConstraintViolationException.class).when(pointTagDao).findAll();
        pointTagService.findAll();
    }

    @Test
    public void updatePointTag() {
        pointTag1.setDescription("New pointTag 2 description");
        doNothing().when(pointTagDao).update(pointTag1);
        pointTagService.update(pointTag1);

        verify(pointTagDao).update(pointTag1);
    }

    @Test(expectedExceptions = NullPointerException.class)
    public void updatePointTagNullThrowsNullPointerException() {
        doNothing().when(pointTagDao).update(null);
        doThrow(NullPointerException.class).when(pointTagDao).update(null);
        pointTagService.update(null);
    }

    @Test(expectedExceptions = DaoDataAccessException.class)
    public void updatePointTagDaoLayerThrowsDaoDataAccessException() {
        PointTag invalidPointTag = new PointTag();
        invalidPointTag.setDescription("Invalid PointTag Title");
        doNothing().when(pointTagDao).update(invalidPointTag);
        doThrow(ConstraintViolationException.class).when(pointTagDao).update(invalidPointTag);
        pointTagService.update(invalidPointTag);
    }

    @Test
    public void removePointTagById() {
        doNothing().when(pointTagDao).remove(pointTag1);
        pointTagService.removeById(pointTag1.getId());

        verify(pointTagDao).findById(pointTag1.getId());
    }

    @Test(expectedExceptions = NullPointerException.class)
    public void removeByIdNullIdThrowsNullPointerException() {
        doThrow(NullPointerException.class).when(pointTagDao).remove(null);
        pointTagService.removeById(null);
    }

    @Test(expectedExceptions = DaoDataAccessException.class)
    public void removeByIdDaoLayerThrowsDaoDataAccessException() {
        when(pointTagDao.findById(pointTag1.getId())).thenReturn(pointTag1);
        doThrow(ConstraintViolationException.class).when(pointTagDao).remove(pointTag1);
        pointTagService.removeById(pointTag1.getId());
    }

    private void initPointTag() {
        pointTag1 = new PointTag();
        pointTag1.setId(1L);
        pointTag1.setName("Test create pointTag 1");
        pointTag1.setDescription("PointTag 1 Description");

        pointTag2 = new PointTag();
        pointTag2.setId(2L);
        pointTag2.setName("Test create pointTag 2");
        pointTag2.setDescription("PointTag 2 Description");
    }
}
