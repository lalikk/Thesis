package cz.muni.fi.thesis.lalikova.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToMany;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.validation.constraints.NotNull;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

/**
 * Class for Point cz.muni.fi.thesis.lalikova.entity
 */
@Entity
public class Point {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(nullable = false)
    private String title;

    @OneToOne(mappedBy = "point")
    private Coordinates coordinates;

    private String description;

    @OneToMany(mappedBy = "point")
    private Set<Photo> photos ;

    @ManyToMany(mappedBy = "points")
    private Set<PointTag> tags = new HashSet<>();

    @ManyToMany
    private Set<Route> routes = new HashSet<>();

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

    public Coordinates getCoordinates() {
        return coordinates;
    }

    public void setCoordinates(Coordinates coordinates) {
        this.coordinates = coordinates;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Set<Photo> getPhotos() {
        return photos;
    }

    public void setPhotos(Set<Photo> photos) {
        this.photos = photos;
    }

    public Set<PointTag> getTags() {
        return tags;
    }

    public void setTags(Set<PointTag> tags) {
        this.tags = tags;
    }

    public Set<Route> getRoutes() {
        return routes;
    }

    public void setRoutes(Set<Route> routes) {
        this.routes = routes;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Point point = (Point) o;
        return getTitle().equals(point.getTitle()) && Objects.equals(getCoordinates(), point.getCoordinates());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getTitle(), getCoordinates());
    }

    @Override
    public String toString() {
        return "Point{" +
                "title='" + title + '\'' +
                '}';
    }
}
