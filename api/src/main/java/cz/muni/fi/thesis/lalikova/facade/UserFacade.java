package cz.muni.fi.thesis.lalikova.facade;

import cz.muni.fi.thesis.lalikova.dto.UserAuthenticateDto;
import cz.muni.fi.thesis.lalikova.dto.UserDto;

import java.util.List;

public interface UserFacade {

    boolean authenticate(UserAuthenticateDto userAuthenticateDto);

    UserDto findById(Long id);

    List<UserDto> findAll();

    UserDto findByLogin(String login);
}
