package cz.muni.fi.thesis.lalikova.dto;

import java.util.Objects;

public class UserDto {
    private Long id;

    private String login;

    private String passwordHash;

    public Long getId() {
        return id;
    }

    public UserDto setId(Long id) {
        this.id = id;
        return this;
    }

    public String getLogin() {
        return login;
    }

    public UserDto setLogin(String login) {
        this.login = login;
        return this;
    }

    public String getPasswordHash() {
        return passwordHash;
    }

    public UserDto setPasswordHash(String passwordHash) {
        this.passwordHash = passwordHash;
        return this;
    }

    public boolean hasFullAccess() {
        return true;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof UserDto)) return false;
        UserDto userDto = (UserDto) o;
        return getLogin().equals(userDto.getLogin());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getLogin());
    }

    @Override
    public String toString() {
        return "UserDto{" +
                "login='" + login + '\'' +
                '}';
    }
}
