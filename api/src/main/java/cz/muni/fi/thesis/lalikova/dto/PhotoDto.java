package cz.muni.fi.thesis.lalikova.dto;

import java.util.Objects;

public class PhotoDto {

    Long id;

    private String description;

    private byte[] image;

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

    public byte[] getImage() {
        return image;
    }

    public void setImage(byte[] image) {
        this.image = image;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        PhotoDto photoDto = (PhotoDto) o;
        return getId().equals(photoDto.getId()) && Objects.equals(getDescription(), photoDto.getDescription());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getId(), getDescription());
    }

    @Override
    public String toString() {
        return "PhotoDto{" +
                "id=" + id +
                ", description='" + description + '\'' +
                '}';
    }
}
