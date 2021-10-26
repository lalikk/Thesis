package cz.muni.fi.thesis.lalikova.service.service.facade;

import cz.muni.fi.thesis.lalikova.dto.PointCreateDto;
import cz.muni.fi.thesis.lalikova.dto.PointDto;
import cz.muni.fi.thesis.lalikova.entity.Point;
import cz.muni.fi.thesis.lalikova.exceptions.ServiceCallException;
import cz.muni.fi.thesis.lalikova.facade.PointFacade;
import cz.muni.fi.thesis.lalikova.service.service.BeanMappingService;
import cz.muni.fi.thesis.lalikova.service.service.PointService;
import lombok.NonNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class PointFacadeImpl implements PointFacade {

    @Autowired
    private PointService pointService;

    @Autowired
    private BeanMappingService beanMappingService;

    @Override
    public void create(@NonNull PointCreateDto point) {
        Point pointEntity;
        try {
            pointEntity = beanMappingService.mapTo(point, Point.class);
        } catch (Exception e) {
            throw new ServiceCallException("BeanMappingService Map To Exception with point: " + point, e);
        }
        pointService.create(pointEntity);
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
    public List<PointDto> findAll() {
        List<Point> point = pointService.findAll();
        try {
            return beanMappingService.mapTo(point, PointDto.class);
        } catch (Exception e) {
            throw new ServiceCallException("BeanMappingService Map To Exception with list of point: " + point, e);
        }
    }

    @Override
    public void update(PointDto point) {
        Point pointEntity;
        try {
            pointEntity = beanMappingService.mapTo(point, Point.class);
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
