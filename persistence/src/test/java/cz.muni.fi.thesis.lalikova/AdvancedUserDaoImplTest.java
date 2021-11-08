package cz.muni.fi.thesis.lalikova;

import cz.muni.fi.thesis.lalikova.dao.AdvancedUserDao;
import cz.muni.fi.thesis.lalikova.entity.AdvancedUser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.testng.AbstractTestNGSpringContextTests;
import org.testng.annotations.AfterClass;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@ContextConfiguration(classes = cz.muni.fi.thesis.lalikova.InMemoryDb.class)
public class AdvancedUserDaoImplTest extends AbstractTestNGSpringContextTests {

    @Autowired
    private AdvancedUserDao userDao;

    private AdvancedUser user1;
    private AdvancedUser user2;

    @BeforeClass
    public void beforeClass() {
        user1 = new AdvancedUser();
        user1.setLogin("Login1");
        user1.setPasswordHash("123");

        userDao.create(user1);

        user2 = new AdvancedUser();
        user2.setLogin("Login2");
        user2.setPasswordHash("456");

        userDao.create(user2);
    }

    @AfterClass
    public void afterClass() {
        for (AdvancedUser u : userDao.findAll()) {
            userDao.remove(u);
        }
    }

    @Test
    public void testCreate() {
        AdvancedUser user = new AdvancedUser();
        user.setLogin("Login");
        user.setPasswordHash("123");
        userDao.create(user);

        assertThat(userDao.findById(user.getId())).isEqualTo(user);
    }

    @Test
    public void testFindById() {
        AdvancedUser returnedUser2 = userDao.findById(user2.getId());

        assertThat(user2).isEqualTo(returnedUser2);
    }

    @Test
    public void testFindByLogin() {
        AdvancedUser returnedUser1 = userDao.findByLogin(user1.getLogin());

        assertThat(user1).isEqualTo(returnedUser1);
    }

    @Test
    public void testFindAll() {
        List<AdvancedUser> returnedUsers = userDao.findAll();

        assertThat(returnedUsers.size()).isGreaterThanOrEqualTo(2);
        assertThat(returnedUsers.contains(user2)).isTrue();
        assertThat(returnedUsers.contains(user1)).isTrue();
    }

    @Test
    public void testUpdate() {
        user1.setPasswordHash("789");
        userDao.update(user1);

        assertThat(userDao.findById(user1.getId())).isEqualTo(user1);
    }

    @Test
    public void testRemove() {
        Long user2Id = user2.getId();
        userDao.remove(user2);

        assertThat(userDao.findById(user2Id)).isNull();
    }

    @Test(expectedExceptions = NullPointerException.class)
    public void testCreateNull() {
        userDao.create(null);
    }

    @Test(expectedExceptions = NullPointerException.class)
    public void testUpdateNull() {
        userDao.update(null);
    }

    @Test(expectedExceptions = NullPointerException.class)
    public void testFindByNullId() {
        userDao.findById(null);
    }

    @Test
    public void findByIdNonExistentUser() {
        assertThat(userDao.findById(9079867687L)).isNull();
    }

    @Test(expectedExceptions = NullPointerException.class)
    public void testFindByNullLogin() {
        userDao.findByLogin(null);
    }

    @Test(expectedExceptions = NullPointerException.class)
    public void testRemoveNull() {
        userDao.remove(null);
    }
}

