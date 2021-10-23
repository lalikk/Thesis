package dao;

import entity.Coordinates;
import java.util.List;

public interface CoordinatesDao {

    void create(Coordinates coordinates);

    Coordinates findById(Long id);

    List<Coordinates> findAll();

    void update(Coordinates coordinates);

    void remove(Coordinates coordinates);
}
