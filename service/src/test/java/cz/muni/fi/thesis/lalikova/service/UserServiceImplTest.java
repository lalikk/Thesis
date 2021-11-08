package cz.muni.fi.thesis.lalikova.service;

import cz.muni.fi.thesis.lalikova.ServiceConfiguration;
import cz.muni.fi.thesis.lalikova.dao.UserDao;
import cz.muni.fi.thesis.lalikova.entity.User;
import cz.muni.fi.thesis.lalikova.exceptions.DaoDataAccessException;
import org.hibernate.service.spi.ServiceException;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.testng.AbstractTestNGSpringContextTests;
import org.testng.Assert;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;

import javax.validation.ConstraintViolationException;
import java.util.ArrayList;
import java.util.List;

import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.when;

@ContextConfiguration(classes = ServiceConfiguration.class)
public class UserServiceImplTest extends AbstractTestNGSpringContextTests {

    @Mock
    private UserDao userDao;

    @Autowired
    @InjectMocks
    private UserService userService;

    private User user1;
    private User user2;
    private User userWithoutId;

    @BeforeClass
    public void setup() throws ServiceException {
        MockitoAnnotations.initMocks(this);
    }

    @BeforeMethod
    public void prepareTestUser() {
        user1 = new User();
        user1.setId(1L);
        user1.setLogin("user1");
        user1.setPasswordHash("123");

        userWithoutId = new User();
        userWithoutId.setLogin("no Id");
        userWithoutId.setPasswordHash("123");

        user2 = new User();
        user2.setId(2L);
        user2.setLogin("user2");
        user2.setPasswordHash("456");
    }

    @Test
    public void testFindAll() {
        List<User> users = new ArrayList<>();
        users.add(user1);
        users.add(user2);

        when(userDao.findAll()).thenReturn(users);
        List<User> foundUsers = userService.findAll();
        Assert.assertEquals(2, foundUsers.size());
        Assert.assertEquals(foundUsers.get(0).getId(), Long.valueOf(1L));
        Assert.assertEquals(foundUsers.get(1).getId(), Long.valueOf(2L));
    }

    @Test
    public void testAuthenticate_CorrectPassword_True() {
        Assert.assertTrue(userService.authenticate(user1, "123"));
    }

    @Test
    public void testAuthenticate_IncorrectPassword_False() {
        Assert.assertFalse(userService.authenticate(user1, "xxx"));
    }

    @Test
    public void testFindUserById_CorrectId_Equals() {
        when(userDao.findById(user2.getId())).thenReturn(user2);
        Assert.assertEquals(user2, userService.findUserById(user2.getId()));
    }

    @Test
    public void testFindUserById_WrongId_DaoDataAccessExc() {
        doThrow(ConstraintViolationException.class).when(userDao).findById(5L);
        Assert.assertThrows(DaoDataAccessException.class, () -> userService.findUserById(5L));
    }

    @Test
    public void testFindUserById_WithoutId_NullPointerExc() {
        Assert.assertThrows(NullPointerException.class, () -> userService.findUserById(userWithoutId.getId()));
    }
}
