package cz.muni.fi.thesis.lalikova.service.facade;


import cz.muni.fi.thesis.lalikova.dto.AdvancedUserAuthenticateDto;
import cz.muni.fi.thesis.lalikova.dto.AdvancedUserDto;
import cz.muni.fi.thesis.lalikova.entity.AdvancedUser;
import cz.muni.fi.thesis.lalikova.exceptions.ServiceCallException;
import cz.muni.fi.thesis.lalikova.facade.AdvancedUserFacade;
import cz.muni.fi.thesis.lalikova.service.AdvancedUserService;
import cz.muni.fi.thesis.lalikova.service.BeanMappingService;
import lombok.NonNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;

@Service
@Transactional
public class AdvancedUserFacadeImpl implements AdvancedUserFacade {

    @Autowired
    private AdvancedUserService userService;

    @Autowired
    private BeanMappingService beanMappingService;

    @Override
    public boolean authenticate(@NonNull AdvancedUserAuthenticateDto userAuthenticateDto) {
        return userService.authenticate(
                userService.findByLogin(userAuthenticateDto.getLogin()), userAuthenticateDto.getPassword());
    }

    @Override
    public AdvancedUserDto findById(@NonNull Long id) {
        AdvancedUser user = userService.findUserById(id);
        try {
            return (user == null) ? null : beanMappingService.mapTo(user, AdvancedUserDto.class);
        } catch (Exception e) {
            throw new ServiceCallException("BeanMappingService Map To Exception with user: " + user, e);
        }
    }

    @Override
    public List<AdvancedUserDto> findAll() {
        List<AdvancedUser> users = userService.findAll();
        try {
            return beanMappingService.mapTo(users, AdvancedUserDto.class);
        } catch (Exception e) {
            throw new ServiceCallException("BeanMappingService Map To Exception with list of users: " + users, e);
        }
    }

    @Override
    public AdvancedUserDto findByLogin(@NonNull String login){
        AdvancedUser user = userService.findByLogin(login);
        try {
            return (user == null) ? null : beanMappingService.mapTo(user, AdvancedUserDto.class);
        } catch (Throwable e) {
            throw new ServiceCallException("BeanMappingService Map To Exception with user: " + user, e);
        }
    }
}
