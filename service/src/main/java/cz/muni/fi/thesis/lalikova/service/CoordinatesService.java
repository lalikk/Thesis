package cz.muni.fi.thesis.lalikova.service;

import cz.muni.fi.thesis.lalikova.entity.Coordinates;
import java.util.List;

/**
 * Interface for the service for Coordinates entity
 */
public interface CoordinatesService {

    void create(Coordinates coordinates);

    Coordinates findById(Long id);

    List<Coordinates> findAll();

    void update(Coordinates coordinates);

    void removeById(Long id);
}
