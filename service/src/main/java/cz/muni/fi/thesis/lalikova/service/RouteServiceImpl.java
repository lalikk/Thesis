package cz.muni.fi.thesis.lalikova.service;

import cz.muni.fi.thesis.lalikova.dao.PointDao;
import cz.muni.fi.thesis.lalikova.dao.RouteDao;
import cz.muni.fi.thesis.lalikova.entity.Point;
import cz.muni.fi.thesis.lalikova.entity.Route;
import cz.muni.fi.thesis.lalikova.exceptions.DaoDataAccessException;
import lombok.NonNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Implementation of the interface for the service for Route entity
 */
@Service
public class RouteServiceImpl implements RouteService {


    private final Logger log = LoggerFactory.getLogger(RouteServiceImpl.class);

    @Autowired
    private RouteDao routeDao;

    @Autowired
    private PointDao pointDao;

    @Override
    public Route create(@NonNull Route route) {
        try {
            routeDao.create(route);
            for (Point point : route.getPoints()) {
                Point existing = pointDao.findById(point.getId());
                existing.addRoute(route);
                pointDao.update(existing);
            }
            return route;
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
            for (Point point : pointDao.findAll()) {
                point.removeRoute(route);
                pointDao.update(point);
            }
            for (Point point : route.getPoints()) {
                Point existing = pointDao.findById(point.getId());
                existing.addRoute(route);
                pointDao.update(existing);
            }
            log.error("Point count: {}", route.getPoints().size());
            routeDao.update(route);
        } catch (Exception ex) {
            throw new DaoDataAccessException("Route Dao Update Exception with route: " + route, ex);
        }
    }

    @Override
    public void removeById(@NonNull Long id) {
        try {
            Route route = routeDao.findById(id);
            for (Point point : route.getPoints()) {
                point.removeRoute(route);
                pointDao.update(point);
            }
            routeDao.remove(routeDao.findById(id));
        } catch (Exception ex) {
            throw new DaoDataAccessException("Route Dao Remove Exception with id: "+ id, ex);
        }
    }
}
