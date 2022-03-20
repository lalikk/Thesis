package cz.muni.fi.thesis.lalikova.jpa;

import cz.muni.fi.thesis.lalikova.entity.Point;
import cz.muni.fi.thesis.lalikova.dao.PointDao;
import lombok.NonNull;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.util.List;

/**
 * Implementation of data access object interface for Point entity
 */
@Repository
@Transactional
public class PointDaoImpl implements PointDao {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public void create(@NonNull Point point) {
        entityManager.persist(point);
    }

    @Override
    public Point findById(@NonNull Long id) {
        return entityManager.find(Point.class, id);
    }

    @Override
    public List<Point> findAll() {
        return entityManager.createQuery(
                "select p from Point p", Point.class).getResultList();
    }

    @Override
    public void update(@NonNull Point point) {
        entityManager.merge(point);
    }

    @Override
    public void remove(@NonNull Point point) {
        entityManager.remove(findById(point.getId()));
    }
}
