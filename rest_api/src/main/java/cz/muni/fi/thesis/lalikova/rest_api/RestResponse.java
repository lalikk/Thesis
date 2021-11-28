package cz.muni.fi.thesis.lalikova.rest_api;

public class RestResponse<T> {
    private final String status;
    private final T data;

    public RestResponse(T data, String status) {
        this.status = status;
        this.data = data;
    }

    public String getStatus() {
        return status;
    }

    public T getData() {
        return data;
    }
}
