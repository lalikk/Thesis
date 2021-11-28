package cz.muni.fi.thesis.lalikova.service;

import cz.muni.fi.thesis.lalikova.dao.UserDao;
import cz.muni.fi.thesis.lalikova.entity.User;
import cz.muni.fi.thesis.lalikova.exceptions.DaoDataAccessException;
import lombok.NonNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.crypto.argon2.Argon2PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserDao userDao;

    private final PasswordEncoder encoder = new Argon2PasswordEncoder();

    @Override
    public void create(User user, String unencryptedPassword) {
        user.setPasswordHash(encoder.encode(unencryptedPassword));
        try {
            userDao.create(user);
        } catch (DataAccessException e) {
            throw new DaoDataAccessException("Could not create a user: " + user, e);
        }
    }

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

    @Override
    public void changeUserPassword(User user, String plaintextPassword) {
        user.setPasswordHash(encoder.encode(plaintextPassword));

        this.update(user);
    }

    @Override
    public void update(User user) {
        try {
            userDao.update(user);
        } catch (DataAccessException e) {
            throw new DaoDataAccessException("Could not update user with login : " + user.getLogin(), e);
        }
    }

    @Override
    public void removeById(Long id) {
        User dbUser = findUserById(id);
        try {
            if (dbUser != null) {
                userDao.remove(dbUser);
            }
        } catch (DataAccessException e) {
            throw new DaoDataAccessException("Could not delete user with id: " + id, e);
        }
    }
}
