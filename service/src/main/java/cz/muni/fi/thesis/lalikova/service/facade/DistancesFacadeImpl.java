package cz.muni.fi.thesis.lalikova.service.facade;

import cz.muni.fi.thesis.lalikova.dto.DistancesCreateDto;
import cz.muni.fi.thesis.lalikova.dto.DistancesDto;
import cz.muni.fi.thesis.lalikova.entity.Distances;
import cz.muni.fi.thesis.lalikova.exceptions.ServiceCallException;
import cz.muni.fi.thesis.lalikova.facade.DistancesFacade;
import cz.muni.fi.thesis.lalikova.service.BeanMappingService;
import cz.muni.fi.thesis.lalikova.service.DistancesService;
import lombok.NonNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Implementation of the interface for the facade for Distances entity
 */
@Service
@Transactional
public class DistancesFacadeImpl implements DistancesFacade {

    @Autowired
    private DistancesService distancesService;

    @Autowired
    private BeanMappingService beanMappingService;

    @Override
    public void create(@NonNull DistancesCreateDto distances) {
        Distances distancesEntity;
        try {
            distancesEntity = beanMappingService.mapTo(distances, Distances.class);
        } catch (Exception e) {
            throw new ServiceCallException("BeanMappingService Map To Exception with distances: " + distances, e);
        }
        distancesService.create(distancesEntity);
    }

    @Override
    public DistancesDto findById(@NonNull Long id) {
        Distances distancesEntity = distancesService.findById(id);
        try {
            return beanMappingService.mapTo(distancesEntity, DistancesDto.class);
        } catch (Exception e) {
            throw new ServiceCallException("BeanMappingService Map To Exception with distances: " + distancesEntity, e);
        }
    }

    @Override
    public List<DistancesDto> findAll() {
        List<Distances> distances = distancesService.findAll();
        try {
            return beanMappingService.mapTo(distances, DistancesDto.class);
        } catch (Exception e) {
            throw new ServiceCallException("BeanMappingService Map To Exception with list of distances: " + distances, e);
        }
    }

    @Override
    public void update(DistancesDto distances) {
        Distances distancesEntity;
        try {
            distancesEntity = beanMappingService.mapTo(distances, Distances.class);
        } catch (Exception e) {
            throw new ServiceCallException("BeanMappingService Map To Exception with distances: " + distances, e);
        }
        distancesService.update(distancesEntity);
    }

    @Override
    public void removeById(Long id) {
        distancesService.removeById(id);
    }
}
