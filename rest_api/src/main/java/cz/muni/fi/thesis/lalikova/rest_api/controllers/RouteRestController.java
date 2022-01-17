package cz.muni.fi.thesis.lalikova.rest_api.controllers;

import cz.muni.fi.thesis.lalikova.dto.RouteCreateDto;
import cz.muni.fi.thesis.lalikova.dto.RouteDto;
import cz.muni.fi.thesis.lalikova.facade.RouteFacade;
import cz.muni.fi.thesis.lalikova.rest_api.ApiUri;
import cz.muni.fi.thesis.lalikova.rest_api.security.Role;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.security.RolesAllowed;
import java.util.Collection;

@RequestMapping(ApiUri.ROOT_URI)
@RestController
public class RouteRestController {

    private final Logger log = LoggerFactory.getLogger(PhotoRestController.class);

    @Autowired
    RouteFacade routeFacade;

    @GetMapping(value = ApiUri.ROOT_URI_ROUTES, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Collection<RouteDto>> findAll() {
        log.info("findAll()");
        try {
            return ResponseEntity.ok(routeFacade.findAll());
        } catch (Exception ex) {
            log.error("Exception={}", ex.getCause(), ex);
            return ResponseEntity.notFound().header("message", ex.getLocalizedMessage()).build();
        }
    }

    @GetMapping(value = ApiUri.ROOT_URI_ROUTE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<RouteDto> findById(@PathVariable("id") Long id) {
        log.info("findById({})", id);
        try {
            return ResponseEntity.ok(routeFacade.findById(id));
        } catch (Exception ex) {
            log.error("Exception={}", ex.getCause(), ex);
            return ResponseEntity.notFound().header("message", "Id not found.\nCause:" + ex.getLocalizedMessage()).build();
        }
    }

    @PostMapping(value = ApiUri.ROOT_URI_ROUTES, produces = MediaType.APPLICATION_JSON_VALUE)
    @RolesAllowed({Role.FULL})
    public ResponseEntity<RouteDto> create(@RequestBody RouteCreateDto routeCreateDto) {
        log.info("create({})", routeCreateDto);
        try {
            routeFacade.create(routeCreateDto);
            return ResponseEntity.ok(routeFacade.findById((long) routeFacade.findAll().size()));
        } catch (Exception ex) {
            log.error("Exception={}", ex.getCause(), ex);
            return ResponseEntity.notFound().header("message", "Create with passed body failed.\nCause:" + ex.getLocalizedMessage()).build();
        }
    }

    @PutMapping(value = ApiUri.ROOT_URI_ROUTES, produces = MediaType.APPLICATION_JSON_VALUE)
    @RolesAllowed({Role.FULL})
    public ResponseEntity<RouteDto> update(@RequestBody RouteDto routeDto) {
        log.info("update({})", routeDto);
        try {
            routeFacade.update(routeDto);
            Long id = routeDto.getId() != null ? routeDto.getId() : routeFacade.findAll().size();
            return ResponseEntity.ok(routeFacade.findById(id));
        } catch (Exception ex) {
            log.error("Exception={}", ex.getCause(), ex);
            return ResponseEntity.notFound().header("message", "Update with passed body failed.\nCause:" + ex.getLocalizedMessage()).build();
        }
    }

    @DeleteMapping(value = ApiUri.ROOT_URI_ROUTE, produces = MediaType.APPLICATION_JSON_VALUE)
    @RolesAllowed({Role.FULL})
    public ResponseEntity<Void> removeById(@PathVariable("id") Long id) {
        log.info("removeById({})", id);
        try {
            routeFacade.removeById(id);
            return ResponseEntity.ok().build();
        } catch (Exception ex) {
            log.error("Exception={}", ex.getCause(), ex);
            return ResponseEntity.notFound().header("message", "Id not found.\nCause:" + ex.getLocalizedMessage()).build();
        }
    }

    /*@GetMapping(value = ApiUri.ROOT_URI_ROUTES, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Boolean> isOrdered(RouteDto routeDto) {
        log.info("isOrdered({})", routeDto);
        try {
            return ResponseEntity.ok(routeFacade.isOrdered(routeDto));
        } catch (Exception ex) {
            log.error("Exception={}", ex.getCause(), ex);
            return ResponseEntity.notFound().header("message", "Is ordered query failed.\nCause:" + ex.getLocalizedMessage()).build();
        }
    }*/

    /*@GetMapping(value = ApiUri.ROOT_URI_ROUTES, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Long> getStaringPointId(RouteDto routeDto) {
        log.info("getStartingPointId({})", routeDto);
        try {
            return ResponseEntity.ok(routeFacade.getStaringPointId(routeDto));
        } catch (Exception ex) {
            log.error("Exception={}", ex.getCause(), ex);
            return ResponseEntity.notFound().header("message", "Starting point Id not found.\nCause:" + ex.getLocalizedMessage()).build();
        }
    }*/
}
