package cz.muni.fi.thesis.lalikova.service;

import cz.muni.fi.thesis.lalikova.dao.AdvancedUserDao;
import cz.muni.fi.thesis.lalikova.entity.AdvancedUser;
import cz.muni.fi.thesis.lalikova.exceptions.DaoDataAccessException;
import lombok.NonNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.crypto.password.Pbkdf2PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdvancedUserServiceImpl implements AdvancedUserService {

    @Autowired
    private AdvancedUserDao userDao;

    private final PasswordEncoder encoder = new Pbkdf2PasswordEncoder();

    @Override
    public boolean authenticate(AdvancedUser user, String password) {
        return encoder.matches(password, user.getPasswordHash());
    }

    @Override
    public AdvancedUser findUserById(@NonNull Long id) {
        try{
            return userDao.findById(id);
        } catch (Exception e){
            throw new DaoDataAccessException("User Dao findById Exception with id: " + id, e);
        }
    }

    @Override
    public List<AdvancedUser> findAll() {
        try{
            return userDao.findAll();
        } catch (Exception e){
            throw new DaoDataAccessException("User Dao FindAll Exception ", e);
        }
    }

    @Override
    public AdvancedUser findByLogin(String login){
        try{
            return userDao.findByLogin(login);
        } catch (Throwable e){
            throw new DaoDataAccessException("User Dao findByLogin Exception with login: " + login, e);
        }
    }
}
