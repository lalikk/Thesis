package cz.muni.fi.thesis.lalikova.service.facade;

import cz.muni.fi.thesis.lalikova.ServiceConfiguration;
import cz.muni.fi.thesis.lalikova.dto.PointCreateDto;
import cz.muni.fi.thesis.lalikova.dto.PointDto;
import cz.muni.fi.thesis.lalikova.dto.PointUpdateDto;
import cz.muni.fi.thesis.lalikova.entity.Point;
import cz.muni.fi.thesis.lalikova.facade.PointFacade;
import cz.muni.fi.thesis.lalikova.service.BeanMappingService;
import cz.muni.fi.thesis.lalikova.service.PointService;
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
public class PointFacadeImplTest extends AbstractTestNGSpringContextTests {

    @Mock
    private PointService pointService;

    @Spy
    @Autowired
    private BeanMappingService beanMappingService;

    @InjectMocks
    private final PointFacade pointFacade = new PointFacadeImpl();

    private Point point1;
    private Point point2;

    @BeforeMethod
    public void init() throws ServiceException {
        MockitoAnnotations.initMocks(this);
        initPoint();
    }

    @Test
    public void create() {
        PointCreateDto pointCreateDto = beanMappingService.mapTo(point1, PointCreateDto.class);
        when(beanMappingService.mapTo(pointCreateDto, Point.class)).thenReturn(point1);
        pointFacade.create(pointCreateDto);

        verify(pointService).create(point1);
    }

    @Test
    public void findById() {
        PointDto pointDtoMapped = beanMappingService.mapTo(point1, PointDto.class);
        when(pointService.findById(point1.getId())).thenReturn(point1);
        when(beanMappingService.mapTo(point1, PointDto.class)).thenReturn(pointDtoMapped);
        PointDto pointDtoFacadeReturns = pointFacade.findById(point1.getId());

        verify(pointService).findById(point1.getId());
        assertThat(pointDtoMapped).isEqualTo(pointDtoFacadeReturns);
    }

    @Test
    public void findAll() {
        List<Point> points = List.of(point1, point2);
        List<PointDto> pointsDtoMapped = beanMappingService.mapTo(points, PointDto.class);
        when(pointService.findAll()).thenReturn(points);
        when(beanMappingService.mapTo(points, PointDto.class)).thenReturn(pointsDtoMapped);
        List<PointDto> pointsReturnedByFacade = pointFacade.findAll();

        assertThat(pointsReturnedByFacade).isEqualTo(pointsDtoMapped);
    }

    @Test
    public void update() {
        PointUpdateDto pointDto = beanMappingService.mapTo(point1, PointUpdateDto.class);
        when(beanMappingService.mapTo(pointDto, Point.class)).thenReturn(point1);
        pointDto.setDescription("New title");
        pointFacade.update(pointDto);

        verify(pointService).update(point1);
    }

    @Test
    public void removeById() {
        doNothing().when(pointService).removeById(point1.getId());
        pointFacade.removeById(point1.getId());

        verify(pointService).removeById(point1.getId());
    }

    private void initPoint() {
        point1 = new Point();
        point1.setId(1L);
        point1.setTitle("Test create point 1");
        point1.setDescription("Test point");

        point2 = new Point();
        point2.setId(2L);
        point2.setTitle("Test create point 2");
        point2.setDescription("Test point");
    }
}
