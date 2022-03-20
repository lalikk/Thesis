package cz.muni.fi.thesis.lalikova.dto;

import javax.validation.constraints.NotNull;
import java.util.Objects;

/**
 * Data transfer object for creation of coordinates entity
 */
public class CoordinatesCreateDto {

    @NotNull
    private Double latitude;

    @NotNull
    private Double longitude;

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        CoordinatesCreateDto that = (CoordinatesCreateDto) o;
        return Objects.equals(getLatitude(), that.getLatitude()) && Objects.equals(getLongitude(), that.getLongitude());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getLatitude(), getLongitude());
    }

    @Override
    public String toString() {
        return "CoordinatesCreateDto{" +
                "latitude=" + latitude +
                ", longitude=" + longitude +
                '}';
    }
}
