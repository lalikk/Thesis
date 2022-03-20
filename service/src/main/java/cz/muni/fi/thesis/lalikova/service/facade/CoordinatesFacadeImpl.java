package cz.muni.fi.thesis.lalikova.service.facade;

import cz.muni.fi.thesis.lalikova.dto.CoordinatesCreateDto;
import cz.muni.fi.thesis.lalikova.dto.CoordinatesDto;
import cz.muni.fi.thesis.lalikova.entity.Coordinates;
import cz.muni.fi.thesis.lalikova.exceptions.ServiceCallException;
import cz.muni.fi.thesis.lalikova.facade.CoordinatesFacade;
import cz.muni.fi.thesis.lalikova.service.BeanMappingService;
import cz.muni.fi.thesis.lalikova.service.CoordinatesService;
import lombok.NonNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Implementation of the interface for the facade for Coordinates entity
 */
@Service
@Transactional
public class CoordinatesFacadeImpl implements CoordinatesFacade {

    @Autowired
    private CoordinatesService coordinatesService;

    @Autowired
    private BeanMappingService beanMappingService;

    @Override
    public void create(@NonNull CoordinatesCreateDto coordinates) {
        Coordinates coordinatesEntity;
        try {
            coordinatesEntity = beanMappingService.mapTo(coordinates, Coordinates.class);
        } catch (Exception e) {
            throw new ServiceCallException("BeanMappingService Map To Exception with coordinates: " + coordinates, e);
        }
        coordinatesService.create(coordinatesEntity);
    }

    @Override
    public CoordinatesDto findById(@NonNull Long id) {
        Coordinates coordinatesEntity = coordinatesService.findById(id);
        try {
            return beanMappingService.mapTo(coordinatesEntity, CoordinatesDto.class);
        } catch (Exception e) {
            throw new ServiceCallException("BeanMappingService Map To Exception with coordinates: " + coordinatesEntity, e);
        }
    }

    @Override
    public List<CoordinatesDto> findAll() {
        List<Coordinates> coordinates = coordinatesService.findAll();
        try {
            return beanMappingService.mapTo(coordinates, CoordinatesDto.class);
        } catch (Exception e) {
            throw new ServiceCallException("BeanMappingService Map To Exception with list of coordinates: " + coordinates, e);
        }
    }

    @Override
    public void update(CoordinatesDto coordinates) {
        Coordinates coordinatesEntity;
        try {
            coordinatesEntity = beanMappingService.mapTo(coordinates, Coordinates.class);
        } catch (Exception e) {
            throw new ServiceCallException("BeanMappingService Map To Exception with coordinates: " + coordinates, e);
        }
        coordinatesService.update(coordinatesEntity);
    }

    @Override
    public void removeById(Long id) {
        coordinatesService.removeById(id);
    }
}
