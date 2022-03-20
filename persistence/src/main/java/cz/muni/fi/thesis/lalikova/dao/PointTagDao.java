package cz.muni.fi.thesis.lalikova.dao;

import cz.muni.fi.thesis.lalikova.entity.PointTag;

import java.util.List;

/**
 * Data access object interface for Point tag entity
 */
public interface PointTagDao {

    void create(PointTag pointTag);

    PointTag findById(Long id);

    List<PointTag> findAll();

    void update(PointTag pointTag);

    void remove(PointTag pointTag);
}
