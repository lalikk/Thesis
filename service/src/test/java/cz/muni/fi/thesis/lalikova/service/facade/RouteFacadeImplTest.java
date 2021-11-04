package cz.muni.fi.thesis.lalikova.service.facade;

import cz.muni.fi.thesis.lalikova.ServiceConfiguration;
import cz.muni.fi.thesis.lalikova.dto.RouteCreateDto;
import cz.muni.fi.thesis.lalikova.dto.RouteDto;
import cz.muni.fi.thesis.lalikova.entity.Route;
import cz.muni.fi.thesis.lalikova.facade.RouteFacade;
import cz.muni.fi.thesis.lalikova.service.BeanMappingService;
import cz.muni.fi.thesis.lalikova.service.RouteService;
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
public class RouteFacadeImplTest extends AbstractTestNGSpringContextTests {

    @Mock
    private RouteService routeService;

    @Spy
    @Autowired
    private BeanMappingService beanMappingService;

    @InjectMocks
    private final RouteFacade routeFacade = new RouteFacadeImpl();

    private Route route1;
    private Route route2;

    @BeforeMethod
    public void init() throws ServiceException {
        MockitoAnnotations.initMocks(this);
        initRoute();
    }

    @Test
    public void create() {
        RouteCreateDto routeCreateDto = beanMappingService.mapTo(route1, RouteCreateDto.class);
        when(beanMappingService.mapTo(routeCreateDto, Route.class)).thenReturn(route1);
        routeFacade.create(routeCreateDto);

        verify(routeService).create(route1);
    }

    @Test
    public void findById() {
        RouteDto routeDtoMapped = beanMappingService.mapTo(route1, RouteDto.class);
        when(routeService.findById(route1.getId())).thenReturn(route1);
        when(beanMappingService.mapTo(route1, RouteDto.class)).thenReturn(routeDtoMapped);
        RouteDto routeDtoFacadeReturns = routeFacade.findById(route1.getId());

        verify(routeService).findById(route1.getId());
        assertThat(routeDtoMapped).isEqualTo(routeDtoFacadeReturns);
    }

    @Test
    public void findAll() {
        List<Route> routes = List.of(route1, route2);
        List<RouteDto> routesDtoMapped = beanMappingService.mapTo(routes, RouteDto.class);
        when(routeService.findAll()).thenReturn(routes);
        when(beanMappingService.mapTo(routes, RouteDto.class)).thenReturn(routesDtoMapped);
        List<RouteDto> routesReturnedByFacade = routeFacade.findAll();

        assertThat(routesReturnedByFacade).isEqualTo(routesDtoMapped);
    }

    @Test
    public void update() {
        RouteDto routeDto = beanMappingService.mapTo(route1, RouteDto.class);
        when(beanMappingService.mapTo(routeDto, Route.class)).thenReturn(route1);
        routeDto.setDescription("New title");
        routeFacade.update(routeDto);

        verify(routeService).update(route1);
    }

    @Test
    public void removeById() {
        doNothing().when(routeService).removeById(route1.getId());
        routeFacade.removeById(route1.getId());

        verify(routeService).removeById(route1.getId());
    }

    private void initRoute() {
        route1 = new Route();
        route1.setId(1L);
        route1.setDescription("Test create route 1");
        route1.setTitle("Route 1");

        route2 = new Route();
        route2.setId(2L);
        route2.setDescription("Test create route 2");
        route2.setTitle("Route 2");
    }
}
