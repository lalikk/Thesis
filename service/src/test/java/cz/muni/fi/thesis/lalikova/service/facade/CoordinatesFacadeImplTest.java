package cz.muni.fi.thesis.lalikova.service.facade;

import cz.muni.fi.thesis.lalikova.ServiceConfiguration;
import cz.muni.fi.thesis.lalikova.dto.CoordinatesCreateDto;
import cz.muni.fi.thesis.lalikova.dto.CoordinatesDto;
import cz.muni.fi.thesis.lalikova.entity.Coordinates;
import cz.muni.fi.thesis.lalikova.facade.CoordinatesFacade;
import cz.muni.fi.thesis.lalikova.service.BeanMappingService;
import cz.muni.fi.thesis.lalikova.service.CoordinatesService;
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
public class CoordinatesFacadeImplTest extends AbstractTestNGSpringContextTests {

    @Mock
    private CoordinatesService coordinatesService;

    @Spy
    @Autowired
    private BeanMappingService beanMappingService;

    @InjectMocks
    private final CoordinatesFacade coordinatesFacade = new CoordinatesFacadeImpl();

    private Coordinates coordinates1;
    private Coordinates coordinates2;

    @BeforeMethod
    public void init() throws ServiceException {
        MockitoAnnotations.initMocks(this);
        initCoordinates();
    }

    @Test
    public void create() {
        CoordinatesCreateDto coordinatesCreateDto = beanMappingService.mapTo(coordinates1, CoordinatesCreateDto.class);
        when(beanMappingService.mapTo(coordinatesCreateDto, Coordinates.class)).thenReturn(coordinates1);
        coordinatesFacade.create(coordinatesCreateDto);

        verify(coordinatesService).create(coordinates1);
    }

    @Test
    public void findById() {
        CoordinatesDto coordinatesDtoMapped = beanMappingService.mapTo(coordinates1, CoordinatesDto.class);
        when(coordinatesService.findById(coordinates1.getId())).thenReturn(coordinates1);
        when(beanMappingService.mapTo(coordinates1, CoordinatesDto.class)).thenReturn(coordinatesDtoMapped);
        CoordinatesDto coordinatesDtoFacadeReturns = coordinatesFacade.findById(coordinates1.getId());

        verify(coordinatesService).findById(coordinates1.getId());
        assertThat(coordinatesDtoMapped).isEqualTo(coordinatesDtoFacadeReturns);
    }

    @Test
    public void findAll() {
        List<Coordinates> coordinatess = List.of(coordinates1, coordinates2);
        List<CoordinatesDto> coordinatessDtoMapped = beanMappingService.mapTo(coordinatess, CoordinatesDto.class);
        when(coordinatesService.findAll()).thenReturn(coordinatess);
        when(beanMappingService.mapTo(coordinatess, CoordinatesDto.class)).thenReturn(coordinatessDtoMapped);
        List<CoordinatesDto> coordinatessReturnedByFacade = coordinatesFacade.findAll();

        assertThat(coordinatessReturnedByFacade).isEqualTo(coordinatessDtoMapped);
    }

    @Test
    public void removeById() {
        doNothing().when(coordinatesService).removeById(coordinates1.getId());
        coordinatesFacade.removeById(coordinates1.getId());

        verify(coordinatesService).removeById(coordinates1.getId());
    }

    private void initCoordinates() {
        coordinates1 = new Coordinates();
        coordinates1.setId(1L);
        coordinates1.setLatitude(0D);
        coordinates1.setLongitude(0D);

        coordinates2 = new Coordinates();
        coordinates2.setId(2L);
        coordinates2.setLatitude(49.195278);
        coordinates2.setLongitude(16.608333);
    }
}
