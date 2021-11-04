package cz.muni.fi.thesis.lalikova.dto;

import java.util.Objects;

public class RouteDto {

    private Long id;

    private String description;

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
