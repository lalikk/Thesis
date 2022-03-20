package cz.muni.fi.thesis.lalikova.dao;

import cz.muni.fi.thesis.lalikova.entity.Route;

import java.util.List;

/**
 * Data access object interface for Route entity
 */
public interface RouteDao {

    void create(Route route);

    Route findById(Long id);

    List<Route> findAll();

    boolean isOrdered(Route route);

    Long getStaringPointId(Route route);

    void update(Route route);

    void remove(Route route);
}
