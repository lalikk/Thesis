package cz.muni.fi.thesis.lalikova.service.facade;

import cz.muni.fi.thesis.lalikova.ServiceConfiguration;
import cz.muni.fi.thesis.lalikova.dto.PhotoCreateDto;
import cz.muni.fi.thesis.lalikova.dto.PhotoDto;
import cz.muni.fi.thesis.lalikova.entity.Photo;
import cz.muni.fi.thesis.lalikova.facade.PhotoFacade;
import cz.muni.fi.thesis.lalikova.service.BeanMappingService;
import cz.muni.fi.thesis.lalikova.service.PhotoService;
import org.hibernate.service.spi.ServiceException;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.Spy;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.testng.AbstractTestNGSpringContextTests;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ContextConfiguration(classes = ServiceConfiguration.class)
public class PhotoFacadeImplTest extends AbstractTestNGSpringContextTests {

    @Mock
    private PhotoService photoService;

    @Spy
    @Autowired
    private BeanMappingService beanMappingService;

    @InjectMocks
    private final PhotoFacade photoFacade = new PhotoFacadeImpl();

    private Photo photo1;
    private Photo photo2;

    @BeforeMethod
    public void init() throws ServiceException {
        MockitoAnnotations.initMocks(this);
        initPhoto();
    }

    @Test
    public void create() {
        PhotoCreateDto photoCreateDto = beanMappingService.mapTo(photo1, PhotoCreateDto.class);
        when(beanMappingService.mapTo(photoCreateDto, Photo.class)).thenReturn(photo1);
        photoFacade.create(photoCreateDto);

        verify(photoService).create(photo1);
    }

    @Test
    public void findById() {
        PhotoDto photoDtoMapped = beanMappingService.mapTo(photo1, PhotoDto.class);
        when(photoService.findById(photo1.getId())).thenReturn(photo1);
        when(beanMappingService.mapTo(photo1, PhotoDto.class)).thenReturn(photoDtoMapped);
        PhotoDto photoDtoFacadeReturns = photoFacade.findById(photo1.getId());

        verify(photoService).findById(photo1.getId());
        assertThat(photoDtoMapped).isEqualTo(photoDtoFacadeReturns);
    }

    @Test
    public void findAll() {
        List<Photo> photos = List.of(photo1, photo2);
        List<PhotoDto> photosDtoMapped = beanMappingService.mapTo(photos, PhotoDto.class);
        when(photoService.findAll()).thenReturn(photos);
        when(beanMappingService.mapTo(photos, PhotoDto.class)).thenReturn(photosDtoMapped);
        List<PhotoDto> photosReturnedByFacade = photoFacade.findAll();

        assertThat(photosReturnedByFacade).isEqualTo(photosDtoMapped);
    }

    @Test
    public void update() {
        PhotoDto photoDto = beanMappingService.mapTo(photo1, PhotoDto.class);
        when(beanMappingService.mapTo(photoDto, Photo.class)).thenReturn(photo1);
        photoDto.setDescription("New title");
        photoFacade.update(photoDto);

        verify(photoService).update(photo1);
    }

    @Test
    public void removeById() {
        doNothing().when(photoService).removeById(photo1.getId());
        photoFacade.removeById(photo1.getId());

        verify(photoService).removeById(photo1.getId());
    }

    private void initPhoto() {
        photo1 = new Photo();
        photo1.setId(1L);
        photo1.setDescription("Photo 1");
        photo1.setImage("Image mock url");

        photo2 = new Photo();
        photo2.setId(2L);
        photo2.setDescription("Photo 2");
        photo2.setImage("Image mock url");
    }
}
