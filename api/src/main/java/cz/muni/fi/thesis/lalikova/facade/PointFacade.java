package cz.muni.fi.thesis.lalikova.facade;

import cz.muni.fi.thesis.lalikova.dto.PointCreateDto;
import cz.muni.fi.thesis.lalikova.dto.PointDto;

import java.util.List;

/**
 * Facade interface for the points
 */
public interface PointFacade {
    void create(PointCreateDto point);

    PointDto findById(Long id);

    List<PointDto> findByRoute(Long id);

    List<PointDto> findAll();

    void update(PointDto point);

    void removeById(Long id);

}
