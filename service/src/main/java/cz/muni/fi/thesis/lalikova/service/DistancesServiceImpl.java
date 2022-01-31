package cz.muni.fi.thesis.lalikova.service;

import cz.muni.fi.thesis.lalikova.dao.DistancesDao;
import cz.muni.fi.thesis.lalikova.entity.Distances;
import cz.muni.fi.thesis.lalikova.exceptions.DaoDataAccessException;
import lombok.NonNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DistancesServiceImpl implements DistancesService {

    @Autowired
    private DistancesDao distancesDao;

    @Override
    public void create(@NonNull Distances distances) {
        try {
            distancesDao.create(distances);
        } catch (Exception ex) {
            throw new DaoDataAccessException("Distances Dao Create Exception with distances: " + distances, ex);
        }
    }

    @Override
    public Distances findById(@NonNull Long id) {
        try {
            return distancesDao.findById(id);
        } catch (Exception ex) {
            throw new DaoDataAccessException("Distances Dao Find by Id Exception with id: " + id, ex );
        }
    }

    @Override
    public List<Distances> findAll() {
        try {
            return distancesDao.findAll();
        } catch (Exception ex) {
            throw new DaoDataAccessException("Distances Dao Find All Exception", ex);
        }
    }

    @Override
    public void update(@NonNull Distances distances) {
        try {
            distancesDao.update(distances);
        } catch (Exception ex) {
            throw new DaoDataAccessException("Distances Dao Update Exception with distances: " + distances, ex);
        }
    }

    @Override
    public void removeById(@NonNull Long id) {
        try {
            distancesDao.remove(distancesDao.findById(id));
        } catch (Exception ex) {
            throw new DaoDataAccessException("Distances Dao Remove Exception with distances with id: "+ id, ex);
        }
    }

}
