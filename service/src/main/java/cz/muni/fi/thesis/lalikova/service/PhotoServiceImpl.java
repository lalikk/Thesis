package cz.muni.fi.thesis.lalikova.service;

import cz.muni.fi.thesis.lalikova.dao.PhotoDao;
import cz.muni.fi.thesis.lalikova.entity.Photo;
import cz.muni.fi.thesis.lalikova.exceptions.DaoDataAccessException;
import lombok.NonNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PhotoServiceImpl implements PhotoService{

    @Autowired
    private PhotoDao photoDao;

    @Override
    public void create(@NonNull Photo photo) {
        try {
            photoDao.create(photo);
        } catch (Exception ex) {
            throw new DaoDataAccessException("Photo Dao Create Exception with photo: " + photo, ex);
        }
    }

    @Override
    public Photo findById(@NonNull Long id) {
        try {
            return photoDao.findById(id);
        } catch (Exception ex) {
            throw new DaoDataAccessException("Photo Dao Find by Id Exception with id: " + id, ex );
        }
    }

    @Override
    public List<Photo> findAll() {
        try {
            return photoDao.findAll();
        } catch (Exception ex) {
            throw new DaoDataAccessException("Photo Dao Find All Exception", ex);
        }
    }

    @Override
    public void update(@NonNull Photo photo) {
        try {
            photoDao.update(photo);
        } catch (Exception ex) {
            throw new DaoDataAccessException("Photo Dao Update Exception with photo: " + photo, ex);
        }
    }

    @Override
    public void removeById(@NonNull Long id) {
        try {
            photoDao.remove(photoDao.findById(id));
        } catch (Exception ex) {
            throw new DaoDataAccessException("Photo Dao Remove Exception with photo id: "+ id, ex);
        }
    }
}
