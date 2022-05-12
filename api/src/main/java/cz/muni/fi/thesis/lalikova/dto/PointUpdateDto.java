package cz.muni.fi.thesis.lalikova.dto;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

public class PointUpdateDto {

    private Long id;

    @NotNull
    @Size(max = 64)
    private String title;

    @Size(max = 500)
    private String description;

    private CoordinatesDto coordinates;

    //private Set<PhotoDto> photos = new HashSet<>();

    private Set<PointTagDto> tags = new HashSet<>();


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

    /*public Set<PhotoDto> getPhotos() {
        return photos;
    }

    public void setPhotos(Set<PhotoDto> photos) {
        this.photos = photos;
    }*/

    public Set<PointTagDto> getTags() {
        return tags;
    }

    public void setTags(Set<PointTagDto> tags) {
        this.tags = tags;
    }

    public CoordinatesDto getCoordinates() {
        return coordinates;
    }

    public void setCoordinates(CoordinatesDto coordinates) {
        this.coordinates = coordinates;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        PointUpdateDto that = (PointUpdateDto) o;
        return getTitle().equals(that.getTitle()) && Objects.equals(getCoordinates(), that.getCoordinates());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getTitle(), getCoordinates());
    }

    @Override
    public String toString() {
        return "PointUpdateDto{" +
                "title='" + title + '\'' +
                ", coordinates=" + coordinates +
                '}';
    }

}
