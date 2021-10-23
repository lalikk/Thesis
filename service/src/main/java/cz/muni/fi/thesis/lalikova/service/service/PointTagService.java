package cz.muni.fi.thesis.lalikova.service.service;

import cz.muni.fi.thesis.lalikova.entity.PointTag;
import java.util.List;

public interface PointTagService {

    void create(PointTag pointTag);

    PointTag findById(Long id);

    List<PointTag> findAll();

    void update(PointTag pointTag);

    void remove(PointTag pointTag);
}
