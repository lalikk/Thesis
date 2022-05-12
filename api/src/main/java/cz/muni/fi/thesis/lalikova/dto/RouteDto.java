package cz.muni.fi.thesis.lalikova.dto;

import java.util.List;
import java.util.Objects;
import java.util.Set;

/**
 * Data transfer object for route entity
 */
public class RouteDto {

    private Long id;

    private String description;

    private Boolean difficult;

    private Set<PointDto> points;

    private List<Long> orderedPointIds;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Boolean getDifficult() {
        return difficult;
    }

    public void setDifficult(Boolean difficult) {
        this.difficult = difficult;
    }

    public Set<PointDto> getPoints() {
        return points;
    }

    public void setPoints(Set<PointDto> points) {
        this.points = points;
    }

    public List<Long> getOrderedPointIds() {
        return orderedPointIds;
    }

    public void setOrderedPointIds(List<Long> orderedPointIds) {
        this.orderedPointIds = orderedPointIds;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        RouteDto routeDto = (RouteDto) o;
        return getId().equals(routeDto.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getId());
    }
}
