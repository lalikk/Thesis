package cz.muni.fi.thesis.lalikova.jpa;

import cz.muni.fi.thesis.lalikova.entity.PointTag;
import cz.muni.fi.thesis.lalikova.dao.PointTagDao;
import lombok.NonNull;
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
    public void create(@NonNull PointTag pointTag) {
        entityManager.persist(pointTag);
    }

    @Override
    public PointTag findById(@NonNull Long id) {
        return entityManager.find(PointTag.class, id);
    }

    @Override
    public List<PointTag> findAll() {
        return entityManager.createQuery(
                "select p from PointTag p", PointTag.class).getResultList();
    }

    @Override
    public void update(@NonNull PointTag pointTag) {
        entityManager.merge(pointTag);
    }

    @Override
    public void remove(@NonNull PointTag pointTag) {
        entityManager.remove(findById(pointTag.getId()));
    }
}
