package jpa;

import dao.RouteDao;
import entity.Route;
import org.springframework.stereotype.Repository;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.transaction.Transactional;
import java.util.List;

@Repository
@Transactional
public class RouteDaoImpl implements RouteDao {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public void create(Route route) {
        entityManager.persist(route);
    }

    @Override
    public Route findById(Long id) {
        return entityManager.find(Route.class, id);
    }

    @Override
    public List<Route> findAll() {
        return entityManager.createQuery(
                "select r from Route r", Route.class).getResultList();
    }

    @Override
    public void update(Route route) {
        entityManager.merge(route);
    }

    @Override
    public void remove(Route route) {
        entityManager.remove(route);
    }
}
