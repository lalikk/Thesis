package cz.muni.fi.thesis.lalikova.rest_api.security;

import cz.muni.fi.thesis.lalikova.facade.UserFacade;
import cz.muni.fi.thesis.lalikova.dto.UserDto;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

import javax.persistence.EntityNotFoundException;

@Component
public class UserDetailsServiceImpl implements UserDetailsService {
    @Autowired
    private UserFacade userFacade;

    final static Logger log = LoggerFactory.getLogger(UserDetailsServiceImpl.class);

    @Override
    public UserDetails loadUserByUsername(String login) throws UsernameNotFoundException {

        try {
            UserDto user = userFacade.findByLogin(login);
            log.error("Found user: " + user.getLogin());
            log.error("Passwd: " + user.getPasswordHash());
            return new cz.muni.fi.thesis.lalikova.rest_api.security.UserDetailsImpl(user);
        } catch (EntityNotFoundException e) {
            throw new UsernameNotFoundException("Username " + login + " was not found");
        }
    }
}
