package cz.muni.fi.thesis.lalikova.service.facade;

import cz.muni.fi.thesis.lalikova.ServiceConfiguration;
import cz.muni.fi.thesis.lalikova.dto.UserAuthenticateDto;
import cz.muni.fi.thesis.lalikova.dto.UserDto;
import cz.muni.fi.thesis.lalikova.entity.User;
import cz.muni.fi.thesis.lalikova.facade.UserFacade;
import cz.muni.fi.thesis.lalikova.service.BeanMappingService;
import cz.muni.fi.thesis.lalikova.service.UserService;
import org.hibernate.service.spi.ServiceException;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.Spy;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.testng.AbstractTestNGSpringContextTests;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ContextConfiguration(classes = ServiceConfiguration.class)
public class UserFacadeImplTest extends AbstractTestNGSpringContextTests {

    @Mock
    private UserService userService;

    @Spy
    @Autowired
    private BeanMappingService beanMappingService;

    @InjectMocks
    private final UserFacade userFacade = new UserFacadeImpl();

    private User user1;
    private User user2;
    private User user3;

    @BeforeMethod
    public void setup() throws ServiceException {
        MockitoAnnotations.initMocks(this);
        prepare();
    }

    @Test
    public void authenticateUser() {
        when(userService.authenticate(user1, "password1")).thenReturn(false);
        when(userService.authenticate(user2, "password2")).thenReturn(true);
        UserAuthenticateDto userDtoFirst = beanMappingService.mapTo(user1, UserAuthenticateDto.class);
        UserAuthenticateDto userDtoSecond = beanMappingService.mapTo(user2, UserAuthenticateDto.class);
        userDtoFirst.setPassword("password1");
        userDtoSecond.setPassword("password2");
        when(userService.findByLogin(user1.getLogin())).thenReturn(user1);
        when(userService.findByLogin(user2.getLogin())).thenReturn(user2);

        assertThat(userFacade.authenticate(userDtoFirst)).isFalse();
        assertThat(userFacade.authenticate(userDtoSecond)).isTrue();
    }

    @Test
    public void findByIdUser() {
        UserDto userDtoFirst = beanMappingService.mapTo(user1, UserDto.class);
        when(userService.findUserById(user1.getId())).thenReturn(user1);
        when(beanMappingService.mapTo(user1, UserDto.class)).thenReturn(userDtoFirst);
        UserDto userDto = userFacade.findById(user1.getId());
        verify(userService).findUserById(user1.getId());

        assertThat(userDtoFirst).isEqualTo(userDto);
    }

    @Test
    public void findAllUser() {
        List<User> allUsers = List.of(user1, user2, user3);
        List<UserDto> userDtos = beanMappingService.mapTo(allUsers, UserDto.class);
        when(userService.findAll()).thenReturn(allUsers);
        when(beanMappingService.mapTo(allUsers, UserDto.class)).thenReturn(userDtos);
        List<UserDto> userDtosFacade = userFacade.findAll();

        assertThat(userDtosFacade).isEqualTo(userDtos);
    }

    private void prepare() {
        user1 = new User();
        user1.setId(1L);
        user1.setLogin("login1");
        user1.setPasswordHash("123");

        user2 = new User();
        user2.setId(2L);
        user2.setLogin("login2");
        user2.setPasswordHash("456");

        user3 = new User();
        user3.setId(3L);
        user3.setLogin("login3");
        user3.setPasswordHash("789");
    }
}