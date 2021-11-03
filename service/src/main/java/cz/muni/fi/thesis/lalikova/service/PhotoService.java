package cz.muni.fi.thesis.lalikova.service;

import cz.muni.fi.thesis.lalikova.entity.Photo;
import java.util.List;

public interface PhotoService {

    void create(Photo photo);

    Photo findById(Long id);

    List<Photo> findAll();

    void update(Photo photo);

    void removeById(Long id);
}
