package cz.muni.fi.thesis.lalikova.dto;

import java.util.Objects;

public class AdvancedUserCreateDto {

    private String login;

    private String password;

    public String getLogin() {
        return login;
    }

    public AdvancedUserCreateDto setLogin(String login) {
        this.login = login;
        return this;
    }

    public String getPassword() {
        return password;
    }

    public AdvancedUserCreateDto setPassword(String password) {
        this.password = password;
        return this;
    }

    public boolean hasFullAccess() {
        return false;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof AdvancedUserCreateDto)) return false;
        AdvancedUserCreateDto userDto = (AdvancedUserCreateDto) o;
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
