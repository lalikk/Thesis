package cz.muni.fi.thesis.lalikova.service;

import cz.muni.fi.thesis.lalikova.ServiceConfiguration;
import cz.muni.fi.thesis.lalikova.dao.PhotoDao;
import cz.muni.fi.thesis.lalikova.entity.Photo;
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
public class PhotoServiceImplTest extends AbstractTestNGSpringContextTests {

    @Mock
    private PhotoDao photoDao;

    @Autowired
    @InjectMocks
    private PhotoService photoService;

    private Photo photo1;
    private Photo photo2;

    @BeforeMethod
    public void init() throws ServiceException {
        MockitoAnnotations.initMocks(this);
        initPhoto();
    }

    @Test
    public void createPhoto(){
        doNothing().when(photoDao).create(photo1);
        photoService.create(photo1);

        verify(photoDao).create(photo1);
    }

    @Test(expectedExceptions = NullPointerException.class)
    public void createPhotoNullPhotoThrowsNullPointerException(){
        doNothing().when(photoDao).create(null);
        doThrow(NullPointerException.class).when(photoDao).create(null);
        photoService.create(null);
    }

    @Test(expectedExceptions = DaoDataAccessException.class)
    public void createPhotoDaoLayerThrowsDaoDataAccessException(){
        doNothing().when(photoDao).create(photo1);
        doThrow(ConstraintViolationException.class).when(photoDao).create(photo1);
        photoService.create(photo1);
    }

    @Test
    public void findPhotoById() {
        when(photoDao.findById(photo1.getId())).thenReturn(photo1);
        Photo photoReturned = photoService.findById(photo1.getId());

        Assert.assertEquals(photoReturned, photo1);
    }

    @Test(expectedExceptions = NullPointerException.class)
    public void findByIdNullIdThrowsNullPointerException() {
        doThrow(NullPointerException.class).when(photoDao).findById(null);
        photoService.findById(null);
    }

    @Test(expectedExceptions = DaoDataAccessException.class)
    public void findByIdDaoLayerThrowsDaoDataAccessException(){
        Long nonexistentId = 3L;
        doThrow(ConstraintViolationException.class).when(photoDao).findById(nonexistentId);
        photoService.findById(nonexistentId);
    }

    @Test
    public void findAllPhotos(){
        List<Photo> allPhotos = List.of(photo1, photo2);
        when(photoDao.findAll()).thenReturn(allPhotos);
        List<Photo> returnedPhotos = photoService.findAll();

        Assert.assertEquals(2, returnedPhotos.size());
        Assert.assertEquals(allPhotos.get(0), returnedPhotos.get(0));
        Assert.assertEquals(allPhotos.get(1), returnedPhotos.get(1));
    }

    @Test
    public void findAllWithNoPhotos() {
        List<Photo> noPhotos = List.of();
        when(photoDao.findAll()).thenReturn(noPhotos);
        List<Photo> returnedPhotos = photoService.findAll();

        Assert.assertEquals(0, returnedPhotos.size());
    }

    @Test(expectedExceptions = DaoDataAccessException.class)
    public void findAllDaoLayerThrowsDaoDataAccessException(){
        doThrow(ConstraintViolationException.class).when(photoDao).findAll();
        photoService.findAll();
    }

    @Test
    public void updatePhoto() {
        photo1.setDescription("New photo 2 description");
        doNothing().when(photoDao).update(photo1);
        photoService.update(photo1);

        verify(photoDao).update(photo1);
    }

    @Test(expectedExceptions = NullPointerException.class)
    public void updatePhotoNullThrowsNullPointerException() {
        doNothing().when(photoDao).update(null);
        doThrow(NullPointerException.class).when(photoDao).update(null);
        photoService.update(null);
    }

    @Test(expectedExceptions = DaoDataAccessException.class)
    public void updatePhotoDaoLayerThrowsDaoDataAccessException() {
        Photo invalidPhoto = new Photo();
        invalidPhoto.setDescription("Invalid Photo Title");
        doNothing().when(photoDao).update(invalidPhoto);
        doThrow(ConstraintViolationException.class).when(photoDao).update(invalidPhoto);
        photoService.update(invalidPhoto);
    }

    @Test
    public void removePhotoById() {
        doNothing().when(photoDao).remove(photo1);
        photoService.removeById(photo1.getId());

        verify(photoDao).findById(photo1.getId());
    }

    @Test(expectedExceptions = NullPointerException.class)
    public void removeByIdNullIdThrowsNullPointerException() {
        doThrow(NullPointerException.class).when(photoDao).remove(null);
        photoService.removeById(null);
    }

    @Test(expectedExceptions = DaoDataAccessException.class)
    public void removeByIdDaoLayerThrowsDaoDataAccessException() {
        when(photoDao.findById(photo1.getId())).thenReturn(photo1);
        doThrow(ConstraintViolationException.class).when(photoDao).remove(photo1);
        photoService.removeById(photo1.getId());
    }

    private void initPhoto() {
        photo1 = new Photo();
        photo1.setId(1L);
        photo1.setDescription("Photo 1 Description");
        photo1.setImage("Image mock bytes".getBytes());

        photo2 = new Photo();
        photo2.setId(2L);
        photo2.setDescription("Photo 2 Description");
        photo2.setImage("Image mock bytes".getBytes());
    }
}
