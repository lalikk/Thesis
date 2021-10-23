package cz.muni.fi.thesis.lalikova.entity;

import javax.validation.constraints.NotNull;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Column;
import java.util.Objects;

@Entity
public class PointTag {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(nullable = false)
    private String name;

    private String description;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
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
        PointTag pointTag = (PointTag) o;
        return getName().equals(pointTag.getName()) && Objects.equals(getDescription(), pointTag.getDescription());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getName(), getDescription());
    }
}
