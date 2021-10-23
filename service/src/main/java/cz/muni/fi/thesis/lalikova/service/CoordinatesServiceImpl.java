package cz.muni.fi.thesis.lalikova.service;

import cz.muni.fi.thesis.lalikova.dao.CoordinatesDao;
import cz.muni.fi.thesis.lalikova.entity.Coordinates;
import cz.muni.fi.thesis.lalikova.exceptions.DaoDataAccessException;
import org.springframework.beans.factory.annotation.Autowired;
import lombok.NonNull;

import java.util.List;

public class CoordinatesServiceImpl implements CoordinatesService {

    @Autowired
    private CoordinatesDao coordinatesDao;

    @Override
    public void create(@NonNull Coordinates coordinates) {
        try {
            coordinatesDao.create(coordinates);
        } catch (Exception ex) {
            throw new DaoDataAccessException("Coordinates Dao Create Exception with coordinates: " + coordinates, ex);
        }
    }

    @Override
    public Coordinates findById(Long id) {
        try {
            return coordinatesDao.findById(id);
        } catch (Exception ex) {
            throw new DaoDataAccessException("Coordinates Dao Find by Id Exception with id: " + id, ex );
        }
    }

    @Override
    public List<Coordinates> findAll() {
        try {
            return coordinatesDao.findAll();
        } catch (Exception ex) {
            throw new DaoDataAccessException("Coordinates Dao Find All Exception", ex);
        }
    }

    @Override
    public void update(Coordinates coordinates) {
        try {
            coordinatesDao.update(coordinates);
        } catch (Exception ex) {
            throw new DaoDataAccessException("Coordinates Dao Update Exception with coordinates: " + coordinates, ex);
        }
    }

    @Override
    public void remove(Coordinates coordinates) {
        try {
            coordinatesDao.remove(coordinates);
        } catch (Exception ex) {
            throw new DaoDataAccessException("Coordinates Dao Remove Exception with coodinates: "+ coordinates, ex);
        }
    }
}
