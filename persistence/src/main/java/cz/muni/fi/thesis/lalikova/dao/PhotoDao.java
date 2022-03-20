package cz.muni.fi.thesis.lalikova.dao;

import cz.muni.fi.thesis.lalikova.entity.Photo;

import java.util.List;

/**
 * Data access object interface for Photo entity
 */
public interface PhotoDao {

    void create(Photo photo);

    Photo findById(Long id);

    List<Photo> findAll();

    void update(Photo photo);

    void remove(Photo photo);
}
