package cz.muni.fi.thesis.lalikova.service.service;

import cz.muni.fi.thesis.lalikova.dao.PointDao;
import cz.muni.fi.thesis.lalikova.entity.Point;
import cz.muni.fi.thesis.lalikova.exceptions.DaoDataAccessException;
import lombok.NonNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PointServiceImpl implements PointService{

    @Autowired
    private PointDao pointDao;

    @Override
    public void create(@NonNull Point point) {
        try {
            pointDao.create(point);
        } catch (Exception ex) {
            throw new DaoDataAccessException("Point Dao Create Exception with point: " + point, ex);
        }
    }

    @Override
    public Point findById(Long id) {
        try {
            return pointDao.findById(id);
        } catch (Exception ex) {
            throw new DaoDataAccessException("Point Dao Find by Id Exception with id: " + id, ex );
        }
    }

    @Override
    public List<Point> findAll() {
        try {
            return pointDao.findAll();
        } catch (Exception ex) {
            throw new DaoDataAccessException("Point Dao Find All Exception", ex);
        }
    }

    @Override
    public void update(Point point) {
        try {
            pointDao.update(point);
        } catch (Exception ex) {
            throw new DaoDataAccessException("Point Dao Update Exception with point: " + point, ex);
        }
    }

    @Override
    public void remove(Point point) {
        try {
            pointDao.remove(point);
        } catch (Exception ex) {
            throw new DaoDataAccessException("Point Dao Remove Exception with point: "+ point, ex);
        }
    }
}
