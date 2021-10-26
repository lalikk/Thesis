package cz.muni.fi.thesis.lalikova.facade;

import cz.muni.fi.thesis.lalikova.dto.PointTagCreateDto;
import cz.muni.fi.thesis.lalikova.dto.PointTagDto;

import java.util.List;

public interface PointTagFacade {

    void create(PointTagCreateDto pointTag);

    PointTagDto findById(Long id);

    List<PointTagDto> findAll();

    void update(PointTagDto pointTag);

    void remove(PointTagDto pointTag);
}
