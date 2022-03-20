package cz.muni.fi.thesis.lalikova.exceptions;

import org.springframework.dao.DataAccessException;

/**
 * Dao layer data access error exception
 */
public class DaoDataAccessException extends DataAccessException {
    public DaoDataAccessException(String msg) {
        super(msg);
    }

    public DaoDataAccessException(String msg, Throwable cause) {
        super(msg, cause);
    }
}
