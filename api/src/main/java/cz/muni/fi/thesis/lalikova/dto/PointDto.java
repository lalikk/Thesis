package cz.muni.fi.thesis.lalikova.dto;

import cz.muni.fi.thesis.lalikova.entity.Coordinates;

import java.util.Objects;

public class PointDto {

    private Long id;

    private String title;

    private String description;

    private CoordinatesDto coordinates;

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

    public CoordinatesDto getCoordinates() {
        return coordinates;
    }

    public void setCoordinates(CoordinatesDto coordinates) {
        this.coordinates = coordinates;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        PointDto pointDto = (PointDto) o;
        return getId().equals(pointDto.getId()) && getTitle().equals(pointDto.getTitle());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getId(), getTitle());
    }

    @Override
    public String toString() {
        return "PointDto{" +
                "id=" + id +
                ", title='" + title + '\'' +
                '}';
    }
}
