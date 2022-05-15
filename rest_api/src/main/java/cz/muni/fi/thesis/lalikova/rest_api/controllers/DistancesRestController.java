package cz.muni.fi.thesis.lalikova.rest_api.controllers;

import cz.muni.fi.thesis.lalikova.dto.DistancesCreateDto;
import cz.muni.fi.thesis.lalikova.dto.DistancesDto;
import cz.muni.fi.thesis.lalikova.facade.DistancesFacade;
import cz.muni.fi.thesis.lalikova.rest_api.ApiUri;
import cz.muni.fi.thesis.lalikova.rest_api.security.Role;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.annotation.security.RolesAllowed;
import java.util.Collection;

@RequestMapping(ApiUri.ROOT_URI)
@RestController
@CrossOrigin
public class DistancesRestController {

    private final Logger log = LoggerFactory.getLogger(CoordinatesRestController.class);

    @Autowired
    DistancesFacade distancesFacade;

    @GetMapping(value = ApiUri.ROOT_URI_DISTANCES, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Collection<DistancesDto>> findAll() {
        log.info("findAll()");
        try {
            return ResponseEntity.ok(distancesFacade.findAll());
        } catch (Exception ex) {
            log.error("Exception={}", ex.getCause(), ex);
            return ResponseEntity.notFound().header("message", ex.getLocalizedMessage()).build();
        }
    }

    @GetMapping(value = ApiUri.ROOT_URI_DISTANCE, produces = MediaType.APPLICATION_JSON_VALUE)
    @RolesAllowed({Role.FULL, Role.LIMITED})
    public ResponseEntity<DistancesDto> findById(@PathVariable("id") Long id) {
        log.info("findById({})", id);
        try {
            return ResponseEntity.ok(distancesFacade.findById(id));
        } catch (Exception ex) {
            log.error("Exception={}", ex.getCause(), ex);
            return ResponseEntity.notFound().header("message", "Id not found.\nCause:" + ex.getLocalizedMessage()).build();
        }
    }

    @PostMapping(value = ApiUri.ROOT_URI_DISTANCES_AUTH, produces = MediaType.APPLICATION_JSON_VALUE)
    //@RolesAllowed({Role.FULL, Role.LIMITED})
    public ResponseEntity<DistancesDto> create(@RequestBody DistancesCreateDto distancesCreateDto) {
        log.info("create({})", distancesCreateDto);
        try {
            distancesFacade.create(distancesCreateDto);
            return ResponseEntity.ok(distancesFacade.findById((long) distancesFacade.findAll().size()));
        } catch (Exception ex) {
            log.error("Exception={}", ex.getCause(), ex);
            return ResponseEntity.notFound().header("message", "Create with passed body failed.\nCause:" + ex.getLocalizedMessage()).build();
        }
    }

    @PutMapping(value = ApiUri.ROOT_URI_DISTANCES_AUTH, produces = MediaType.APPLICATION_JSON_VALUE)
    //@RolesAllowed({Role.FULL, Role.LIMITED})
    public ResponseEntity<DistancesDto> update(@RequestBody DistancesDto distancesDto) {
        log.info("update({})", distancesDto);
        try {
            distancesFacade.update(distancesDto);
            Long id = distancesDto.getId() != null ? distancesDto.getId() : distancesFacade.findAll().size();
            return ResponseEntity.ok(distancesFacade.findById(id));
        } catch (Exception ex) {
            log.error("Exception={}", ex.getCause(), ex);
            return ResponseEntity.notFound().header("message", "Update with passed body failed.\nCause:" + ex.getLocalizedMessage()).build();
        }
    }

    @DeleteMapping(value = ApiUri.ROOT_URI_DISTANCE_AUTH, produces = MediaType.APPLICATION_JSON_VALUE)
    @RolesAllowed({Role.FULL, Role.LIMITED})
    public ResponseEntity<Void> removeById(@PathVariable("id") Long id) {
        log.info("removeById({})", id);
        try {
            distancesFacade.removeById(id);
            return ResponseEntity.ok().build();
        } catch (Exception ex) {
            log.error("Exception={}", ex.getCause(), ex);
            return ResponseEntity.notFound().header("message", "Id not found.\nCause:" + ex.getLocalizedMessage()).build();
        }
    }
}
