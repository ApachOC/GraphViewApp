package cz.zcu.kiv.wernerv;

import cz.zcu.kiv.wernerv.config.MongoConfigurationTest;
import cz.zcu.kiv.wernerv.config.SecurityConfiguration;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Import;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;

@SpringBootApplication
@EnableMongoRepositories
@EnableWebSecurity
@Import({ MongoConfigurationTest.class, SecurityConfiguration.class })
public class GraphViewApp {
    public static void main(String[] args) {
        SpringApplication.run(GraphViewApp.class, args);
    }
}
