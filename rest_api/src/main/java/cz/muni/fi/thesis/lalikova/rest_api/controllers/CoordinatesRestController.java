package cz.muni.fi.thesis.lalikova.rest_api.controllers;

import cz.muni.fi.thesis.lalikova.dto.CoordinatesCreateDto;
import cz.muni.fi.thesis.lalikova.dto.CoordinatesDto;
import cz.muni.fi.thesis.lalikova.facade.CoordinatesFacade;
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
public class CoordinatesRestController {

    private final Logger log = LoggerFactory.getLogger(CoordinatesRestController.class);

    @Autowired
    CoordinatesFacade coordinatesFacade;

    @GetMapping(value = ApiUri.ROOT_URI_COORDINATES, produces = MediaType.APPLICATION_JSON_VALUE)
    //@RolesAllowed({Role.FULL, Role.LIMITED})
    public ResponseEntity<Collection<CoordinatesDto>> findAll() {
        log.info("findAll()");
        try {
            return ResponseEntity.ok(coordinatesFacade.findAll());
        } catch (Exception ex) {
            log.error("Exception={}", ex.getCause(), ex);
            return ResponseEntity.notFound().header("message", ex.getLocalizedMessage()).build();
        }
    }

    @GetMapping(value = ApiUri.ROOT_URI_COORDINATE, produces = MediaType.APPLICATION_JSON_VALUE)
    @RolesAllowed({Role.FULL, Role.LIMITED})
    public ResponseEntity<CoordinatesDto> findById(@PathVariable("id") Long id) {
        log.info("findById({})", id);
        try {
            return ResponseEntity.ok(coordinatesFacade.findById(id));
        } catch (Exception ex) {
            log.error("Exception={}", ex.getCause(), ex);
            return ResponseEntity.notFound().header("message", "Id not found.\nCause:" + ex.getLocalizedMessage()).build();
        }
    }

    @PostMapping(value = ApiUri.ROOT_URI_COORDINATES, produces = MediaType.APPLICATION_JSON_VALUE)
    //@RolesAllowed({Role.FULL, Role.LIMITED})
    public ResponseEntity<CoordinatesDto> create(@RequestBody CoordinatesCreateDto coordinatesCreateDto) {
        log.info("create({})", coordinatesCreateDto);
        try {
            coordinatesFacade.create(coordinatesCreateDto);
            return ResponseEntity.ok(coordinatesFacade.findById((long) coordinatesFacade.findAll().size()));
        } catch (Exception ex) {
            log.error("Exception={}", ex.getCause(), ex);
            return ResponseEntity.notFound().header("message", "Create with passed body failed.\nCause:" + ex.getLocalizedMessage()).build();
        }
    }

    @PutMapping(value = ApiUri.ROOT_URI_COORDINATES, produces = MediaType.APPLICATION_JSON_VALUE)
    //@RolesAllowed({Role.FULL, Role.LIMITED})
    public ResponseEntity<CoordinatesDto> update(@RequestBody CoordinatesDto coordinatesDto) {
        log.info("update({})", coordinatesDto);
        try {
            coordinatesFacade.update(coordinatesDto);
            Long id = coordinatesDto.getId() != null ? coordinatesDto.getId() : coordinatesFacade.findAll().size();
            return ResponseEntity.ok(coordinatesFacade.findById(id));
        } catch (Exception ex) {
            log.error("Exception={}", ex.getCause(), ex);
            return ResponseEntity.notFound().header("message", "Update with passed body failed.\nCause:" + ex.getLocalizedMessage()).build();
        }
    }

    @DeleteMapping(value = ApiUri.ROOT_URI_COORDINATE, produces = MediaType.APPLICATION_JSON_VALUE)
    @RolesAllowed({Role.FULL, Role.LIMITED})
    public ResponseEntity<Void> removeById(@PathVariable("id") Long id) {
        log.info("removeById({})", id);
        try {
            coordinatesFacade.removeById(id);
            return ResponseEntity.ok().build();
        } catch (Exception ex) {
            log.error("Exception={}", ex.getCause(), ex);
            return ResponseEntity.notFound().header("message", "Id not found.\nCause:" + ex.getLocalizedMessage()).build();
        }
    }
}
