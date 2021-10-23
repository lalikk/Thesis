package jpa;

import dao.PointTagDao;
import entity.PointTag;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.util.List;


@Repository
@Transactional
public class PointTagDaoImpl implements PointTagDao {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public void create(PointTag pointTag) {
        entityManager.persist(pointTag);
    }

    @Override
    public PointTag findById(Long id) {
        return entityManager.find(PointTag.class, id);
    }

    @Override
    public List<PointTag> findAll() {
        return entityManager.createQuery(
                "select p from PointTag p", PointTag.class).getResultList();
    }

    @Override
    public void update(PointTag pointTag) {
        entityManager.merge(pointTag);
    }

    @Override
    public void remove(PointTag pointTag) {
        entityManager.remove(findById(pointTag.getId()));
    }
}
