package cz.muni.fi.thesis.lalikova.service.facade;

import cz.muni.fi.thesis.lalikova.dto.PointTagCreateDto;
import cz.muni.fi.thesis.lalikova.dto.PointTagDto;
import cz.muni.fi.thesis.lalikova.entity.PointTag;
import cz.muni.fi.thesis.lalikova.exceptions.ServiceCallException;
import cz.muni.fi.thesis.lalikova.facade.PointTagFacade;
import cz.muni.fi.thesis.lalikova.service.BeanMappingService;
import cz.muni.fi.thesis.lalikova.service.PointTagService;
import lombok.NonNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class PointTagFacadeImpl implements PointTagFacade {

    @Autowired
    private PointTagService pointTagService;

    @Autowired
    private BeanMappingService beanMappingService;

    @Override
    public void create(@NonNull PointTagCreateDto pointTag) {
        PointTag pointTagEntity;
        try {
            pointTagEntity = beanMappingService.mapTo(pointTag, PointTag.class);
        } catch (Exception e) {
            throw new ServiceCallException("BeanMappingService Map To Exception with pointTag: " + pointTag, e);
        }
        pointTagService.create(pointTagEntity);
    }

    @Override
    public PointTagDto findById(@NonNull Long id) {
        PointTag pointTagEntity = pointTagService.findById(id);
        try {
            return beanMappingService.mapTo(pointTagEntity, PointTagDto.class);
        } catch (Exception e) {
            throw new ServiceCallException("BeanMappingService Map To Exception with pointTag: " + pointTagEntity, e);
        }
    }

    @Override
    public List<PointTagDto> findAll() {
        List<PointTag> pointTag = pointTagService.findAll();
        try {
            return beanMappingService.mapTo(pointTag, PointTagDto.class);
        } catch (Exception e) {
            throw new ServiceCallException("BeanMappingService Map To Exception with list of pointTag: " + pointTag, e);
        }
    }

    @Override
    public void update(PointTagDto pointTag) {
        PointTag pointTagEntity;
        try {
            pointTagEntity = beanMappingService.mapTo(pointTag, PointTag.class);
        } catch (Exception e) {
            throw new ServiceCallException("BeanMappingService Map To Exception with pointTag: " + pointTag, e);
        }
        pointTagService.update(pointTagEntity);
    }

    @Override
    public void removeById(Long id) {
        pointTagService.removeById(id);
    }
}
