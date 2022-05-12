package cz.muni.fi.thesis.lalikova.entity;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

/**
 * Class for the entity representing a point of interest
 */
@Entity
public class Point {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(nullable = false)
    private String title;

    @OneToOne(mappedBy = "point", cascade = CascadeType.ALL, orphanRemoval = true)
    private Coordinates coordinates;

    @Column(length = 4096)
    private String description;

    @OneToMany(mappedBy = "point", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Photo> photos;

    @ManyToMany(mappedBy = "points")
    private Set<PointTag> tags = new HashSet<>();

    //@ManyToOne
    //private User user;

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

    /*public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }*/

    public Set<Route> getRoutes() {
        return routes;
    }

    public void setRoutes(Set<Route> routes) {
        this.routes = routes;
    }

    public void removeRoute(Route route) {
        this.routes.remove(route);
    }

    public void addRoute(Route route) {
        this.routes.add(route);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Point point = (Point) o;
        return Objects.equals(getId(), point.getId()) && Objects.equals(getTitle(), point.getTitle());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getId(), getTitle());
    }

    @Override
    public String toString() {
        return "Point{" +
                "title='" + title + '\'' +
                '}';
    }
}
