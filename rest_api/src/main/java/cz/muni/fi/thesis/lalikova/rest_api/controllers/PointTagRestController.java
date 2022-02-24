package cz.muni.fi.thesis.lalikova.rest_api.controllers;

import cz.muni.fi.thesis.lalikova.dto.PointTagCreateDto;
import cz.muni.fi.thesis.lalikova.dto.PointTagDto;
import cz.muni.fi.thesis.lalikova.facade.PointTagFacade;
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
public class PointTagRestController {

    private final Logger log = LoggerFactory.getLogger(PhotoRestController.class);

    @Autowired
    PointTagFacade pointTagFacade;

    @GetMapping(value = ApiUri.ROOT_URI_POINT_TAGS, produces = MediaType.APPLICATION_JSON_VALUE)
    //@RolesAllowed({Role.FULL, Role.LIMITED})
    public ResponseEntity<Collection<PointTagDto>> findAll() {
        log.info("findAll()");
        try {
            return ResponseEntity.ok(pointTagFacade.findAll());
        } catch (Exception ex) {
            log.error("Exception={}", ex.getCause(), ex);
            return ResponseEntity.notFound().header("message", ex.getLocalizedMessage()).build();
        }
    }

    @GetMapping(value = ApiUri.ROOT_URI_POINT_TAG, produces = MediaType.APPLICATION_JSON_VALUE)
    @RolesAllowed({Role.FULL, Role.LIMITED})
    public ResponseEntity<PointTagDto> findById(@PathVariable("id") Long id) {
        log.info("findById({})", id);
        try {
            return ResponseEntity.ok(pointTagFacade.findById(id));
        } catch (Exception ex) {
            log.error("Exception={}", ex.getCause(), ex);
            return ResponseEntity.notFound().header("message", "Id not found.\nCause:" + ex.getLocalizedMessage()).build();
        }
    }

    @PostMapping(value = ApiUri.ROOT_URI_POINT_TAGS, produces = MediaType.APPLICATION_JSON_VALUE)
    @RolesAllowed({Role.FULL, Role.LIMITED})
    public ResponseEntity<PointTagDto> create(@RequestBody PointTagCreateDto pointTagCreateDto) {
        log.info("create({})", pointTagCreateDto);
        try {
            pointTagFacade.create(pointTagCreateDto);
            return ResponseEntity.ok(pointTagFacade.findById((long) pointTagFacade.findAll().size()));
        } catch (Exception ex) {
            log.error("Exception={}", ex.getCause(), ex);
            return ResponseEntity.notFound().header("message", "Create with passed body failed.\nCause:" + ex.getLocalizedMessage()).build();
        }
    }

    @PutMapping(value = ApiUri.ROOT_URI_POINT_TAGS, produces = MediaType.APPLICATION_JSON_VALUE)
    @RolesAllowed({Role.FULL, Role.LIMITED})
    public ResponseEntity<PointTagDto> update(@RequestBody PointTagDto pointTagDto) {
        log.info("update({})", pointTagDto);
        try {
            pointTagFacade.update(pointTagDto);
            Long id = pointTagDto.getId() != null ? pointTagDto.getId() : pointTagFacade.findAll().size();
            return ResponseEntity.ok(pointTagFacade.findById(id));
        } catch (Exception ex) {
            log.error("Exception={}", ex.getCause(), ex);
            return ResponseEntity.notFound().header("message", "Update with passed body failed.\nCause:" + ex.getLocalizedMessage()).build();
        }
    }

    @DeleteMapping(value = ApiUri.ROOT_URI_POINT_TAG, produces = MediaType.APPLICATION_JSON_VALUE)
    @RolesAllowed({Role.FULL, Role.LIMITED})
    public ResponseEntity<Void> removeById(@PathVariable("id") Long id) {
        log.info("removeById({})", id);
        try {
            pointTagFacade.removeById(id);
            return ResponseEntity.ok().build();
        } catch (Exception ex) {
            log.error("Exception={}", ex.getCause(), ex);
            return ResponseEntity.notFound().header("message", "Id not found.\nCause:" + ex.getLocalizedMessage()).build();
        }
    }
}
