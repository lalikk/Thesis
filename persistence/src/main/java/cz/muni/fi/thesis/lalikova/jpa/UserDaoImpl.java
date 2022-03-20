package cz.muni.fi.thesis.lalikova.jpa;

import cz.muni.fi.thesis.lalikova.dao.UserDao;
import cz.muni.fi.thesis.lalikova.entity.User;
import lombok.NonNull;
import org.springframework.stereotype.Repository;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.transaction.Transactional;
import java.util.List;

/**
 * Implementation of data access object interface for User entity
 */
@Repository
@Transactional
public class UserDaoImpl implements UserDao {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public void create(@NonNull User user) {
        entityManager.persist(user);
    }

    @Override
    public User findById(@NonNull Long id) {
        return entityManager.find(User.class, id);
    }

    @Override
    public User findByLogin(@NonNull String login) {
        return entityManager.createQuery("select user from User user where user.login = :login", User.class)
                .setParameter("login", login)
                .getSingleResult();
    }

    @Override
    public List<User> findAll() {
        return entityManager.createQuery("select user from User user", User.class).getResultList();
    }

    @Override
    public void update(@NonNull User user) {
        entityManager.merge(user);
    }

    @Override
    public void remove(@NonNull User user) {
        entityManager.remove(findById(user.getId()));
    }
}
