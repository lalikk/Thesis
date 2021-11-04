package cz.muni.fi.thesis.lalikova;

import cz.muni.fi.thesis.lalikova.dao.PhotoDao;
import cz.muni.fi.thesis.lalikova.entity.Photo;
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
public class PhotoDaoImplTest extends AbstractTestNGSpringContextTests {

    @Autowired
    private PhotoDao photoDao;

    private Photo photo1;
    private Photo photo2;

    @BeforeClass
    public void init() {
        initPhoto();
    }

    @AfterClass
    public void cleanup() {
        removePhoto();
    }

    @Test
    public void testCreate() {
        Photo photo = new Photo();
        photo.setDescription("Test create photo");
        photo.setImage("Image mock bytes".getBytes());
        photoDao.create(photo);
        assertThat(photoDao.findById(photo.getId())).isEqualTo(photo);
    }

    @Test
    public void testFindById() {
        Photo foundPhoto = photoDao.findById(photo1.getId());
        assertThat(photo1).isEqualTo(foundPhoto);
    }

    @Test
    public void testFindAll() {
        List<Photo> foundPhoto = photoDao.findAll();
        assertThat(foundPhoto.size()).isGreaterThanOrEqualTo(2);
        assertThat(foundPhoto).contains(photo1).contains(photo2);
    }

    @Test
    public void testUpdate() {
        final byte[] newPhoto = "New photo mock bytes".getBytes();
        photo1.setImage(newPhoto);
        photoDao.update(photo1);
        Photo searchResult = photoDao.findById(photo1.getId());
        assertThat(searchResult).isEqualTo(photo1);
    }

    @Test
    public void testRemove() {
        Long photo1Id = photo1.getId();
        photoDao.remove(photo1);
        assertThat(photoDao.findById(photo1Id)).isNull();
    }

    @Test(expectedExceptions = ConstraintViolationException.class)
    public void createPhotoNullImage() {
        Photo photo = new Photo();
        photo.setDescription("Test photo with no image");
        photoDao.create(photo);
    }

    @Test(expectedExceptions = NullPointerException.class)
    public void createNullPhoto() {
        photoDao.create(null);
    }

    @Test(expectedExceptions = NullPointerException.class)
    public void updateNullPhoto() {
        photoDao.update(null);
    }

    @Test(expectedExceptions = NullPointerException.class)
    public void deleteNullPhoto() {
        photoDao.remove(null);
    }

    @Test(expectedExceptions = NullPointerException.class)
    public void findByNullId() {
        photoDao.findById(null);
    }

    @Test
    public void findByIdNonExistentPhoto() {
        assertThat(photoDao.findById(9079867687L)).isNull();
    }

    private void initPhoto() {
        photo1 = new Photo();
        photo1.setDescription("Test create photo 1");
        photo1.setImage("Image mock bytes".getBytes());
        photoDao.create(photo1);
        photo2 = new Photo();
        photo2.setDescription("Test create photo 2");
        photo2.setImage("Image mock bytes".getBytes());
        photoDao.create(photo2);
    }

    private void removePhoto() {
        for (Photo photo : photoDao.findAll()) {
            photoDao.remove(photo);
        }
    }
}
