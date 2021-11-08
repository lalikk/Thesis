package cz.muni.fi.thesis.lalikova.jpa;

import cz.muni.fi.thesis.lalikova.dao.AdvancedUserDao;
import cz.muni.fi.thesis.lalikova.entity.AdvancedUser;
import lombok.NonNull;
import org.springframework.stereotype.Repository;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.transaction.Transactional;
import java.util.List;

@Repository
@Transactional
public class AdvancedUserDaoImpl implements AdvancedUserDao {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public void create(@NonNull AdvancedUser user) {
        entityManager.persist(user);
    }

    @Override
    public AdvancedUser findById(@NonNull Long id) {
        return entityManager.find(AdvancedUser.class, id);
    }

    @Override
    public AdvancedUser findByLogin(@NonNull String login) {
        return entityManager.createQuery("select user from AdvancedUser user where user.login = :login", AdvancedUser.class)
                .setParameter("login", login)
                .getSingleResult();
    }

    @Override
    public List<AdvancedUser> findAll() {
        return entityManager.createQuery("select user from AdvancedUser user", AdvancedUser.class).getResultList();
    }

    @Override
    public void update(@NonNull AdvancedUser user) {
        entityManager.merge(user);
    }

    @Override
    public void remove(@NonNull AdvancedUser user) {
        entityManager.remove(findById(user.getId()));
    }
}
