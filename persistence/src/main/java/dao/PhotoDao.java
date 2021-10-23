package dao;

import entity.Photo;
import java.util.List;

public interface PhotoDao {

    void create(Photo photo);

    Photo findById(Long id);

    List<Photo> findAll();

    void update(Photo photo);

    void remove(Photo photo);
}
