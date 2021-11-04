package cz.muni.fi.thesis.lalikova.exceptions;

import org.springframework.dao.DataAccessException;

public class ServiceCallException extends DataAccessException {
    public ServiceCallException(String msg) {
        super(msg);
    }

    public ServiceCallException(String msg, Throwable cause) {
        super(msg, cause);
    }
}