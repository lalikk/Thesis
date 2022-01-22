package cz.muni.fi.thesis.lalikova.rest_api;

import cz.muni.fi.thesis.lalikova.ServiceConfiguration;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Import;

@SpringBootApplication
@Import(ServiceConfiguration.class)
@ComponentScan(basePackages = {"cz.muni.fi.thesis.lalikova.rest_api", "cz.muni.fi.thesis.lalikova.rest_api.controllers"})
public class RestApplication extends SpringBootServletInitializer {

    public static void main(String[] args) {
        SpringApplication.run(RestApplication.class, args);
    }

}
