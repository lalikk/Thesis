package cz.muni.fi.thesis.lalikova;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;

import javax.annotation.PostConstruct;
import java.io.IOException;
@Configuration()
@Import(ServiceConfiguration.class)
@ComponentScan(basePackageClasses = {TestData.class})
public class DataConfiguration {

    @Autowired
    private TestData testData;

    @PostConstruct
    public void dataLoading() throws IOException {
        testData.loadData();
    }
}
