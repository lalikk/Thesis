package cz.muni.fi.thesis.lalikova.service.facade;

import cz.muni.fi.thesis.lalikova.ServiceConfiguration;
import cz.muni.fi.thesis.lalikova.dto.PointTagCreateDto;
import cz.muni.fi.thesis.lalikova.dto.PointTagDto;
import cz.muni.fi.thesis.lalikova.entity.PointTag;
import cz.muni.fi.thesis.lalikova.facade.PointTagFacade;
import cz.muni.fi.thesis.lalikova.service.BeanMappingService;
import cz.muni.fi.thesis.lalikova.service.PointTagService;
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
public class PointTagFacadeImplTest extends AbstractTestNGSpringContextTests {

    @Mock
    private PointTagService pointTagService;

    @Spy
    @Autowired
    private BeanMappingService beanMappingService;

    @InjectMocks
    private final PointTagFacade pointTagFacade = new PointTagFacadeImpl();

    private PointTag pointTag1;
    private PointTag pointTag2;

    @BeforeMethod
    public void init() throws ServiceException {
        MockitoAnnotations.initMocks(this);
        initPointTag();
    }

    @Test
    public void create() {
        PointTagCreateDto pointTagCreateDto = beanMappingService.mapTo(pointTag1, PointTagCreateDto.class);
        when(beanMappingService.mapTo(pointTagCreateDto, PointTag.class)).thenReturn(pointTag1);
        pointTagFacade.create(pointTagCreateDto);

        verify(pointTagService).create(pointTag1);
    }

    @Test
    public void findById() {
        PointTagDto pointTagDtoMapped = beanMappingService.mapTo(pointTag1, PointTagDto.class);
        when(pointTagService.findById(pointTag1.getId())).thenReturn(pointTag1);
        when(beanMappingService.mapTo(pointTag1, PointTagDto.class)).thenReturn(pointTagDtoMapped);
        PointTagDto pointTagDtoFacadeReturns = pointTagFacade.findById(pointTag1.getId());

        verify(pointTagService).findById(pointTag1.getId());
        assertThat(pointTagDtoMapped).isEqualTo(pointTagDtoFacadeReturns);
    }

    @Test
    public void findAll() {
        List<PointTag> pointTags = List.of(pointTag1, pointTag2);
        List<PointTagDto> pointTagsDtoMapped = beanMappingService.mapTo(pointTags, PointTagDto.class);
        when(pointTagService.findAll()).thenReturn(pointTags);
        when(beanMappingService.mapTo(pointTags, PointTagDto.class)).thenReturn(pointTagsDtoMapped);
        List<PointTagDto> pointTagsReturnedByFacade = pointTagFacade.findAll();

        assertThat(pointTagsReturnedByFacade).isEqualTo(pointTagsDtoMapped);
    }

    @Test
    public void update() {
        PointTagDto pointTagDto = beanMappingService.mapTo(pointTag1, PointTagDto.class);
        when(beanMappingService.mapTo(pointTagDto, PointTag.class)).thenReturn(pointTag1);
        pointTagDto.setDescription("New title");
        pointTagFacade.update(pointTagDto);

        verify(pointTagService).update(pointTag1);
    }

    @Test
    public void removeById() {
        doNothing().when(pointTagService).removeById(pointTag1.getId());
        pointTagFacade.removeById(pointTag1.getId());

        verify(pointTagService).removeById(pointTag1.getId());
    }

    private void initPointTag() {
        pointTag1 = new PointTag();
        pointTag1.setId(1L);
        pointTag1.setName("Test create pointTag 1");
        pointTag1.setDescription("PointTag 1 Description");

        pointTag2 = new PointTag();
        pointTag2.setId(2L);
        pointTag2.setName("Test create pointTag 2");
        pointTag2.setDescription("PointTag 2 Description");
    }
}
