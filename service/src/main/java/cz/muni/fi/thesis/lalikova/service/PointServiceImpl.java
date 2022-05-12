package cz.muni.fi.thesis.lalikova.service;

import cz.muni.fi.thesis.lalikova.dao.*;
import cz.muni.fi.thesis.lalikova.dto.PhotoDto;
import cz.muni.fi.thesis.lalikova.dto.PointDto;
import cz.muni.fi.thesis.lalikova.entity.*;
import cz.muni.fi.thesis.lalikova.exceptions.DaoDataAccessException;
import lombok.NonNull;
import org.mockito.internal.util.collections.Sets;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Implementation of the interface for the service for Point entity
 */
@Service
public class PointServiceImpl implements PointService{

    final static Logger log = LoggerFactory.getLogger(PointServiceImpl.class);

    @Autowired
    private PointDao pointDao;

    @Autowired
    private RouteDao routeDao;

    @Autowired
    private PhotoDao photoDao;

    @Autowired
    private PointTagDao tagDao;

    @Autowired
    private CoordinatesDao coordinatesDao;

    @Override
    public Point create(@NonNull Point point) {
        log.error("Create point", point);
        try {
            if (point.getCoordinates() == null) {
                throw new DaoDataAccessException("No coordinates supplied");
            }
            //Coordinates coords = new Coordinates();
            //coords.setLatitude(point.getCoordinates().getLatitude());
            //coords.setLongitude(point.getCoordinates().getLongitude());
            //coordinatesDao.create(coords);
            //point.setCoordinates(coords);
            //Set<Long> pointTagIds = new HashSet<>();
            //if (point.getPhotos() != null) {
                //
            //}
            /*if (point.getTags() != null) {
                Set<PointTag> newSet = point.getTags().stream()
                        .map(tag -> {
                            PointTag existingTag = tagDao.findById(tag.getId());
                            existingTag.addPoint(point);
                            return existingTag;
                        })
                        .collect(Collectors.toSet());
                point.setTags(newSet);
            }*/
            point.getCoordinates().setPoint(point);
            pointDao.create(point);
            for (PointTag tag : point.getTags()) {
                PointTag existingTag = tagDao.findById(tag.getId());
                existingTag.addPoint(point);
                tagDao.update(existingTag);
            }
            return point;
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
            for (PointTag tag : tagDao.findAll()) {
                tag.removePoint(point);
                tagDao.update(tag);
            }
            for (PointTag tag : point.getTags()) {
                PointTag existingTag = tagDao.findById(tag.getId());
                existingTag.addPoint(point);
                tagDao.update(existingTag);
            }
            pointDao.update(point);
        } catch (Exception ex) {
            throw new DaoDataAccessException("Point Dao Update Exception with point: " + point, ex);
        }
    }

    @Override
    public void removeById(@NonNull Long id) {
        try {
            Point point = pointDao.findById(id);
            for (PointTag tag : point.getTags()) {
                tag.removePoint(point);
                tagDao.update(tag);
            }
            point.setTags(Collections.emptySet());
            for (Route route : point.getRoutes()) {
                route.removePoint(point);
                routeDao.update(route);
            }
            point.setRoutes(Collections.emptySet());
            pointDao.remove(point);
        } catch (Exception ex) {
            throw new DaoDataAccessException("Point Dao Remove Exception with point id: "+ id, ex);
        }
    }
}
