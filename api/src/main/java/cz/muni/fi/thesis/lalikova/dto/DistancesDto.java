package cz.muni.fi.thesis.lalikova.dto;

import java.util.Objects;

/**
 * Data transfer object for distances entity
 */
public class DistancesDto {

    Long id;

    private Long pointAId;

    private Long pointBId;

    private Double distance;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

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
        DistancesDto that = (DistancesDto) o;
        return Objects.equals(getPointAId(), that.getPointAId()) && Objects.equals(getPointBId(), that.getPointBId());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getPointAId(), getPointBId());
    }
}
