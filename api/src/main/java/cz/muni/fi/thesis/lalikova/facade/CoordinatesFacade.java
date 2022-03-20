package cz.muni.fi.thesis.lalikova.facade;

import cz.muni.fi.thesis.lalikova.dto.CoordinatesCreateDto;
import cz.muni.fi.thesis.lalikova.dto.CoordinatesDto;

import java.util.List;

/**
 * Facade interface for the coordinates
 */
public interface CoordinatesFacade {

    void create(CoordinatesCreateDto coordinates);

    CoordinatesDto findById(Long id);

    List<CoordinatesDto> findAll();

    void update(CoordinatesDto coordinates);

    void removeById(Long Id);
}
