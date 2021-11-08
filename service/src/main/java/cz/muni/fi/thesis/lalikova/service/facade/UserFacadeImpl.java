package cz.muni.fi.thesis.lalikova.service.facade;

import cz.muni.fi.thesis.lalikova.dto.UserAuthenticateDto;
import cz.muni.fi.thesis.lalikova.dto.UserDto;
import cz.muni.fi.thesis.lalikova.entity.User;
import cz.muni.fi.thesis.lalikova.exceptions.ServiceCallException;
import cz.muni.fi.thesis.lalikova.facade.UserFacade;
import cz.muni.fi.thesis.lalikova.service.BeanMappingService;
import cz.muni.fi.thesis.lalikova.service.UserService;
import lombok.NonNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;

@Service
@Transactional
public class UserFacadeImpl implements UserFacade {

    @Autowired
    private UserService userService;

    @Autowired
    private BeanMappingService beanMappingService;

    @Override
    public boolean authenticate(@NonNull UserAuthenticateDto userAuthenticateDto) {
        return userService.authenticate(
                userService.findByLogin(userAuthenticateDto.getLogin()), userAuthenticateDto.getPassword());
    }

    @Override
    public UserDto findById(@NonNull Long id) {
        User user = userService.findUserById(id);
        try {
            return (user == null) ? null : beanMappingService.mapTo(user, UserDto.class);
        } catch (Exception e) {
            throw new ServiceCallException("BeanMappingService Map To Exception with user: " + user, e);
        }
    }

    @Override
    public List<UserDto> findAll() {
        List<User> users = userService.findAll();
        try {
            return beanMappingService.mapTo(users, UserDto.class);
        } catch (Exception e) {
            throw new ServiceCallException("BeanMappingService Map To Exception with list of users: " + users, e);
        }
    }

    @Override
    public UserDto findByLogin(@NonNull String login){
        User user = userService.findByLogin(login);
        try {
            return (user == null) ? null : beanMappingService.mapTo(user, UserDto.class);
        } catch (Throwable e) {
            throw new ServiceCallException("BeanMappingService Map To Exception with user: " + user, e);
        }
    }
}
