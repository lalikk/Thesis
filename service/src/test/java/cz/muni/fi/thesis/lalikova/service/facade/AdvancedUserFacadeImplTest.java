package cz.muni.fi.thesis.lalikova.service.facade;

import cz.muni.fi.thesis.lalikova.ServiceConfiguration;
import cz.muni.fi.thesis.lalikova.dto.AdvancedUserAuthenticateDto;
import cz.muni.fi.thesis.lalikova.dto.AdvancedUserDto;
import cz.muni.fi.thesis.lalikova.dto.UserAuthenticateDto;
import cz.muni.fi.thesis.lalikova.dto.UserDto;
import cz.muni.fi.thesis.lalikova.entity.AdvancedUser;
import cz.muni.fi.thesis.lalikova.entity.User;
import cz.muni.fi.thesis.lalikova.facade.AdvancedUserFacade;
import cz.muni.fi.thesis.lalikova.facade.UserFacade;
import cz.muni.fi.thesis.lalikova.service.AdvancedUserService;
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
public class AdvancedUserFacadeImplTest extends AbstractTestNGSpringContextTests {

    @Mock
    private AdvancedUserService userService;

    @Spy
    @Autowired
    private BeanMappingService beanMappingService;

    @InjectMocks
    private final AdvancedUserFacade userFacade = new AdvancedUserFacadeImpl();

    private AdvancedUser user1;
    private AdvancedUser user2;
    private AdvancedUser user3;

    @BeforeMethod
    public void setup() throws ServiceException {
        MockitoAnnotations.initMocks(this);
        prepare();
    }

    @Test
    public void authenticateUser() {
        when(userService.authenticate(user1, "password1")).thenReturn(false);
        when(userService.authenticate(user2, "password2")).thenReturn(true);
        AdvancedUserAuthenticateDto userDtoFirst = beanMappingService.mapTo(user1, AdvancedUserAuthenticateDto.class);
        AdvancedUserAuthenticateDto userDtoSecond = beanMappingService.mapTo(user2, AdvancedUserAuthenticateDto.class);
        userDtoFirst.setPassword("password1");
        userDtoSecond.setPassword("password2");
        when(userService.findByLogin(user1.getLogin())).thenReturn(user1);
        when(userService.findByLogin(user2.getLogin())).thenReturn(user2);

        assertThat(userFacade.authenticate(userDtoFirst)).isFalse();
        assertThat(userFacade.authenticate(userDtoSecond)).isTrue();
    }

    @Test
    public void findByIdUser() {
        AdvancedUserDto userDtoFirst = beanMappingService.mapTo(user1, AdvancedUserDto.class);
        when(userService.findUserById(user1.getId())).thenReturn(user1);
        when(beanMappingService.mapTo(user1, AdvancedUserDto.class)).thenReturn(userDtoFirst);
        AdvancedUserDto userDto = userFacade.findById(user1.getId());
        verify(userService).findUserById(user1.getId());

        assertThat(userDtoFirst).isEqualTo(userDto);
    }

    @Test
    public void findAllUser() {
        List<AdvancedUser> allUsers = List.of(user1, user2, user3);
        List<AdvancedUserDto> userDtos = beanMappingService.mapTo(allUsers, AdvancedUserDto.class);
        when(userService.findAll()).thenReturn(allUsers);
        when(beanMappingService.mapTo(allUsers, AdvancedUserDto.class)).thenReturn(userDtos);
        List<AdvancedUserDto> userDtosFacade = userFacade.findAll();

        assertThat(userDtosFacade).isEqualTo(userDtos);
    }

    private void prepare() {
        user1 = new AdvancedUser();
        user1.setId(1L);
        user1.setLogin("login1");
        user1.setPasswordHash("123");

        user2 = new AdvancedUser();
        user2.setId(2L);
        user2.setLogin("login2");
        user2.setPasswordHash("456");

        user3 = new AdvancedUser();
        user3.setId(3L);
        user3.setLogin("login3");
        user3.setPasswordHash("789");
    }

}
