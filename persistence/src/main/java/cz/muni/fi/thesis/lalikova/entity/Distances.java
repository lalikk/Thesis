package cz.muni.fi.thesis.lalikova.entity;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.util.Objects;

/**
 *  Class representing the precomputed distances between pairs of point for proximity calculations
 */
@Entity
public class Distances {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(nullable = false)
    private Long pointAId;

    @NotNull
    @Column(nullable = false)
    private Long pointBId;

    @NotNull
    @Column(nullable = false)
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
        Distances distances = (Distances) o;
        return getPointAId().equals(distances.getPointAId()) && getPointBId().equals(distances.getPointBId());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getPointAId(), getPointBId());
    }
}
