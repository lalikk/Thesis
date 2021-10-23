package cz.muni.fi.thesis.lalikova.jpa;

import cz.muni.fi.thesis.lalikova.entity.Point;
import cz.muni.fi.thesis.lalikova.dao.PointDao;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.util.List;

@Repository
@Transactional
public class PointDaoImpl implements PointDao {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public void create(Point point) {
        entityManager.persist(point);
    }

    @Override
    public Point findById(Long id) {
        return entityManager.find(Point.class, id);
    }

    @Override
    public List<Point> findAll() {
        return entityManager.createQuery(
                "select p from Point p", Point.class).getResultList();
    }

    @Override
    public void update(Point point) {
        entityManager.merge(point);
    }

    @Override
    public void remove(Point point) {
        entityManager.remove(findById(point.getId()));
    }
}
