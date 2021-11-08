package cz.muni.fi.thesis.lalikova.dao;

import cz.muni.fi.thesis.lalikova.entity.AdvancedUser;

import java.util.List;

public interface AdvancedUserDao {

    void create(AdvancedUser user);

    List<AdvancedUser> findAll();

    AdvancedUser findById(Long id);

    AdvancedUser findByLogin(String login);

    void update(AdvancedUser user);

    void remove(AdvancedUser user);
}
