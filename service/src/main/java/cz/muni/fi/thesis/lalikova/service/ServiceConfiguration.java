package cz.muni.fi.thesis.lalikova.service;

import cz.muni.fi.thesis.lalikova.InMemoryDb;
import cz.muni.fi.thesis.lalikova.service.service.PointServiceImpl;
import cz.muni.fi.thesis.lalikova.service.service.RouteServiceImpl;
import org.dozer.DozerBeanMapper;
import org.dozer.Mapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;

@Configuration
@Import(InMemoryDb.class)
@ComponentScan(basePackageClasses={RouteServiceImpl.class, PointServiceImpl.class})
public class ServiceConfiguration {

    @Bean
    public Mapper dozer(){
        return new DozerBeanMapper();
    }
}