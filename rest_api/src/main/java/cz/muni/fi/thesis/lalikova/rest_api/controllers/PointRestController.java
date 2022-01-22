package cz.muni.fi.thesis.lalikova.rest_api.controllers;

import cz.muni.fi.thesis.lalikova.dto.PointCreateDto;
import cz.muni.fi.thesis.lalikova.dto.PointDto;
import cz.muni.fi.thesis.lalikova.facade.PointFacade;
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
public class PointRestController {

    private final Logger log = LoggerFactory.getLogger(PointRestController.class);

    @Autowired
    PointFacade pointFacade;

    @GetMapping(value = ApiUri.ROOT_URI_POINTS, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Collection<PointDto>> findAll() {
        log.info("findAll()");
        try {
            return ResponseEntity.ok(pointFacade.findAll());
        } catch (Exception ex) {
            log.error("Exception={}", ex.getCause(), ex);
            return ResponseEntity.notFound().header("message", ex.getLocalizedMessage()).build();
        }
    }

    @GetMapping(value = ApiUri.ROOT_URI_POINT, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<PointDto> findById(@PathVariable("id") Long id) {
        log.info("findById({})", id);
        try {
            return ResponseEntity.ok(pointFacade.findById(id));
        } catch (Exception ex) {
            log.error("Exception={}", ex.getCause(), ex);
            return ResponseEntity.notFound().header("message", "Id not found.\nCause:" + ex.getLocalizedMessage()).build();
        }
    }

    @PostMapping(value = ApiUri.ROOT_URI_POINTS, produces = MediaType.APPLICATION_JSON_VALUE)
    @RolesAllowed({Role.FULL, Role.LIMITED})
    public ResponseEntity<PointDto> create(@RequestBody PointCreateDto pointCreateDto) {
        log.info("create({})", pointCreateDto);
        try {
            pointFacade.create(pointCreateDto);
            return ResponseEntity.ok(pointFacade.findById((long) pointFacade.findAll().size()));
        } catch (Exception ex) {
            log.error("Exception={}", ex.getCause(), ex);
            return ResponseEntity.notFound().header("message", "Create with passed body failed.\nCause:" + ex.getLocalizedMessage()).build();
        }
    }

    @PutMapping(value = ApiUri.ROOT_URI_POINTS, produces = MediaType.APPLICATION_JSON_VALUE)
    @RolesAllowed({Role.FULL, Role.LIMITED})
    public ResponseEntity<PointDto> update(@RequestBody PointDto pointDto) {
        log.info("update({})", pointDto);
        try {
            pointFacade.update(pointDto);
            Long id = pointDto.getId() != null ? pointDto.getId() : pointFacade.findAll().size();
            return ResponseEntity.ok(pointFacade.findById(id));
        } catch (Exception ex) {
            log.error("Exception={}", ex.getCause(), ex);
            return ResponseEntity.notFound().header("message", "Update with passed body failed.\nCause:" + ex.getLocalizedMessage()).build();
        }
    }

    @DeleteMapping(value = ApiUri.ROOT_URI_POINT, produces = MediaType.APPLICATION_JSON_VALUE)
    @RolesAllowed({Role.FULL, Role.LIMITED})
    public ResponseEntity<Void> removeById(@PathVariable("id") Long id) {
        log.info("removeById({})", id);
        try {
            pointFacade.removeById(id);
            return ResponseEntity.ok().build();
        } catch (Exception ex) {
            log.error("Exception={}", ex.getCause(), ex);
            return ResponseEntity.notFound().header("message", "Id not found.\nCause:" + ex.getLocalizedMessage()).build();
        }
    }
}
