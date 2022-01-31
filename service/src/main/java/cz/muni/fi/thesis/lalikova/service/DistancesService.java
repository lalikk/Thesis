package cz.muni.fi.thesis.lalikova.service;

import cz.muni.fi.thesis.lalikova.entity.Distances;
import java.util.List;

public interface DistancesService {

    void create(Distances distances);

    Distances findById(Long id);

    List<Distances> findAll();

    void update(Distances distances);

    void removeById(Long id);
}
