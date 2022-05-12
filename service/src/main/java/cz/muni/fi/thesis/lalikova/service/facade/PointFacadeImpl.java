package cz.muni.fi.thesis.lalikova.service.facade;

import cz.muni.fi.thesis.lalikova.dto.PointCreateDto;
import cz.muni.fi.thesis.lalikova.dto.PointDto;
import cz.muni.fi.thesis.lalikova.dto.PointUpdateDto;
import cz.muni.fi.thesis.lalikova.entity.Point;
import cz.muni.fi.thesis.lalikova.entity.PointTag;
import cz.muni.fi.thesis.lalikova.exceptions.ServiceCallException;
import cz.muni.fi.thesis.lalikova.facade.PointFacade;
import cz.muni.fi.thesis.lalikova.service.BeanMappingService;
import cz.muni.fi.thesis.lalikova.service.PointService;
import lombok.NonNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * Implementation of the interface for the facade for Point entity
 */
@Service
@Transactional
public class PointFacadeImpl implements PointFacade {

    @Autowired
    private PointService pointService;

    @Autowired
    private BeanMappingService beanMappingService;

    @Override
    public PointDto create(@NonNull PointCreateDto point) {
        Point pointEntity;
        try {
            pointEntity = beanMappingService.mapTo(point, Point.class);
        } catch (Exception e) {
            throw new ServiceCallException("BeanMappingService Map To Exception with point: " + point, e);
        }
        pointEntity = pointService.create(pointEntity);
        return beanMappingService.mapTo(pointEntity, PointDto.class);
    }

    @Override
    public PointDto findById(@NonNull Long id) {
        Point pointEntity = pointService.findById(id);
        try {
            return beanMappingService.mapTo(pointEntity, PointDto.class);
        } catch (Exception e) {
            throw new ServiceCallException("BeanMappingService Map To Exception with point: " + pointEntity, e);
        }
    }

    @Override
    public List<PointDto> findByRoute(@NonNull Long id) {
        List<Point> point = pointService.findByRoute(id);
        try {
            return beanMappingService.mapTo(point, PointDto.class);
        } catch (Exception e) {
            throw new ServiceCallException("BeanMappingService Map To Exception with list of point: " + point, e);
        }
    }

    @Override
    public List<PointDto> findAll() {
        List<Point> point = pointService.findAll();
        try {
            return beanMappingService.mapTo(point, PointDto.class);
        } catch (Exception e) {
            throw new ServiceCallException("BeanMappingService Map To Exception with list of point: " + point, e);
        }
    }

    @Override
    public void update(PointUpdateDto point) {
        Point pointEntity;
        try {
            pointEntity = pointService.findById(point.getId());
            pointEntity.setTitle(point.getTitle());
            pointEntity.setDescription(point.getDescription());
            pointEntity.getCoordinates().setLatitude(point.getCoordinates().getLatitude());
            pointEntity.getCoordinates().setLongitude(point.getCoordinates().getLongitude());
            pointEntity.setTags(new HashSet<>(beanMappingService.mapTo(point.getTags(), PointTag.class)));
        } catch (Exception e) {
            throw new ServiceCallException("BeanMappingService Map To Exception with point: " + point, e);
        }
        pointService.update(pointEntity);
    }

    @Override
    public void removeById(Long id) {
        pointService.removeById(id);
    }
}
