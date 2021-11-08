package cz.muni.fi.thesis.lalikova.service;

import cz.muni.fi.thesis.lalikova.entity.AdvancedUser;
import org.springframework.stereotype.Service;

import java.util.List;

public interface AdvancedUserService {

    boolean authenticate(AdvancedUser user, String password);

    AdvancedUser findUserById(Long id);

    List<AdvancedUser> findAll();

    AdvancedUser findByLogin(String login);
}
