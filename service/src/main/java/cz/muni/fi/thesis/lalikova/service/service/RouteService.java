package cz.muni.fi.thesis.lalikova.service.service;

import cz.muni.fi.thesis.lalikova.entity.Route;
import java.util.List;

public interface RouteService {
    void create(Route route);

    Route findById(Long id);

    List<Route> findAll();

    boolean isOrdered(Route route);

    Long getStaringPointId(Route route);

    void update(Route route);

    void remove(Route route);
}
