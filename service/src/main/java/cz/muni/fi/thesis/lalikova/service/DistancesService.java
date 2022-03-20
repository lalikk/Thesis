package cz.muni.fi.thesis.lalikova.service;

import cz.muni.fi.thesis.lalikova.entity.Distances;
import java.util.List;

/**
 * Interface for the service for Distances entity
 */
public interface DistancesService {

    void create(Distances distances);

    Distances findById(Long id);

    List<Distances> findAll();

    void update(Distances distances);

    void removeById(Long id);
}
