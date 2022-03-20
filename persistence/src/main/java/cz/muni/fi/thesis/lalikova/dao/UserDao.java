package cz.muni.fi.thesis.lalikova.dao;

import cz.muni.fi.thesis.lalikova.entity.User;

import java.util.List;

/**
 * Data access object interface for User entity
 */
public interface UserDao {

    void create(User user);

    List<User> findAll();

    User findById(Long id);

    User findByLogin(String login);

    void update(User user);

    void remove(User user);
}
