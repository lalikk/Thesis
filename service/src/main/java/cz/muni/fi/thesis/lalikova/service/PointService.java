package cz.muni.fi.thesis.lalikova.service;

import java.util.List;
import cz.muni.fi.thesis.lalikova.entity.Point;

/**
 * Interface for the service for Point entity
 */
public interface PointService {
    Point create(Point point);

    Point findById(Long id);

    List<Point> findByRoute(Long id);

    List<Point> findAll();

    void update(Point point);

    void removeById(Long id);
}
