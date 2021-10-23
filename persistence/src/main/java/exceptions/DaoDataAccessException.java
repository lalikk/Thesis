package exceptions;

import org.springframework.dao.DataAccessException;

public class DaoDataAccessException extends DataAccessException {
    public DaoDataAccessException(String msg) {
        super(msg);
    }

    public DaoDataAccessException(String msg, Throwable cause) {
        super(msg, cause);
    }
}
