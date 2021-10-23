package dao;

import entity.PointTag;
import java.util.List;

public interface PointTagDao {

    void create(PointTag pointTag);

    PointTag findById(Long id);

    List<PointTag> findAll();

    void update(PointTag pointTag);

    void remove(PointTag pointTag);
}
