package cz.muni.fi.thesis.lalikova.dto;

import java.util.Objects;

/**
 * Data transfer object for new user entity
 */
public class UserCreateDto {
    
    private String login;

    private String password;

    public String getLogin() {
        return login;
    }

    public UserCreateDto setLogin(String login) {
        this.login = login;
        return this;
    }

    public String getPassword() {
        return password;
    }

    public UserCreateDto setPassword(String password) {
        this.password = password;
        return this;
    }

    public boolean hasFullAccess() {
        return true;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof UserCreateDto)) return false;
        UserCreateDto userDto = (UserCreateDto) o;
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
