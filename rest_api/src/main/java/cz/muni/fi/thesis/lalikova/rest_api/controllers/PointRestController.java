package cz.muni.fi.thesis.lalikova.rest_api.controllers;

import cz.muni.fi.thesis.lalikova.dto.PhotoDto;
import cz.muni.fi.thesis.lalikova.dto.PointCreateDto;
import cz.muni.fi.thesis.lalikova.dto.PointDto;
import cz.muni.fi.thesis.lalikova.dto.PointUpdateDto;
import cz.muni.fi.thesis.lalikova.entity.Point;
import cz.muni.fi.thesis.lalikova.facade.PhotoFacade;
import cz.muni.fi.thesis.lalikova.facade.PointFacade;
import cz.muni.fi.thesis.lalikova.rest_api.ApiUri;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

    @GetMapping(value = ApiUri.ROOT_URI_ROUTE_POINTS, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Collection<PointDto>> findByRoute(@PathVariable("id") Long id) {
        log.info("findByRoute()");
        try {
            return ResponseEntity.ok(pointFacade.findByRoute(id));
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
            return ResponseEntity.notFound().header("message", "Id not found. Cause:" + ex.getLocalizedMessage()).build();
        }
    }

    @PostMapping(value = ApiUri.ROOT_URI_POINTS_AUTH, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<PointDto> create(@RequestBody PointCreateDto pointCreateDto) {
        log.info("create({})", pointCreateDto);
        try {
            boolean isValid = pointCreateDto.getTitle() != null;
            isValid = isValid && !pointCreateDto.getTitle().isBlank();
            isValid = isValid && (pointCreateDto.getCoordinates() != null);
            isValid = isValid && (pointCreateDto.getCoordinates().getLatitude() != null);
            isValid = isValid && (pointCreateDto.getCoordinates().getLongitude() != null);
            isValid = isValid && (pointCreateDto.getCoordinates().getLatitude() > -90.0);
            isValid = isValid && (pointCreateDto.getCoordinates().getLatitude() < 90.0);
            isValid = isValid && (pointCreateDto.getCoordinates().getLongitude() > -180.0);
            isValid = isValid && (pointCreateDto.getCoordinates().getLongitude() < 180.0);
            isValid = isValid && (pointCreateDto.getTags() != null);
            if (!isValid) {
                return ResponseEntity
                        .badRequest()
                        .header("message", "Invalid point data.")
                        .build();
            }
            PointDto created = pointFacade.create(pointCreateDto);
            return ResponseEntity.ok(pointFacade.findById(created.getId()));
        } catch (Exception ex) {
            log.error("Exception={}", ex.getCause(), ex);
            return ResponseEntity.notFound().header("message", "Create with passed body failed. Cause:" + ex.getLocalizedMessage()).build();
        }
    }

    @PutMapping(value = ApiUri.ROOT_URI_POINTS_AUTH, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<PointDto> update(@RequestBody PointUpdateDto pointDto) {
        log.info("update({})", pointDto);
        try {
            boolean isValid = pointDto.getTitle() != null;
            isValid = isValid && !pointDto.getTitle().isBlank();
            isValid = isValid && (pointDto.getCoordinates() != null);
            isValid = isValid && (pointDto.getCoordinates().getLatitude() != null);
            isValid = isValid && (pointDto.getCoordinates().getLongitude() != null);
            isValid = isValid && (pointDto.getCoordinates().getLatitude() > -90.0);
            isValid = isValid && (pointDto.getCoordinates().getLatitude() < 90.0);
            isValid = isValid && (pointDto.getCoordinates().getLongitude() > -180.0);
            isValid = isValid && (pointDto.getCoordinates().getLongitude() < 180.0);
            isValid = isValid && (pointDto.getTags() != null);
            if (!isValid) {
                return ResponseEntity
                        .badRequest()
                        .header("message", "Invalid point data.")
                        .build();
            }
            pointFacade.update(pointDto);
            Long id = pointDto.getId() != null ? pointDto.getId() : pointFacade.findAll().size();
            return ResponseEntity.ok(pointFacade.findById(id));
        } catch (Exception ex) {
            log.error("Exception={}", ex.getCause(), ex);
            return ResponseEntity.notFound().header("message", "Update with passed body failed. Cause:" + ex.getLocalizedMessage()).build();
        }
    }

    @DeleteMapping(value = ApiUri.ROOT_URI_POINT_AUTH, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Void> removeById(@PathVariable("id") Long id) {
        log.info("removeById({})", id);
        try {
            pointFacade.removeById(id);
            return ResponseEntity.ok().build();
        } catch (Exception ex) {
            log.error("Exception={}", ex.getCause(), ex);
            return ResponseEntity.notFound().header("message", "Id not found. Cause:" + ex.getLocalizedMessage()).build();
        }
    }
}
