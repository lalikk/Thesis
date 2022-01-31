package cz.muni.fi.thesis.lalikova.facade;

import cz.muni.fi.thesis.lalikova.dto.DistancesCreateDto;
import cz.muni.fi.thesis.lalikova.dto.DistancesDto;

import java.util.List;

public interface DistancesFacade {

    void create(DistancesCreateDto distances);

    DistancesDto findById(Long id);

    List<DistancesDto> findAll();

    void update(DistancesDto distances);

    void removeById(Long id);
}
