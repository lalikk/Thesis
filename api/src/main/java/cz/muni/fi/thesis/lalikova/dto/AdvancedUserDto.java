package cz.muni.fi.thesis.lalikova.dto;

import java.util.Objects;

public class AdvancedUserDto {

    private Long id;

    private String login;

    private String passwordHash;

    public Long getId() {
        return id;
    }

    public AdvancedUserDto setId(Long id) {
        this.id = id;
        return this;
    }

    public String getLogin() {
        return login;
    }

    public AdvancedUserDto setLogin(String login) {
        this.login = login;
        return this;
    }

    public String getPasswordHash() {
        return passwordHash;
    }

    public AdvancedUserDto setPasswordHash(String passwordHash) {
        this.passwordHash = passwordHash;
        return this;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof AdvancedUserDto)) return false;
        AdvancedUserDto userDto = (AdvancedUserDto) o;
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
