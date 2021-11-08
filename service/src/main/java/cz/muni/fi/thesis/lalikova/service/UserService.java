package cz.muni.fi.thesis.lalikova.service;

import cz.muni.fi.thesis.lalikova.entity.User;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface UserService {

    boolean authenticate(User user, String password);

    User findUserById(Long id);

    List<User> findAll();

    User findByLogin(String login);
}
