package cz.muni.fi.thesis.lalikova;

import cz.muni.fi.thesis.lalikova.dao.PointTagDao;
import cz.muni.fi.thesis.lalikova.entity.PointTag;
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
public class PointTagDaoImplTest extends AbstractTestNGSpringContextTests {

    @Autowired
    private PointTagDao pointTagDao;

    private PointTag pointTag1;
    private PointTag pointTag2;

    @BeforeClass
    public void init() {
        initPointTag();
    }

    @AfterClass
    public void cleanup() {
        removePointTag();
    }

    @Test
    public void testCreate() {
        PointTag pointTag = new PointTag();
        pointTag.setName("Test tag");
        pointTag.setDescription("Test create pointTag");
        pointTagDao.create(pointTag);
        assertThat(pointTagDao.findById(pointTag.getId())).isEqualTo(pointTag);
    }

    @Test
    public void testFindById() {
        PointTag foundPointTag = pointTagDao.findById(pointTag1.getId());
        assertThat(pointTag1).isEqualTo(foundPointTag);
    }

    @Test
    public void testFindAll() {
        List<PointTag> foundPointTag = pointTagDao.findAll();
        assertThat(foundPointTag.size()).isGreaterThanOrEqualTo(2);
        assertThat(foundPointTag).contains(pointTag1).contains(pointTag2);
    }

    @Test
    public void testUpdate() {
        pointTag1.setDescription("New updated description");
        pointTagDao.update(pointTag1);
        PointTag searchResult = pointTagDao.findById(pointTag1.getId());
        assertThat(searchResult).isEqualTo(pointTag1);
    }

    @Test
    public void testRemove() {
        Long pointTag1Id = pointTag1.getId();
        pointTagDao.remove(pointTag1);
        assertThat(pointTagDao.findById(pointTag1Id)).isNull();
    }

    @Test(expectedExceptions = ConstraintViolationException.class)
    public void createPointTagNullName() {
        PointTag pointTag = new PointTag();
        pointTag.setDescription("Test pointTag with no name");
        pointTagDao.create(pointTag);
    }

    @Test(expectedExceptions = NullPointerException.class)
    public void createNullPointTag() {
        pointTagDao.create(null);
    }

    @Test(expectedExceptions = NullPointerException.class)
    public void updateNullPointTag() {
        pointTagDao.update(null);
    }

    @Test(expectedExceptions = NullPointerException.class)
    public void deleteNullPointTag() {
        pointTagDao.remove(null);
    }

    @Test(expectedExceptions = NullPointerException.class)
    public void findByNullId() {
        pointTagDao.findById(null);
    }

    @Test
    public void findByIdNonExistentPointTag() {
        assertThat(pointTagDao.findById(9079867687L)).isNull();
    }

    private void initPointTag() {
        pointTag1 = new PointTag();
        pointTag1.setName("Test create pointTag 1");
        pointTag1.setDescription("Test pointTag");
        pointTagDao.create(pointTag1);
        pointTag2 = new PointTag();
        pointTag2.setName("Test create pointTag 2");
        pointTag2.setDescription("Test pointTag");
        pointTagDao.create(pointTag2);
    }

    private void removePointTag() {
        for (PointTag pointTag : pointTagDao.findAll()) {
            pointTagDao.remove(pointTag);
        }
    }
}
