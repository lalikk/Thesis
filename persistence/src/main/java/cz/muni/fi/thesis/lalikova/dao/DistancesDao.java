package cz.muni.fi.thesis.lalikova.dao;

import cz.muni.fi.thesis.lalikova.entity.Distances;
import java.util.List;

public interface DistancesDao {

    void create(Distances distances);

    Distances findById(Long id);

    List<Distances> findAll();

    void update(Distances distances);

    void remove(Distances distances);
}