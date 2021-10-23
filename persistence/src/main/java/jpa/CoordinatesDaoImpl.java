package jpa;

import dao.CoordinatesDao;
import entity.Coordinates;
import lombok.NonNull;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.util.List;

@Repository
@Transactional
public class CoordinatesDaoImpl implements CoordinatesDao {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public void create(@NonNull Coordinates coordinates) {
        entityManager.persist(coordinates);
    }

    @Override
    public Coordinates findById(@NonNull Long id) {
        return entityManager.find(Coordinates.class, id);
    }

    @Override
    public List<Coordinates> findAll() {
        return entityManager.createQuery(
                "select c from Coordinates c", Coordinates.class).getResultList();
    }

    @Override
    public void update(@NonNull Coordinates coordinates) {
        entityManager.merge(coordinates);
    }

    @Override
    public void remove(Coordinates coordinates) {
        entityManager.remove(findById(coordinates.getId()));
    }
}
