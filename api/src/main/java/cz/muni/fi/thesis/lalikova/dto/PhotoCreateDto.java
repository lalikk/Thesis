package cz.muni.fi.thesis.lalikova.dto;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.util.Arrays;
import java.util.Objects;

public class PhotoCreateDto {

    @NotNull
    @Size(max=500)
    private String description;

    @NotNull
    private String image;

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        PhotoCreateDto that = (PhotoCreateDto) o;
        return getDescription().equals(that.getDescription()) && getImage().equals(that.getImage());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getDescription(), getImage());
    }

    @Override
    public String toString() {
        return "PhotoCreateDto{" +
                "description='" + description + '\'' +
                '}';
    }
}
