package cz.muni.fi.thesis.lalikova.jpa;

import cz.muni.fi.thesis.lalikova.dao.DistancesDao;
import cz.muni.fi.thesis.lalikova.entity.Distances;
import lombok.NonNull;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.util.List;

/**
 * Implementation of data access object interface for Distances entity
 */
@Repository
@Transactional
public class DistancesDaoImpl implements DistancesDao {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public void create(@NonNull Distances distances) {
        entityManager.persist(distances);
    }

    @Override
    public Distances findById(@NonNull Long id) {
        return entityManager.find(Distances.class, id);
    }

    @Override
    public List<Distances> findAll() {
        return entityManager.createQuery(
                "select d from Distances d", Distances.class).getResultList();
    }

    @Override
    public void update(@NonNull Distances distances) {
        entityManager.merge(distances);
    }

    @Override
    public void remove(@NonNull Distances distances) {
        entityManager.remove(findById(distances.getId()));
    }
}
