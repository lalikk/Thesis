package cz.muni.fi.thesis.lalikova.dto;

import javax.validation.constraints.NotNull;
import java.util.Objects;

/**
 * Data transfer object for new distances entity
 */
public class DistancesCreateDto {

    @NotNull
    private Long pointAId;

    @NotNull
    private Long pointBId;

    @NotNull
    private Double distance;

    public Long getPointAId() {
        return pointAId;
    }

    public void setPointAId(Long pointAId) {
        this.pointAId = pointAId;
    }

    public Long getPointBId() {
        return pointBId;
    }

    public void setPointBId(Long pointBId) {
        this.pointBId = pointBId;
    }

    public Double getDistance() {
        return distance;
    }

    public void setDistance(Double distance) {
        this.distance = distance;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        DistancesCreateDto that = (DistancesCreateDto) o;
        return getPointAId().equals(that.getPointAId()) && getPointBId().equals(that.getPointBId());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getPointAId(), getPointBId());
    }
}
