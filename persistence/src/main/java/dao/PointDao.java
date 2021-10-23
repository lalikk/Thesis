package dao;

import entity.Point;
import java.util.List;

public interface PointDao {

    void create(Point point);

    Point findById(Long id);

    List<Point> findAll();

    void update(Point point);

    void remove(Point point);
}
