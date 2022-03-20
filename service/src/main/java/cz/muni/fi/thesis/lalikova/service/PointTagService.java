package cz.muni.fi.thesis.lalikova.service;

import cz.muni.fi.thesis.lalikova.entity.PointTag;
import java.util.List;

/**
 * Interface for the service for Point tag entity
 */
public interface PointTagService {

    void create(PointTag pointTag);

    PointTag findById(Long id);

    List<PointTag> findAll();

    void update(PointTag pointTag);

    void removeById(Long id);
}
