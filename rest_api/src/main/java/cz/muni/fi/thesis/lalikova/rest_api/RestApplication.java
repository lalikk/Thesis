package cz.muni.fi.thesis.lalikova.rest_api;

import cz.muni.fi.thesis.lalikova.ServiceConfiguration;
import cz.muni.fi.thesis.lalikova.rest_api.controllers.AuthController;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.web.servlet.config.annotation.*;

@SpringBootApplication
@Import(ServiceConfiguration.class)
@ComponentScan(basePackages = {"cz.muni.fi.thesis.lalikova.rest_api", "cz.muni.fi.thesis.lalikova.rest_api.controllers"})
public class RestApplication extends SpringBootServletInitializer implements WebMvcConfigurer {


    final static Logger log = LoggerFactory.getLogger(RestApplication.class);

    public static void main(String[] args) {
        SpringApplication.run(RestApplication.class, args);
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        log.error("I AM ALIVE");
        registry.addResourceHandler("/**").addResourceLocations("file:../frontend/").setCachePeriod(0);
        registry.addResourceHandler("/images/**").addResourceLocations("file:../images/").setCachePeriod(0);
    }

    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        registry.addViewController("/").setViewName("forward:/index.html");
    }

    @Override
    public void configureContentNegotiation(ContentNegotiationConfigurer configurer) {
        configurer.mediaType("mjs", new MediaType("text", "javascript"));
    }
}
