package cz.muni.fi.thesis.lalikova.dto;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;

/**
 * Data transfer object for new route entity
 */
public class RouteCreateDto {

    @NotNull
    @Size(max=64)
    private String title;

    private String description;

    private Set<PointDto> points = new HashSet<>();

    private List<Long> orderedPointIds = new ArrayList<>();

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
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
        RouteCreateDto that = (RouteCreateDto) o;
        return getTitle().equals(that.getTitle()) && Objects.equals(getPoints(), that.getPoints());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getTitle(), getPoints());
    }
}
