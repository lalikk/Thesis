package cz.muni.fi.thesis.lalikova.facade;

import cz.muni.fi.thesis.lalikova.dto.UserAuthenticateDto;
import cz.muni.fi.thesis.lalikova.dto.UserCreateDto;
import cz.muni.fi.thesis.lalikova.dto.UserDto;

import java.util.List;

/**
 * Facade interface for the users
 */
public interface UserFacade {
    void create(UserCreateDto userDto, String unencryptedPassword);

    boolean authenticate(UserAuthenticateDto userAuthenticateDto);

    UserDto findById(Long id);

    List<UserDto> findAll();

    UserDto findByLogin(String login);

    void update(UserDto genre);

    void removeById(Long userId);
}
