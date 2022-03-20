package cz.muni.fi.thesis.lalikova.facade;

import cz.muni.fi.thesis.lalikova.dto.RouteCreateDto;
import cz.muni.fi.thesis.lalikova.dto.RouteDto;

import java.util.List;

/**
 * Facade interface for the routes
 */
public interface RouteFacade {
    void create(RouteCreateDto route);

    RouteDto findById(Long id);

    List<RouteDto> findAll();

    boolean isOrdered(RouteDto route);

    Long getStaringPointId(RouteDto route);

    void update(RouteDto route);

    void removeById(Long id);
}
