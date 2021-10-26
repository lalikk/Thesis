package cz.muni.fi.thesis.lalikova.facade;

import cz.muni.fi.thesis.lalikova.dto.PhotoCreateDto;
import cz.muni.fi.thesis.lalikova.dto.PhotoDto;

import java.util.List;

public interface PhotoFacade {

    void create(PhotoCreateDto photo);

    PhotoDto findById(Long id);

    List<PhotoDto> findAll();

    void update(PhotoDto photo);

    void removeById(Long Id);
}
