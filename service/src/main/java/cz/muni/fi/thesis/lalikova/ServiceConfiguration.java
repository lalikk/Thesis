package cz.muni.fi.thesis.lalikova;

import cz.muni.fi.thesis.lalikova.service.PointServiceImpl;
import cz.muni.fi.thesis.lalikova.service.RouteServiceImpl;
import org.dozer.DozerBeanMapper;
import org.dozer.Mapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.security.crypto.argon2.Argon2PasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

/**
 * Service configuration class
 */
@Configuration
@Import(InMemoryDb.class)
@ComponentScan(basePackageClasses={RouteServiceImpl.class, PointServiceImpl.class})
public class ServiceConfiguration {

    @Bean
    public Mapper dozer(){
        return new DozerBeanMapper();
    }

    @Bean
    public PasswordEncoder argon2PasswordEncoder() {
        return new Argon2PasswordEncoder();
    }
}