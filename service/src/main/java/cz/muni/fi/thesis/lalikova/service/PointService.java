package cz.muni.fi.thesis.lalikova.service;

import java.util.List;
import cz.muni.fi.thesis.lalikova.entity.Point;

public interface PointService {
    void create(Point point);

    Point findById(Long id);

    List<Point> findAll();

    void update(Point point);

    void remove(Point point);

}
