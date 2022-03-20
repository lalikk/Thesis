package cz.muni.fi.thesis.lalikova.service;

import cz.muni.fi.thesis.lalikova.entity.User;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Interface for the service for User entity
 */
@Service
public interface UserService {
    void create(User user, String unencryptedPassword);

    boolean authenticate(User user, String password);

    User findUserById(Long id);

    List<User> findAll();

    User findByLogin(String login);

    void changeUserPassword(User user, String plaintextPassword);

    void update(User user);

    void removeById(Long id);
}
