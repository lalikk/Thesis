package cz.muni.fi.thesis.lalikova.service;

import cz.muni.fi.thesis.lalikova.dao.PointTagDao;
import cz.muni.fi.thesis.lalikova.entity.PointTag;
import cz.muni.fi.thesis.lalikova.exceptions.DaoDataAccessException;
import lombok.NonNull;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

public class PointTagServiceImpl implements PointTagService{

    @Autowired
    private PointTagDao pointTagDao;

    @Override
    public void create(@NonNull PointTag pointTag) {
        try {
            pointTagDao.create(pointTag);
        } catch (Exception ex) {
            throw new DaoDataAccessException("PointTag Dao Create Exception with pointTag: " + pointTag, ex);
        }
    }

    @Override
    public PointTag findById(Long id) {
        try {
            return pointTagDao.findById(id);
        } catch (Exception ex) {
            throw new DaoDataAccessException("PointTag Dao Find by Id Exception with id: " + id, ex );
        }
    }

    @Override
    public List<PointTag> findAll() {
        try {
            return pointTagDao.findAll();
        } catch (Exception ex) {
            throw new DaoDataAccessException("PointTag Dao Find All Exception", ex);
        }
    }

    @Override
    public void update(PointTag pointTag) {
        try {
            pointTagDao.update(pointTag);
        } catch (Exception ex) {
            throw new DaoDataAccessException("PointTag Dao Update Exception with pointTag: " + pointTag, ex);
        }
    }

    @Override
    public void remove(PointTag pointTag) {
        try {
            pointTagDao.remove(pointTag);
        } catch (Exception ex) {
            throw new DaoDataAccessException("PointTag Dao Remove Exception with pointTag: "+ pointTag, ex);
        }
    }
}
