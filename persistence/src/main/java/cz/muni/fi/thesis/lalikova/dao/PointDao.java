package cz.muni.fi.thesis.lalikova.dao;

import cz.muni.fi.thesis.lalikova.entity.Point;

import java.util.List;

/**
 * Data access object interface for Point entity
 */
public interface PointDao {

    void create(Point point);

    Point findById(Long id);

    List<Point> findAll();

    void update(Point point);

    void remove(Point point);
}
