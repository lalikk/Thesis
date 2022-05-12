package cz.muni.fi.thesis.lalikova.service.facade;

import cz.muni.fi.thesis.lalikova.dto.RouteCreateDto;
import cz.muni.fi.thesis.lalikova.dto.RouteDto;
import cz.muni.fi.thesis.lalikova.entity.Point;
import cz.muni.fi.thesis.lalikova.entity.Route;
import cz.muni.fi.thesis.lalikova.exceptions.ServiceCallException;
import cz.muni.fi.thesis.lalikova.facade.RouteFacade;
import cz.muni.fi.thesis.lalikova.service.BeanMappingService;
import cz.muni.fi.thesis.lalikova.service.RouteService;
import lombok.NonNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;

/**
 * Implementation of the interface for the facade for Route entity
 */
@Service
@Transactional
public class RouteFacadeImpl implements RouteFacade {

    @Autowired
    private RouteService routeService;

    @Autowired
    private BeanMappingService beanMappingService;

    @Override
    public RouteDto create(@NonNull RouteCreateDto route) {
        Route routeEntity;
        try {
            routeEntity = beanMappingService.mapTo(route, Route.class);
        } catch (Exception e) {
            throw new ServiceCallException("BeanMappingService Map To Exception with route: " + route, e);
        }
        routeEntity = routeService.create(routeEntity);
        return beanMappingService.mapTo(routeEntity, RouteDto.class);
    }

    @Override
    public RouteDto findById(@NonNull Long id) {
        Route routeEntity = routeService.findById(id);
        try {
            return beanMappingService.mapTo(routeEntity, RouteDto.class);
        } catch (Exception e) {
            throw new ServiceCallException("BeanMappingService Map To Exception with route: " + routeEntity, e);
        }
    }

    @Override
    public List<RouteDto> findAll() {
        List<Route> route = routeService.findAll();
        try {
            return beanMappingService.mapTo(route, RouteDto.class);
        } catch (Exception e) {
            throw new ServiceCallException("BeanMappingService Map To Exception with list of route: " + route, e);
        }
    }

    @Override
    public boolean isOrdered(@NonNull RouteDto route) {
        Route routeEntity;
        try {
            routeEntity = beanMappingService.mapTo(route, Route.class);
        } catch (Exception e) {
            throw new ServiceCallException("BeanMappingService Map To Exception with route: " + route, e);
        }
        return routeService.isOrdered(routeEntity);
    }

    @Override
    public Long getStaringPointId(@NonNull RouteDto route) {
        Route routeEntity;
        try {
            routeEntity = beanMappingService.mapTo(route, Route.class);
        } catch (Exception e) {
            throw new ServiceCallException("BeanMappingService Map To Exception with route: " + route, e);
        }
        return routeService.getStaringPointId(routeEntity);
    }

    @Override
    public void update(@NonNull RouteDto route) {
        Route existing;
        try {
            existing = routeService.findById(route.getId());
            existing.setDescription(route.getDescription());
            existing.setDifficult(route.getDifficult());
            existing.setPoints(new HashSet<>(beanMappingService.mapTo(route.getPoints(), Point.class)));
        } catch (Exception e) {
            throw new ServiceCallException("BeanMappingService Map To Exception with route: " + route, e);
        }
        routeService.update(existing);
    }

    @Override
    public void removeById(@NonNull Long id) {
        routeService.removeById(id);
    }
}
