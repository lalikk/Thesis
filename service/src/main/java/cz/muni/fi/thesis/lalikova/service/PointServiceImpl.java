package cz.muni.fi.thesis.lalikova.service;

import cz.muni.fi.thesis.lalikova.dao.PointDao;
import cz.muni.fi.thesis.lalikova.dao.RouteDao;
import cz.muni.fi.thesis.lalikova.entity.Point;
import cz.muni.fi.thesis.lalikova.entity.Route;
import cz.muni.fi.thesis.lalikova.exceptions.DaoDataAccessException;
import lombok.NonNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Implementation of the interface for the service for Point entity
 */
@Service
public class PointServiceImpl implements PointService{

    @Autowired
    private PointDao pointDao;

    @Autowired
    private RouteDao routeDao;

    @Override
    public void create(@NonNull Point point) {
        try {
            pointDao.create(point);
        } catch (Exception ex) {
            throw new DaoDataAccessException("Point Dao Create Exception with point: " + point, ex);
        }
    }

    @Override
    public Point findById(@NonNull Long id) {
        try {
            return pointDao.findById(id);
        } catch (Exception ex) {
            throw new DaoDataAccessException("Point Dao Find by Id Exception with id: " + id, ex );
        }
    }

    @Override
    public List<Point> findByRoute(Long id) {
        try {
            Route route = routeDao.findById(id);
            List<Point> points = pointDao.findAll();
            return points.stream().filter(x -> x.getRoutes().contains(route)).collect(Collectors.toList());
        } catch (Exception ex) {
            throw new DaoDataAccessException("Point Dao Find by Route Exception with route id: " + id, ex );
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
    public void update(@NonNull Point point) {
        try {
            pointDao.update(point);
        } catch (Exception ex) {
            throw new DaoDataAccessException("Point Dao Update Exception with point: " + point, ex);
        }
    }

    @Override
    public void removeById(@NonNull Long id) {
        try {
            pointDao.remove(pointDao.findById(id));
        } catch (Exception ex) {
            throw new DaoDataAccessException("Point Dao Remove Exception with point id: "+ id, ex);
        }
    }
}
