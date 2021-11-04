package cz.muni.fi.thesis.lalikova.service;

import cz.muni.fi.thesis.lalikova.dao.RouteDao;
import cz.muni.fi.thesis.lalikova.entity.Route;
import cz.muni.fi.thesis.lalikova.exceptions.DaoDataAccessException;
import lombok.NonNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RouteServiceImpl implements RouteService {

    @Autowired
    private RouteDao routeDao;

    @Override
    public void create(@NonNull Route route) {
        try {
            routeDao.create(route);
        } catch (Exception ex) {
            throw new DaoDataAccessException("Route Dao Create Exception with route: " + route, ex);
        }
    }

    @Override
    public Route findById(@NonNull Long id) {
        try {
            return routeDao.findById(id);
        } catch (Exception ex) {
            throw new DaoDataAccessException("Route Dao Find by Id Exception with id: " + id, ex );
        }
    }

    @Override
    public List<Route> findAll() {
        try {
            return routeDao.findAll();
        } catch (Exception ex) {
            throw new DaoDataAccessException("Route Dao Find All Exception", ex);
        }
    }

    @Override
    public boolean isOrdered(@NonNull Route route) {
        try {
            return routeDao.isOrdered(route);
        } catch (Exception ex) {
            throw new DaoDataAccessException("Route Dao is Ordered Exception with route: " + route, ex);
        }
    }

    @Override
    public Long getStaringPointId(@NonNull Route route) {
        try {
            return routeDao.getStaringPointId(route);
        } catch (Exception ex) {
            throw new DaoDataAccessException("Route Dao get Starting Point Exception with route: " + route, ex);
        }
    }

    @Override
    public void update(@NonNull Route route) {
        try {
            routeDao.update(route);
        } catch (Exception ex) {
            throw new DaoDataAccessException("Route Dao Update Exception with route: " + route, ex);
        }
    }

    @Override
    public void removeById(@NonNull Long id) {
        try {
            routeDao.remove(routeDao.findById(id));
        } catch (Exception ex) {
            throw new DaoDataAccessException("Route Dao Remove Exception with id: "+ id, ex);
        }
    }
}
