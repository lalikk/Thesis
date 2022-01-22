package cz.muni.fi.thesis.lalikova.rest_api.controllers;

import cz.muni.fi.thesis.lalikova.dto.PhotoCreateDto;
import cz.muni.fi.thesis.lalikova.dto.PhotoDto;
import cz.muni.fi.thesis.lalikova.facade.PhotoFacade;
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
public class PhotoRestController {

    private final Logger log = LoggerFactory.getLogger(PhotoRestController.class);

    @Autowired
    PhotoFacade photoFacade;

    @GetMapping(value = ApiUri.ROOT_URI_PHOTOS, produces = MediaType.APPLICATION_JSON_VALUE)
    @RolesAllowed({Role.FULL, Role.LIMITED})
    public ResponseEntity<Collection<PhotoDto>> findAll() {
        log.info("findAll()");
        try {
            return ResponseEntity.ok(photoFacade.findAll());
        } catch (Exception ex) {
            log.error("Exception={}", ex.getCause(), ex);
            return ResponseEntity.notFound().header("message", ex.getLocalizedMessage()).build();
        }
    }

    @GetMapping(value = ApiUri.ROOT_URI_PHOTO, produces = MediaType.APPLICATION_JSON_VALUE)
    @RolesAllowed({Role.FULL, Role.LIMITED})
    public ResponseEntity<PhotoDto> findById(@PathVariable("id") Long id) {
        log.info("findById({})", id);
        try {
            return ResponseEntity.ok(photoFacade.findById(id));
        } catch (Exception ex) {
            log.error("Exception={}", ex.getCause(), ex);
            return ResponseEntity.notFound().header("message", "Id not found.\nCause:" + ex.getLocalizedMessage()).build();
        }
    }

    @PostMapping(value = ApiUri.ROOT_URI_PHOTOS, produces = MediaType.APPLICATION_JSON_VALUE)
    @RolesAllowed({Role.FULL, Role.LIMITED})
    public ResponseEntity<PhotoDto> create(@RequestBody PhotoCreateDto photoCreateDto) {
        log.info("create({})", photoCreateDto);
        try {
            photoFacade.create(photoCreateDto);
            return ResponseEntity.ok(photoFacade.findById((long) photoFacade.findAll().size()));
        } catch (Exception ex) {
            log.error("Exception={}", ex.getCause(), ex);
            return ResponseEntity.notFound().header("message", "Create with passed body failed.\nCause:" + ex.getLocalizedMessage()).build();
        }
    }

    @PutMapping(value = ApiUri.ROOT_URI_PHOTOS, produces = MediaType.APPLICATION_JSON_VALUE)
    @RolesAllowed({Role.FULL, Role.LIMITED})
    public ResponseEntity<PhotoDto> update(@RequestBody PhotoDto genreDto) {
        log.info("update({})", genreDto);
        try {
            photoFacade.update(genreDto);
            Long id = genreDto.getId() != null ? genreDto.getId() : photoFacade.findAll().size();
            return ResponseEntity.ok(photoFacade.findById(id));
        } catch (Exception ex) {
            log.error("Exception={}", ex.getCause(), ex);
            return ResponseEntity.notFound().header("message", "Update with passed body failed.\nCause:" + ex.getLocalizedMessage()).build();
        }
    }

    @DeleteMapping(value = ApiUri.ROOT_URI_PHOTO, produces = MediaType.APPLICATION_JSON_VALUE)
    @RolesAllowed({Role.FULL, Role.LIMITED})
    public ResponseEntity<Void> removeById(@PathVariable("id") Long id) {
        log.info("removeById({})", id);
        try {
            photoFacade.removeById(id);
            return ResponseEntity.ok().build();
        } catch (Exception ex) {
            log.error("Exception={}", ex.getCause(), ex);
            return ResponseEntity.notFound().header("message", "Id not found.\nCause:" + ex.getLocalizedMessage()).build();
        }
    }
}
