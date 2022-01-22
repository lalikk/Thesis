package cz.muni.fi.thesis.lalikova.rest_api.controllers;

import cz.muni.fi.thesis.lalikova.dto.UserCreateDto;
import cz.muni.fi.thesis.lalikova.dto.UserDto;
import cz.muni.fi.thesis.lalikova.facade.UserFacade;
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
public class UserRestController {

    private final Logger log = LoggerFactory.getLogger(PhotoRestController.class);

    @Autowired
    UserFacade userFacade;

    @RolesAllowed({Role.FULL})
    @GetMapping(value = ApiUri.ROOT_URI_USERS, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Collection<UserDto>> findAll() {
        log.info("findAll()");
        try {
            return ResponseEntity.ok(userFacade.findAll());
        } catch (Exception ex) {
            log.error("Exception={}", ex.getCause(), ex);
            return ResponseEntity.notFound().header("message", ex.getLocalizedMessage()).build();
        }
    }

    @RolesAllowed({Role.FULL})
    @GetMapping(value = ApiUri.ROOT_URI_USER, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<UserDto> findById(@PathVariable("id") Long id) {
        log.info("findById({})", id);
        try {
            return ResponseEntity.ok(userFacade.findById(id));
        } catch (Exception ex) {
            log.error("Exception={}", ex.getCause(), ex);
            return ResponseEntity.notFound().header("message", "Id not found.\nCause:" + ex.getLocalizedMessage()).build();
        }
    }

    @PostMapping(value = ApiUri.ROOT_URI_USERS, produces = MediaType.APPLICATION_JSON_VALUE)
    @RolesAllowed({Role.FULL, Role.LIMITED})
    public ResponseEntity<UserDto> create(@RequestBody UserCreateDto userCreateDto) {
        log.info("create({})", userCreateDto);
        try {
            userFacade.create(userCreateDto, userCreateDto.getPassword());
            return ResponseEntity.ok(userFacade.findById((long) userFacade.findAll().size()));
        } catch (Exception ex) {
            log.error("Exception={}", ex.getCause(), ex);
            return ResponseEntity.notFound().header("message", "Create with passed body failed.\nCause:" + ex.getLocalizedMessage()).build();
        }
    }

    @PutMapping(value = ApiUri.ROOT_URI_USERS, produces = MediaType.APPLICATION_JSON_VALUE)
    @RolesAllowed({Role.FULL, Role.LIMITED})
    public ResponseEntity<UserDto> update(@RequestBody UserDto userDto) {
        log.info("update({})", userDto);
        try {
            userFacade.update(userDto);
            Long id = userDto.getId() != null ? userDto.getId() : userFacade.findAll().size();
            return ResponseEntity.ok(userFacade.findById(id));
        } catch (Exception ex) {
            log.error("Exception={}", ex.getCause(), ex);
            return ResponseEntity.notFound().header("message", "Update with passed body failed.\nCause:" + ex.getLocalizedMessage()).build();
        }
    }

    @DeleteMapping(value = ApiUri.ROOT_URI_USER, produces = MediaType.APPLICATION_JSON_VALUE)
    @RolesAllowed({Role.FULL, Role.LIMITED})
    public ResponseEntity<Void> removeById(@PathVariable("id") Long id) {
        log.info("removeById({})", id);
        try {
            userFacade.removeById(id);
            return ResponseEntity.ok().build();
        } catch (Exception ex) {
            log.error("Exception={}", ex.getCause(), ex);
            return ResponseEntity.notFound().header("message", "Id not found.\nCause:" + ex.getLocalizedMessage()).build();
        }
    }
}
