package cz.muni.fi.thesis.lalikova.entity;

import javax.persistence.Column;
import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToMany;
import javax.validation.constraints.NotNull;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;

@Entity
public class Route {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(nullable = false)
    private String title;

    private String description;

    @ManyToMany(mappedBy = "routes")
    private Set<Point> points = new HashSet<>();

    @ElementCollection
    private List<Long> orderedPointIds = new ArrayList<>();

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

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

    public Set<Point> getPoints() {
        return points;
    }

    public void setPoints(Set<Point> points) {
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
        Route route = (Route) o;
        return getTitle().equals(route.getTitle()) && Objects.equals(getPoints(), route.getPoints());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getTitle(), getPoints());
    }

    @Override
    public String toString() {
        return "Route{" +
                "title='" + title + '\'' +
                '}';
    }
}
