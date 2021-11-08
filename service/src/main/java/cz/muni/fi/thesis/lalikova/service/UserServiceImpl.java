package cz.muni.fi.thesis.lalikova.service;

import cz.muni.fi.thesis.lalikova.dao.UserDao;
import cz.muni.fi.thesis.lalikova.entity.User;
import cz.muni.fi.thesis.lalikova.exceptions.DaoDataAccessException;
import lombok.NonNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.crypto.password.Pbkdf2PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserDao userDao;

    private final PasswordEncoder encoder = new Pbkdf2PasswordEncoder();

    @Override
    public boolean authenticate(User user, String password) {
        return encoder.matches(password, user.getPasswordHash());
    }

    @Override
    public User findUserById(@NonNull Long id) {
        try{
            return userDao.findById(id);
        } catch (Exception e){
            throw new DaoDataAccessException("User Dao findById Exception with id: " + id, e);
        }
    }

    @Override
    public List<User> findAll() {
        try{
            return userDao.findAll();
        } catch (Exception e){
            throw new DaoDataAccessException("User Dao FindAll Exception ", e);
        }
    }

    @Override
    public User findByLogin(String login){
        try{
            return userDao.findByLogin(login);
        } catch (Throwable e){
            throw new DaoDataAccessException("User Dao findByLogin Exception with login: " + login, e);
        }
    }
}