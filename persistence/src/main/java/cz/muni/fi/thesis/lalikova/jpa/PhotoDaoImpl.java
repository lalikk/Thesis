package cz.muni.fi.thesis.lalikova.jpa;

import cz.muni.fi.thesis.lalikova.entity.Photo;
import cz.muni.fi.thesis.lalikova.dao.PhotoDao;
import lombok.NonNull;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.util.List;

@Repository
@Transactional
public class PhotoDaoImpl implements PhotoDao {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public void create(@NonNull Photo photo) {
        entityManager.persist(photo);
    }

    @Override
    public Photo findById(@NonNull Long id) {
        return entityManager.find(Photo.class, id);
    }

    @Override
    public List<Photo> findAll() {
        return entityManager.createQuery(
                "select p from Photo p", Photo.class).getResultList();
    }

    @Override
    public void update(@NonNull Photo photo) {
        entityManager.merge(photo);
    }

    @Override
    public void remove(Photo photo) {
        entityManager.remove(findById(photo.getId()));
    }
}
