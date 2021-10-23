package dao;

import entity.Route;
import java.util.List;

public interface RouteDao {

    void create(Route route);

    Route findById(Long id);

    List<Route> findAll();

    void update(Route route);

    void remove(Route route);
}
