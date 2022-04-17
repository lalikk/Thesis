package cz.muni.fi.thesis.lalikova.rest_api.controllers;

import cz.muni.fi.thesis.lalikova.dto.AuthenticationCheckDto;
import cz.muni.fi.thesis.lalikova.dto.TokenCheckDto;
import cz.muni.fi.thesis.lalikova.dto.UserAuthenticateDto;
import cz.muni.fi.thesis.lalikova.facade.UserFacade;
import cz.muni.fi.thesis.lalikova.rest_api.ApiUri;
import cz.muni.fi.thesis.lalikova.rest_api.security.JwtResponse;
import cz.muni.fi.thesis.lalikova.rest_api.security.JwtUtils;
import cz.muni.fi.thesis.lalikova.rest_api.security.UserDetailsImpl;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping(ApiUri.ROOT_URI)
public class AuthController {

    final static Logger log = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserFacade userFacade;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtUtils jwtUtils;

    @PostMapping(value = ApiUri.ROOT_URI_LOGIN, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<?> authenticateUser(@RequestBody @Valid UserAuthenticateDto user) {
        Authentication authentication;
        try {
            log.error(user.getPassword());
            log.error(encoder.encode(user.getPassword()));
            log.error(String.valueOf(encoder.matches("user", encoder.encode(user.getPassword()))));
            authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(user.getLogin(), user.getPassword()));
        } catch (AuthenticationException e) {
            return ResponseEntity.badRequest().body("Authentication error");
        }

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        return ResponseEntity.ok(new JwtResponse(jwt, userDetails.getRole(), userDetails.getUsername()));
    }

    @PostMapping(value = ApiUri.ROOT_URI_AUTH, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<AuthenticationCheckDto> checkAuthorisation(@RequestBody TokenCheckDto tokenDto) {
        AuthenticationCheckDto check = new AuthenticationCheckDto();
        check.setValidAuthentication(jwtUtils.validateJwtToken(tokenDto.getToken()));
        return ResponseEntity.ok(check);
    }
}