package cz.muni.fi.thesis.lalikova.service.facade;

import cz.muni.fi.thesis.lalikova.dto.PhotoCreateDto;
import cz.muni.fi.thesis.lalikova.dto.PhotoDto;
import cz.muni.fi.thesis.lalikova.entity.Photo;
import cz.muni.fi.thesis.lalikova.exceptions.ServiceCallException;
import cz.muni.fi.thesis.lalikova.facade.PhotoFacade;
import cz.muni.fi.thesis.lalikova.service.BeanMappingService;
import cz.muni.fi.thesis.lalikova.service.PhotoService;
import lombok.NonNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class PhotoFacadeImpl implements PhotoFacade {

    @Autowired
    private PhotoService photoService;

    @Autowired
    private BeanMappingService beanMappingService;

    @Override
    public void create(@NonNull PhotoCreateDto photo) {
        Photo photoEntity;
        try {
            photoEntity = beanMappingService.mapTo(photo, Photo.class);
        } catch (Exception e) {
            throw new ServiceCallException("BeanMappingService Map To Exception with photo: " + photo, e);
        }
        photoService.create(photoEntity);
    }

    @Override
    public PhotoDto findById(@NonNull Long id) {
        Photo photoEntity = photoService.findById(id);
        try {
            return beanMappingService.mapTo(photoEntity, PhotoDto.class);
        } catch (Exception e) {
            throw new ServiceCallException("BeanMappingService Map To Exception with photo: " + photoEntity, e);
        }
    }

    @Override
    public List<PhotoDto> findAll() {
        List<Photo> photo = photoService.findAll();
        try {
            return beanMappingService.mapTo(photo, PhotoDto.class);
        } catch (Exception e) {
            throw new ServiceCallException("BeanMappingService Map To Exception with list of photo: " + photo, e);
        }
    }

    @Override
    public void update(PhotoDto photo) {
        Photo photoEntity;
        try {
            photoEntity = beanMappingService.mapTo(photo, Photo.class);
        } catch (Exception e) {
            throw new ServiceCallException("BeanMappingService Map To Exception with photo: " + photo, e);
        }
        photoService.update(photoEntity);
    }

    @Override
    public void removeById(Long id) {
        photoService.removeById(id);
    }
}
