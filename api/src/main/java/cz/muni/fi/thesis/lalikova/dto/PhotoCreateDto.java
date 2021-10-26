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
    private byte[] image;

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
        PhotoCreateDto that = (PhotoCreateDto) o;
        return getDescription().equals(that.getDescription()) && Arrays.equals(getImage(), that.getImage());
    }

    @Override
    public int hashCode() {
        int result = Objects.hash(getDescription());
        result = 31 * result + Arrays.hashCode(getImage());
        return result;
    }

    @Override
    public String toString() {
        return "PhotoCreateDto{" +
                "description='" + description + '\'' +
                '}';
    }
}
