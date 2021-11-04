package cz.muni.fi.thesis.lalikova.jpa;

import cz.muni.fi.thesis.lalikova.entity.Route;
import cz.muni.fi.thesis.lalikova.dao.RouteDao;
import cz.muni.fi.thesis.lalikova.exceptions.DaoDataAccessException;
import lombok.NonNull;
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
    public void create(@NonNull Route route) {
        entityManager.persist(route);
    }

    @Override
    public Route findById(@NonNull Long id) {
        return entityManager.find(Route.class, id);
    }

    @Override
    public List<Route> findAll() {
        return entityManager.createQuery(
                "select r from Route r", Route.class).getResultList();
    }

    @Override
    public boolean isOrdered(@NonNull Route route) {
        return !route.getOrderedPointIds().isEmpty();
    }

    @Override
    public Long getStaringPointId(@NonNull Route route) {
        if (isOrdered(route)) {
            return route.getOrderedPointIds().get(0);
        } else {
            throw new DaoDataAccessException("Requesting starting point of unordered route not possible");
        }
    }

    @Override
    public void update(@NonNull Route route) {
        entityManager.merge(route);
    }

    @Override
    public void remove(@NonNull Route route) {
        entityManager.remove(findById(route.getId()));
    }
}
