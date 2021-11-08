package cz.muni.fi.thesis.lalikova.entity;

import javax.persistence.Entity;
import javax.persistence.OneToMany;
import java.util.Set;

@Entity
public class AdvancedUser extends User {

    @OneToMany(mappedBy = "user")
    private Set<Route> routes;

    public Set<Route> getRoutes() {
        return routes;
    }

    public void setRoutes(Set<Route> routes) {
        this.routes = routes;
    }
}
