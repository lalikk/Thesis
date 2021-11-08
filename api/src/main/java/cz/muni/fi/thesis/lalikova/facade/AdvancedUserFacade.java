package cz.muni.fi.thesis.lalikova.facade;

import cz.muni.fi.thesis.lalikova.dto.AdvancedUserAuthenticateDto;
import cz.muni.fi.thesis.lalikova.dto.AdvancedUserDto;

import java.util.List;

public interface AdvancedUserFacade {

    boolean authenticate(AdvancedUserAuthenticateDto userAuthenticateDto);

    AdvancedUserDto findById(Long id);

    List<AdvancedUserDto> findAll();

    AdvancedUserDto findByLogin(String login);
}
