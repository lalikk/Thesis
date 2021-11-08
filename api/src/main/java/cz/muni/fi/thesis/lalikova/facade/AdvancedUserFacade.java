package cz.muni.fi.thesis.lalikova.facade;

import cz.muni.fi.thesis.lalikova.dto.UserAuthenticateDto;
import cz.muni.fi.thesis.lalikova.dto.UserDto;

import java.util.List;

public interface AdvancedUserFacade {

    boolean authenticate(UserAuthenticateDto userAuthenticateDto);

    boolean isAdmin(UserDto userDto);

    UserDto findById(Long id);

    List<UserDto> findAll();

    UserDto findByLogin(String login);
}
